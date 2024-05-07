import {gulp, fs, execSync, argv} from '../';
import {interpolateName} from '@formatjs/ts-transformer'
import * as _ from 'lodash';

const BASE_LANGUAGE = 'en-US';
const TEST_LANGUAGE = 'en-TEST';
const JULIA_LOOKUP_CODES = ['a', 'l', 'v'];
const ALL_SUPPORT_LANGUAGES = ['en-US', 'en-TEST', 'zh-CN'];

function migrateLanguageContent(locale, baseLanguageContent, destContent, sourceTranslationByEnglish, backEndLookupCode, addMissingEntriesInDestination) {
    const isNeedToSetNeedsTranslation = locale !== BASE_LANGUAGE && locale !== TEST_LANGUAGE;
    const needsTranslations = [];

    destContent = _.keys(baseLanguageContent).reduce((accu, key) => {
        const untranslatedMessage =  baseLanguageContent[key]["untranslatedMessage"] || baseLanguageContent[key]["defaultMessage"];
        if (!destContent[key]) {
	        const existingMessage = null; //destContent[_.find(_.keys(destContent), k => destContent[k].untranslatedMessage == untranslatedMessage)];

			if (existingMessage) {
				// Found a match for replacement string. This is useful if the description was updated but the translation still valid.
				console.log("Using translated string that matches the untranslated message but with a different description")
				accu[key] = {...existingMessage, description: baseLanguageContent[key]["description"], untranslatedMessage: untranslatedMessage};
			} else {
				needsTranslations.push({
                   key,
                   value: {...baseLanguageContent[key], ...(isNeedToSetNeedsTranslation ? {needsTranslation: true} : {}), untranslatedMessage: untranslatedMessage}
               });
			}
        } else {
            accu[key] = {...destContent[key], untranslatedMessage: untranslatedMessage};
        }

        return accu;
    }, {});

    const destTranslationByEnglish = _.reduce(_.keys(destContent), (acc, key) => {
        const untranslatedMessage =  baseLanguageContent[key]["untranslatedMessage"] || baseLanguageContent[key]["defaultMessage"];
        const description = baseLanguageContent[key]["description"];
        baseLanguageContent[key] && (acc[backEndLookupCode == "v" ? description + untranslatedMessage : untranslatedMessage] = {...destContent[key], hash: key});
        return acc;
    }, {});

    needsTranslations.forEach((needsTranslation) => {
        const { key , value } = needsTranslation;
        destContent[key] = value;
    });

	// Replace the k interpolation format (&0) with the ICU format ({0})
	const convertToICU = (message) =>  message.replace(/&(\d+)/g, '{$1}');

    // Add translations that already exists in sourceKFile
    if (sourceTranslationByEnglish) {
        for (const key of _.keys(sourceTranslationByEnglish)) {
            const destTranslation = destTranslationByEnglish[key];
            console.log(key)
            if (destTranslation && destContent[destTranslation.hash].needsTranslation) {
                console.log("update", key)
                destContent[destTranslation.hash] = {defaultMessage: convertToICU(sourceTranslationByEnglish[key][1]), description: destTranslation.description, untranslatedMessage: convertToICU(sourceTranslationByEnglish[key][0])};
            }
            else if (addMissingEntriesInDestination && sourceTranslationByEnglish[key][0] != "") {
                console.log("add", key)
                // Generate hash and store new translation
                // Content used formatJS is ${defaultMessage}#${description} when description is present
                let description = "";
                let untranslatedMessage = convertToICU(sourceTranslationByEnglish[key][0]);
                let defaultMessage = convertToICU(sourceTranslationByEnglish[key][1]);

                if (backEndLookupCode == "v") {
                    description = sourceTranslationByEnglish[key][0];
                    untranslatedMessage = convertToICU(sourceTranslationByEnglish[key][1]);
                    defaultMessage = convertToICU(sourceTranslationByEnglish[key][2]);
                }

                const hash = getMessageKey(untranslatedMessage, description);
                destContent[hash] = {defaultMessage: defaultMessage, description: description, untranslatedMessage: untranslatedMessage}
            }
        }
    }
    return destContent;
}

gulp.task('lang:generateLangFile', (cb) => {
	const isUITarget = argv.ui != undefined;
	const targetLocales = argv.locale != undefined ? [argv.locale] : ALL_SUPPORT_LANGUAGES;
	const backEndLookupCodes = argv.lookupCode ? [argv.lookupCode] : JULIA_LOOKUP_CODES;
    if (argv.extract != undefined) {
        if (isUITarget) {
		    execSync(`npm run lang:extract`);
        } else {
            execSync(`npm run lang:extract:julia`);
        }
	}

    if (isUITarget) {
        const baseJSONFile = `lang/${BASE_LANGUAGE}/ui.json`;
        const baseLanguageContent = baseJSONFile ? JSON.parse(fs.readFileSync(baseJSONFile, 'utf8')) : {};
        targetLocales.filter(l => l !== BASE_LANGUAGE).forEach((targetLocale) => {
            if (targetLocale == TEST_LANGUAGE) {
                execSync('./node_modules/.bin/gulp lang:generateTestFile --extract --ui');
                return;
            }

            const destJSONFile = `lang/${targetLocale}/ui.json`;
            let destContent = fs.existsSync(destJSONFile) ? JSON.parse(fs.readFileSync(destJSONFile, 'utf8')) : {};
            destContent = migrateLanguageContent(targetLocale, baseLanguageContent, destContent, null, 'l', false);
            fs.writeFileSync(destJSONFile, JSON.stringify(destContent, null, 2));

            if (argv.ignoreComplie == undefined) {
                execSync(`node_modules/.bin/formatjs compile ${destJSONFile} --ast --out-file lang/compiled-lang/${targetLocale}.json`);
            }
        });
    } else {
        const isUseSourceKFile =  argv.useSourceKFile != undefined;
        const baseLanguageContents = backEndLookupCodes.reduce((accu, lookupCode) => {
            const baseJSONFile = `lang/${BASE_LANGUAGE}/backEnd/${lookupCode}.json`;
            const baseLanguageContent = baseJSONFile ? JSON.parse(fs.readFileSync(baseJSONFile, 'utf8')) : {};
            const baseExtractJSONFile = `lang/${BASE_LANGUAGE}/backEnd/extract/${lookupCode}.json`;
            const baseExtractLanguageContent = baseExtractJSONFile ? JSON.parse(fs.readFileSync(baseExtractJSONFile, 'utf8')) : {};
            accu[lookupCode] = {
                baseLanguageContent,
                baseExtractLanguageContent
            };
            return accu;
        }, {});

        targetLocales.forEach((targetLocale) => {
            backEndLookupCodes.forEach((lookupCode)=> {
                if (targetLocale == TEST_LANGUAGE) {
                    execSync(`./node_modules/.bin/gulp lang:generateTestFile --lookupCode ${lookupCode}`);
                    return;
                }

                const { baseLanguageContent, baseExtractLanguageContent } = baseLanguageContents[lookupCode];
                const destJSONFile = `lang/${targetLocale}/backEnd/${lookupCode}.json`;
                const destExtractJSONFile = `lang/${targetLocale}/backEnd/extract/${lookupCode}.json`;

                let sourceTranslationByEnglish = null;
                if (isUseSourceKFile) {
                    const sourceKFile = `legacy/common/lang/${targetLocale == "zh-CN" ? "zh-CH" : targetLocale}/${lookupCode}.dfk`;
                    const isSourceKFileExist = sourceKFile ? fs.existsSync(sourceKFile) : false;
                    console.log('targetLocale', targetLocale, 'sourceKFile', sourceKFile, 'isSourceKFileExist', 'lookupCode', lookupCode);

                    if (isSourceKFileExist) {
                        sourceTranslationByEnglish = _.keyBy(fs.readFileSync(sourceKFile, 'utf8').split("\r\n").map(line => line.split("\t")), columns => lookupCode == "v" ? columns[0] + columns[1] : columns[0]);
                    }
                }

                let destContent = fs.existsSync(destJSONFile) ? JSON.parse(fs.readFileSync(destJSONFile, 'utf8')) : {};
                destContent = migrateLanguageContent(targetLocale, baseLanguageContent, destContent, sourceTranslationByEnglish, lookupCode, true);
                fs.writeFileSync(destJSONFile, JSON.stringify(destContent, null, 2));

                destContent = fs.existsSync(destExtractJSONFile) ? JSON.parse(fs.readFileSync(destExtractJSONFile, 'utf8')) : {};
                destContent = migrateLanguageContent(targetLocale, baseExtractLanguageContent, destContent, sourceTranslationByEnglish, lookupCode, true);
                fs.writeFileSync(destExtractJSONFile, JSON.stringify(destContent, null, 2));
            });
        });
    }

	cb();
});


gulp.task('lang:generateTestFile', (cb) => {
	if (argv.extract != undefined) {
		execSync(`npm run lang:extract`)
	}

    const isUITarget = argv.ui != undefined;
	const backEndLookupCode = argv.lookupCode || "l";

	const fileList = isUITarget ? [{ baseJSONFile: `lang/${BASE_LANGUAGE}/ui.json`, testJSONFile: `lang/${TEST_LANGUAGE}/ui.json`}] :
        [{ baseJSONFile: `lang/${BASE_LANGUAGE}/backEnd/${backEndLookupCode}.json`, testJSONFile: `lang/${TEST_LANGUAGE}/backEnd/${backEndLookupCode}.json`},
         { baseJSONFile: `lang/${BASE_LANGUAGE}/backEnd/extract/${backEndLookupCode}.json`, testJSONFile: `lang/${TEST_LANGUAGE}/backEnd/extract/${backEndLookupCode}.json`}]

    fileList.forEach((f) => {
        const { baseJSONFile, testJSONFile } = f;
        const baseLanguageContent = JSON.parse(fs.readFileSync(baseJSONFile, 'utf8'));
        _.values(baseLanguageContent).forEach(value => value.defaultMessage = `>>> ${value.defaultMessage} <<<`);

        fs.writeFileSync(testJSONFile, JSON.stringify(baseLanguageContent, null, 2));

        if (isUITarget) {
            execSync(`node_modules/.bin/formatjs compile ${testJSONFile} --ast --out-file lang/compiled-lang/${TEST_LANGUAGE}.json`);
            (argv.extract != undefined) && execSync(`npm run lang:compile`);
        }
    });

	cb();
});

gulp.task('lang:autoCompile', (cb) => {
    // Julia doesn't need automatically compile currently
	const isUITarget = true; // argv.ui != undefined;
	const langFileName = `${isUITarget ? 'ui' : 'backEnd'}.json`;
	const targetLocales = argv.locale != undefined ? [argv.locale] : ALL_SUPPORT_LANGUAGES;
	const targetLocalesFilePath = targetLocales.map((targetLocale) => `lang/${targetLocale}/${langFileName}`).filter((path) => fs.existsSync(path));
	const watcher = gulp.watch(targetLocalesFilePath);
	watcher.on('change', function(path, stats) {
		const locale = path.replace('lang/', '').replace(`/${langFileName}`, '');
		execSync(`node_modules/.bin/formatjs compile ${path} --ast --out-file lang/compiled-lang/${locale}.json`);
	});
});

gulp.task('lang:mergeFile', (cb) => {
	const isUITarget = argv.ui != undefined;
	const client =isUITarget ? "ui" : "backEnd";
	const locale = argv.locale;
	const baseJSONFile = `lang/${locale}/${client}.json`;
	const mergeJSONFile = `lang/${locale}/${client}.json.bak`;

	const baseLanguageContent = JSON.parse(fs.readFileSync(baseJSONFile, 'utf8'));
	const mergeLanguageContent = JSON.parse(fs.readFileSync(mergeJSONFile, 'utf8'));

	const mergeLanguageValues = _.filter(_.values(mergeLanguageContent), v => v["needsTranslation"] !== true);

	let count = 0, count2 = 0;
	_.forEach(_.values(baseLanguageContent), bv => {
		if (bv["needsTranslation"] === true) {
			const found = _.find(mergeLanguageValues, mv => mv["description"] === bv["description"] && mv["untranslatedMessage"] === bv["defaultMessage"]);
			if (found) {
				count++;
				console.log(`replace from backup\t[${bv["defaultMessage"]}] ==> [${found["defaultMessage"]}]\n\t\t\t${bv["description"]}`);
				// v["backupMessage"] = v["defaultMessage"];
				bv["defaultMessage"] = found["defaultMessage"];
				delete bv["needsTranslation"];
			} else {
				count2++;
				// console.log(`can not find backup\t[${bv["defaultMessage"]}]\n\t\t\t${bv["description"]}`);
			}
		}
	});
	console.log(`\n---------------------------\nreplace ${count} from backup, ${count2} can not found in backup file\n---------------------------\n`);

	fs.writeFileSync(baseJSONFile, JSON.stringify(baseLanguageContent, null, 2));

	if (isUITarget) {
		execSync(`node_modules/.bin/formatjs compile ${baseJSONFile} --ast --out-file lang/compiled-lang/${locale}.json`);
	}
	cb();
});

gulp.task('lang:syncLangFileKeys', (cb) => {
	if (argv.filename == null) {
		console.error("Filename required")
		return;
	}

	const filename = argv.filename;
	const existingLanguageContent = JSON.parse(fs.readFileSync(filename, 'utf8'));

	const updatedContent = _.keys(existingLanguageContent).reduce((accu, key) => {

		const message = existingLanguageContent[key];
		const correct_key = getMessageKey(message["untranslatedMessage"], message["description"]);

		if (message["untranslatedMessage"] !== "" && correct_key !== key) {
			console.log(`Update key:${key} to ${correct_key}`);
			console.log(message);
			accu[correct_key] = message;
		}
		else {
			accu[key] = message;
		}

		return accu;
	}, {});

	fs.writeFileSync(filename, JSON.stringify(updatedContent, null, 2));

	cb();
})

function getMessageKey(untranslatedMessage, description) {
	return interpolateName("", "[sha512:contenthash:base64:6]", {content: description != "" ? `${untranslatedMessage}#${description}` : untranslatedMessage})
}
