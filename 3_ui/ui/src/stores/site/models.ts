export interface SiteController {
    showModal(config: ModalConfig);
    hideModal();
}

export interface ModalConfig {
    onRenderContent?: () => React.ReactNode | React.ReactNode[];
    onRenderActions?: () => React.ReactNode | React.ReactNode[];
    header?: string;
    onShow?: Function;
    className?: string;
    buttons?: 'okCancel' | 'close'
    buttonLabel?: string,
    onApprove?: Function;
    onDeny?: Function;
    okDisabled?: boolean;
    cancelDisabled?: boolean;
    closable?: boolean;
}

export type SiteHeaderStyle = 'v1' | 'v2';

export interface SiteHeader {
    title?: string;  // Used in chrome tab title
    id?: string | null;
    editable?: boolean;
    editing?: boolean;
    status?: string;
    type?: 'report' | 'query' | 'queryResult' | 'simulation' | null;
    loading?: boolean;
}

export type SortOrder = 'initial' | 'asc' | 'desc';

export type MenuOpenOn = 'hover' | 'click';


export interface SystemInformation {
	dbVersion: string,
	serverVersion: string,
	canMigrateDb: boolean,
	rethinkDb: { host: string, database: string, serverError: boolean },
}