

declare module 'golden-layout' {
    import React = __React;

    export interface ReactLayoutConfig {
        component?:string,
        componentState?:any,
        props?:any
    }

    export interface BaseLayoutConfig {
        content?:Array<ItemConfig>,
        id?:string,
        width?:number,
        height?:number,
        isClosable?:boolean,
        title?:string,
        activeItemIndex?:number
        type?:'react-component' | 'row' | 'stack' | 'column';
    }

    export interface ItemConfig extends ReactLayoutConfig, BaseLayoutConfig {
		key?: string;
    }

    export interface Header {
        tabs:Tab[]
        layoutManager: GoldenLayout,
        activeContentItem: ContentItem,
        element: JQuery,
        tabsContainer: JQuery,
        controlsContainer: JQuery,
        setActiveContentItem(ContentItem);
        createTab(contentItem: ContentItem,  index: number);
        removeTab(contentItem: ContentItem);

    }

    export interface Tab {
        contentItem:ContentItem;
        element:JQuery;
        isActive: boolean;
        header: Header;
        titleElement: JQuery;

        setTitle(title:string);
        setActive(isActive: boolean);

    }

    export interface GoldenLayoutConfig {
        settings?:{
            hasHeaders?:boolean
            constrainDragToContainer?:boolean
            reorderEnabled?:boolean
            selectionEnabled?:boolean
            popoutWholeStack?:boolean
            blockedPopoutsThrowError?:boolean
            closePopoutsOnUnload?:boolean
            showPopoutIcon?:boolean
            showMaximiseIcon?:boolean
            showCloseIcon?:boolean
        },
        dimensions?:{
            borderWidth?:number
            minItemHeight?:number
            minItemWidth?:number
            headerHeight?:number
            dragProxyWidth?:number | string
            dragProxyHeight?:number | string
        },
        labels?:{
            close?:string
            maximise?:string
            minimise?:string
            popout?:string
        },
        content?:ItemConfig
    }

    type ContentItemType =  'row' | 'column' | 'stack' | 'root';

    export interface ContentItem {
        type:ContentItemType;
        contentItems:ContentItem[];
        parent?:ContentItem;
        id?:string | string[];
        isInitialised:boolean;
        isMaximised:boolean;
        isRoot:boolean;
        isRow:boolean;
        isColumn:boolean;
        isStack:boolean;
        isComponent:boolean;
        layoutManager:GoldenLayout;
        element:JQuery;
        childElementContainer:JQuery;
        container?:IContainer;
        config?:ItemConfig;
        header:Header;

        addChild(item:ContentItem | ItemConfig, index?:number);
        removeChild(item:ContentItem, keepChild?:boolean)
        replaceChild(item:ContentItem, newChild:ContentItem | ItemConfig)
        setSize()
        setTitle(title:string)
        remove()
        popout()
        toggleMaximise()
        select()
        deselect()
        hasId(id:string):boolean
        setActiveContentItem(item:ContentItem)
        getActiveContentItem():ContentItem
        addId(string)
        removeId(string)
        getItemsByFilter(filterFn:(ContentItem) => boolean):Array<ContentItem>
        getItemsById(id:string):Array<ContentItem>
        getItemsByType(type:ContentItemType):Array<ContentItem>
        getComponentsByName(name:string):Array<any>



        /**
         * A powerful, yet admittedly confusing method to recursively call methods on items in a tree. Usually you wouldn't need to use it directly, but it's used internally to setSizes, destroy parts of the item tree etc.
         */
        callDownwards(functionName:string, args?:Array<any>, bottomUp?:boolean, skipSelf?:boolean);

        emitBubblingEvent(name:string);


        on(event:'stateChanged' | 'titleChanged' | 'activeContentItemChanged' | 'itemDestroyed' | 'itemCreated' | 'componentCreated' | 'rowCreated' | 'columnCreated' | 'stackCreated',
           callback:Function,
           context?:any);
        unbind(event:'stateChanged' | 'titleChanged' | 'activeContentItemChanged' | 'itemDestroyed' | 'itemCreated' | 'componentCreated' | 'rowCreated' | 'columnCreated' | 'stackCreated',
           callback:Function,
           context?:any);
    }

    export interface IBrowserWindow {
        close();
        getWindow():Window;
        getGInstance():GoldenLayout;
        popIn();

        isInitialised: boolean;
    }

    export interface EventEmitter{
        on(...any);
        emit(...any);
        trigger(...any);
        unbind(eventName:string, Function, context?:any);
        off(eventName:string, Function, context?:any);
    }

    export interface IContainer {
        parent: ContentItem;
        width: number;
        height: number;
        tab: Tab;
        title: string;
        layoutManager: GoldenLayout,
        isHidden: boolean;

        hide();
        getElement() : JQuery;

        /**
         * Overwrites the components state with the provided value. To only change parts of the componentState see extendState below. This is the main mechanism for saving the state of a component.
         * This state will be the value of componentState when layout.toConfig() is called and will be passed back to the component's constructor function. It will also be used when the component is opened in a new window.
         */
        setState(state: any);
        /**
         * This is similar to setState, but merges the provided state into the current one, rather than overwriting it.
         * @param state
         */
        extendState(state: any);
        getState() : any;
        hide() : boolean;
        show() : boolean;
        setSize(width: number,  height: number);
        setTitle(title: string);
        close(): boolean;

        on(event:'open' | 'resize' | 'destroy' | 'close' | 'tab' | 'hide' | 'show',
           callback:Function,
           context?:any);

        unbind(event:'open' | 'resize' | 'destroy' | 'close' | 'tab' | 'hide' | 'show',
               callback:Function,
               context?:any);

        trigger(event:'open' | 'resize' | 'destroy' | 'close' | 'tab' | 'hide' | 'show');
    }

    type LayoutEvent = "initialised" | "windowOpened" | 'windowClosed' | "selectionChanged" | 'stateChanged' | 'itemCreated' | 'itemDestroyed' | 'itemDropped'
        | 'componentCreated' | 'componentDestroyed' | 'rowCreated' | 'columnCreated' | 'stackCreated' | 'tabCreated' | 'popIn' | 'setSize'

    export class GoldenLayout {
        registerComponent(name:string, component:Function);

        isInitialised:boolean;
        container:JQuery;
        root:ContentItem;
        width:number;
        height:number;
        config:ItemConfig;
        openPopouts:Array<IBrowserWindow>;
        isSubWindow:boolean;
        eventHub:EventEmitter;
        init();

        toConfig():any;

        getComponent(name:string):any;

        /**
         * Resizes the layout. If no arguments are provided GoldenLayout measures its container and resizes accordingly.
         * @param width
         * @param height
         */
        updateSize(width?:number, height?:number)

        /**
         * Destroys the layout. Recursively calls destroy on all components and content items, removes all event listeners and finally removes itself from the DOM.
         */
        destroy();

        /**
         * If settings.selectionEnabled is set to true, this allows to select items programmatically.
         * @param contentItem
         */
        selectItem(contentItem:ContentItem);

        /**
         Turns a DOM element into a dragSource, meaning that the user can drag the element directly onto the layout where it turns into a contentItem.
         */
        createDragSource(element:JQuery, itemConfig:ItemConfig)

        on(event:LayoutEvent, callback:Function, context?:any);
        unbind(event:LayoutEvent, callback:Function, context?:any);

        /**
         * Creates a new popout window with configOrContentItem as contents at the position specified in dimensions
         * @param configOrContentItem
         * @param dimensions
         * @param parentId
         * @param indexInParent
         */
        createPopout(configOrContentItem: ContentItem | GoldenLayoutConfig, dimensions : {left: number,  top: number,  width: number,  height: number}, parentId?: string, indexInParent?: number);
    }

    export interface GoldenLayoutFn {
        new(config:GoldenLayoutConfig, element?:Node) : GoldenLayout;
    }

    var _GoldenLayout:GoldenLayout;
    export default _GoldenLayout;
}
