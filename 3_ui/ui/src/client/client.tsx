localStorage.debug = null

import {utility} from 'stores';
const {KeyCode} = utility;

//import 'react-select/dist/react-select.css';
import 'styles/common';

//require('jquery-ui/themes/base/jquery-ui.css'); // Why?
import {i18n} from 'stores';
import './clientRoutes';
import {Environments} from '../shared';

//require('./lib/semantic/dist/semantic.css');   // The fonts stop working
// Plugin for determining query strings
(function($) {
    $.QueryString = (function(a) {
        if (a == null || a.length === 0) return {};
        let b = {};
        for (let i = 0; i < a.length; ++i)
        {
            let p=a[i].split('=', 2);
            if (p.length !== 2) continue;
            b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
        }
        return b;
    })(window.location.search.substr(1).split('&'))
})(jQuery);

// Add a way to pause script execution via F12
if (!IS_PROD) {
    $(window).keydown(function (e) {
        if (e.keyCode === KeyCode.F12) debugger; });
}

if (DEV_BUILD && PLATFORM === 'client' && window.devToolsExtension) {
	window.devToolsExtension()
}

var _render     = ReactDOM.render;
(ReactDOM as any).render = function () {
	return arguments[1].react = _render.apply(this, arguments);
}
