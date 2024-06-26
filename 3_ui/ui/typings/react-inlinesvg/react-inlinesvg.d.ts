// Type definitions for InlineSVG
// Project: https://github.com/matthewwithanm/react-inlinesvg
// Definitions by: Noah Shipley <https://github.com/noah79/>
// Definitions: https://github.com/borisyankov/DefinitelyTyped


declare module __InlineSVG {
    interface InlineSVGProps extends React.HTMLAttributes<any> {
        src: string;
        meta?: string;
    }

    interface InlineSVGClass extends React.ComponentClass<InlineSVGProps>{}

}

declare var InlineSVG : __InlineSVG.InlineSVGClass;

declare module "react-inlinesvg" {
    export = InlineSVG;
}



