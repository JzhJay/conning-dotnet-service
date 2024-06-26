function getCdnList(isDebug) { 
    const jsExtenstion = isDebug ? '.js': '.min.js';
    const reactJsExtension = isDebug ? '.development.js' : '.production.min.js';

	return [
        `./node_modules/react/umd/react${reactJsExtension}`,
        `./node_modules/react-dom/umd/react-dom${reactJsExtension}`,
        `./node_modules/react-dom/umd/react-dom-server.browser${reactJsExtension}`,
        `./node_modules/push.js/bin/push${jsExtenstion}`,
        `./node_modules/jquery/dist/jquery${jsExtenstion}`,
        `./node_modules/lodash/lodash${jsExtenstion}`,
        `./ui/src/lib/semantic/dist/semantic${jsExtenstion}`,
        `./ui/src/lib/semantic/dist/components/transition${jsExtenstion}`,
        `./ui/src/lib/semantic/dist/components/dropdown${jsExtenstion}`,
        `./ui/src/lib/semantic/dist/components/popup${jsExtenstion}`,
        `./ui/src/lib/semantic/dist/components/sidebar${jsExtenstion}`,
        './node_modules/semantic-ui-react/dist/umd/semantic-ui-react.min.js'
    ];
}

module.exports = getCdnList;
