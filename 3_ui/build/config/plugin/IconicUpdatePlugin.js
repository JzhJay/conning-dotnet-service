const fs = require('fs');
import { appIcons } from '../../../ui/src/stores/site/iconography/icons';

class IconicUpdatePlugin {
    static defaultOptions = {
        outputFile: 'iconicUpdate.js',
    };

    // Any options should be passed in the constructor of your plugin,
    // (this is a public API of your plugin).
    constructor(options = {}) {
        // Applying user-specified options over the default options
        // and making merged options further available to the plugin methods.
        // You should probably validate all the options here as well.
        this.options = { ...IconicUpdatePlugin.defaultOptions, ...options };
    }

    apply(compiler) {
        const pluginName = IconicUpdatePlugin.name;

        // webpack module instance can be accessed from the compiler object,
        // this ensures that correct version of the module is used
        // (do not require/import the webpack or any symbols from it directly).
        const { webpack } = compiler;

        // Compilation object gives us reference to some useful constants.
        const { Compilation } = webpack;

        // RawSource is one of the "sources" classes that should be used
        // to represent asset sources in compilation.
        const { RawSource } = webpack.sources;

        let allIconicInjectScripts = '';
        // Tapping to the "thisCompilation" hook in order to further tap
        // to the compilation process on an earlier stage.
        compiler.hooks.initialize.tap(pluginName, (compilation) => {
            // Tapping to the assets processing pipeline on a specific stage.
            function traverseAppIcons(icons) {
                for (let key in icons) {
                    if (Object.prototype.hasOwnProperty.call(icons, key)) {
                        const icon = icons[key];
                        if (icon) {
                            if (icon.type && icon.name) {
                                getInjectScript(icon);
                            } else {
                                traverseAppIcons(icon);
                            }
                        }
                    }
                }
            }

            function getInjectScript(icon) {
                const { type, name } = icon;
                if (type === 'iconic' || type === 'customIconic') {
                    const folder = type == 'customIconic' ? 'customIconic' : 'Iconic';
                    const fileName = `lib/${folder}/svg/smart/${name}.svg`;
                    const svgFilePath = `ui/src/${fileName}`;
                    if (fs.existsSync(svgFilePath)) {
                        const svgSource = fs.readFileSync(svgFilePath, 'utf8');
                        if (svgSource) {
                            const regex = /\/\/<!\[CDATA\[[\r\n|\r|\n]*([\s\S]*?)[\r\n|\r|\n]*\/\/]]>/;
                            const matchResult = svgSource.match(regex);
                            // Check if there is a match and retrieve the extracted string
                            if (matchResult && matchResult.length > 1) {
                                let extractedString = matchResult[1];
                                if (extractedString) {
                                    allIconicInjectScripts += `(function(window){${extractedString}})(window);\n\n`;
                                }
                            }
                        }
                    } else {
                        console.error(`Svg file ${svgFilePath} doesn't exist.`)
                    }
                }
            }

            traverseAppIcons(appIcons);
            
            if (allIconicInjectScripts) {
                console.log(`Generate Iconic inject scripts successfully.`)
            }
        });

        compiler.hooks.thisCompilation.tap(pluginName, compilation => {
            compilation.hooks.additionalAssets.tap(pluginName,
                () => {
                    const { outputFile } = this.options;
                    if (allIconicInjectScripts) {
                        compilation.emitAsset(outputFile, new RawSource(allIconicInjectScripts));
                    }
                });
        });
    }
}

module.exports = { IconicUpdatePlugin };