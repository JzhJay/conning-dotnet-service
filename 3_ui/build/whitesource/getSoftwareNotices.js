
const fs = require('fs');
const superagent = require('superagent');
const _get = require('lodash/get');
const whiteSourceApiUrl = 'https://app.whitesourcesoftware.com/api/v1.3';
const checkedLicensesSet = new Set([
    'Academic 2.1',
    'Apache 2.0',
    'BSD',
    'BSD2',
    'BSD3',
    'CC BY 3.0',
    'CC BY 4.0',
    'GPL 2.0',
    'GPL 3.0 GCC',
    'Illinois/NCSA',
    'ISC',
    'LGPL',
    'LGPL 3.0',
    'MIT',
    'OpenSSL'
]);

function waitTimeout(timeout) {
    return new Promise((resolve)=> {
        setTimeout(resolve, timeout);
    });
}

export default async function (scanResultPath, outputPath) {
    try {
        const scanResult = JSON.parse(fs.readFileSync(scanResultPath, 'utf8'));
        const project = scanResult.projects[0];
        const requestBody = {
            requestType: 'getProjectAttributionReport',
            productToken: '87cd0bd9f18b4e8681e2678becfd31c26bb7876a903f4e8796f97cf906ae51b1',
            projectToken: `${project.projectToken}`,
            userKey: '2cda2f4c14554a6f8abafaa953b526a48af8eba7ac104168927d4f94b47a8123',
            reportingAggregationMode: 'BY_PROJECT',
            missingLicenseDisplayOption: 'BLANK',
            exportFormat: 'JSON',
            licenseReferenceTextPlacement: 'LICENSE_SECTION',
            customAttribute: 'customName'
        };

        // callback
        let body;
        let retryTime = 0;
        while (!body && retryTime < 5) { 
            try {
                console.log('Start to get WhiteSource scan result');
                const response = await superagent
                    .post(whiteSourceApiUrl)
                    .send(requestBody) // sends a JSON post body
                    .set('accept', 'json');

                body = response.body;
                
                if (!body || body.errorMessage) {
                    console.error('body', body);     
                    body = null;
                }
            } catch (e) {
                console.error('Get WhiteSource scan result failed', e.stack);
            }

            if (!body) {
                console.error('Retry to get whiteSource scan result');
                await waitTimeout(60000);
                retryTime += 1;
            }
        }

        if (!body) {
            throw new Error('Cannot get WhiteSource scan result');
        }

        console.log('Get WhiteSource scan result completely');
        const librarySet = new Set(); 
        const items = body.summary.filter((item) => { // check if library's licenses need to show software notices
            return item.licenses.some((license) => checkedLicensesSet.has(license)); 
        }).filter((item) => {   
            let name = item.library;
            const customName = _get(item, ['customAttribute', 'customName', project.projectName], '');
            
            if (customName) {
                name = customName;
            } else {
                const extraVersionPatterns = [
                    /\-\d+\.\d+\.\d+\.[a-zA-z]+$/, // Remove node package version and file extensions, ex: icons-3.13.0.tgz --> icons
                    /(\-\d+\.\d+\.\d+\.\d+)?\.dll$/, // Remove dll package version and file extensions, ex: libuv.dll --> libuv, AWSSDK.Core-3.3.106.9.dll --> AWSSDK.Core
                    /\-\d+\.\d+\.\d+\.min\.js$/, // Remove min js package version and file extensions, ex: push-1.0.12.min.js --> push
                    /\-\d+\.\d+\.\d+$/, // Remove version but no file extensions, ex: Semantic-UI-2.2.10 --> Semantic-UI
                    /\@\d+\.\d+\.\d+$/, // Remove @ version, ex: blueprint-@blueprintjs/docs-app@3.25.0 --> blueprint-@blueprintjs/docs-app
                    /\-v\d+\.\d+\.\d+$/ // Remove jula version, ex: Pkg.jl-v1.4.0 --> Pkg.jl
                ];

                const matchedPattern = extraVersionPatterns.find((pattern) => !!name.match(pattern));
                if (matchedPattern) {
                    name = name.replace(matchedPattern, '');
                }
            }

            item.library = name;

            if (!librarySet.has(name)) { // check if library is duplicate
                librarySet.add(name);
                return true;
            }

            return false;
        });
        
        let currentChar = '';
        const finalResults = items.reduce((accu, item) => {
            const firstChar = item.library.substring(0, 1).toUpperCase();
            if (currentChar !== firstChar) {
                currentChar = firstChar;
                accu.push({
                    displayName: firstChar,
                    libraries: [
                        item
                    ]
                });
            } else {
                accu[accu.length - 1].libraries.push(item);
            }

            return accu;
        }, []);

        console.log('Start to create softwareNotices.json');
        fs.writeFileSync(outputPath, JSON.stringify(finalResults));
        console.log('Output softwareNotices.json successfully!');
    } catch(e) {
        throw e;    
    }
};