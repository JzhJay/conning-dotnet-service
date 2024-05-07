// Type definitions for react-flip-move
// Project: https://github.com/joshwcomeau/react-flip-move
// Definitions by: Noah Shipley <https://github.com/noah79/>
// Definitions: https://github.com/borisyankov/DefinitelyTyped


declare module __ReactFlipMove {
    interface ReactFlipMoveProps extends React.Props<ReactFlipMoveClass> {
        children?: any;
        easing?: string;
        duration?: number;
        delay?: number;
        staggerDurationBy?: number;
        staggerDelayBy ?: number;
	    appearAnimation?: any;
        enterAnimation?: any;
        leaveAnimation?: any;
        onStart?: Function;
        onFinish?: Function;
        onStartAll?: Function;
        onFinishAll?: Function;
        style?: any;
	    maintainContainerHeight?: boolean;
        className?: string;
        typeName?: string;
        disableAllAnimations?: boolean;
    }

    interface ReactFlipMoveClass extends React.ComponentClass<ReactFlipMoveProps> {

    }
}

declare var ReactFlipMove : __ReactFlipMove.ReactFlipMoveClass

declare module "react-flip-move" {
    export = ReactFlipMove;
}



