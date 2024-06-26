// Type definitions for Redux v1.0.0
// Project: https://github.com/rackt/redux
// Definitions by: William Buchwalter <https://github.com/wbuchwalter/>, Vincent Prouillet <https://github.com/Keats/>
// Definitions: https://github.com/borisyankov/DefinitelyTyped

import {Component} from 'react';

declare module "recompose" {
    class ElementClass extends Component<any, any> {
    }
    interface ClassDecorator {
        <T extends (typeof ElementClass)>(component:T):T
    }

    function pure(): ClassDecorator;
}