// Type definitions for react-portal
// Project: https://github.com/react-portal
// Definitions by: Noah Shipley <https://github.com/noah79/>
// Definitions: https://github.com/borisyankov/DefinitelyTyped


declare module __ReactPortal {
    interface PortalProps extends React.Props<PortalClass> {
        isOpened?: boolean;
        openByClickOn?: any;
        closeOnOutsideClick?: boolean;
        closeOnEsc?: boolean;
        onOpen?: (Node) => void;
        onClose?: () => void;
        onUpdate?: () => void;
        beforeClose(node: React.ReactNode, fn: Function)
    }

    interface PortalClass extends React.ComponentClass<PortalProps> {
        openPortal();
        node: Node;
    }
}

declare var Portal : __ReactPortal.PortalClass

declare module "react-portal" {
    export = Portal;
}



