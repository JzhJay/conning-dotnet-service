/*!
    *
    * Wijmo Library 5.20212.812
    * http://wijmo.com/
    *
    * Copyright(c) GrapeCity, Inc.  All rights reserved.
    *
    * Licensed under the GrapeCity Commercial License.
    * sales@wijmo.com
    * wijmo.com/products/wijmo-5/license/
    *
    */


    module wijmo.webcomponents {
    







//import * as wjcGridSelector from '@grapecity/wijmo.grid.selector';

























'use strict';

export function softChart(): typeof wijmo.chart {
    return wijmo._getModule('wijmo.chart');
}
export function softChartAnalytics(): typeof wijmo.chart.analytics {
    return wijmo._getModule('wijmo.chart.analytics');
}
export function softChartAnimation(): typeof wijmo.chart.animation {
    return wijmo._getModule('wijmo.chart.animation');
}
export function softChartAnnotation(): typeof wijmo.chart.annotation {
    return wijmo._getModule('wijmo.chart.annotation');
}
export function softChartFinance(): typeof wijmo.chart.finance {
    return wijmo._getModule('wijmo.chart.finance');
}
export function softChartFinanceAnalytics(): typeof wijmo.chart.finance.analytics {
    return wijmo._getModule('wijmo.chart.finance.analytics');
}
export function softChartHierarchical(): typeof wijmo.chart.hierarchical {
    return wijmo._getModule('wijmo.chart.hierarchical');
}
export function softChartInteraction(): typeof wijmo.chart.interaction {
    return wijmo._getModule('wijmo.chart.interaction');
}
export function softChartRadar(): typeof wijmo.chart.radar {
    return wijmo._getModule('wijmo.chart.radar');
}
export function softChartMap(): typeof wijmo.chart.map {
    return wijmo._getModule('wijmo.chart.map');
}
export function softGauge(): typeof wijmo.gauge {
    return wijmo._getModule('wijmo.gauge');
}
export function softGrid(): typeof wijmo.grid {
    return wijmo._getModule('wijmo.grid');
}
export function softGridDetail(): typeof wijmo.grid.detail {
    return wijmo._getModule('wijmo.grid.detail');
}
export function softGridFilter(): typeof wijmo.grid.filter {
    return wijmo._getModule('wijmo.grid.filter');
}
export function softGridGrouppanel(): typeof wijmo.grid.grouppanel {
    return wijmo._getModule('wijmo.grid.grouppanel');
}
export function softGridSearch(): typeof wijmo.grid.search {
    return wijmo._getModule('wijmo.grid.search');
}
// export function softGridSelector(): typeof wjcGridSelector {
//     return _getModule('wijmo.grid.selector');
// }
export function softGridMultirow(): typeof wijmo.grid.multirow {
    return wijmo._getModule('wijmo.grid.multirow');
}
export function softGridSheet(): typeof wijmo.grid.sheet {
    return wijmo._getModule('wijmo.grid.sheet');
}
export function softGridTransposed(): typeof wijmo.grid.transposed {
    return wijmo._getModule('wijmo.grid.transposed');
}
export function softGridTransposedMultiRow(): typeof wijmo.grid.transposedmultirow {
    return wijmo._getModule('wijmo.grid.transposedmultirow');
}
export function softGridImmutable(): typeof wijmo.grid.immutable {
    return wijmo._getModule('wijmo.grid.immutable');
}
export function softNav(): typeof wijmo.nav {
    return wijmo._getModule('wijmo.nav');
}
export function softOlap(): typeof wijmo.olap {
    return wijmo._getModule('wijmo.olap');
}
export function softViewer(): typeof wijmo.viewer {
    return wijmo._getModule('wijmo.viewer');
}
export function softInput(): typeof wijmo.input {
    return wijmo._getModule('wijmo.input');
}
export function softBarcode(): typeof wijmo.barcode {
    return wijmo._getModule('wijmo.barcode');
}
export function softBarcodeCommon(): typeof wijmo.barcode.common {
    return wijmo._getModule('wijmo.barcode.common');
}
export function softBarcodeComposite(): typeof wijmo.barcode.composite {
    return wijmo._getModule('wijmo.barcode.composite');
}
export function softBarcodeSpecialized(): typeof wijmo.barcode.specialized {
    return wijmo._getModule('wijmo.barcode.specialized');
}

    }
    


    module wijmo.webcomponents {
    


/*
    Represents shared metadata (control properties/events descriptions) used by 
    interop services like Angular directives and Knockout custom bindings.

    Control metadata is retrieved using the getMetaData method by passing the 
    control's metaDataId (see the method description for details).

    Descriptor objects are created using the CreateProp, CreateEvent and 
    CreateComplexProp static methods.

    The specific interop service should create a class derived from ControlMetaFactory
    and override these methods to create descriptors of the platform specific types 
    (see the wijmo.angular.MetaFactory class as an example).

    To initialize platform specific properties of the descriptors an interop services 
    can use the findProp, findEvent and findComplexProp methods to find a necessary 
    descriptor object by name.
*/
export class ControlMetaFactory {
    
    // Creates a property descriptor object. A specific interop service should override 
    // this method in the derived metadata factory class to create platform specific 
    // descriptor object.
    public static CreateProp(propertyName: string, propertyType: PropertyType, changeEvent?: string, enumType?,
        isNativeControlProperty?: boolean, priority?: number): PropDescBase {

        return new PropDescBase(propertyName, propertyType, changeEvent, enumType, isNativeControlProperty, priority);
    }

    // Creates an event descriptor object. A specific interop service should override this method in the derived
    // metadata factory class to create platform specific descriptor object.
    public static CreateEvent(eventName: string, isPropChanged?: boolean): EventDescBase {
        return new EventDescBase(eventName, isPropChanged);
    }

    // Creates a complex property descriptor object. A specific interop service should override this method in the derived
    // metadata factory class to create platform specific descriptor object.
    public static CreateComplexProp(propertyName: string, isArray: boolean, ownsObject?: boolean): ComplexPropDescBase {
        return new ComplexPropDescBase(propertyName, isArray, ownsObject);
    }

    // Finds a property descriptor by the property name in the specified array.
    public static findProp(propName: string, props: PropDescBase[]): PropDescBase {
        return this.findInArr(props, 'propertyName', propName);
    }

    // Finds an event descriptor by the event name in the specified array.
    public static findEvent(eventName: string, events: EventDescBase[]): EventDescBase {
        return this.findInArr(events, 'eventName', eventName);
    }

    // Finds a complex property descriptor by the property name in the specified array.
    public static findComplexProp(propName: string, props: ComplexPropDescBase[]): ComplexPropDescBase {
        return this.findInArr(props, 'propertyName', propName);
    }

    /*
        Returns metadata for the control by its metadata ID.In the most cases the control type (constructor function)
        is used as metadata ID. In cases where this is not applicable an arbitrary object can be used as an ID, e.g.
        'MenuItem' string is used as the ID for Menu Item.

        The sets of descriptors returned for the specific metadata ID take into account the controls inheritance chain
        and include metadata defined for the control's base classes.
        In case of a control that has no a base class metadata you create its metadata object with a constructor:
        return new MetaDataBase(... descriptor arrays ...);

        If the control has the base control metadata then you create its metadata object by a recursive call to
        the getMetaData method with the base control's metadata ID passed, and add the controls own metadata to
        the returned object using the 'add' method. E.g. for the ComboBox derived from the DropDown this looks like:
        return this.getMetaData(wijmo.input.DropDown).add(... descriptor arrays ...);

        The specific platforms provide the following implementations of the metadata ID support:

        Angular
        =======
        The WjDirective._getMetaDataId method returns a metadata ID. By default it returns a value of the
        WjDirective._controlConstructor property. Because of this approach it's reasonable to override the
        _controlConstructor property even in the abstract classes like WjDropDown, in this case it's not necessary
        to override the _getMetaDataId method itself.
        ----------------
        WARNING: if you override the _getMetaDataId method, don't forget to override it in the derived classes!
        ----------------
        You usually need to override the _getMetaDataId method only for classes like WjMenuItem and WjCollectionViewNavigator
        for which the _controlConstructor as an ID approach doesn't work.

        Knockout
        ========
        TBD
    */
    public static getMetaData(metaDataId: any): MetaDataBase {
        switch (metaDataId) {

            // wijmo.Control *************************************************************
            case wijmo.Control:
                return new MetaDataBase(
                    [
                        this.CreateProp('isDisabled', PropertyType.Boolean),
                    ],
                    [
                        this.CreateEvent('gotFocus'),
                        this.CreateEvent('lostFocus'),
                        this.CreateEvent('refreshing'),
                        this.CreateEvent('refreshed'),
                        this.CreateEvent('invalidInput')
                    ]);

            // wijmo.input *************************************************************
            case (softInput()) && (softInput()).DropDown:
                return this.getMetaData(wijmo.Control).add(
                    [
                        this.CreateProp('isDroppedDown', PropertyType.Boolean, 'isDroppedDownChanged'),
                        this.CreateProp('showDropDownButton', PropertyType.Boolean),
                        this.CreateProp('autoExpandSelection', PropertyType.Boolean),
                        this.CreateProp('placeholder', PropertyType.String),
                        this.CreateProp('dropDownCssClass', PropertyType.String),
                        this.CreateProp('isAnimated', PropertyType.Boolean),
                        this.CreateProp('isReadOnly', PropertyType.Boolean),
                        this.CreateProp('isRequired', PropertyType.Boolean),
                        this.CreateProp('inputType', PropertyType.String),
                        this.CreateProp('clickAction', PropertyType.Enum, '', (softInput()).ClickAction),
                        this.CreateProp('text', PropertyType.String, 'textChanged', null, true, 1000) // textChanged
                    ],
                    [
                        this.CreateEvent('isDroppedDownChanging'),
                        this.CreateEvent('isDroppedDownChanged', true),
                        this.CreateEvent('textChanged', true)
                    ]);

            case (softInput()) && (softInput()).ComboBox:
                return this.getMetaData((softInput()).DropDown).add(
                    [
                        this.CreateProp('displayMemberPath', PropertyType.String),
                        this.CreateProp('selectedValuePath', PropertyType.String),
                        this.CreateProp('headerPath', PropertyType.String),
                        this.CreateProp('isContentHtml', PropertyType.Boolean),
                        this.CreateProp('isEditable', PropertyType.Boolean),
                        this.CreateProp('handleWheel', PropertyType.Boolean),
                        this.CreateProp('maxDropDownHeight', PropertyType.Number),
                        this.CreateProp('maxDropDownWidth', PropertyType.Number),
                        this.CreateProp('itemFormatter', PropertyType.Function),
                        this.CreateProp('showGroups', PropertyType.Boolean),
                        this.CreateProp('trimText', PropertyType.Boolean),
                        this.CreateProp('caseSensitiveSearch', PropertyType.Boolean),
                        this.CreateProp('virtualizationThreshold', PropertyType.Number),
                        this.CreateProp('itemsSource', PropertyType.Any, '', null, true, 900),
                        this.CreateProp('selectedIndex', PropertyType.Number, 'selectedIndexChanged', null, true, 1000),
                        this.CreateProp('selectedItem', PropertyType.Any, 'selectedIndexChanged', null, true, 1000),
                        this.CreateProp('selectedValue', PropertyType.Any, 'selectedIndexChanged', null, true, 1000),
                    ],
                    [
                        this.CreateEvent('itemsSourceChanged'),
                        this.CreateEvent('formatItem'),
                        this.CreateEvent('selectedIndexChanged', true)
                    ])
                    .addOptions({ ngModelProperty: 'selectedValue' });

            case (softInput()) && (softInput()).AutoComplete:
                return this.getMetaData((softInput()).ComboBox).add(
                    [
                        this.CreateProp('delay', PropertyType.Number),
                        this.CreateProp('maxItems', PropertyType.Number),
                        this.CreateProp('minLength', PropertyType.Number),
                        this.CreateProp('cssMatch', PropertyType.String),
                        this.CreateProp('itemsSourceFunction', PropertyType.Function),
                        this.CreateProp('searchMemberPath', PropertyType.String),
                        this.CreateProp('beginsWithSearch', PropertyType.Boolean)
                    ]);

            case (softInput()) && (softInput()).Calendar:
                return this.getMetaData(wijmo.Control).add(
                    [
                        this.CreateProp('monthView', PropertyType.Boolean),
                        this.CreateProp('showHeader', PropertyType.Boolean),
                        this.CreateProp('itemFormatter', PropertyType.Function),
                        this.CreateProp('itemValidator', PropertyType.Function),
                        this.CreateProp('firstDayOfWeek', PropertyType.Number),
                        this.CreateProp('max', PropertyType.Date),
                        this.CreateProp('min', PropertyType.Date),
                        this.CreateProp('formatYearMonth', PropertyType.String),
                        this.CreateProp('formatDayHeaders', PropertyType.String),
                        this.CreateProp('formatDays', PropertyType.String),
                        this.CreateProp('formatYear', PropertyType.String),
                        this.CreateProp('formatMonths', PropertyType.String),
                        this.CreateProp('selectionMode', PropertyType.Enum, '', (softInput()).DateSelectionMode),
                        this.CreateProp('isReadOnly', PropertyType.Boolean),
                        this.CreateProp('handleWheel', PropertyType.Boolean),
                        this.CreateProp('repeatButtons', PropertyType.Boolean),
                        this.CreateProp('showYearPicker', PropertyType.Boolean),
                        this.CreateProp('value', PropertyType.Date, 'valueChanged'),
                        // displayMonth should go after 'value'!
                        this.CreateProp('displayMonth', PropertyType.Date, 'displayMonthChanged'),
                        this.CreateProp('monthCount', PropertyType.Number),
                        this.CreateProp('showMonthPicker', PropertyType.Enum, '', (softInput()).ShowMonthPicker),
                        this.CreateProp('weeksBefore', PropertyType.Number),
                        this.CreateProp('weeksAfter', PropertyType.Number),
                        this.CreateProp('rangeEnd', PropertyType.Date, 'rangeEndChanged'),
                        this.CreateProp('rangeMin', PropertyType.Number),
                        this.CreateProp('rangeMax', PropertyType.Number),
                    ],
                    [
                        this.CreateEvent('valueChanged', true),
                        this.CreateEvent('rangeEndChanged', true),
                        this.CreateEvent('rangeChanged', false),
                        this.CreateEvent('displayMonthChanged', true),
                        this.CreateEvent('formatItem', false)
                    ])
                    .addOptions({ ngModelProperty: 'value' });

            case (softInput()) && (softInput()).ColorPicker:
                return this.getMetaData(wijmo.Control).add(
                    [
                        this.CreateProp('showAlphaChannel', PropertyType.Boolean),
                        this.CreateProp('showColorString', PropertyType.Boolean),
                        this.CreateProp('palette', PropertyType.Any),
                        this.CreateProp('value', PropertyType.String, 'valueChanged')
                    ],
                    [
                        this.CreateEvent('valueChanged', true)
                    ])
                    .addOptions({ ngModelProperty: 'value' });

            case (softInput()) && (softInput()).ListBox:
                return this.getMetaData(wijmo.Control).add(
                    [
                        this.CreateProp('isContentHtml', PropertyType.Boolean),
                        this.CreateProp('maxHeight', PropertyType.Number),
                        this.CreateProp('selectedValuePath', PropertyType.String),
                        this.CreateProp('itemFormatter', PropertyType.Function),
                        this.CreateProp('displayMemberPath', PropertyType.String),
                        this.CreateProp('checkedMemberPath', PropertyType.String),
                        this.CreateProp('caseSensitiveSearch', PropertyType.Boolean),
                        this.CreateProp('itemsSource', PropertyType.Any),
                        this.CreateProp('virtualizationThreshold', PropertyType.Number),
                        this.CreateProp('showGroups', PropertyType.Boolean),
                        this.CreateProp('selectedIndex', PropertyType.Number, 'selectedIndexChanged'),
                        this.CreateProp('selectedItem', PropertyType.Any, 'selectedIndexChanged'),
                        this.CreateProp('selectedValue', PropertyType.Any, 'selectedIndexChanged'),
                        this.CreateProp('checkedItems', PropertyType.Any, 'checkedItemsChanged'),
                    ],
                    [
                        this.CreateEvent('formatItem', false),
                        this.CreateEvent('itemsChanged', true),
                        //AlexI: isPropChanged must be true, in order to run a digest and update bound expressions
                        this.CreateEvent('itemChecked', true),
                        this.CreateEvent('selectedIndexChanged', true),
                        this.CreateEvent('checkedItemsChanged', true),
                    ])
                    .addOptions({ ngModelProperty: 'selectedValue' });

            case (softInput()) && (softInput()).MultiSelectListBox:
                return this.getMetaData(wijmo.Control).add(
                    [
                        this.CreateProp('itemsSource', PropertyType.Any),
                        this.CreateProp('displayMemberPath', PropertyType.String),
                        this.CreateProp('selectedIndex', PropertyType.Number, 'selectedIndexChanged'),
                        this.CreateProp('isContentHtml', PropertyType.Boolean),
                        this.CreateProp('showGroups', PropertyType.Boolean),
                        this.CreateProp('checkOnFilter', PropertyType.Boolean),
                        this.CreateProp('showFilterInput', PropertyType.Boolean),
                        this.CreateProp('filterInputPlaceholder', PropertyType.String),
                        this.CreateProp('showSelectAllCheckbox', PropertyType.Boolean),
                        this.CreateProp('selectAllLabel', PropertyType.String),
                        this.CreateProp('delay', PropertyType.Number),
                        this.CreateProp('caseSensitiveSearch', PropertyType.Boolean),
                        this.CreateProp('checkedMemberPath', PropertyType.String),
                        this.CreateProp('virtualizationThreshold', PropertyType.Number),
                        this.CreateProp('checkedItems', PropertyType.Any, 'checkedItemsChanged'),
                    ],
                    [
                        this.CreateEvent('checkedItemsChanged', true),
                        this.CreateEvent('selectedIndexChanged', true),
                    ])
                    .addOptions({ ngModelProperty: 'checkedItems' });

            case 'ItemTemplate':
                return new MetaDataBase(
                    [], [], [], undefined, undefined, undefined, 'owner');

            case (softInput()) && (softInput()).Menu:
                return this.getMetaData((softInput()).ComboBox).add(
                    [
                        this.CreateProp('header', PropertyType.String),
                        this.CreateProp('commandParameterPath', PropertyType.String),
                        this.CreateProp('commandPath', PropertyType.String),
                        this.CreateProp('subItemsPath', PropertyType.String),
                        this.CreateProp('openOnHover', PropertyType.Boolean),
                        this.CreateProp('closeOnLeave', PropertyType.Boolean),
                        this.CreateProp('isButton', PropertyType.Boolean),
                        //this.CreateProp('value', PropertyType.Any, 'selectedIndexChanged', null, false, 1000)
                        this.CreateProp('value', PropertyType.Any, 'itemClicked', null, false, 1000)
                    ],
                    [
                        this.CreateEvent('itemClicked')
                    ]);

            case 'MenuItem':
                return new MetaDataBase(
                    [
                        //TBD: check whether they should be two-way
                        //this.CreateProp('value', PropertyType.String, BindingMode.TwoWay),
                        //this.CreateProp('cmd', PropertyType.String, BindingMode.TwoWay),
                        //this.CreateProp('cmdParam', PropertyType.String, BindingMode.TwoWay)

                        this.CreateProp('value', PropertyType.Any, ''),
                        this.CreateProp('cmd', PropertyType.Any, ''),
                        this.CreateProp('cmdParam', PropertyType.Any, '')
                    ], [], [], 'itemsSource', true);
            case 'MenuSeparator':
                return new MetaDataBase([], [], [], 'itemsSource', true);

            case (softInput()) && (softInput()).InputDate:
                return this.getMetaData((softInput()).DropDown).add(
                    [
                        this.CreateProp('selectionMode', PropertyType.Enum, '', (softInput()).DateSelectionMode),
                        this.CreateProp('format', PropertyType.String),
                        this.CreateProp('mask', PropertyType.String),
                        this.CreateProp('max', PropertyType.Date),
                        this.CreateProp('min', PropertyType.Date),
                        this.CreateProp('inputType', PropertyType.String),
                        this.CreateProp('value', PropertyType.Date, 'valueChanged', null, true, 1000),
                        this.CreateProp('repeatButtons', PropertyType.Boolean),
                        this.CreateProp('showYearPicker', PropertyType.Boolean),
                        this.CreateProp('itemValidator', PropertyType.Function),
                        this.CreateProp('itemFormatter', PropertyType.Function),
                        this.CreateProp('monthCount', PropertyType.Number),
                        this.CreateProp('handleWheel', PropertyType.Boolean),
                        this.CreateProp('showMonthPicker', PropertyType.Enum, '', (softInput()).ShowMonthPicker),
                        this.CreateProp('showHeader', PropertyType.Boolean),
                        this.CreateProp('weeksBefore', PropertyType.Number),
                        this.CreateProp('weeksAfter', PropertyType.Number),
                        this.CreateProp('rangeEnd', PropertyType.Date, 'rangeEndChanged', null, true, 1001),    // priority greater then for value one
                        this.CreateProp('rangeMin', PropertyType.Number),
                        this.CreateProp('rangeMax', PropertyType.Number),
                        this.CreateProp('separator', PropertyType.String),
                        this.CreateProp('alwaysShowCalendar', PropertyType.Boolean),
                        this.CreateProp('predefinedRanges', PropertyType.Any),
                        this.CreateProp('closeOnSelection', PropertyType.Boolean),
                    ],
                    [
                        this.CreateEvent('valueChanged', true),
                        this.CreateEvent('rangeEndChanged', true),
                        this.CreateEvent('rangeChanged', false),
                    ])
                    .addOptions({ ngModelProperty: 'value' });

            case (softInput()) && (softInput()).InputDateTime:
                return this.getMetaData((softInput()).InputDate).add(
                    [
                        this.CreateProp('timeMax', PropertyType.Date),
                        this.CreateProp('timeMin', PropertyType.Date),
                        this.CreateProp('timeStep', PropertyType.Number),
                        this.CreateProp('timeFormat', PropertyType.String),
                    ]);

            case (softInput()) && (softInput()).InputDateRange:
                return this.getMetaData((softInput()).InputDate);

            case (softInput()) && (softInput()).InputNumber:
                return this.getMetaData(wijmo.Control).add(
                    [
                        this.CreateProp('showSpinner', PropertyType.Boolean),
                        this.CreateProp('repeatButtons', PropertyType.Boolean),
                        this.CreateProp('max', PropertyType.Number),
                        this.CreateProp('min', PropertyType.Number),
                        this.CreateProp('step', PropertyType.Number),
                        this.CreateProp('isRequired', PropertyType.Boolean),
                        this.CreateProp('placeholder', PropertyType.String),
                        this.CreateProp('inputType', PropertyType.String),
                        this.CreateProp('format', PropertyType.String),
                        this.CreateProp('isReadOnly', PropertyType.Boolean),
                        this.CreateProp('handleWheel', PropertyType.Boolean),
                        this.CreateProp('value', PropertyType.Number, 'valueChanged'),
                        this.CreateProp('text', PropertyType.String, 'textChanged')
                    ],
                    [
                        this.CreateEvent('valueChanged', true),
                        this.CreateEvent('textChanged', true)
                    ])
                    .addOptions({ ngModelProperty: 'value' });

            case (softInput()) && (softInput()).InputMask:
                return this.getMetaData(wijmo.Control).add(
                    [
                        this.CreateProp('mask', PropertyType.String),
                        this.CreateProp('overwriteMode', PropertyType.Boolean),
                        this.CreateProp('isRequired', PropertyType.Boolean),
                        this.CreateProp('isReadOnly', PropertyType.Boolean),
                        this.CreateProp('promptChar', PropertyType.String),
                        this.CreateProp('placeholder', PropertyType.String),
                        this.CreateProp('inputType', PropertyType.String),
                        this.CreateProp('rawValue', PropertyType.String, 'valueChanged'),
                        this.CreateProp('value', PropertyType.String, 'valueChanged')
                    ],
                    [
                        this.CreateEvent('valueChanged', true),
                    ])
                    .addOptions({ ngModelProperty: 'value' });

            case (softInput()) && (softInput()).InputTime:
                return this.getMetaData((softInput()).ComboBox).add(
                    [
                        this.CreateProp('max', PropertyType.Date),
                        this.CreateProp('min', PropertyType.Date),
                        this.CreateProp('step', PropertyType.Number),
                        this.CreateProp('format', PropertyType.String),
                        this.CreateProp('mask', PropertyType.String),
                        this.CreateProp('inputType', PropertyType.String),
                        this.CreateProp('value', PropertyType.Date, 'valueChanged', null, true, 1000),
                    ],
                    [
                        this.CreateEvent('valueChanged', true)
                    ])
                    .addOptions({ ngModelProperty: 'value' });

            case (softInput()) && (softInput()).InputColor:
                return this.getMetaData((softInput()).DropDown).add(
                    [
                        this.CreateProp('showAlphaChannel', PropertyType.Boolean),
                        this.CreateProp('showColorString', PropertyType.Boolean),
                        this.CreateProp('value', PropertyType.String, 'valueChanged')
                    ],
                    [
                        this.CreateEvent('valueChanged', true)
                    ])
                    .addOptions({ ngModelProperty: 'value' });

            case (softInput()) && (softInput()).Popup:
                return this.getMetaData(wijmo.Control).add(
                    [
                        this.CreateProp('owner', PropertyType.String),
                        this.CreateProp('showTrigger', PropertyType.Enum, '', (softInput()).PopupTrigger),
                        this.CreateProp('hideTrigger', PropertyType.Enum, '', (softInput()).PopupTrigger),
                        this.CreateProp('fadeIn', PropertyType.Boolean),
                        this.CreateProp('fadeOut', PropertyType.Boolean),
                        this.CreateProp('isDraggable', PropertyType.Boolean),
                        this.CreateProp('isResizable', PropertyType.Boolean),
                        this.CreateProp('dialogResultEnter', PropertyType.String),
                        this.CreateProp('dialogResultSubmit', PropertyType.String),
                        this.CreateProp('modal', PropertyType.Boolean),
                        this.CreateProp('removeOnHide', PropertyType.Boolean)
                    ],
                    [
                        this.CreateEvent('showing'),
                        this.CreateEvent('shown'),
                        this.CreateEvent('hiding'),
                        this.CreateEvent('hidden'),
                        this.CreateEvent('resizing'),
                        this.CreateEvent('sizeChanging'),
                        this.CreateEvent('sizeChanged'),
                        this.CreateEvent('resized'),
                        this.CreateEvent('dragging'),
                        this.CreateEvent('positionChanging'),
                        this.CreateEvent('positionChanged'),
                        this.CreateEvent('dragged'),
                    ]);

            case (softInput()) && (softInput()).MultiSelect:
                return this.getMetaData((softInput()).ComboBox).add(
                    [
                        this.CreateProp('checkedMemberPath', PropertyType.String),
                        this.CreateProp('maxHeaderItems', PropertyType.Number),
                        this.CreateProp('headerFormat', PropertyType.String),
                        this.CreateProp('headerFormatter', PropertyType.Function),
                        this.CreateProp('showSelectAllCheckbox', PropertyType.Boolean),
                        this.CreateProp('selectAllLabel', PropertyType.String),
                        this.CreateProp('showFilterInput', PropertyType.Boolean),
                        this.CreateProp('filterInputPlaceholder', PropertyType.String),
                        this.CreateProp('checkOnFilter', PropertyType.Boolean),
                        this.CreateProp('delay', PropertyType.Number),
                        this.CreateProp('caseSensitiveSearch', PropertyType.Boolean),
                        // initialized after itemsSource but before selectedXXX
                        this.CreateProp('checkedItems', PropertyType.Any, 'checkedItemsChanged', BindingMode.TwoWay, true, 950),
                    ],
                    [
                        this.CreateEvent('checkedItemsChanged', true)
                    ])
                    .addOptions({ ngModelProperty: 'checkedItems' });

            // this is for compatibility for old frameworks like AngularJS and KO
            case 'CollectionViewNavigator':
                return new MetaDataBase(
                    [
                        this.CreateProp('cv', PropertyType.Any),
                    ]);
            // this one replaces 'CollectionViewNavigator' in modern frameworks
            case (softInput()) && (softInput()).CollectionViewNavigator:
                return this.getMetaData(wijmo.Control).add(
                    [
                        this.CreateProp('cv', PropertyType.Any),
                        this.CreateProp('byPage', PropertyType.Boolean),
                        this.CreateProp('headerFormat', PropertyType.String),
                        this.CreateProp('repeatButtons', PropertyType.Boolean)
                    ]);

            case 'CollectionViewPager':
                return new MetaDataBase(
                    [
                        this.CreateProp('cv', PropertyType.Any)
                    ]);

            case (softInput()) && (softInput()).MultiAutoComplete:
                return this.getMetaData((softInput()).AutoComplete).add(
                    [
                        this.CreateProp('maxSelectedItems', PropertyType.Number),
                        this.CreateProp('selectedMemberPath', PropertyType.String,'', null, true, 950),
                        this.CreateProp('selectedItems', PropertyType.Any, 'selectedItemsChanged'),
                    ],
                    [
                        this.CreateEvent('selectedItemsChanged', true)
                    ])
                    .addOptions({ ngModelProperty: 'selectedItems' });

        
            // wijmo.grid *************************************************************
            case (softGrid()) && (softGrid()).FlexGrid:
                return this.getMetaData(wijmo.Control).add(
                    [
                        this.CreateProp('newRowAtTop', PropertyType.Boolean),
                        this.CreateProp('allowAddNew', PropertyType.Boolean),
                        this.CreateProp('allowDelete', PropertyType.Boolean),
                        this.CreateProp('allowDragging', PropertyType.Enum, '', (softGrid()).AllowDragging),
                        this.CreateProp('allowMerging', PropertyType.Enum, '', (softGrid()).AllowMerging),
                        this.CreateProp('allowResizing', PropertyType.Enum, '', (softGrid()).AllowResizing),
                        this.CreateProp('allowSorting', PropertyType.Enum, '', (softGrid()).AllowSorting),
                        this.CreateProp('allowPinning', PropertyType.Enum, '', (softGrid()).AllowPinning),
                        this.CreateProp('autoScroll', PropertyType.Boolean),
                        this.CreateProp('autoRowHeights', PropertyType.Boolean),
                        this.CreateProp('autoSizeMode', PropertyType.Enum, '', (softGrid()).AutoSizeMode),
                        this.CreateProp('autoGenerateColumns', PropertyType.Boolean),
                        this.CreateProp('autoSearch', PropertyType.Boolean),
                        this.CreateProp('caseSensitiveSearch', PropertyType.Boolean),
                        this.CreateProp('quickAutoSize', PropertyType.Boolean),
                        this.CreateProp('bigCheckboxes', PropertyType.Boolean),
                        this.CreateProp('childItemsPath', PropertyType.Any),
                        this.CreateProp('groupHeaderFormat', PropertyType.String),
                        this.CreateProp('headersVisibility', PropertyType.Enum, '', (softGrid()).HeadersVisibility),
                        this.CreateProp('showSelectedHeaders', PropertyType.Enum, '', (softGrid()).HeadersVisibility),
                        this.CreateProp('showMarquee', PropertyType.Boolean),
                        this.CreateProp('showPlaceholders', PropertyType.Boolean),
                        this.CreateProp('itemFormatter', PropertyType.Function),
                        this.CreateProp('isReadOnly', PropertyType.Boolean),
                        this.CreateProp('imeEnabled', PropertyType.Boolean),
                        this.CreateProp('mergeManager', PropertyType.Any),
                        // REVIEW: This breaks the grid too, see TFS 82636
                        //this.CreateProp('scrollPosition', PropertyType.Any, '='),
                        // REVIEW: this screws up the grid when selectionMode == ListBox.
                        // When the directive applies a selection to the grid and selectionMode == ListBox,
                        // the grid clears the row[x].isSelected properties of rows that are not in the selection.
                        // I think a possible fix would be for the directive to not set the grid's selection if it
                        // is the same range as the current selection property. I cannot do that in the grid because
                        // when the user does it, this side-effect is expected.
                        //this.CreateProp('selection', PropertyType.Any, '='),
                        //this.CreateProp('columnLayout', ...),
                        this.CreateProp('selectionMode', PropertyType.Enum, '', (softGrid()).SelectionMode),
                        this.CreateProp('showGroups', PropertyType.Boolean),
                        this.CreateProp('showSort', PropertyType.Boolean),
                        this.CreateProp('showDropDown', PropertyType.Boolean),
                        this.CreateProp('showAlternatingRows', PropertyType.Boolean), // deprecated for alternatingRowStep
                        this.CreateProp('showErrors', PropertyType.Boolean),
                        this.CreateProp('alternatingRowStep', PropertyType.Number),
                        this.CreateProp('itemValidator', PropertyType.Function),
                        this.CreateProp('validateEdits', PropertyType.Boolean),
                        this.CreateProp('treeIndent', PropertyType.Number),
                        this.CreateProp('itemsSource', PropertyType.Any),
                        this.CreateProp('autoClipboard', PropertyType.Boolean),
                        this.CreateProp('expandSelectionOnCopyPaste', PropertyType.Boolean),
                        this.CreateProp('frozenRows', PropertyType.Number),
                        this.CreateProp('frozenColumns', PropertyType.Number),
                        this.CreateProp('cloneFrozenCells', PropertyType.Boolean),
                        this.CreateProp('deferResizing', PropertyType.Boolean),
                        this.CreateProp('sortRowIndex', PropertyType.Number),
                        this.CreateProp('editColumnIndex', PropertyType.Number),
                        this.CreateProp('stickyHeaders', PropertyType.Boolean),
                        this.CreateProp('preserveSelectedState', PropertyType.Boolean),
                        this.CreateProp('preserveOutlineState', PropertyType.Boolean),
                        this.CreateProp('preserveWhiteSpace', PropertyType.Boolean),
                        this.CreateProp('keyActionTab', PropertyType.Enum, '', (softGrid()).KeyAction),
                        this.CreateProp('keyActionEnter', PropertyType.Enum, '', (softGrid()).KeyAction),
                        this.CreateProp('rowHeaderPath', PropertyType.String),
                        this.CreateProp('virtualizationThreshold', PropertyType.Any), // number or array
                        this.CreateProp('anchorCursor', PropertyType.Boolean),
                        this.CreateProp('lazyRender', PropertyType.Boolean),
                        this.CreateProp('refreshOnEdit', PropertyType.Boolean),
                        this.CreateProp('copyHeaders', PropertyType.Enum, '', (softGrid()).HeadersVisibility),
                        this.CreateProp('columnGroups', PropertyType.Any) // array
                    ],
                    [
                        // Cell events
                        this.CreateEvent('beginningEdit'),
                        this.CreateEvent('cellEditEnded'),
                        this.CreateEvent('cellEditEnding'),
                        this.CreateEvent('prepareCellForEdit'),
                        this.CreateEvent('formatItem'),

                        // Column events
                        this.CreateEvent('resizingColumn'),
                        this.CreateEvent('resizedColumn'),
                        this.CreateEvent('autoSizingColumn'),
                        this.CreateEvent('autoSizedColumn'),
                        this.CreateEvent('draggingColumn'),
                        this.CreateEvent('draggingColumnOver'),
                        this.CreateEvent('draggedColumn'),
                        this.CreateEvent('sortingColumn'),
                        this.CreateEvent('sortedColumn'),
                        this.CreateEvent('pinningColumn'),
                        this.CreateEvent('pinnedColumn'),

                        // Row Events
                        this.CreateEvent('resizingRow'),
                        this.CreateEvent('resizedRow'),
                        this.CreateEvent('autoSizingRow'),
                        this.CreateEvent('autoSizedRow'),
                        this.CreateEvent('draggingRow'),
                        this.CreateEvent('draggingRowOver'),
                        this.CreateEvent('draggedRow'),
                        this.CreateEvent('deletingRow'),
                        this.CreateEvent('deletedRow', true), // TFS 434786
                        this.CreateEvent('loadingRows'),
                        this.CreateEvent('loadedRows', true), // TFS 434786
                        this.CreateEvent('rowEditStarting'),
                        this.CreateEvent('rowEditStarted'),
                        this.CreateEvent('rowEditEnding'),
                        this.CreateEvent('rowEditEnded'),
                        this.CreateEvent('rowAdded', true), // TFS 434786

                        this.CreateEvent('groupCollapsedChanging'),
                        this.CreateEvent('groupCollapsedChanged'),
                        this.CreateEvent('columnGroupCollapsedChanging'),
                        this.CreateEvent('columnGroupCollapsedChanged'),

                        this.CreateEvent('itemsSourceChanging'),
                        this.CreateEvent('itemsSourceChanged', true),
                        this.CreateEvent('selectionChanging'),
                        this.CreateEvent('selectionChanged', true),
                        this.CreateEvent('scrollPositionChanged', false), // AlexI: TBD: true freezes scrolling with mouse wheel
                        this.CreateEvent('updatingView'),
                        this.CreateEvent('updatedView'),
                        this.CreateEvent('updatingLayout'),
                        this.CreateEvent('updatedLayout'),

                        // Clipboard events
                        this.CreateEvent('pasting'),
                        this.CreateEvent('pasted'),
                        this.CreateEvent('pastingCell'),
                        this.CreateEvent('pastedCell'),
                        this.CreateEvent('copying'),
                        this.CreateEvent('copied')
                    ]);

            case (softGrid()) && (softGrid()).Column:
                return new MetaDataBase(
                    [
                        this.CreateProp('name', PropertyType.String),
                        this.CreateProp('dataMap', PropertyType.Any), // Angular converts this to 'map'
                        this.CreateProp('dataType', PropertyType.Enum, '', wijmo.DataType),
                        this.CreateProp('binding', PropertyType.String),
                        this.CreateProp('sortMemberPath', PropertyType.String),
                        this.CreateProp('format', PropertyType.String),
                        this.CreateProp('cellTemplate', PropertyType.Any), // string | ICellTemplateFunction
                        this.CreateProp('header', PropertyType.String),
                        this.CreateProp('width', PropertyType.Number),
                        this.CreateProp('maxLength', PropertyType.Number),
                        this.CreateProp('minWidth', PropertyType.Number),
                        this.CreateProp('maxWidth', PropertyType.Number),
                        this.CreateProp('align', PropertyType.String),
                        this.CreateProp('allowDragging', PropertyType.Boolean),
                        this.CreateProp('allowSorting', PropertyType.Boolean),
                        this.CreateProp('allowResizing', PropertyType.Boolean),
                        this.CreateProp('allowMerging', PropertyType.Boolean),
                        this.CreateProp('aggregate', PropertyType.Enum, '', wijmo.Aggregate),
                        this.CreateProp('isReadOnly', PropertyType.Boolean),
                        this.CreateProp('cssClass', PropertyType.String),
                        this.CreateProp('cssClassAll', PropertyType.String),
                        this.CreateProp('isContentHtml', PropertyType.Boolean),
                        this.CreateProp('isSelected', PropertyType.Boolean, 'grid.selectionChanged'),
                        this.CreateProp('visible', PropertyType.Boolean),
                        this.CreateProp('wordWrap', PropertyType.Boolean),
                        this.CreateProp('multiLine', PropertyType.Boolean),
                        this.CreateProp('mask', PropertyType.String),
                        this.CreateProp('inputType', PropertyType.String),
                        this.CreateProp('isRequired', PropertyType.Boolean),
                        this.CreateProp('showDropDown', PropertyType.Boolean), // ** deprecated
                        this.CreateProp('dataMapEditor', PropertyType.Enum, '', (softGrid()).DataMapEditor),
                        this.CreateProp('dropDownCssClass', PropertyType.String),
                        this.CreateProp('quickAutoSize', PropertyType.Boolean),
                        this.CreateProp('editor', PropertyType.Any),
                    ],
                    [], [], 'columns', true);

            case (softGrid()) && (softGrid()).ColumnGroup:
                return this.getMetaData(softGrid().Column).add(
                    [
                        this.CreateProp('collapseTo', PropertyType.String),
                        this.CreateProp('isCollapsed', PropertyType.Boolean),
                    ],
                    [], [], 'columnGroups', true);
       

            case 'FlexGridCellTemplate':
                return new MetaDataBase(
                    [
                        this.CreateProp('cellType', PropertyType.String, '', null, false),
                        this.CreateProp('cellOverflow', PropertyType.String, ''),
                        this.CreateProp('forceFullEdit', PropertyType.Boolean),
                        //this.CreateProp('editorAutoFocus', PropertyType.Boolean),
                    ],
                    [], [], undefined, undefined, undefined, 'owner');

            case 'MultiRowCellTemplate':
                return this.getMetaData('FlexGridCellTemplate').add([]);
            case (softGrid()) && (softGridFilter()) && (softGridFilter()).FlexGridFilter:
                return new MetaDataBase(
                    [
                        this.CreateProp('showFilterIcons', PropertyType.Boolean),
                        this.CreateProp('showSortButtons', PropertyType.Boolean),
                        this.CreateProp('defaultFilterType', PropertyType.Enum, '', (softGridFilter()).FilterType),
                        this.CreateProp('filterColumns', PropertyType.Any),
                    ],
                    [
                        this.CreateEvent('editingFilter'),
                        this.CreateEvent('filterChanging'),
                        this.CreateEvent('filterChanged'),
                        this.CreateEvent('filterApplied')
                    ],
                    [], undefined, undefined, undefined, '');

            case (softGrid()) && (softGridGrouppanel()) && (softGridGrouppanel()).GroupPanel:
                return this.getMetaData(wijmo.Control).add(
                    [
                        this.CreateProp('hideGroupedColumns', PropertyType.Boolean),
                        this.CreateProp('showDragGlyphs', PropertyType.Boolean),
                        this.CreateProp('maxGroups', PropertyType.Number),
                        this.CreateProp('placeholder', PropertyType.String),
                        this.CreateProp('filter', PropertyType.Any),
                        this.CreateProp('groupDescriptionCreator', PropertyType.Any),
                        this.CreateProp('grid', PropertyType.Any),
                    ]);

            case (softGrid()) && (softGridDetail()) && (softGridDetail()).FlexGridDetailProvider:
                return new MetaDataBase(
                    [
                        this.CreateProp('maxHeight', PropertyType.Number),
                        this.CreateProp('keyActionEnter', PropertyType.Enum, '', (softGridDetail()).KeyAction),
                        this.CreateProp('detailVisibilityMode', PropertyType.Enum, '', (softGridDetail()).DetailVisibilityMode),
                        this.CreateProp('rowHasDetail', PropertyType.Function),
                        this.CreateProp('isAnimated', PropertyType.Boolean),
                    ],
                    [], [], undefined, undefined, undefined, '');

            case softGrid() && softGridSearch() && softGridSearch().FlexGridSearch:
                return this.getMetaData(wijmo.Control).add(
                    [
                        this.CreateProp('text', PropertyType.String),
                        this.CreateProp('delay', PropertyType.Number),
                        this.CreateProp('searchAllColumns', PropertyType.Boolean),
                        this.CreateProp('placeholder', PropertyType.String),
                        this.CreateProp('cssMatch', PropertyType.String),
                        this.CreateProp('grid', PropertyType.Any)
                    ]);
        
            // case softGrid() && softGridSelector() && softGridSelector().Selector:
            //     return new MetaDataBase(
            //         [
            //             this.CreateProp('showCheckAll', PropertyType.Boolean),
            //             this.CreateProp('column', PropertyType.Any, 'columnChanged')
            //         ],
            //         [
            //             this.CreateEvent('columnChanging'),
            //             this.CreateEvent('columnChanged', true),
            //             this.CreateEvent('itemChecked'),
            //         ],
            //         [], undefined, undefined, undefined, '');
                    
            case softGrid() && softGridImmutable() && softGridImmutable().ImmutabilityProvider:
                return new MetaDataBase(
                    [
                        this.CreateProp('itemsSource', PropertyType.Any)
                    ],
                    [
                        this.CreateEvent('dataChanged'),
                        this.CreateEvent('cloningItem')
                    ],
                    [], undefined, undefined, undefined, '');
                    
            case (softGrid()) && (softGridSheet()) && (softGridSheet()).FlexSheet:
                return this.getMetaData((softGrid()).FlexGrid).add(
                    [
                        this.CreateProp('allowAutoFill', PropertyType.Boolean),
                        this.CreateProp('isTabHolderVisible', PropertyType.Boolean),
                        this.CreateProp('showFilterIcons', PropertyType.Boolean),
                        this.CreateProp('enableDragDrop', PropertyType.Boolean),
                        this.CreateProp('enableFormulas', PropertyType.Boolean),
                        this.CreateProp('selectedSheetIndex', PropertyType.Number, 'selectedSheetChanged'),
                    ],
                    [
                        this.CreateEvent('selectedSheetChanged', true),
                        this.CreateEvent('draggingRowColumn'),
                        // deprecated, should be removed later together with the control event
                        this.CreateEvent('droppingRowColumn'),
                        this.CreateEvent('beginDroppingRowColumn'),
                        this.CreateEvent('endDroppingRowColumn'),
                        this.CreateEvent('loaded'),
                        this.CreateEvent('unknownFunction'),
                        this.CreateEvent('sheetCleared'),
                        this.CreateEvent('prepareChangingRow'),
                        this.CreateEvent('prepareChangingColumn'),
                        this.CreateEvent('rowChanged'),
                        this.CreateEvent('columnChanged'),
                        this.CreateEvent('autoFilling'),
                        this.CreateEvent('autoFilled'),
                    ]);

            case (softGrid()) && (softGridSheet()) && (softGridSheet()).Sheet:
                return new MetaDataBase(
                    [
                        this.CreateProp('name', PropertyType.String),
                        this.CreateProp('itemsSource', PropertyType.Any),
                        this.CreateProp('visible', PropertyType.Boolean),
                        this.CreateProp('rowCount', PropertyType.Number, '', null),
                        this.CreateProp('columnCount', PropertyType.Number, '', null)
                    ],
                    [
                        this.CreateEvent('nameChanged'),
                    ], [], 'sheets', true, undefined, '');

            case (softGrid()) && (softGridMultirow()) && (softGridMultirow()).MultiRow:
                return this.getMetaData((softGrid()).FlexGrid).add(
                    [
                        this.CreateProp('layoutDefinition', PropertyType.Any),
                        this.CreateProp('headerLayoutDefinition', PropertyType.Any),
                        this.CreateProp('centerHeadersVertically', PropertyType.Boolean),
                        this.CreateProp('collapsedHeaders', PropertyType.Boolean, 'collapsedHeadersChanged'),
                        this.CreateProp('showHeaderCollapseButton', PropertyType.Boolean),
                        this.CreateProp('multiRowGroupHeaders', PropertyType.Boolean)
                    ],
                    [
                        this.CreateEvent('collapsedHeadersChanging'),
                        this.CreateEvent('collapsedHeadersChanged', true),
                    ]);

            case (softGrid()) && (softGridMultirow()) && (softGridMultirow()).MultiRowCell:
                return this.getMetaData((softGrid()).Column).add(
                    [
                        this.CreateProp('colspan', PropertyType.Number),
                        this.CreateProp('rowspan', PropertyType.Number),
                    ],
                    [], [], 'cells', true);

            case (softGridMultirow()) && (softGridMultirow()).MultiRowCellGroup:
                return this.getMetaData((softGridMultirow()).MultiRowCell).add(
                    [
                    ],
                    [], [], 'layoutDefinition', true);

            case softGrid() && softGridTransposed() && softGridTransposed().TransposedGrid:
                return this.getMetaData((softGrid()).FlexGrid).add(
                    [
                        this.CreateProp('autoGenerateRows', PropertyType.Boolean, '', null, true, -100),
                        this.CreateProp('rowGroups', PropertyType.Any) // array
                    ]);
            case softGrid() && softGridTransposed() && softGridTransposed().TransposedGridRow:
                return this.getMetaData((softGrid()).Column).addOptions({
                        parentProperty: '_rowInfo'
                    });

            case softGrid() && softGridTransposedMultiRow() && softGridTransposedMultiRow().TransposedMultiRow:
                return this.getMetaData((softGrid()).FlexGrid).add(
                    [
                        this.CreateProp('layoutDefinition', PropertyType.Any),
                    ]);

            // Chart *************************************************************
            case (softChart()) && (softChart()).FlexChartBase:
                return this.getMetaData(wijmo.Control).add(
                    [
                        this.CreateProp('binding', PropertyType.String),
                        this.CreateProp('footer', PropertyType.String),
                        this.CreateProp('header', PropertyType.String),
                        this.CreateProp('selectionMode', PropertyType.Enum, '', (softChart()).SelectionMode),
                        this.CreateProp('palette', PropertyType.Any),
                        this.CreateProp('plotMargin', PropertyType.Any),
                        this.CreateProp('footerStyle', PropertyType.Any),
                        this.CreateProp('headerStyle', PropertyType.Any),
                        this.CreateProp('tooltipContent', PropertyType.String, '', null, false),
                        this.CreateProp('itemsSource', PropertyType.Any)
                    ],
                    [
                        this.CreateEvent('rendering'),
                        this.CreateEvent('rendered'),
                        this.CreateEvent('selectionChanged', true),
                        this.CreateEvent('itemsSourceChanging'),
                        this.CreateEvent('itemsSourceChanged', true),
                    ]);

            case (softChart()) && (softChart()).FlexChartCore:
                return this.getMetaData((softChart()).FlexChartBase).add(
                    [
                        this.CreateProp('bindingX', PropertyType.String),
                        // this.CreateProp('chartType', PropertyType.Enum, '', wijmo.chart.ChartType),
                        this.CreateProp('interpolateNulls', PropertyType.Boolean),
                        this.CreateProp('legendToggle', PropertyType.Boolean),
                        this.CreateProp('symbolSize', PropertyType.Number),
                        this.CreateProp('options', PropertyType.Any),
                        this.CreateProp('selection', PropertyType.Any, 'selectionChanged'),
                        this.CreateProp('itemFormatter', PropertyType.Function),
                        this.CreateProp('labelContent', PropertyType.String, '', null, false),
                        this.CreateProp('renderEngine', PropertyType.Any, '', null, true, -1000)
                    ],
                    [
                        this.CreateEvent('seriesVisibilityChanged'),
                    ],
                    [
                        this.CreateComplexProp('axisX', false, false),
                        this.CreateComplexProp('axisY', false, false),
                        this.CreateComplexProp('axes', true),
                        this.CreateComplexProp('plotAreas', true)
                    ]);

            case (softChart()) && (softChart()).FlexChart:
                return this.getMetaData((softChart()).FlexChartCore).add(
                    [
                        this.CreateProp('chartType', PropertyType.Enum, '', (softChart()).ChartType),
                        this.CreateProp('rotated', PropertyType.Boolean),
                        this.CreateProp('stacking', PropertyType.Enum, '', (softChart()).Stacking),
                    ]);

            case (softChart()) && (softChart()).FlexPie:
                return this.getMetaData((softChart()).FlexChartBase).add(
                    [
                        this.CreateProp('bindingName', PropertyType.String),
                        this.CreateProp('innerRadius', PropertyType.Number),
                        this.CreateProp('isAnimated', PropertyType.Boolean),
                        this.CreateProp('offset', PropertyType.Number),
                        this.CreateProp('reversed', PropertyType.Boolean),
                        this.CreateProp('startAngle', PropertyType.Number),
                        this.CreateProp('selectedIndex', PropertyType.Number),
                        this.CreateProp('selectedItemPosition', PropertyType.Enum, '', (softChart()).Position),
                        this.CreateProp('selectedItemOffset', PropertyType.Number),
                        this.CreateProp('itemFormatter', PropertyType.Function),
                        this.CreateProp('labelContent', PropertyType.String, '', null, false),
                        this.CreateProp('titles', PropertyType.Any),
                        this.CreateProp('chartsPerLine', PropertyType.Number),
                    ]);

            case (softChart()) && (softChart()).FlexPie && (softChartHierarchical()) && (softChartHierarchical()).Sunburst:
                return this.getMetaData((softChart()).FlexChartBase).add(
                    [
                        this.CreateProp('bindingName', PropertyType.Any),
                        this.CreateProp('innerRadius', PropertyType.Number),
                        this.CreateProp('isAnimated', PropertyType.Boolean),
                        this.CreateProp('offset', PropertyType.Number),
                        this.CreateProp('reversed', PropertyType.Boolean),
                        this.CreateProp('startAngle', PropertyType.Number),
                        this.CreateProp('selectedIndex', PropertyType.Number),
                        this.CreateProp('selectedItemPosition', PropertyType.Enum, '', (softChart()).Position),
                        this.CreateProp('selectedItemOffset', PropertyType.Number),
                        this.CreateProp('itemFormatter', PropertyType.Function),
                        this.CreateProp('labelContent', PropertyType.String, '', null, false),
                        this.CreateProp('childItemsPath', PropertyType.Any)
                    ]);

            case (softChart()) && (softChartHierarchical()) && (softChartHierarchical()).TreeMap:
                return this.getMetaData((softChart()).FlexChartBase).add(
                    [
                        this.CreateProp('bindingName', PropertyType.Any),
                        this.CreateProp('maxDepth', PropertyType.Number),
                        this.CreateProp('type', PropertyType.Enum, '', (softChartHierarchical()).TreeMapType),
                        this.CreateProp('labelContent', PropertyType.String, '', null, false),
                        this.CreateProp('childItemsPath', PropertyType.Any)
                    ]);

            case (softChart()) && (softChart()).Axis:
                return new MetaDataBase(
                    [
                        this.CreateProp('axisLine', PropertyType.Boolean),
                        this.CreateProp('format', PropertyType.String),
                        this.CreateProp('labels', PropertyType.Boolean),
                        this.CreateProp('majorGrid', PropertyType.Boolean),
                        this.CreateProp('majorTickMarks', PropertyType.Enum, '', (softChart()).TickMark),
                        this.CreateProp('majorUnit', PropertyType.Number),
                        this.CreateProp('max', PropertyType.Number),
                        this.CreateProp('min', PropertyType.Number),
                        this.CreateProp('position', PropertyType.Enum, '', (softChart()).Position),
                        this.CreateProp('reversed', PropertyType.Boolean),
                        this.CreateProp('title', PropertyType.String),
                        this.CreateProp('labelAngle', PropertyType.Number),
                        this.CreateProp('minorGrid', PropertyType.Boolean),
                        this.CreateProp('minorTickMarks', PropertyType.Enum, '', (softChart()).TickMark),
                        this.CreateProp('minorUnit', PropertyType.Number),
                        this.CreateProp('origin', PropertyType.Number),
                        this.CreateProp('logBase', PropertyType.Number),
                        this.CreateProp('plotArea', PropertyType.Any),
                        this.CreateProp('labelAlign', PropertyType.String),
                        this.CreateProp('name', PropertyType.String),
                        this.CreateProp('overlappingLabels', PropertyType.Enum, '', (softChart()).OverlappingLabels),
                        this.CreateProp('labelPadding', PropertyType.Number),
                        this.CreateProp('itemFormatter', PropertyType.Function),
                        this.CreateProp('itemsSource', PropertyType.Any),
                        this.CreateProp('binding', PropertyType.String),
                    ],
                    [
                        this.CreateEvent('rangeChanged'),
                    ], [], 'axes', true); //use wj-property attribute on directive to define axisX or axisY

            case (softChart()) && (softChart()).Legend:
                return new MetaDataBase(
                    [
                        this.CreateProp('orientation', PropertyType.Enum, '', (softChart()).Orientation),
                        this.CreateProp('position', PropertyType.Enum, '', (softChart()).Position),
                        this.CreateProp('title', PropertyType.String),
                        this.CreateProp('titleAlign', PropertyType.String),
                        this.CreateProp('maxSize', PropertyType.String)
                    ],
                    [], [], 'legend', false, false, '');

            case (softChart()) && (softChart()).DataLabelBase:
                return new MetaDataBase(
                    [
                        this.CreateProp('content', PropertyType.Any, ''),
                        this.CreateProp('border', PropertyType.Boolean),
                        this.CreateProp('offset', PropertyType.Number),
                        this.CreateProp('connectingLine', PropertyType.Boolean),
                    ],
                    [
                        this.CreateEvent('rendering'),
                    ],
                    [], 'dataLabel', false, false);

            case (softChart()) && (softChart()).DataLabel:
                return this.getMetaData((softChart()).DataLabelBase).add(
                    [
                        this.CreateProp('position', PropertyType.Enum, '', (softChart()).LabelPosition),
                    ]);

            case (softChart()) && (softChart()).PieDataLabel:
                return this.getMetaData((softChart()).DataLabelBase).add(
                    [
                        this.CreateProp('position', PropertyType.Enum, '', (softChart()).PieLabelPosition),
                    ]);

            case (softChart()) && (softChart()).SeriesBase:
                return new MetaDataBase(
                    [
                        this.CreateProp('axisX', PropertyType.Any),
                        this.CreateProp('axisY', PropertyType.Any),
                        this.CreateProp('binding', PropertyType.String),
                        this.CreateProp('bindingX', PropertyType.String),
                        this.CreateProp('cssClass', PropertyType.String),
                        this.CreateProp('name', PropertyType.String),
                        this.CreateProp('style', PropertyType.Any),
                        this.CreateProp('altStyle', PropertyType.Any),
                        this.CreateProp('symbolMarker', PropertyType.Enum, '', (softChart()).Marker),
                        this.CreateProp('symbolSize', PropertyType.Number),
                        this.CreateProp('symbolStyle', PropertyType.Any),
                        this.CreateProp('visibility', PropertyType.Enum, 'chart.seriesVisibilityChanged', (softChart()).SeriesVisibility),
                        this.CreateProp('itemsSource', PropertyType.Any),
                        this.CreateProp('interpolateNulls', PropertyType.Boolean),
                        this.CreateProp('tooltipContent', PropertyType.Any),
                        this.CreateProp('itemFormatter', PropertyType.Function),
            ],
                    [
                        this.CreateEvent('rendering'),
                        this.CreateEvent('rendered')
                    ],
                    [
                        this.CreateComplexProp('axisX', false, true),
                        this.CreateComplexProp('axisY', false, true),
                    ],
                    'series', true);

            case (softChart()) && (softChart()).Series:
                return this.getMetaData((softChart()).SeriesBase).add(
                    [
                        this.CreateProp('chartType', PropertyType.Enum, '', (softChart()).ChartType)
                    ]);

            case (softChart()) && (softChart()).LineMarker:
                return new MetaDataBase(
                    [
                        this.CreateProp('isVisible', PropertyType.Boolean),
                        this.CreateProp('seriesIndex', PropertyType.Number),
                        this.CreateProp('horizontalPosition', PropertyType.Number),
                        this.CreateProp('content', PropertyType.Function),
                        this.CreateProp('verticalPosition', PropertyType.Number),
                        this.CreateProp('alignment', PropertyType.Enum, '', (softChart()).LineMarkerAlignment),
                        this.CreateProp('lines', PropertyType.Enum, '', (softChart()).LineMarkerLines),
                        this.CreateProp('interaction', PropertyType.Enum, '', (softChart()).LineMarkerInteraction),
                        this.CreateProp('dragLines', PropertyType.Boolean),
                        this.CreateProp('dragThreshold', PropertyType.Number),
                        this.CreateProp('dragContent', PropertyType.Boolean),
                    ],
                    [
                        this.CreateEvent('positionChanged'),
                    ],
                    [],
                    undefined, undefined, undefined, '');

            case (softChart()) && (softChart()).DataPoint:
                return new MetaDataBase([
                    this.CreateProp('x', PropertyType.AnyPrimitive),
                    this.CreateProp('y', PropertyType.AnyPrimitive)
                ],
                    [], [], '');

            case (softChart()) && (softChartAnnotation()) && (softChartAnnotation()).AnnotationLayer:
                return new MetaDataBase([], [], [], undefined, undefined, undefined, '');

            case 'FlexChartAnnotation':
                return new MetaDataBase([
                    this.CreateProp('type', PropertyType.String, '', null, false),
                    this.CreateProp('attachment', PropertyType.Enum, '', (softChartAnnotation()).AnnotationAttachment),
                    this.CreateProp('position', PropertyType.Enum, '', (softChartAnnotation()).AnnotationPosition),
                    this.CreateProp('point', PropertyType.Any),
                    this.CreateProp('seriesIndex', PropertyType.Number),
                    this.CreateProp('pointIndex', PropertyType.Number),
                    this.CreateProp('offset', PropertyType.Any),
                    this.CreateProp('style', PropertyType.Any),
                    this.CreateProp('isVisible', PropertyType.Boolean),
                    this.CreateProp('tooltip', PropertyType.String),
                    this.CreateProp('text', PropertyType.String),
                    this.CreateProp('content', PropertyType.String),
                    this.CreateProp('name', PropertyType.String),
                    this.CreateProp('width', PropertyType.Number),
                    this.CreateProp('height', PropertyType.Number),
                    this.CreateProp('start', PropertyType.Any),
                    this.CreateProp('end', PropertyType.Any),
                    this.CreateProp('radius', PropertyType.Number),
                    this.CreateProp('length', PropertyType.Number),
                    this.CreateProp('href', PropertyType.String)
                ], [],
                    [
                        this.CreateComplexProp('point', false, true),
                        this.CreateComplexProp('start', false, true),
                        this.CreateComplexProp('end', false, true),
                        this.CreateComplexProp('points', true),
                    ], 'items', true);

            case (softChart()) && (softChartInteraction()) && (softChartInteraction()).RangeSelector:
                return new MetaDataBase(
                    [
                        this.CreateProp('isVisible', PropertyType.Boolean),
                        this.CreateProp('min', PropertyType.Number),
                        this.CreateProp('max', PropertyType.Number),
                        this.CreateProp('orientation', PropertyType.Enum, '', (softChartInteraction()).Orientation),
                        this.CreateProp('seamless', PropertyType.Boolean),
                        this.CreateProp('minScale', PropertyType.Number),
                        this.CreateProp('maxScale', PropertyType.Number),
                    ],
                    [
                        this.CreateEvent('rangeChanged'),
                    ],
                    [],
                    undefined, undefined, undefined, '');

            case (softChart()) && (softChartInteraction()) && (softChartInteraction()).ChartGestures:
                return new MetaDataBase(
                    [
                        this.CreateProp('mouseAction', PropertyType.Enum, '', (softChartInteraction()).MouseAction),
                        this.CreateProp('interactiveAxes', PropertyType.Enum, '', (softChartInteraction()).InteractiveAxes),
                        this.CreateProp('enable', PropertyType.Boolean),
                        this.CreateProp('scaleX', PropertyType.Number),
                        this.CreateProp('scaleY', PropertyType.Number),
                        this.CreateProp('posX', PropertyType.Number),
                        this.CreateProp('posY', PropertyType.Number),
                    ],
                    [],
                    [],
                    undefined, undefined, undefined, '');

            case (softChart()) && (softChartAnimation()) && (softChartAnimation()).ChartAnimation:
                return new MetaDataBase(
                    [
                        this.CreateProp('animationMode', PropertyType.Enum, '', (softChartAnimation()).AnimationMode),
                        this.CreateProp('easing', PropertyType.Enum, '', (softChartAnimation()).Easing),
                        this.CreateProp('duration', PropertyType.Number),
                        this.CreateProp('axisAnimation', PropertyType.Boolean)
                    ], [], [], undefined, undefined, undefined, '');

            case (softChart()) && (softChartFinance()) && (softChartFinance()).FinancialChart:
                return this.getMetaData((softChart()).FlexChartCore).add(
                    [
                        this.CreateProp('chartType', PropertyType.Enum, '', (softChartFinance()).FinancialChartType),
                    ]);

            case (softChart()) && (softChartFinance()) && (softChartFinance()).FinancialSeries:
                return this.getMetaData((softChart()).SeriesBase).add(
                    [
                        this.CreateProp('chartType', PropertyType.Enum, '', (softChartFinance()).FinancialChartType)
                    ]);

            case (softChart()) && (softChartRadar()) && (softChartRadar()).FlexRadar:
                return this.getMetaData((softChart()).FlexChartCore).add(
                    [
                        this.CreateProp('chartType', PropertyType.Enum, '', (softChartRadar()).RadarChartType),
                        this.CreateProp('startAngle', PropertyType.Number),
                        this.CreateProp('totalAngle', PropertyType.Number),
                        this.CreateProp('reversed', PropertyType.Boolean),
                        this.CreateProp('stacking', PropertyType.Enum, '', (softChart()).Stacking)
                    ]);

            case (softChart()) && (softChartRadar()) && (softChartRadar()).FlexRadarSeries:
                return this.getMetaData((softChart()).SeriesBase).add(
                    [
                        this.CreateProp('chartType', PropertyType.Enum, '', (softChartRadar()).RadarChartType)
                    ]);

            case (softChart()) && (softChartRadar()) && (softChartRadar()).FlexRadarAxis:
                return this.getMetaData((softChart()).Axis);

            case (softChart()) && (softChartAnalytics()) && (softChartAnalytics()).TrendLineBase:
                return this.getMetaData((softChart()).SeriesBase).add(
                    [
                        this.CreateProp('sampleCount', PropertyType.Number)
                    ]);

            case (softChart()) && (softChartAnalytics()) && (softChartAnalytics()).TrendLine:
                return this.getMetaData((softChartAnalytics()).TrendLineBase).add(
                    [
                        this.CreateProp('order', PropertyType.Number),
                        this.CreateProp('fitType', PropertyType.Enum, '', (softChartAnalytics()).TrendLineFitType)
                    ]);

            case (softChart()) && (softChartAnalytics()) && (softChartAnalytics()).MovingAverage:
                return this.getMetaData((softChartAnalytics()).TrendLineBase).add(
                    [
                        this.CreateProp('period', PropertyType.Number),
                        this.CreateProp('type', PropertyType.Enum, '', (softChartAnalytics()).MovingAverageType)
                    ]);

            case (softChart()) && (softChartAnalytics()) && (softChartAnalytics()).FunctionSeries:
                return this.getMetaData((softChartAnalytics()).TrendLineBase).add(
                    [
                        this.CreateProp('min', PropertyType.Number),
                        this.CreateProp('max', PropertyType.Number),
                    ]);

            case (softChart()) && (softChartAnalytics()) && (softChartAnalytics()).YFunctionSeries:
                return this.getMetaData((softChartAnalytics()).FunctionSeries).add(
                    [
                        this.CreateProp('func', PropertyType.Function),
                    ]);

            case (softChart()) && (softChartAnalytics()) && (softChartAnalytics()).ParametricFunctionSeries:
                return this.getMetaData((softChartAnalytics()).FunctionSeries).add(
                    [
                        //Add func property for xFunc property in angular1.
                        //Attribute names beginning with "x-" is reserved for user agent use, 'x-func' is parsed to 'func'
                        //Set func value to xFunc property in WjFlexChartParametricFunctionSeries._initProps function in wijmo.angular.chart.ts file.
                        this.CreateProp('func', PropertyType.Function),
                        this.CreateProp('xFunc', PropertyType.Function),
                        this.CreateProp('yFunc', PropertyType.Function),
                    ]);

            case (softChart()) && (softChartAnalytics()) && (softChartAnalytics()).Waterfall:
                return this.getMetaData((softChart()).SeriesBase).add(
                    [
                        this.CreateProp('relativeData', PropertyType.Boolean),
                        this.CreateProp('start', PropertyType.Number),
                        this.CreateProp('startLabel', PropertyType.String),
                        this.CreateProp('showTotal', PropertyType.Boolean),
                        this.CreateProp('totalLabel', PropertyType.String),
                        this.CreateProp('showIntermediateTotal', PropertyType.Boolean),
                        this.CreateProp('intermediateTotalPositions', PropertyType.Any),
                        this.CreateProp('intermediateTotalLabels', PropertyType.Any),
                        this.CreateProp('connectorLines', PropertyType.Boolean),
                        this.CreateProp('styles', PropertyType.Any)
                    ]);

            case (softChart()) && (softChartAnalytics()) && (softChartAnalytics()).BoxWhisker:
                return this.getMetaData((softChart()).SeriesBase).add(
                    [
                        this.CreateProp('quartileCalculation', PropertyType.Enum, '', (softChartAnalytics()).QuartileCalculation),
                        this.CreateProp('groupWidth', PropertyType.Number),
                        this.CreateProp('gapWidth', PropertyType.Number),
                        this.CreateProp('showMeanLine', PropertyType.Boolean),
                        this.CreateProp('meanLineStyle', PropertyType.Any),
                        this.CreateProp('showMeanMarker', PropertyType.Boolean),
                        this.CreateProp('meanMarkerStyle', PropertyType.Any),
                        this.CreateProp('showInnerPoints', PropertyType.Boolean),
                        this.CreateProp('showOutliers', PropertyType.Boolean)
                    ]);


            case (softChart()) && (softChartAnalytics()) && (softChartAnalytics()).ErrorBar:
                return this.getMetaData((softChart()).Series).add(
                    [
                        this.CreateProp('errorBarStyle', PropertyType.Any),
                        this.CreateProp('value', PropertyType.Any),
                        this.CreateProp('errorAmount', PropertyType.Enum, '', (softChartAnalytics()).ErrorAmount),
                        this.CreateProp('endStyle', PropertyType.Enum, '', (softChartAnalytics()).ErrorBarEndStyle),
                        this.CreateProp('direction', PropertyType.Enum, '', (softChartAnalytics()).ErrorBarDirection)
                    ]);

            case (softChart()) && (softChartAnalytics()) && (softChartAnalytics()).BreakEven:
                return this.getMetaData((softChart()).SeriesBase).add(
                    [
                        this.CreateProp('fixedCost', PropertyType.Number),
                        this.CreateProp('variableCost', PropertyType.Number),
                        this.CreateProp('salesPrice', PropertyType.Number),
                        this.CreateProp('styles', PropertyType.Any),
                    ]);

            case (softChart()) && (softChart()).PlotArea:
                return new MetaDataBase(
                    [
                        this.CreateProp('column', PropertyType.Number),
                        this.CreateProp('height', PropertyType.String),
                        this.CreateProp('name', PropertyType.String),
                        this.CreateProp('row', PropertyType.Number),
                        this.CreateProp('style', PropertyType.Any),
                        this.CreateProp('width', PropertyType.String),
                    ],
                    [],
                    [],
                    'plotAreas', true);

            case (softChart()) && (softChartFinance()) && (softChartFinanceAnalytics()) && (softChartFinanceAnalytics()).Fibonacci:
                return this.getMetaData((softChart()).SeriesBase).add(
                    [
                        this.CreateProp('high', PropertyType.Number),
                        this.CreateProp('low', PropertyType.Number),
                        this.CreateProp('labelPosition', PropertyType.Enum, '', (softChart()).LabelPosition),
                        this.CreateProp('levels', PropertyType.Any),
                        this.CreateProp('minX', PropertyType.AnyPrimitive),
                        this.CreateProp('maxX', PropertyType.AnyPrimitive),
                        this.CreateProp('uptrend', PropertyType.Boolean)
                    ]);

            case (softChart()) && (softChartFinance()) && (softChartFinanceAnalytics()) && (softChartFinanceAnalytics()).FibonacciTimeZones:
                return this.getMetaData((softChart()).SeriesBase).add(
                    [
                        this.CreateProp('startX', PropertyType.Any),
                        this.CreateProp('endX', PropertyType.Any),
                        this.CreateProp('labelPosition', PropertyType.Enum, '', (softChart()).LabelPosition),
                        this.CreateProp('levels', PropertyType.Any)
                    ]);

            case (softChart()) && (softChartFinance()) && (softChartFinanceAnalytics()) && (softChartFinanceAnalytics()).FibonacciArcs:
            case (softChart()) && (softChartFinance()) && (softChartFinanceAnalytics()) && (softChartFinanceAnalytics()).FibonacciFans:
                return this.getMetaData((softChart()).SeriesBase).add(
                    [
                        this.CreateProp('start', PropertyType.Any),
                        this.CreateProp('end', PropertyType.Any),
                        this.CreateProp('labelPosition', PropertyType.Enum, '', (softChart()).LabelPosition),
                        this.CreateProp('levels', PropertyType.Any)
                    ]);

            case (softChart()) && (softChartFinance()) && (softChartFinanceAnalytics()) && (softChartFinanceAnalytics()).OverlayIndicatorBase:
                return this.getMetaData((softChart()).SeriesBase);

            case (softChart()) && (softChartFinance()) && (softChartFinanceAnalytics()) && (softChartFinanceAnalytics()).SingleOverlayIndicatorBase:
                return this.getMetaData((softChartFinanceAnalytics()).OverlayIndicatorBase).add(
                    [
                        this.CreateProp('period', PropertyType.Number)
                    ]);

            case (softChart()) && (softChartFinance()) && (softChartFinanceAnalytics()) && (softChartFinanceAnalytics()).MacdBase:
                return this.getMetaData((softChartFinanceAnalytics()).OverlayIndicatorBase).add(
                    [
                        this.CreateProp('fastPeriod', PropertyType.Number),
                        this.CreateProp('slowPeriod', PropertyType.Number),
                        this.CreateProp('smoothingPeriod', PropertyType.Number)
                    ]);

            case (softChart()) && (softChartFinance()) && (softChartFinanceAnalytics()) && (softChartFinanceAnalytics()).Macd:
                return this.getMetaData((softChartFinanceAnalytics()).MacdBase).add(
                    [
                        this.CreateProp('styles', PropertyType.Any)
                    ]);

            case (softChart()) && (softChartFinance()) && (softChartFinanceAnalytics()) && (softChartFinanceAnalytics()).MacdHistogram:
                return this.getMetaData((softChartFinanceAnalytics()).MacdBase);

            case (softChart()) && (softChartFinance()) && (softChartFinanceAnalytics()) && (softChartFinanceAnalytics()).ATR:
            case (softChart()) && (softChartFinance()) && (softChartFinanceAnalytics()) && (softChartFinanceAnalytics()).RSI:
            case (softChart()) && (softChartFinance()) && (softChartFinanceAnalytics()) && (softChartFinanceAnalytics()).WilliamsR:
                return this.getMetaData((softChartFinanceAnalytics()).SingleOverlayIndicatorBase);

            case (softChart()) && (softChartFinance()) && (softChartFinanceAnalytics()) && (softChartFinanceAnalytics()).CCI:
                return this.getMetaData((softChartFinanceAnalytics()).SingleOverlayIndicatorBase).add(
                    [
                        this.CreateProp('constant', PropertyType.Number)
                    ]);

            case (softChart()) && (softChartFinance()) && (softChartFinanceAnalytics()) && (softChartFinanceAnalytics()).Stochastic:
                return this.getMetaData((softChartFinanceAnalytics()).OverlayIndicatorBase).add(
                    [
                        this.CreateProp('dPeriod', PropertyType.Number),
                        this.CreateProp('kPeriod', PropertyType.Number),
                        this.CreateProp('smoothingPeriod', PropertyType.Number),
                        this.CreateProp('styles', PropertyType.Any)
                    ]);

            case (softChart()) && (softChartFinance()) && (softChartFinanceAnalytics()) && (softChartFinanceAnalytics()).Envelopes:
                return this.getMetaData((softChartFinanceAnalytics()).OverlayIndicatorBase).add(
                    [
                        this.CreateProp('period', PropertyType.Number),
                        this.CreateProp('size', PropertyType.Number),
                        this.CreateProp('type', PropertyType.Enum, '', (softChartFinanceAnalytics()).MovingAverageType)
                    ]);

            case (softChart()) && (softChartFinance()) && (softChartFinanceAnalytics()) && (softChartFinanceAnalytics()).BollingerBands:
                return this.getMetaData((softChartFinanceAnalytics()).OverlayIndicatorBase).add(
                    [
                        this.CreateProp('period', PropertyType.Number),
                        this.CreateProp('multiplier', PropertyType.Number)
                    ]);

            case (softChart()) && (softChartMap()) && (softChartMap()).FlexMap:
                return this.getMetaData((softChart()).FlexChartBase).add(
                    [
                        this.CreateProp('center', PropertyType.Any),
                        this.CreateProp('zoom', PropertyType.Number),
                    ],
                    [
                    ], [
                        // this.CreateComplexProp('layers', true),
                    ]);

            case (softChart()) && (softChartMap()) && (softChartMap()).MapLayerBase:
                return new MetaDataBase(
                    [
                        this.CreateProp('style', PropertyType.Any),
                        this.CreateProp('itemsSource', PropertyType.Any, 'itemsSourceChanged'),
                        this.CreateProp('url', PropertyType.String),
                        // this.CreateProp('colorScale', PropertyType.Any),
                    ],
                    [
                        this.CreateEvent('itemsSourceChanged', true),
                    ], [], 'layers', true);

            case (softChart()) && (softChartMap()) && (softChartMap()).ScatterMapLayer:
                return this.getMetaData((softChartMap()).MapLayerBase).add(
                    [
                        this.CreateProp('symbolSize', PropertyType.Number),
                        this.CreateProp('symbolMinSize', PropertyType.Number),
                        this.CreateProp('symbolMaxSize', PropertyType.Number),
                        this.CreateProp('binding', PropertyType.String),
                    ]);

            case (softChart()) && (softChartMap()) && (softChartMap()).GeoMapLayer:
                return this.getMetaData((softChartMap()).MapLayerBase).add(
                    [
                        this.CreateProp('itemFormatter', PropertyType.Any),
                    ]);

            case (softChart()) && (softChartMap()) && (softChartMap()).GeoGridLayer:
                return this.getMetaData((softChartMap()).MapLayerBase);

            case (softChart()) && (softChartMap()) && (softChartMap()).ColorScale:
                return new MetaDataBase(
                    [
                        this.CreateProp('scale', PropertyType.Number),
                        this.CreateProp('binding', PropertyType.String),
                        this.CreateProp('colorUnknown', PropertyType.String),
                        this.CreateProp('colors', PropertyType.Any),
                        this.CreateProp('format', PropertyType.String),
                    ],
                    [
                    ], [], 'colorScale', false);

            // *************************** Gauge *************************************************************
            //case 'Gauge':
            case (softGauge()) && (softGauge()).Gauge:
                return this.getMetaData(wijmo.Control).add(
                    [
                        this.CreateProp('value', PropertyType.Number, 'valueChanged'),
                        this.CreateProp('min', PropertyType.Number),
                        this.CreateProp('max', PropertyType.Number),
                        this.CreateProp('origin', PropertyType.Number),
                        this.CreateProp('isReadOnly', PropertyType.Boolean),
                        this.CreateProp('handleWheel', PropertyType.Boolean),
                        this.CreateProp('step', PropertyType.Number),
                        this.CreateProp('format', PropertyType.String),
                        this.CreateProp('thickness', PropertyType.Number),
                        this.CreateProp('hasShadow', PropertyType.Boolean),
                        this.CreateProp('isAnimated', PropertyType.Boolean),
                        this.CreateProp('showText', PropertyType.Enum, '', (softGauge()).ShowText),
                        this.CreateProp('showTicks', PropertyType.Boolean),
                        this.CreateProp('showTickText', PropertyType.Boolean),
                        this.CreateProp('showRanges', PropertyType.Boolean),
                        this.CreateProp('stackRanges', PropertyType.Boolean),
                        this.CreateProp('thumbSize', PropertyType.Number),
                        this.CreateProp('tickSpacing', PropertyType.Number),
                        this.CreateProp('getText', PropertyType.Function)
                    ],
                    [
                        this.CreateEvent('valueChanged', true)
                    ],
                    [
                        this.CreateComplexProp('ranges', true),
                        this.CreateComplexProp('pointer', false, false),
                        this.CreateComplexProp('face', false, false)
                    ])
                    .addOptions({ ngModelProperty: 'value' });

            //case 'LinearGauge':
            case (softGauge()) && (softGauge()).LinearGauge:
                return this.getMetaData((softGauge()).Gauge).add(
                    [
                        this.CreateProp('direction', PropertyType.Enum, '', (softGauge()).GaugeDirection)
                    ]);

            case (softGauge()) && (softGauge()).BulletGraph:
                return this.getMetaData((softGauge()).LinearGauge).add(
                    [
                        this.CreateProp('target', PropertyType.Number),
                        this.CreateProp('good', PropertyType.Number),
                        this.CreateProp('bad', PropertyType.Number)
                    ]);

            case (softGauge()) && (softGauge()).RadialGauge:
                return this.getMetaData((softGauge()).Gauge).add(
                    [
                        this.CreateProp('autoScale', PropertyType.Boolean),
                        this.CreateProp('startAngle', PropertyType.Number),
                        this.CreateProp('sweepAngle', PropertyType.Number),
                        this.CreateProp('needleShape', PropertyType.Enum, '', (softGauge()).NeedleShape),
                        this.CreateProp('needleLength', PropertyType.Enum, '', (softGauge()).NeedleLength),
                        this.CreateProp('needleElement', PropertyType.Any), // SVGElement
                    ]);

            case (softGauge()) && (softGauge()).Range:
                return new MetaDataBase(
                    [
                        this.CreateProp('color', PropertyType.String),
                        this.CreateProp('min', PropertyType.Number),
                        this.CreateProp('max', PropertyType.Number),
                        this.CreateProp('name', PropertyType.String),
                        this.CreateProp('thickness', PropertyType.Number)
                    ],
                    [], [], 'ranges', true);

            // *************************** Olap *************************************************************
            case (softOlap()) && (softOlap()).PivotGrid:
                return this.getMetaData((softGrid()).FlexGrid).add(
                    [
                        this.CreateProp('showDetailOnDoubleClick', PropertyType.Boolean),
                        this.CreateProp('customContextMenu', PropertyType.Boolean),
                        this.CreateProp('collapsibleSubtotals', PropertyType.Boolean),
                        this.CreateProp('centerHeadersVertically', PropertyType.Boolean),
                        this.CreateProp('showColumnFieldHeaders', PropertyType.Boolean),
                        this.CreateProp('showRowFieldHeaders', PropertyType.Boolean),
                        this.CreateProp('showValueFieldHeaders', PropertyType.Boolean),
                        this.CreateProp('outlineMode', PropertyType.Boolean)
                    ]);

            case (softOlap()) && (softOlap()).PivotChart:
                return this.getMetaData(wijmo.Control).add(
                    [
                        this.CreateProp('chartType', PropertyType.Enum, '', (softOlap()).PivotChartType),
                        this.CreateProp('showHierarchicalAxes', PropertyType.Boolean),
                        this.CreateProp('showTotals', PropertyType.Boolean),
                        this.CreateProp('showTitle', PropertyType.Boolean),
                        this.CreateProp('showLegend', PropertyType.Enum, '', (softOlap()).LegendVisibility),
                        this.CreateProp('legendPosition', PropertyType.Enum, '', (softChart()).Position),
                        this.CreateProp('stacking', PropertyType.Enum, '', (softChart()).Stacking),
                        this.CreateProp('maxSeries', PropertyType.Number),
                        this.CreateProp('maxPoints', PropertyType.Number),
                        this.CreateProp('itemsSource', PropertyType.Any),
                        this.CreateProp('header', PropertyType.String),
                        this.CreateProp('footer', PropertyType.String),
                        this.CreateProp('headerStyle', PropertyType.Any),
                        this.CreateProp('footerStyle', PropertyType.Any),
                    ]);

            case (softOlap()) && (softOlap()).PivotPanel:
                return this.getMetaData(wijmo.Control).add(
                    [
                        this.CreateProp('autoGenerateFields', PropertyType.Boolean),
                        this.CreateProp('viewDefinition', PropertyType.String),
                        this.CreateProp('engine', PropertyType.Any),
                        this.CreateProp('itemsSource', PropertyType.Any),
                        this.CreateProp('showFieldIcons', PropertyType.Boolean),
                        this.CreateProp('restrictDragging', PropertyType.Boolean),
                    ],
                    [
                        this.CreateEvent('itemsSourceChanged'),
                        this.CreateEvent('viewDefinitionChanged'),
                        this.CreateEvent('updatingView'),
                        this.CreateEvent('updatedView')
                    ]);
            case (softOlap()) && (softOlap()).Slicer:
                return this.getMetaData(wijmo.Control).add(
                    [
                        this.CreateProp('field', PropertyType.Any),
                        this.CreateProp('showHeader', PropertyType.Boolean),
                        this.CreateProp('header', PropertyType.String),                                
                        this.CreateProp('showCheckboxes', PropertyType.Boolean),
                        this.CreateProp('multiSelect', PropertyType.Boolean),
                    ]);

            case (softOlap()) && (softOlap()).PivotField:
                return new MetaDataBase(
                    [
                        this.CreateProp('binding', PropertyType.String),
                        this.CreateProp('header', PropertyType.String),
                        this.CreateProp('aggregate', PropertyType.Enum, '', wijmo.Aggregate),
                        this.CreateProp('showAs', PropertyType.Enum, '', (softOlap()).ShowAs),
                        this.CreateProp('format', PropertyType.String),
                        this.CreateProp('width', PropertyType.Number),
                        this.CreateProp('wordWrap', PropertyType.Boolean),
                        this.CreateProp('descending', PropertyType.Boolean),
                        this.CreateProp('isContentHtml', PropertyType.Boolean),
                        this.CreateProp('visible', PropertyType.Boolean),
                        this.CreateProp('dataType', PropertyType.Enum, '', wijmo.DataType),
                        this.CreateProp('getValue', PropertyType.Function),
                        this.CreateProp('getAggregateValue', PropertyType.Function),
                    ],
                    [], [], '', true, true, '');

            // *************************** ReportViewer *************************************************************
            case (softViewer()) && (softViewer()).ViewerBase:
                return this.getMetaData(wijmo.Control).add(
                    [
                        this.CreateProp('serviceUrl', PropertyType.String),
                        this.CreateProp('filePath', PropertyType.String),
                        this.CreateProp('fullScreen', PropertyType.Boolean, 'fullScreenChanged'),
                        this.CreateProp('zoomFactor', PropertyType.Number, 'zoomFactorChanged'),
                        this.CreateProp('zoomMode', PropertyType.Enum, 'zoomModeChanged',(softViewer()).ZoomMode),
                        this.CreateProp('mouseMode', PropertyType.Enum, 'mouseModeChanged', (softViewer()).MouseMode),
                        this.CreateProp('viewMode', PropertyType.Enum, 'viewModeChanged', (softViewer()).ViewMode),
                        this.CreateProp('requestHeaders', PropertyType.Any)
                    ],
                    [
                        this.CreateEvent('pageIndexChanged'),
                        this.CreateEvent('viewModeChanged'),
                        this.CreateEvent('mouseModeChanged'),
                        this.CreateEvent('fullScreenChanged'),
                        this.CreateEvent('zoomFactorChanged', true),
                        this.CreateEvent('zoomModeChanged', true),
                        this.CreateEvent('queryLoadingData'),
                        this.CreateEvent('beforeSendRequest')
                    ]);
            case (softViewer()) && (softViewer()).ReportViewer:
                return this.getMetaData((softViewer()).ViewerBase).add(
                    [
                        this.CreateProp('parameters', PropertyType.Any),
                        this.CreateProp('paginated', PropertyType.Boolean),
                        this.CreateProp('reportName', PropertyType.String),
                    ]);
            // *************************** PdfViewer *************************************************************
            case (softViewer()) && (softViewer()).PdfViewer:
                return this.getMetaData((softViewer()).ViewerBase);

            // *************************** Navigation *************************************************************
            case (softNav()) && (softNav()).TreeView:
                return this.getMetaData(wijmo.Control).add(
                    [
                        this.CreateProp('childItemsPath', PropertyType.Any),
                        this.CreateProp('displayMemberPath', PropertyType.Any),
                        this.CreateProp('imageMemberPath', PropertyType.Any),
                        this.CreateProp('checkedMemberPath', PropertyType.Any),
                        this.CreateProp('isContentHtml', PropertyType.Boolean),
                        this.CreateProp('showCheckboxes', PropertyType.Boolean),
                        this.CreateProp('autoCollapse', PropertyType.Boolean),
                        this.CreateProp('isAnimated', PropertyType.Boolean),
                        this.CreateProp('isReadOnly', PropertyType.Boolean),
                        this.CreateProp('allowDragging', PropertyType.Boolean),
                        this.CreateProp('checkOnClick', PropertyType.Boolean),
                        this.CreateProp('expandOnClick', PropertyType.Boolean),
                        this.CreateProp('collapseOnClick', PropertyType.Boolean),
                        this.CreateProp('expandOnLoad', PropertyType.Boolean),
                        this.CreateProp('lazyLoadFunction', PropertyType.Function),
                        this.CreateProp('itemsSource', PropertyType.Any),
                        this.CreateProp('selectedItem', PropertyType.Any, 'selectedItemChanged'),
                        this.CreateProp('selectedNode', PropertyType.Any, 'selectedItemChanged'),
                        this.CreateProp('checkedItems', PropertyType.Any, 'checkedItemsChanged'),
                    ],
                    [
                        this.CreateEvent('itemsSourceChanged', true),
                        this.CreateEvent('loadingItems'),
                        this.CreateEvent('loadedItems'),
                        this.CreateEvent('itemClicked'),
                        this.CreateEvent('selectedItemChanged'),
                        this.CreateEvent('checkedItemsChanged', true),
                        this.CreateEvent('isCollapsedChanging'),
                        this.CreateEvent('isCollapsedChanged'),
                        this.CreateEvent('isCheckedChanging'),
                        this.CreateEvent('isCheckedChanged'),
                        this.CreateEvent('formatItem'),
                        this.CreateEvent('dragStart'),
                        this.CreateEvent('dragOver'),                                
                        this.CreateEvent('drop'),
                        this.CreateEvent('dragEnd'),
                        this.CreateEvent('nodeEditStarting'),
                        this.CreateEvent('nodeEditStarted'),
                        this.CreateEvent('nodeEditEnding'),
                        this.CreateEvent('nodeEditEnded')
                    ]);

            case (softNav()) && (softNav()).TabPanel:
                return this.getMetaData(wijmo.Control).add(
                    [
                        this.CreateProp('isAnimated', PropertyType.Boolean),
                        this.CreateProp('autoSwitch', PropertyType.Boolean),
                        this.CreateProp('selectedIndex', PropertyType.Number, 'selectedIndexChanged'),
                        this.CreateProp('selectedTab', PropertyType.Any, 'selectedIndexChanged'),
                    ],
                    [
                        this.CreateEvent('selectedIndexChanged', true),
                    ]);
            case (softNav()) && (softNav()).Tab:
                return new MetaDataBase(
                    [
                        this.CreateProp('isDisabled', PropertyType.Boolean),
                        this.CreateProp('isVisible', PropertyType.Boolean),
                    ],
                    [], [], 'tabs', true);

            case (softNav()) && (softNav()).Accordion:
                return this.getMetaData(wijmo.Control).add(
                    [
                        this.CreateProp('isAnimated', PropertyType.Boolean),
                        this.CreateProp('autoSwitch', PropertyType.Boolean),
                        this.CreateProp('selectedIndex', PropertyType.Number, 'selectedIndexChanged'),
                        this.CreateProp('selectedPane', PropertyType.Any),
                        this.CreateProp('showIcons', PropertyType.Boolean),
                        this.CreateProp('allowCollapseAll', PropertyType.Boolean),
                        this.CreateProp('allowExpandMany', PropertyType.Boolean),
                    ],
                    [
                        this.CreateEvent('selectedIndexChanged', true),
                    ]);
            case (softNav()) && (softNav()).AccordionPane:
                return new MetaDataBase(
                    [
                        this.CreateProp('isDisabled', PropertyType.Boolean),
                        this.CreateProp('isVisible', PropertyType.Boolean),
                    ],
                    [], [], 'panes', true);

            // *************************** Barcode *************************************************************
            case (softBarcode()) && (softBarcode()).BarcodeBase:
                return this.getMetaData(wijmo.Control).add([
                    this.CreateProp('value', PropertyType.AnyPrimitive),
                    this.CreateProp('quietZone', PropertyType.Any),
                    this.CreateProp('renderType', PropertyType.Enum, null, (softBarcode()).RenderType),
                    this.CreateProp('color', PropertyType.String),
                    this.CreateProp('backgroundColor', PropertyType.String),
                    this.CreateProp('hideExtraChecksum', PropertyType.Boolean),
                    this.CreateProp('font', PropertyType.Any),
                ], [
                    this.CreateEvent('isValidChanged'),
                ]);

            case (softBarcodeCommon()) && (softBarcodeCommon()).Codabar:
                return this.getMetaData((softBarcode()).BarcodeBase).add([
                    this.CreateProp('autoWidth', PropertyType.Boolean),
                    this.CreateProp('autoWidthZoom', PropertyType.Number),
                    this.CreateProp('showLabel', PropertyType.Boolean),
                    this.CreateProp('checkDigit', PropertyType.Boolean),
                    this.CreateProp('labelPosition', PropertyType.Enum, null, (softBarcode()).LabelPosition),
                    this.CreateProp('nwRatio', PropertyType.Enum, null, (softBarcode()).NarrowToWideRatio),
                ]);

            case (softBarcodeCommon()) && (softBarcodeCommon()).EanBase:
                return this.getMetaData((softBarcode()).BarcodeBase).add([
                    this.CreateProp('showLabel', PropertyType.Boolean),
                    this.CreateProp('labelPosition', PropertyType.Enum, null, (softBarcode()).LabelPosition),
                ]);

            case (softBarcodeCommon()) && (softBarcodeCommon()).Ean8:
                return this.getMetaData((softBarcodeCommon()).EanBase);

            case (softBarcodeCommon()) && (softBarcodeCommon()).Ean13:
                return this.getMetaData((softBarcodeCommon()).EanBase).add([
                    this.CreateProp('addOn', PropertyType.AnyPrimitive),
                    this.CreateProp('addOnHeight', PropertyType.AnyPrimitive),
                    this.CreateProp('addOnLabelPosition', PropertyType.Enum, null, (softBarcode()).LabelPosition),
                ]);

            case (softBarcodeCommon()) && (softBarcodeCommon()).Code39:
                return this.getMetaData((softBarcode()).BarcodeBase).add([
                    this.CreateProp('autoWidth', PropertyType.Boolean),
                    this.CreateProp('autoWidthZoom', PropertyType.Number),
                    this.CreateProp('showLabel', PropertyType.Boolean),
                    this.CreateProp('checkDigit', PropertyType.Boolean),
                    this.CreateProp('fullAscii', PropertyType.Boolean), 
                    this.CreateProp('labelPosition', PropertyType.Enum, null, (softBarcode()).LabelPosition),
                    this.CreateProp('nwRatio', PropertyType.Enum, null, (softBarcode()).NarrowToWideRatio),
                    this.CreateProp('labelWithStartAndStopCharacter', PropertyType.Boolean),
                ]);

            case (softBarcodeCommon()) && (softBarcodeCommon()).Code128:
                return this.getMetaData((softBarcode()).BarcodeBase).add([
                    this.CreateProp('autoWidth', PropertyType.Boolean),
                    this.CreateProp('autoWidthZoom', PropertyType.Number),
                    this.CreateProp('showLabel', PropertyType.Boolean),
                    this.CreateProp('codeSet', PropertyType.Enum, null, (softBarcodeCommon()).Code128CodeSet),
                    this.CreateProp('labelPosition', PropertyType.Enum, null, (softBarcode()).LabelPosition),
                ]);

            case (softBarcodeCommon()) && (softBarcodeCommon()).Gs1_128:
                return this.getMetaData((softBarcode()).BarcodeBase).add([
                    this.CreateProp('autoWidth', PropertyType.Boolean),
                    this.CreateProp('autoWidthZoom', PropertyType.Number),
                    this.CreateProp('showLabel', PropertyType.Boolean),
                    this.CreateProp('labelPosition', PropertyType.Enum, null, (softBarcode()).LabelPosition),
                ]);

            case (softBarcodeCommon()) && (softBarcodeCommon()).UpcBase:
                return this.getMetaData((softBarcode()).BarcodeBase).add([
                    this.CreateProp('showLabel', PropertyType.Boolean),
                    this.CreateProp('addOn', PropertyType.AnyPrimitive),
                    this.CreateProp('labelPosition', PropertyType.Enum, null, (softBarcode()).LabelPosition),
                    this.CreateProp('addOnHeight', PropertyType.AnyPrimitive),
                    this.CreateProp('addOnLabelPosition', PropertyType.Enum, null, (softBarcode()).LabelPosition),
                ]);

            case (softBarcodeCommon()) && (softBarcodeCommon()).UpcA:
                return this.getMetaData((softBarcodeCommon()).UpcBase);

            case (softBarcodeCommon()) && (softBarcodeCommon()).UpcE0:
                return this.getMetaData((softBarcodeCommon()).UpcBase);

            case (softBarcodeCommon()) && (softBarcodeCommon()).UpcE1:
                return this.getMetaData((softBarcodeCommon()).UpcBase);

            case (softBarcodeCommon()) && (softBarcodeCommon()).QrCode:
                return this.getMetaData((softBarcode()).BarcodeBase).add([
                    this.CreateProp('charCode', PropertyType.Number),
                    this.CreateProp('charset', PropertyType.Enum, null, (softBarcodeCommon()).QrCodeCharset),
                    this.CreateProp('model', PropertyType.Enum, null, (softBarcodeCommon()).QrCodeModel),
                    this.CreateProp('version', PropertyType.AnyPrimitive),
                    this.CreateProp('errorCorrectionLevel', PropertyType.Enum, null, (softBarcodeCommon()).QrCodeCorrectionLevel),
                    this.CreateProp('mask', PropertyType.Number),
                    this.CreateProp('connection', PropertyType.Boolean),
                    this.CreateProp('connectionIndex', PropertyType.Number),
                ]);

            case (softBarcodeComposite()) && (softBarcodeComposite()).Gs1DataBarBase:
                return this.getMetaData((softBarcode()).BarcodeBase).add([
                    this.CreateProp('showLabel', PropertyType.Boolean),
                    this.CreateProp('labelPosition', PropertyType.Enum, null, (softBarcode()).LabelPosition),
                    this.CreateProp('linkage', PropertyType.String),
                    this.CreateProp('linkageVersion', PropertyType.Enum, null, (softBarcodeComposite()).Gs1DataBarLinkageVersion),
                    this.CreateProp('linkageHeight', PropertyType.AnyPrimitive),
                    this.CreateProp('hideLinkageText', PropertyType.Boolean),
                    this.CreateProp('hideAiText', PropertyType.Boolean),
                ]);

            case (softBarcodeComposite()) && (softBarcodeComposite()).Gs1DataBarOmnidirectional:
                return this.getMetaData((softBarcodeComposite()).Gs1DataBarBase);

            case (softBarcodeComposite()) && (softBarcodeComposite()).Gs1DataBarTruncated:
                return this.getMetaData((softBarcodeComposite()).Gs1DataBarBase);

            case (softBarcodeComposite()) && (softBarcodeComposite()).Gs1DataBarStacked:
                return this.getMetaData((softBarcodeComposite()).Gs1DataBarBase).add([
                    this.CreateProp('ratio', PropertyType.Number),
                ]);

            case (softBarcodeComposite()) && (softBarcodeComposite()).Gs1DataBarStackedOmnidirectional:
                return this.getMetaData((softBarcodeComposite()).Gs1DataBarBase).add([
                    this.CreateProp('ratio', PropertyType.Number),
                ]);

            case (softBarcodeComposite()) && (softBarcodeComposite()).Gs1DataBarLimited:
                return this.getMetaData((softBarcodeComposite()).Gs1DataBarBase);

            case (softBarcodeComposite()) && (softBarcodeComposite()).Gs1DataBarExpanded:
                return this.getMetaData((softBarcodeComposite()).Gs1DataBarBase).add([
                    this.CreateProp('autoWidth', PropertyType.Boolean),
                    this.CreateProp('autoWidthZoom', PropertyType.Number),
                ]);

            case (softBarcodeComposite()) && (softBarcodeComposite()).Gs1DataBarExpandedStacked:
                return this.getMetaData((softBarcodeComposite()).Gs1DataBarBase).add([
                    this.CreateProp('autoWidth', PropertyType.Boolean),
                    this.CreateProp('autoWidthZoom', PropertyType.Number),
                    this.CreateProp('rowCount', PropertyType.AnyPrimitive),
                ]);

            case (softBarcodeComposite()) && (softBarcodeComposite()).Pdf417:
                return this.getMetaData((softBarcode()).BarcodeBase).add([
                    this.CreateProp('autoWidth', PropertyType.Boolean),
                    this.CreateProp('autoWidthZoom', PropertyType.Number),
                    this.CreateProp('errorCorrectionLevel', PropertyType.AnyPrimitive),
                    this.CreateProp('columns', PropertyType.AnyPrimitive),
                    this.CreateProp('rows', PropertyType.AnyPrimitive),
                    this.CreateProp('compact', PropertyType.Boolean),
                ]);

            case (softBarcodeComposite()) && (softBarcodeComposite()).MicroPdf417:
                return this.getMetaData((softBarcode()).BarcodeBase).add([
                    this.CreateProp('dimensions', PropertyType.Enum, null, (softBarcodeComposite()).MicroPdfDimensions),
                    this.CreateProp('compactionMode', PropertyType.Enum, null, (softBarcodeComposite()).MicroPdfCompactionMode),
                    this.CreateProp('structuredAppend', PropertyType.Boolean),
                    this.CreateProp('segmentIndex', PropertyType.Number),
                    this.CreateProp('fileId', PropertyType.Number),
                    this.CreateProp('optionalFields', PropertyType.Any),
                ]);

            case (softBarcodeSpecialized()) && (softBarcodeSpecialized()).DataMatrixBase:
                return this.getMetaData((softBarcode()).BarcodeBase);

            case (softBarcodeSpecialized()) && (softBarcodeSpecialized()).DataMatrixEcc000:
                return this.getMetaData((softBarcodeSpecialized()).DataMatrixBase).add([
                    this.CreateProp('version', PropertyType.Enum, null, (softBarcodeSpecialized()).DataMatrixVersion),
                    this.CreateProp('symbolSize', PropertyType.Enum, null, (softBarcodeSpecialized()).Ecc000_140SymbolSize),
                ]);

            case (softBarcodeSpecialized()) && (softBarcodeSpecialized()).DataMatrixEcc200:
                return this.getMetaData((softBarcodeSpecialized()).DataMatrixBase).add([
                    this.CreateProp('symbolSize', PropertyType.Enum, null, (softBarcodeSpecialized()).Ecc200SymbolSize),
                    this.CreateProp('encodingMode', PropertyType.Enum, null, (softBarcodeSpecialized()).Ecc200EncodingMode),
                    this.CreateProp('structuredAppend', PropertyType.Boolean),
                    this.CreateProp('structureNumber', PropertyType.Number),
                    this.CreateProp('fileIdentifier', PropertyType.Number),
                ]);

            case (softBarcodeSpecialized()) && (softBarcodeSpecialized()).Code49:
                return this.getMetaData((softBarcode()).BarcodeBase).add([
                    this.CreateProp('showLabel', PropertyType.Boolean),
                    this.CreateProp('grouping', PropertyType.Boolean),
                    this.CreateProp('groupIndex', PropertyType.Number),
                    this.CreateProp('labelPosition', PropertyType.Enum, null, (softBarcode()).LabelPosition),
                ]);

            case (softBarcodeSpecialized()) && (softBarcodeSpecialized()).Code93:
                return this.getMetaData((softBarcode()).BarcodeBase).add([
                    this.CreateProp('autoWidth', PropertyType.Boolean),
                    this.CreateProp('autoWidthZoom', PropertyType.Number),
                    this.CreateProp('showLabel', PropertyType.Boolean),
                    this.CreateProp('checkDigit', PropertyType.Boolean),
                    this.CreateProp('fullAscii', PropertyType.Boolean),
                    this.CreateProp('labelPosition', PropertyType.Enum, null, (softBarcode()).LabelPosition),
                ]);

            case (softBarcodeSpecialized()) && (softBarcodeSpecialized()).Itf14:
                return this.getMetaData((softBarcode()).BarcodeBase).add([
                    this.CreateProp('showLabel', PropertyType.Boolean),
                    this.CreateProp('nwRatio', PropertyType.Enum, null, (softBarcode()).NarrowToWideRatio),
                    this.CreateProp('bearerBar', PropertyType.Boolean),
                    this.CreateProp('labelPosition', PropertyType.Enum, null, (softBarcode()).LabelPosition),
                ]);

            case (softBarcodeSpecialized()) && (softBarcodeSpecialized()).Interleaved2of5:
                return this.getMetaData((softBarcode()).BarcodeBase).add([
                    this.CreateProp('autoWidth', PropertyType.Boolean),
                    this.CreateProp('autoWidthZoom', PropertyType.Number),
                    this.CreateProp('showLabel', PropertyType.Boolean),
                    this.CreateProp('nwRatio', PropertyType.Enum, null, (softBarcode()).NarrowToWideRatio),
                    this.CreateProp('bearerBar', PropertyType.Boolean),
                    this.CreateProp('labelPosition', PropertyType.Enum, null, (softBarcode()).LabelPosition),
                    this.CreateProp('checkCharacter', PropertyType.Boolean),
                ]);

            case (softBarcodeSpecialized()) && (softBarcodeSpecialized()).JapanesePostal:
                return this.getMetaData((softBarcode()).BarcodeBase).add([
                    this.CreateProp('showLabel', PropertyType.Boolean),
                    this.CreateProp('labelPosition', PropertyType.Enum, null, (softBarcode()).LabelPosition),
                ]);
        }

        return new MetaDataBase([]);
    }

    // For the specified class reference returns its name as a string, e.g.
    // getClassName(wijmo.input.ComboBox) returns 'ComboBox'.
    public static getClassName(classRef: any): string {
        return (classRef.toString().match(/function (.+?)\(/) || [, ''])[1];
    }

    // Returns a camel case representation of the dash delimited name.
    public static toCamelCase(s) {
        return s.toLowerCase().replace(/-(.)/g, function (match, group1) {
            return group1.toUpperCase();
        });
    }


    private static findInArr(arr: any[], propName: string, value: any): any {
        for (var i in arr) {
            if (arr[i][propName] === value) {
                return arr[i];
            }
        }
        return null;
    }

}

// Describes a scope property: name, type, binding mode.
// Also defines enum type and custom watcher function extender
export class PropDescBase {
    private _propertyName: string;
    private _propertyType: PropertyType;
    private _changeEvent: string;
    private _enumType: any;
    //private _bindingMode: BindingMode;
    private _isNativeControlProperty: boolean;
    private _priority: number = 0;

    // Initializes a new instance of a PropDesc
    constructor(propertyName: string, propertyType: PropertyType, /*bindingMode: BindingMode = BindingMode.OneWay*/changeEvent?: string,
        enumType?: any, isNativeControlProperty: boolean = true, priority: number = 0) {
        this._propertyName = propertyName;
        this._propertyType = propertyType;
        //this._bindingMode = bindingMode;
        this._changeEvent = changeEvent;
        this._enumType = enumType;
        this._isNativeControlProperty = isNativeControlProperty;
        this._priority = priority;
    }

    // Gets the property name
    get propertyName(): string {
        return this._propertyName;
    }

    // Gets the property type (number, string, boolean, enum, or any)
    get propertyType(): PropertyType {
        return this._propertyType;
    }

    get changeEvent(): string {
        return this._changeEvent;
    }

    // Gets the property enum type
    get enumType(): any { return this._enumType; }

    // Gets the property binding mode
    get bindingMode(): BindingMode {
        //return this._bindingMode;
        return this.changeEvent ? BindingMode.TwoWay : BindingMode.OneWay;
    }

    // Gets whether the property belongs to the control is just to the directive
    get isNativeControlProperty(): boolean {
        return this._isNativeControlProperty;
    }

    // Gets an initialization priority. Properties with higher priority are assigned to directive's underlying control
    // property later than properties with lower priority. Properties with the same priority are assigned in the order of
    // their index in the _props collection.
    get priority(): number {
        return this._priority;
    }

    // Indicates whether a bound 'controller' property should be updated on this property change (i.e. two-way binding).
    get shouldUpdateSource(): boolean {
        return this.bindingMode === BindingMode.TwoWay && this.propertyType != PropertyType.EventHandler;
    }

    initialize(options: any) {
        wijmo.copy(this, options);
    }

    // Casts value to the property type
    castValueToType(value: any) {
        if (value == undefined) {
            return value;
        }

        var type = this.propertyType,
            pt = PropertyType;
        if (type === pt.AnyPrimitive) {
            if (!wijmo.isString(value)) {
                return value;
            }
            if (value === 'true' || value === 'false') {
                type = pt.Boolean;
            } else {
                castVal = +value;
                if (!isNaN(castVal)) {
                    return castVal;
                }
                var castVal = this._parseDate(value);
                if (!wijmo.isString(castVal)) {
                    return castVal;
                }
                return value;
            }
        }
        switch (type) {
            case pt.Number:
                if (typeof value == 'string') {
                    if (value.indexOf('*') >= 0) { // hack for star width ('*', '2*'...)
                        return value;
                    }
                    if (value.trim() === '') { // binding to an empty html input means null
                        return null;
                    }
                }
                return +value; // cast to number
            case pt.Boolean:
                if (value === 'true') {
                    return true;
                }
                if (value === 'false') {
                    return false;
                }
                return !!value; // cast to bool
            case pt.String:
                return value + ''; // cast to string
            case pt.Date:
                return this._parseDate(value);
            case pt.Enum:
                if (typeof value === 'number') {
                    return value;
                }
                return this.enumType[value];
            default:
                return value;
        }
    }

    // Parsing DateTime values from string
    private _parseDate(value) {
        if (value && wijmo.isString(value)) {

            // For by-val attributes Angular converts a Date object to a
            // string wrapped in quotation marks, so we strip them.
            value = value.replace(/["']/g, '');

            // parse date/time using RFC 3339 pattern
            var dt = wijmo.changeType(value, wijmo.DataType.Date, 'r');
            if (wijmo.isDate(dt)) {
                return dt;
            }
        }
        return value;
    }

}

// Property types as used in the PropDesc class.
export enum PropertyType {
    Boolean,
    Number,
    Date,
    String,
    // Allows a value of any primitive type above, that can be parsed from string
    AnyPrimitive,
    Enum, // IMPORTANT: All new simple types must be added before Enum, all complex types after Enum.
    Function,
    EventHandler,
    Any
}

// Gets a value that indicates whether the specified type is simple (true) or complex (false).
export function isSimpleType(type: PropertyType): boolean {
    return type <= PropertyType.Enum;
}

export enum BindingMode {
    OneWay,
    TwoWay
}

// Describes a scope event
export class EventDescBase {
    private _eventName: string;
    private _isPropChanged: boolean;

    // Initializes a new instance of an EventDesc
    constructor(eventName: string, isPropChanged?: boolean) {
        this._eventName = eventName;
        this._isPropChanged = isPropChanged;
    }

    // Gets the event name
    get eventName(): string {
        return this._eventName;
    }

    // Gets whether this event is a property change notification
    get isPropChanged(): boolean {
        return this._isPropChanged === true;
    }
}

// Describe property info for nested directives.
export class ComplexPropDescBase {
    public propertyName: string;
    public isArray: boolean = false;
    private _ownsObject: boolean = false;

    constructor(propertyName: string, isArray: boolean, ownsObject: boolean = false) {
        this.propertyName = propertyName;
        this.isArray = isArray;
        this._ownsObject = ownsObject;
    }

    get ownsObject(): boolean {
        return this.isArray || this._ownsObject;
    }
}

// Stores a control metadata as arrays of property, event and complex property descriptors.
export class MetaDataBase {
    private _props: PropDescBase[] = [];
    private _events: EventDescBase[] = [];
    private _complexProps: ComplexPropDescBase[] = [];
    // For a child directive, the name of parent's property to assign to. Being assigned indicates that this is a child directive.
    // Begin assigned to an empty string indicates that this is a child directive but parent property name should be defined
    // by the wj-property attribute on directive's tag.
    parentProperty: string;
    // For a child directive indicates whether the parent _property is a collection.
    isParentPropertyArray: boolean;
    // For a child directive which is not a collection item indicates whether it should create an object or retrieve it
    // from parent's _property.
    ownsObject: boolean;
    // For a child directive, the name of the property of the directive's underlying object that receives the reference
    // to the parent, or an empty string that indicates that the reference to the parent should be passed as the
    // underlying object's constructor parameter.
    parentReferenceProperty: string;
    // The name of the control property represented by ng-model directive defined on the control's directive.
    ngModelProperty: string;

    constructor(props: PropDescBase[], events?: EventDescBase[], complexProps?: ComplexPropDescBase[],
        parentProperty?: string, isParentPropertyArray?: boolean, ownsObject?: boolean,
        parentReferenceProperty?: string, ngModelProperty?: string) {
        this.props = props;
        this.events = events;
        this.complexProps = complexProps;
        this.parentProperty = parentProperty;
        this.isParentPropertyArray = isParentPropertyArray;
        this.ownsObject = ownsObject;
        this.parentReferenceProperty = parentReferenceProperty;
        this.ngModelProperty = ngModelProperty;
    }

    get props(): PropDescBase[] {
        return this._props;
    }
    set props(value: PropDescBase[]) {
        this._props = value || [];
    }

    get events(): EventDescBase[] {
        return this._events;
    }
    set events(value: EventDescBase[]) {
        this._events = value || [];
    }

    get complexProps(): ComplexPropDescBase[] {
        return this._complexProps;
    }
    set complexProps(value: ComplexPropDescBase[]) {
        this._complexProps = value || [];
    }

    // Adds the specified arrays to the end of corresponding arrays of this object, and overwrite the simple properties
    // if specified. Returns 'this'.
    add(props: PropDescBase[], events?: EventDescBase[], complexProps?: ComplexPropDescBase[],
        parentProperty?: string, isParentPropertyArray?: boolean, ownsObject?: boolean,
        parentReferenceProperty?: string, ngModelProperty?: string): MetaDataBase {

        return this.addOptions({
            props: props,
            events: events,
            complexProps: complexProps,
            parentProperty: parentProperty,
            isParentPropertyArray: isParentPropertyArray,
            ownsObject: ownsObject,
            parentReferenceProperty: parentReferenceProperty,
            ngModelProperty: ngModelProperty
        });

        //this._props = this._props.concat(props || []);
        //this._events = this._events.concat(events || []);
        //this._complexProps = this._complexProps.concat(complexProps || []);
        //if (parentProperty !== undefined) {
        //    this.parentProperty = parentProperty;
        //}
        //if (isParentPropertyArray !== undefined) {
        //    this.isParentPropertyArray = isParentPropertyArray;
        //}
        //if (ownsObject !== undefined) {
        //    this.ownsObject = ownsObject;
        //}
        //if (parentReferenceProperty !== undefined) {
        //    this.parentReferenceProperty = parentReferenceProperty;
        //}
        //if (ngModelProperty !== undefined) {
        //    this.ngModelProperty = ngModelProperty;
        //}
        //return this;
    }

    addOptions(options: any) {
        for (var prop in options) {
            var thisValue = this[prop],
                optionsValue = options[prop];
            if (thisValue instanceof Array) {
                this[prop] = thisValue.concat(optionsValue || []);
            }
            else if (optionsValue !== undefined) {
                this[prop] = optionsValue;
            }
        }
        return this;
    }

    // Prepares a raw defined metadata for a usage, for example sorts the props array on priority.
    prepare() {
        // stable sort of props on priority
        var baseArr: PropDescBase[] = [].concat(this._props);
        this._props.sort(function (a: PropDescBase, b: PropDescBase): number {
            var ret = a.priority - b.priority;
            if (!ret) {
                ret = baseArr.indexOf(a) - baseArr.indexOf(b);
            }
            return ret;
        });
    }
}




    }
    


    module wijmo.webcomponents {
    // Entry file. All real code files should be re-exported from here.


wijmo._registerModule('wijmo.meta', wijmo.webcomponents);



    }
    

    module wijmo.webcomponents {
    



(function () {
    var sheet = document.createElement('style')
    sheet.innerHTML =
        `.wj-web-component {
            display: inline-block;
        }`;
    //document.head.appendChild(sheet);
    document.head.insertBefore(sheet, document.head.firstElementChild);
})();

//export interface IWjComponentMetaStatic {
//    parentProp: string;
//    parentInCtor: boolean;
//    siblingId: string;
//}
//export interface IWjComponentMeta {
//    constructor: new () => IWjComponentMetaStatic;
//}

export interface IPropsMeta {
    [name: string]: PropDescBase;
};

export class WjComponentBehavior {

    private static readonly _typeSiblingIdAttr = '_wjSiblingId';
    static readonly _behClassProp = '_wjBehCl';
    static readonly _behProp = '_wjBehaviour';
    static readonly _beforeInitParent = '_beforeInitParent';
    static readonly _afterInitParent = '_afterInitParent';
    //private static _controlType: ObjectConstructor = null;
    private static _siblingDirId = 0;
    private static _cmpRegId = 0;
    private static _registered = [];


    private _siblingId: string;
    private _isMounted = false;
    private _mountedCBs: (() => void)[] = [];
    //private _siblingInsertedEH;
    private _isDomInitialized = false;
    private _initialValues: { name: string, oldValue: string, newValue: string }[] = [];

    // Contains a reference to the attached Vue component instance.
    //readonly component: any;
    // References the underlying Wijmo object
    control: any;
    readonly component: HTMLElement;
    parentComponent: HTMLElement;
    // For the child behaviors, contains a reference to the parent component behavior.
    //parent: WjComponentBehavior;

    // Make "this.constructor" expression typed, for the convenient access to the overridden static members
    ['constructor']: typeof WjComponentBehavior;

    static _attach(component: HTMLElement): WjComponentBehavior {
        return new this(component);
    }

    constructor(component: any) {
        this.component = component;
        // assign this.control as early as possible, in order to allow attribute values to be
        // applied to control properties immediately, without waiting to the connectedCallback.
        if (!this.isWrapper) {
            this.control = component;
        }
    }

    // Registers WebComponent, as well as its base class if the component is not a wrapper
    static register(name: string, componentType: any) {
        if (componentType == null) {
            return;
        }
        let isImplemented = !!name;
        if (this._registered.indexOf(componentType) < 0) {
            this._registered.push(componentType);
            window['customElements'].define(isImplemented ? name : 'wjc-dummy-' + (++this._cmpRegId),
                componentType);
        } else if (isImplemented) {
            throw `Wijmo WebComponents error: component '${name}' is already registered.`;
        }
        // If component is inherited from the Wijmo class, register all super classes (if not yet)
        // until HTMLElement, in order to allow these classes to be instantiated with "new class()".
        //if (isImplemented) {
            if (!componentType.wrappedClass) {
                //for (let controlType = this._getControlType(componentType);
                for (let controlType = Object.getPrototypeOf(componentType.prototype).constructor;
                    // controlType !== HTMLElement comparison doesn't work in ES5, so compare their prototypes
                    controlType.prototype !== HTMLElement.prototype && this._registered.indexOf(controlType) < 0;
                    controlType = Object.getPrototypeOf(controlType.prototype).constructor) {
                    let controlRegName = 'wjc-dummy-' + (++this._cmpRegId);
                    this._registered.push(controlType);
                    window['customElements'].define(controlRegName, controlType);
                }
            } else if (isImplemented) {
                // For wrappers, expose all the bindable properties of the wrapped control to support
                // property bindings like [propName]="expression" in Angular.
                //let propsMeta = this._getPropsMetaData(componentType);
                let props = this._getMetaData(componentType).props;
                for (let propDesc of props) {
                    let propName = propDesc.propertyName;
                    if (propDesc.isNativeControlProperty) {
                        if (propName in HTMLElement.prototype) {
                            console.log(`WARNING: Wijmo WebComponent '${componentType.name}' exposes the '${propName}' property which coinsides with the HTMLElement class member.`);
                        }
                        Object.defineProperty(componentType.prototype, propName, {
                            get: function () {
                                return this.control[propName];
                            },
                            set: function (value) {
                                this.control[propName] = value;
                            },
                            enumerable: true,
                            configurable: true
                        });
                    }

                }
            }
        //}
    }

    static getProps(componentType: any): IPropsMeta {
        this._ensureMetadata(componentType);
        return componentType._props;
    }

    // Returns true if namespace and symbol already exists; otherwise, creates missed ns objects
    // and assigns missed symbols to null.
    static ensureNs(ns: string, ...symbolNames: string[]): boolean {
        let parts = ns.split('.'),
            curNs = <any>window,
            ret = true;
        for (let curPart of parts) {
            let nextNs = curNs[curPart];
            if (!nextNs) {
                nextNs = curNs[curPart] = {};
                ret = false;
            }
            curNs = nextNs;
        }
        if (symbolNames) {
            for (let curSymbol of symbolNames) {
                if (curSymbol && !curNs[curSymbol]) {
                    curNs[curSymbol] = null;
                    ret = false;
                }
            }
        }

        return ret;
    }

    get isWrapper(): boolean {
        return this.component.constructor['wrappedClass'] != null;
    }

    // ======== WebComponent lifecicle hooks. =================
    // Called by the attached WebComponent's lifecycle hooks.

    // implements WebComponent's connectedCallback
    lhConnected() {
        //console.log(`${this.constructor.name}.connectedCallback`);
        this.parentComponent = this.component.parentElement;
        //this.parent = this.parentComponent[WjComponentBehavior._behProp];
        this._prepareControl();
        if (this._isChild()) {
            this._initParent();
        } 
    }

    // implements WebComponent's disconnectedCallback
    lhDisconnected() {
        //console.log(`${this.constructor.name}.disconnectedCallback`);

        //if (this._siblingInsertedEH) {
        //    this._getElement().removeEventListener('DOMNodeInserted', this._siblingInsertedEH);
        //}

        let control = this.control;
        if (control) {
            if (this._isChild()) {
                let parProp = this._getParentProp();
                if (parProp) {
                    let parControl = this.parentComponent,
                        parValue = parControl[parProp];
                    if (wijmo.isArray(parValue)) {
                        let idx = parValue.indexOf(control);
                        if (idx > -1) {
                            parValue.splice(idx, 1);
                        }
                    }
                }
            } else if (control instanceof wijmo.Control) {
                // TBD: It's not clear when to dispose the control. Removal from the DOM tree doesn't mean
                // that control should be destroyed, it can be later added to another place of the DOM.
                //control.dispose();
            }
        }

        this.parentComponent = null;
        //this.parent = null;
    }

    // implements WebComponent's attributeChangedCallback
    lhAttributeChanged(name: string, oldValue: string, newValue: string) {
        //console.log(`${this.constructor.name}.attributeChangedCallback: ${name} from ${oldValue} to ${newValue}`);
        this._onAttributeChanged(name, oldValue, newValue);
    }

    // === End of WebComponents lifecicle hooks

    // For child component, initializes its parent after component's 'control' has been created.
    // Can be overridden in the derived class with the mandatory 'super' call.
    private _initParent() {
        this._callCmpMethod(WjComponentBehavior._beforeInitParent);
        let parProp = this._getParentProp();
        if (parProp) {
            let parControl = (<any>this.parentComponent).control,
                parArr = <any[]>parControl[parProp];
            if (wijmo.isArray(parArr)) {
                // insert child at correct index, which is the same as an index of the directive element amid sibling directives
                // of the same type
                let linkIdx = this._getSiblingIndex();
                if (linkIdx < 0 || linkIdx >= parArr.length) {
                    linkIdx = parArr.length;
                }
                parArr.splice(linkIdx, 0, this.control);
                //this._siblingInsertedEH = this._siblingInserted.bind(this);
                //this._getElement().addEventListener('DOMNodeInserted', this._siblingInsertedEH);

            } else {
                parControl[parProp] = this.control;
            }
        }
        this._callCmpMethod(WjComponentBehavior._afterInitParent);
    }

    // Creates a control and initializes its properties.
    private _prepareControl() {
        if (this._isDomInitialized) {
            return;
        }
        let CB = <any>this.component.constructor,
            component = this.component;
        let control = this.control = CB.wrappedClass ? this._createControl() : component;
        (<any>component).control = control;
        //let host = <HTMLElement>this._getElement(),
        //    isWjControl = control instanceof wijmo.Control;

        wijmo.addClass(component, 'wj-web-component');
        if (component instanceof wijmo.Control && control.hostElement !== component) {
            let host = control.hostElement;
            host.style.height = "100%";
            host.style.width = "100%";
            //let cmpStyle = window.getComputedStyle(component);
            //// we treat inline as a default, i.e. it's not overridden intentionally by css or inline style
            //if (cmpStyle.display === 'inline') {
            //    component.style.display = window.getComputedStyle(host).display;
            //}
            //let bbb = cmpStyle;
            ////if (cmpStyle.
        }
        if (this._isChild()) {
            component.style.display = 'none';
        }
        this._initDom();

        // define sibling id
        if (!this._siblingId) {
            if (CB.siblingId == null) {
                CB.siblingId = (++WjComponentBehavior._siblingDirId) + ''
            }
            this._siblingId = CB.siblingId;
        }
        component.setAttribute(WjComponentBehavior._typeSiblingIdAttr, this._siblingId);

        this._flushInitialValues();
        // TBD: should it be before attributes application, like in other interops?
        this._initEvents();
    }

    _initDom() {
        if (this._isDomInitialized) {
            return;
        }
        this._isDomInitialized = true;

        let control = this.control,
            component = this.component;
        if (control instanceof wijmo.Control && control.hostElement !== component) {
            component.appendChild(control.hostElement);
        }

        //let shadowRoot = this['attachShadow']({ mode: 'open' });
        //let shadowRootEl = document.createElement('div');
        //shadowRoot.appendChild(shadowRootEl);
        //this.createControl(shadowRootEl);
        //this.createControl(this);
    }

    private _createControl(): any {
        let param = this._isChild()
            ? (this._isParentInCtor() ? (<any>this.parentComponent).control : undefined)
            : <HTMLElement>this._getElement(),
            control = new (WjComponentBehavior._getControlType(this.component.constructor))(param);
        return control;
    }

    private _initEvents() {
        let meta = WjComponentBehavior._getMetaData(this.component.constructor);
        if (meta) {
            for (let eventDesc of meta.events) {
                ((eventDesc) => {
                    this.control[eventDesc.eventName].addHandler((s, e) => {
                        this.component.dispatchEvent(
                            new CustomEvent(WjComponentBehavior.toDash(eventDesc.eventName), {
                                detail: e
                            }));
                    });
                })(eventDesc);
            }
        }
    }

    private _onAttributeChanged(name: string, oldValue: string, newValue: string) {
        //console.log(`_onAttributeChanged: ${name} from ${oldValue} to ${newValue}`);
        let control = this.control;
        if (oldValue != newValue) {
            if (control) {
                if (this._initialValues) {
                    this._flushInitialValues();
                }
                let WCB = WjComponentBehavior,
                    propsMeta = WCB._getPropsMetaData(this.component.constructor),
                    attrName = name,
                    propName = WCB.toCamelCase(name),
                    //propDesc = propsMeta[WCB.toCamelCase(name)];
                    propDesc = propsMeta[attrName];

                if (propDesc != null) {
                    newValue = propDesc.castValueToType(newValue);
                }
                if (control[propName] !== newValue) {
                    control[propName] = newValue;
                }
            } else if (this._initialValues) {
                this._initialValues.push({ name: name, oldValue: oldValue, newValue: newValue });
            }
        }
    }

    private _flushInitialValues() {
        let initValues = this._initialValues;
        if (initValues) {
            this._initialValues = null;
            // TBD: sort them out by priority
            for (let curInit of initValues) {
                this._onAttributeChanged(curInit.name, curInit.oldValue, curInit.newValue);
            }
        }
    }


    private _isChild(): boolean {
        let ctor = <any>this.component.constructor;
        return ctor.parentProp != null || ctor.parentInCtor != null;
    }
    private _isParentInCtor(): boolean {
        return (<any>this.component.constructor).parentInCtor === true;
    }
    private _getParentProp(): string {
        return this.component.getAttribute('wj-property') || (<any>this.component.constructor).parentProp;
    }

    // Gets an index of this directive host element among another host elements pertain to the same directive type.
    private _getSiblingIndex() {
        var thisEl = this._getElement(),
            parEl = thisEl.parentElement;
        // If parentElement is null, e.g. because this element is temporary in DocumentFragment, the index
        // of the element isn't relevant to the item's position in the array, so we return -1 and thus force
        // a calling code to not reposition the item in the array at all.  
        if (!parEl) {
            return -1;
        }
        var siblings = parEl.childNodes,
            idx = -1,
            dirId = this._siblingId;
        for (var i = 0; i < siblings.length; i++) {
            var curEl = <HTMLElement>siblings[i];
            if (curEl.nodeType == 1 && curEl.getAttribute(WjComponentBehavior._typeSiblingIdAttr) == dirId) {
                ++idx;
                if (curEl === thisEl) {
                    return idx;
                }
            }
        }

        return -1;
    }

    //private _siblingInserted(e) {
    //    if (e.target === this._getElement()) {
    //        var lIdx = this._getSiblingIndex(),
    //            control = this.control,
    //            parArr = <any[]>this.parent.control[this._getParentProp()],
    //            arrIdx = parArr.indexOf(control);
    //        if (lIdx >= 0 && arrIdx >= 0 && lIdx !== arrIdx) {
    //            parArr.splice(arrIdx, 1);
    //            lIdx = Math.min(lIdx, parArr.length);
    //            parArr.splice(lIdx, 0, control);
    //        }
    //    }
    //}

    private _getElement(): HTMLElement {
        return this.component;
    }

    private static _getControlType(componentType: any): any {
        return componentType.wrappedClass
            // return wrapped Wijmo class
            ? componentType.wrappedClass()
            // returns base class
            : Object.getPrototypeOf(componentType.prototype).constructor;
    }

    private static _getMetaDataId(componentType: any) {
        return this._getControlType(componentType);
    }
    private static _getMetaData(componentType: any): MetaDataBase {
        this._ensureMetadata(componentType);
        return componentType._meta;
    }
    private static _getPropsMetaData(componentType: any): IPropsMeta {
        this._ensureMetadata(componentType);
        return componentType._propsMeta;
    }
    private static _ensureMetadata(componentType: any) {
        if (!componentType._meta) {
            let metaId = this._getMetaDataId(componentType);
            if (metaId) {
                let metaData = componentType._meta = ControlMetaFactory.getMetaData(metaId);
                metaData.prepare();
                let propsMeta = componentType._propsMeta = {},
                    propDescs = metaData.props,
                    props = componentType._props = [];
                for (let curDesc of propDescs) {
                    if (curDesc.propertyType <= PropertyType.Enum) {
                        let attrName = WjComponentBehavior.toDash(curDesc.propertyName);
                        propsMeta[attrName] = curDesc;
                        props.push(attrName);
                    }
                }
            }
        }
    }

    private _callCmpMethod(method: string, ...args) {
        let component = this.component,
            methodRef = <Function>component[method];
        if (typeof methodRef === 'function') {
            methodRef.apply(component, args);
        }
    }

    // Returns a camel case representation of the dash delimited name.
    public static toCamelCase(s: string): string {
        return ControlMetaFactory.toCamelCase(s);
    }
    // Converts camel case to dash delimited string
    public static toDash(s: string) {
        return s.replace(/([A-Z])/g, (g) => '-' + g[0].toLowerCase());
    }


}

    }
    


    module wijmo.webcomponents {
    

    }
    

    module wijmo.webcomponents {
    

let _wj_ns_exists_1 = wijmo.webcomponents.WjComponentBehavior.ensureNs('wijmo.chart.analytics', 'TrendLine', 'MovingAverage', 'YFunctionSeries', 'ParametricFunctionSeries', 'Waterfall', 'BoxWhisker', 'ErrorBar', 'BreakEven');









    export class WjcFlexChartTrendLine extends HTMLElement {
        static wrappedClass = () => { return wijmo.chart.analytics.TrendLine; };
        static parentProp = 'series';
        static siblingId = 'series'; 
		_wjBehaviour: WjComponentBehavior; 

		constructor() {
			super();
			this._wjBehaviour = WjComponentBehavior._attach(<any>this); 
		}

		static get observedAttributes() {
			return WjComponentBehavior.getProps(this);
		}

		connectedCallback() {
			this._wjBehaviour.lhConnected();
		}

		attributeChangedCallback(name: string, oldValue: string, newValue: string) {
			this._wjBehaviour.lhAttributeChanged(name, oldValue, newValue);
		}

		disconnectedCallback() {
			this._wjBehaviour.lhDisconnected();
		} 
	}  
    if (_wj_ns_exists_1) {
		WjComponentBehavior.register('wjc-flex-chart-trend-line', WjcFlexChartTrendLine); 
	}
  
    export class WjcFlexChartMovingAverage extends HTMLElement {
        static wrappedClass = () => { return wijmo.chart.analytics.MovingAverage; };
        static parentProp = 'series';
        static siblingId = 'series'; 
		_wjBehaviour: WjComponentBehavior; 

		constructor() {
			super();
			this._wjBehaviour = WjComponentBehavior._attach(<any>this); 
		}

		static get observedAttributes() {
			return WjComponentBehavior.getProps(this);
		}

		connectedCallback() {
			this._wjBehaviour.lhConnected();
		}

		attributeChangedCallback(name: string, oldValue: string, newValue: string) {
			this._wjBehaviour.lhAttributeChanged(name, oldValue, newValue);
		}

		disconnectedCallback() {
			this._wjBehaviour.lhDisconnected();
		} 
	}  
    if (_wj_ns_exists_1) {
		WjComponentBehavior.register('wjc-flex-chart-moving-average', WjcFlexChartMovingAverage); 
	}
  
    export class WjcFlexChartYFunctionSeries extends HTMLElement {
        static wrappedClass = () => { return wijmo.chart.analytics.YFunctionSeries; };
        static parentProp = 'series';
        static siblingId = 'series'; 
		_wjBehaviour: WjComponentBehavior; 

		constructor() {
			super();
			this._wjBehaviour = WjComponentBehavior._attach(<any>this); 
		}

		static get observedAttributes() {
			return WjComponentBehavior.getProps(this);
		}

		connectedCallback() {
			this._wjBehaviour.lhConnected();
		}

		attributeChangedCallback(name: string, oldValue: string, newValue: string) {
			this._wjBehaviour.lhAttributeChanged(name, oldValue, newValue);
		}

		disconnectedCallback() {
			this._wjBehaviour.lhDisconnected();
		} 
	}  
    if (_wj_ns_exists_1) {
		WjComponentBehavior.register('wjc-flex-chart-y-function-series', WjcFlexChartYFunctionSeries); 
	}
  
    export class WjcFlexChartParametricFunctionSeries extends HTMLElement {
        static wrappedClass = () => { return wijmo.chart.analytics.ParametricFunctionSeries; };
        static parentProp = 'series';
        static siblingId = 'series'; 
		_wjBehaviour: WjComponentBehavior; 

		constructor() {
			super();
			this._wjBehaviour = WjComponentBehavior._attach(<any>this); 
		}

		static get observedAttributes() {
			return WjComponentBehavior.getProps(this);
		}

		connectedCallback() {
			this._wjBehaviour.lhConnected();
		}

		attributeChangedCallback(name: string, oldValue: string, newValue: string) {
			this._wjBehaviour.lhAttributeChanged(name, oldValue, newValue);
		}

		disconnectedCallback() {
			this._wjBehaviour.lhDisconnected();
		} 
	}  
    if (_wj_ns_exists_1) {
		WjComponentBehavior.register('wjc-flex-chart-parametric-function-series', WjcFlexChartParametricFunctionSeries); 
	}
  
    export class WjcFlexChartWaterfall extends HTMLElement {
        static wrappedClass = () => { return wijmo.chart.analytics.Waterfall; };
        static parentProp = 'series';
        static siblingId = 'series'; 
		_wjBehaviour: WjComponentBehavior; 

		constructor() {
			super();
			this._wjBehaviour = WjComponentBehavior._attach(<any>this); 
		}

		static get observedAttributes() {
			return WjComponentBehavior.getProps(this);
		}

		connectedCallback() {
			this._wjBehaviour.lhConnected();
		}

		attributeChangedCallback(name: string, oldValue: string, newValue: string) {
			this._wjBehaviour.lhAttributeChanged(name, oldValue, newValue);
		}

		disconnectedCallback() {
			this._wjBehaviour.lhDisconnected();
		} 
	}  
    if (_wj_ns_exists_1) {
		WjComponentBehavior.register('wjc-flex-chart-waterfall', WjcFlexChartWaterfall); 
	}
  
    export class WjcFlexChartBoxWhisker extends HTMLElement {
        static wrappedClass = () => { return wijmo.chart.analytics.BoxWhisker; };
        static parentProp = 'series';
        static siblingId = 'series'; 
		_wjBehaviour: WjComponentBehavior; 

		constructor() {
			super();
			this._wjBehaviour = WjComponentBehavior._attach(<any>this); 
		}

		static get observedAttributes() {
			return WjComponentBehavior.getProps(this);
		}

		connectedCallback() {
			this._wjBehaviour.lhConnected();
		}

		attributeChangedCallback(name: string, oldValue: string, newValue: string) {
			this._wjBehaviour.lhAttributeChanged(name, oldValue, newValue);
		}

		disconnectedCallback() {
			this._wjBehaviour.lhDisconnected();
		} 
	}  
    if (_wj_ns_exists_1) {
		WjComponentBehavior.register('wjc-flex-chart-box-whisker', WjcFlexChartBoxWhisker); 
	}
  
    export class WjcFlexChartErrorBar extends HTMLElement {
        static wrappedClass = () => { return wijmo.chart.analytics.ErrorBar; };
        static parentProp = 'series';
        static siblingId = 'series'; 
		_wjBehaviour: WjComponentBehavior; 

		constructor() {
			super();
			this._wjBehaviour = WjComponentBehavior._attach(<any>this); 
		}

		static get observedAttributes() {
			return WjComponentBehavior.getProps(this);
		}

		connectedCallback() {
			this._wjBehaviour.lhConnected();
		}

		attributeChangedCallback(name: string, oldValue: string, newValue: string) {
			this._wjBehaviour.lhAttributeChanged(name, oldValue, newValue);
		}

		disconnectedCallback() {
			this._wjBehaviour.lhDisconnected();
		} 
	}  
    if (_wj_ns_exists_1) {
		WjComponentBehavior.register('wjc-flex-chart-error-bar', WjcFlexChartErrorBar); 
	}
  
    export class WjcFlexChartBreakEven extends HTMLElement {
        static wrappedClass = () => { return wijmo.chart.analytics.BreakEven; };
        static parentProp = 'series';
        static siblingId = 'series'; 
		_wjBehaviour: WjComponentBehavior; 

		constructor() {
			super();
			this._wjBehaviour = WjComponentBehavior._attach(<any>this); 
		}

		static get observedAttributes() {
			return WjComponentBehavior.getProps(this);
		}

		connectedCallback() {
			this._wjBehaviour.lhConnected();
		}

		attributeChangedCallback(name: string, oldValue: string, newValue: string) {
			this._wjBehaviour.lhAttributeChanged(name, oldValue, newValue);
		}

		disconnectedCallback() {
			this._wjBehaviour.lhDisconnected();
		} 
	}  
    if (_wj_ns_exists_1) {
		WjComponentBehavior.register('wjc-flex-chart-break-even', WjcFlexChartBreakEven); 
	}
  
    }
    


    module wijmo.webcomponents {
    

    }
    

    module wijmo.webcomponents {
    

let _wj_ns_exists_2 = wijmo.webcomponents.WjComponentBehavior.ensureNs('wijmo.chart.animation', 'ChartAnimation');









    export class WjcFlexChartAnimation extends HTMLElement {
        static wrappedClass = () => { return wijmo.chart.animation.ChartAnimation; };
        static parentInCtor = true; 
		_wjBehaviour: WjComponentBehavior; 

		constructor() {
			super();
			this._wjBehaviour = WjComponentBehavior._attach(<any>this); 
		}

		static get observedAttributes() {
			return WjComponentBehavior.getProps(this);
		}

		connectedCallback() {
			this._wjBehaviour.lhConnected();
		}

		attributeChangedCallback(name: string, oldValue: string, newValue: string) {
			this._wjBehaviour.lhAttributeChanged(name, oldValue, newValue);
		}

		disconnectedCallback() {
			this._wjBehaviour.lhDisconnected();
		} 
	}  
    if (_wj_ns_exists_2) {
		WjComponentBehavior.register('wjc-flex-chart-animation', WjcFlexChartAnimation); 
	}
  
    }
    


    module wijmo.webcomponents {
    

    }
    

    module wijmo.webcomponents {
    

let _wj_ns_exists_3 = wijmo.webcomponents.WjComponentBehavior.ensureNs('wijmo.chart.finance.analytics', 'Fibonacci', 'FibonacciArcs', 'FibonacciFans', 'FibonacciTimeZones', 'ATR', 'CCI', 'RSI', 'WilliamsR', 'Macd', 'MacdHistogram', 'Stochastic', 'BollingerBands', 'Envelopes');









    export class WjcFlexChartFibonacci extends HTMLElement {
        static wrappedClass = () => { return wijmo.chart.finance.analytics.Fibonacci; };
        static parentProp = 'series';
        static siblingId = 'series'; 
		_wjBehaviour: WjComponentBehavior; 

		constructor() {
			super();
			this._wjBehaviour = WjComponentBehavior._attach(<any>this); 
		}

		static get observedAttributes() {
			return WjComponentBehavior.getProps(this);
		}

		connectedCallback() {
			this._wjBehaviour.lhConnected();
		}

		attributeChangedCallback(name: string, oldValue: string, newValue: string) {
			this._wjBehaviour.lhAttributeChanged(name, oldValue, newValue);
		}

		disconnectedCallback() {
			this._wjBehaviour.lhDisconnected();
		} 
	}  
    if (_wj_ns_exists_3) {
		WjComponentBehavior.register('wjc-flex-chart-fibonacci', WjcFlexChartFibonacci); 
	}
  
    export class WjcFlexChartFibonacciArcs extends HTMLElement {
        static wrappedClass = () => { return wijmo.chart.finance.analytics.FibonacciArcs; };
        static parentProp = 'series';
        static siblingId = 'series'; 
		_wjBehaviour: WjComponentBehavior; 

		constructor() {
			super();
			this._wjBehaviour = WjComponentBehavior._attach(<any>this); 
		}

		static get observedAttributes() {
			return WjComponentBehavior.getProps(this);
		}

		connectedCallback() {
			this._wjBehaviour.lhConnected();
		}

		attributeChangedCallback(name: string, oldValue: string, newValue: string) {
			this._wjBehaviour.lhAttributeChanged(name, oldValue, newValue);
		}

		disconnectedCallback() {
			this._wjBehaviour.lhDisconnected();
		} 
	}  
    if (_wj_ns_exists_3) {
		WjComponentBehavior.register('wjc-flex-chart-fibonacci-arcs', WjcFlexChartFibonacciArcs); 
	}
  
    export class WjcFlexChartFibonacciFans extends HTMLElement {
        static wrappedClass = () => { return wijmo.chart.finance.analytics.FibonacciFans; };
        static parentProp = 'series';
        static siblingId = 'series'; 
		_wjBehaviour: WjComponentBehavior; 

		constructor() {
			super();
			this._wjBehaviour = WjComponentBehavior._attach(<any>this); 
		}

		static get observedAttributes() {
			return WjComponentBehavior.getProps(this);
		}

		connectedCallback() {
			this._wjBehaviour.lhConnected();
		}

		attributeChangedCallback(name: string, oldValue: string, newValue: string) {
			this._wjBehaviour.lhAttributeChanged(name, oldValue, newValue);
		}

		disconnectedCallback() {
			this._wjBehaviour.lhDisconnected();
		} 
	}  
    if (_wj_ns_exists_3) {
		WjComponentBehavior.register('wjc-flex-chart-fibonacci-fans', WjcFlexChartFibonacciFans); 
	}
  
    export class WjcFlexChartFibonacciTimeZones extends HTMLElement {
        static wrappedClass = () => { return wijmo.chart.finance.analytics.FibonacciTimeZones; };
        static parentProp = 'series';
        static siblingId = 'series'; 
		_wjBehaviour: WjComponentBehavior; 

		constructor() {
			super();
			this._wjBehaviour = WjComponentBehavior._attach(<any>this); 
		}

		static get observedAttributes() {
			return WjComponentBehavior.getProps(this);
		}

		connectedCallback() {
			this._wjBehaviour.lhConnected();
		}

		attributeChangedCallback(name: string, oldValue: string, newValue: string) {
			this._wjBehaviour.lhAttributeChanged(name, oldValue, newValue);
		}

		disconnectedCallback() {
			this._wjBehaviour.lhDisconnected();
		} 
	}  
    if (_wj_ns_exists_3) {
		WjComponentBehavior.register('wjc-flex-chart-fibonacci-time-zones', WjcFlexChartFibonacciTimeZones); 
	}
  
    export class WjcFlexChartAtr extends HTMLElement {
        static wrappedClass = () => { return wijmo.chart.finance.analytics.ATR; };
        static parentProp = 'series';
        static siblingId = 'series'; 
		_wjBehaviour: WjComponentBehavior; 

		constructor() {
			super();
			this._wjBehaviour = WjComponentBehavior._attach(<any>this); 
		}

		static get observedAttributes() {
			return WjComponentBehavior.getProps(this);
		}

		connectedCallback() {
			this._wjBehaviour.lhConnected();
		}

		attributeChangedCallback(name: string, oldValue: string, newValue: string) {
			this._wjBehaviour.lhAttributeChanged(name, oldValue, newValue);
		}

		disconnectedCallback() {
			this._wjBehaviour.lhDisconnected();
		} 
	}  
    if (_wj_ns_exists_3) {
		WjComponentBehavior.register('wjc-flex-chart-atr', WjcFlexChartAtr); 
	}
  
    export class WjcFlexChartCci extends HTMLElement {
        static wrappedClass = () => { return wijmo.chart.finance.analytics.CCI; };
        static parentProp = 'series';
        static siblingId = 'series'; 
		_wjBehaviour: WjComponentBehavior; 

		constructor() {
			super();
			this._wjBehaviour = WjComponentBehavior._attach(<any>this); 
		}

		static get observedAttributes() {
			return WjComponentBehavior.getProps(this);
		}

		connectedCallback() {
			this._wjBehaviour.lhConnected();
		}

		attributeChangedCallback(name: string, oldValue: string, newValue: string) {
			this._wjBehaviour.lhAttributeChanged(name, oldValue, newValue);
		}

		disconnectedCallback() {
			this._wjBehaviour.lhDisconnected();
		} 
	}  
    if (_wj_ns_exists_3) {
		WjComponentBehavior.register('wjc-flex-chart-cci', WjcFlexChartCci); 
	}
  
    export class WjcFlexChartRsi extends HTMLElement {
        static wrappedClass = () => { return wijmo.chart.finance.analytics.RSI; };
        static parentProp = 'series';
        static siblingId = 'series'; 
		_wjBehaviour: WjComponentBehavior; 

		constructor() {
			super();
			this._wjBehaviour = WjComponentBehavior._attach(<any>this); 
		}

		static get observedAttributes() {
			return WjComponentBehavior.getProps(this);
		}

		connectedCallback() {
			this._wjBehaviour.lhConnected();
		}

		attributeChangedCallback(name: string, oldValue: string, newValue: string) {
			this._wjBehaviour.lhAttributeChanged(name, oldValue, newValue);
		}

		disconnectedCallback() {
			this._wjBehaviour.lhDisconnected();
		} 
	}  
    if (_wj_ns_exists_3) {
		WjComponentBehavior.register('wjc-flex-chart-rsi', WjcFlexChartRsi); 
	}
  
    export class WjcFlexChartWilliamsR extends HTMLElement {
        static wrappedClass = () => { return wijmo.chart.finance.analytics.WilliamsR; };
        static parentProp = 'series';
        static siblingId = 'series'; 
		_wjBehaviour: WjComponentBehavior; 

		constructor() {
			super();
			this._wjBehaviour = WjComponentBehavior._attach(<any>this); 
		}

		static get observedAttributes() {
			return WjComponentBehavior.getProps(this);
		}

		connectedCallback() {
			this._wjBehaviour.lhConnected();
		}

		attributeChangedCallback(name: string, oldValue: string, newValue: string) {
			this._wjBehaviour.lhAttributeChanged(name, oldValue, newValue);
		}

		disconnectedCallback() {
			this._wjBehaviour.lhDisconnected();
		} 
	}  
    if (_wj_ns_exists_3) {
		WjComponentBehavior.register('wjc-flex-chart-williams-r', WjcFlexChartWilliamsR); 
	}
  
    export class WjcFlexChartMacd extends HTMLElement {
        static wrappedClass = () => { return wijmo.chart.finance.analytics.Macd; };
        static parentProp = 'series';
        static siblingId = 'series'; 
		_wjBehaviour: WjComponentBehavior; 

		constructor() {
			super();
			this._wjBehaviour = WjComponentBehavior._attach(<any>this); 
		}

		static get observedAttributes() {
			return WjComponentBehavior.getProps(this);
		}

		connectedCallback() {
			this._wjBehaviour.lhConnected();
		}

		attributeChangedCallback(name: string, oldValue: string, newValue: string) {
			this._wjBehaviour.lhAttributeChanged(name, oldValue, newValue);
		}

		disconnectedCallback() {
			this._wjBehaviour.lhDisconnected();
		} 
	}  
    if (_wj_ns_exists_3) {
		WjComponentBehavior.register('wjc-flex-chart-macd', WjcFlexChartMacd); 
	}
  
    export class WjcFlexChartMacdHistogram extends HTMLElement {
        static wrappedClass = () => { return wijmo.chart.finance.analytics.MacdHistogram; };
        static parentProp = 'series';
        static siblingId = 'series'; 
		_wjBehaviour: WjComponentBehavior; 

		constructor() {
			super();
			this._wjBehaviour = WjComponentBehavior._attach(<any>this); 
		}

		static get observedAttributes() {
			return WjComponentBehavior.getProps(this);
		}

		connectedCallback() {
			this._wjBehaviour.lhConnected();
		}

		attributeChangedCallback(name: string, oldValue: string, newValue: string) {
			this._wjBehaviour.lhAttributeChanged(name, oldValue, newValue);
		}

		disconnectedCallback() {
			this._wjBehaviour.lhDisconnected();
		} 
	}  
    if (_wj_ns_exists_3) {
		WjComponentBehavior.register('wjc-flex-chart-macd-histogram', WjcFlexChartMacdHistogram); 
	}
  
    export class WjcFlexChartStochastic extends HTMLElement {
        static wrappedClass = () => { return wijmo.chart.finance.analytics.Stochastic; };
        static parentProp = 'series';
        static siblingId = 'series'; 
		_wjBehaviour: WjComponentBehavior; 

		constructor() {
			super();
			this._wjBehaviour = WjComponentBehavior._attach(<any>this); 
		}

		static get observedAttributes() {
			return WjComponentBehavior.getProps(this);
		}

		connectedCallback() {
			this._wjBehaviour.lhConnected();
		}

		attributeChangedCallback(name: string, oldValue: string, newValue: string) {
			this._wjBehaviour.lhAttributeChanged(name, oldValue, newValue);
		}

		disconnectedCallback() {
			this._wjBehaviour.lhDisconnected();
		} 
	}  
    if (_wj_ns_exists_3) {
		WjComponentBehavior.register('wjc-flex-chart-stochastic', WjcFlexChartStochastic); 
	}
  
    export class WjcFlexChartBollingerBands extends HTMLElement {
        static wrappedClass = () => { return wijmo.chart.finance.analytics.BollingerBands; };
        static parentProp = 'series';
        static siblingId = 'series'; 
		_wjBehaviour: WjComponentBehavior; 

		constructor() {
			super();
			this._wjBehaviour = WjComponentBehavior._attach(<any>this); 
		}

		static get observedAttributes() {
			return WjComponentBehavior.getProps(this);
		}

		connectedCallback() {
			this._wjBehaviour.lhConnected();
		}

		attributeChangedCallback(name: string, oldValue: string, newValue: string) {
			this._wjBehaviour.lhAttributeChanged(name, oldValue, newValue);
		}

		disconnectedCallback() {
			this._wjBehaviour.lhDisconnected();
		} 
	}  
    if (_wj_ns_exists_3) {
		WjComponentBehavior.register('wjc-flex-chart-bollinger-bands', WjcFlexChartBollingerBands); 
	}
  
    export class WjcFlexChartEnvelopes extends HTMLElement {
        static wrappedClass = () => { return wijmo.chart.finance.analytics.Envelopes; };
        static parentProp = 'series';
        static siblingId = 'series'; 
		_wjBehaviour: WjComponentBehavior; 

		constructor() {
			super();
			this._wjBehaviour = WjComponentBehavior._attach(<any>this); 
		}

		static get observedAttributes() {
			return WjComponentBehavior.getProps(this);
		}

		connectedCallback() {
			this._wjBehaviour.lhConnected();
		}

		attributeChangedCallback(name: string, oldValue: string, newValue: string) {
			this._wjBehaviour.lhAttributeChanged(name, oldValue, newValue);
		}

		disconnectedCallback() {
			this._wjBehaviour.lhDisconnected();
		} 
	}  
    if (_wj_ns_exists_3) {
		WjComponentBehavior.register('wjc-flex-chart-envelopes', WjcFlexChartEnvelopes); 
	}
  
    }
    


    module wijmo.webcomponents {
    

    }
    

    module wijmo.webcomponents {
    

let _wj_ns_exists_4 = wijmo.webcomponents.WjComponentBehavior.ensureNs('wijmo.chart.finance', 'FinancialChart', 'FinancialSeries');









    export class WjcFinancialChart extends wijmo.chart.finance.FinancialChart { 
		_wjBehaviour: WjComponentBehavior; 

		constructor() {
			super(document.createElement('div'));
			this._wjBehaviour = WjComponentBehavior._attach(<any>this); 
		}

		static get observedAttributes() {
			return WjComponentBehavior.getProps(this);
		}

		connectedCallback() {
			this._wjBehaviour.lhConnected();
		}

		attributeChangedCallback(name: string, oldValue: string, newValue: string) {
			this._wjBehaviour.lhAttributeChanged(name, oldValue, newValue);
		}

		disconnectedCallback() {
			this._wjBehaviour.lhDisconnected();
		}

        addEventListener(...args) {
            if (typeof args[0] === 'string') {
                HTMLElement.prototype.addEventListener.apply(this, args);
            } else {
                super.addEventListener.apply(this, args);
            }
        } 
	}  
    if (_wj_ns_exists_4) {
		WjComponentBehavior.register('wjc-financial-chart', WjcFinancialChart); 
	}
  
    export class WjcFinancialChartSeries extends HTMLElement {
        static wrappedClass = () => { return wijmo.chart.finance.FinancialSeries; };
        static parentProp = 'series';
        static siblingId = 'series'; 
		_wjBehaviour: WjComponentBehavior; 

		constructor() {
			super();
			this._wjBehaviour = WjComponentBehavior._attach(<any>this); 
		}

		static get observedAttributes() {
			return WjComponentBehavior.getProps(this);
		}

		connectedCallback() {
			this._wjBehaviour.lhConnected();
		}

		attributeChangedCallback(name: string, oldValue: string, newValue: string) {
			this._wjBehaviour.lhAttributeChanged(name, oldValue, newValue);
		}

		disconnectedCallback() {
			this._wjBehaviour.lhDisconnected();
		} 
	}  
    if (_wj_ns_exists_4) {
		WjComponentBehavior.register('wjc-financial-chart-series', WjcFinancialChartSeries); 
	}
  
    }
    


    module wijmo.webcomponents {
    

    }
    

    module wijmo.webcomponents {
    

let _wj_ns_exists_5 = wijmo.webcomponents.WjComponentBehavior.ensureNs('wijmo.chart.hierarchical', 'Sunburst', 'TreeMap');









    export class WjcSunburst extends wijmo.chart.hierarchical.Sunburst { 
		_wjBehaviour: WjComponentBehavior; 

		constructor() {
			super(document.createElement('div'));
			this._wjBehaviour = WjComponentBehavior._attach(<any>this); 
		}

		static get observedAttributes() {
			return WjComponentBehavior.getProps(this);
		}

		connectedCallback() {
			this._wjBehaviour.lhConnected();
		}

		attributeChangedCallback(name: string, oldValue: string, newValue: string) {
			this._wjBehaviour.lhAttributeChanged(name, oldValue, newValue);
		}

		disconnectedCallback() {
			this._wjBehaviour.lhDisconnected();
		}

        addEventListener(...args) {
            if (typeof args[0] === 'string') {
                HTMLElement.prototype.addEventListener.apply(this, args);
            } else {
                super.addEventListener.apply(this, args);
            }
        } 
	}  
    if (_wj_ns_exists_5) {
		WjComponentBehavior.register('wjc-sunburst', WjcSunburst); 
	}
  
    export class WjcTreeMap extends wijmo.chart.hierarchical.TreeMap { 
		_wjBehaviour: WjComponentBehavior; 

		constructor() {
			super(document.createElement('div'));
			this._wjBehaviour = WjComponentBehavior._attach(<any>this); 
		}

		static get observedAttributes() {
			return WjComponentBehavior.getProps(this);
		}

		connectedCallback() {
			this._wjBehaviour.lhConnected();
		}

		attributeChangedCallback(name: string, oldValue: string, newValue: string) {
			this._wjBehaviour.lhAttributeChanged(name, oldValue, newValue);
		}

		disconnectedCallback() {
			this._wjBehaviour.lhDisconnected();
		}

        addEventListener(...args) {
            if (typeof args[0] === 'string') {
                HTMLElement.prototype.addEventListener.apply(this, args);
            } else {
                super.addEventListener.apply(this, args);
            }
        } 
	}  
    if (_wj_ns_exists_5) {
		WjComponentBehavior.register('wjc-tree-map', WjcTreeMap); 
	}
  
    }
    


    module wijmo.webcomponents {
    

    }
    

    module wijmo.webcomponents {
    

let _wj_ns_exists_6 = wijmo.webcomponents.WjComponentBehavior.ensureNs('wijmo.chart.interaction', 'RangeSelector', 'ChartGestures');









    export class WjcFlexChartRangeSelector extends HTMLElement {
        static wrappedClass = () => { return wijmo.chart.interaction.RangeSelector; };
        static parentInCtor = true; 
		_wjBehaviour: WjComponentBehavior; 

		constructor() {
			super();
			this._wjBehaviour = WjComponentBehavior._attach(<any>this); 
		}

		static get observedAttributes() {
			return WjComponentBehavior.getProps(this);
		}

		connectedCallback() {
			this._wjBehaviour.lhConnected();
		}

		attributeChangedCallback(name: string, oldValue: string, newValue: string) {
			this._wjBehaviour.lhAttributeChanged(name, oldValue, newValue);
		}

		disconnectedCallback() {
			this._wjBehaviour.lhDisconnected();
		} 
	}  
    if (_wj_ns_exists_6) {
		WjComponentBehavior.register('wjc-flex-chart-range-selector', WjcFlexChartRangeSelector); 
	}
  
    export class WjcFlexChartGestures extends HTMLElement {
        static wrappedClass = () => { return wijmo.chart.interaction.ChartGestures; };
        static parentInCtor = true; 
		_wjBehaviour: WjComponentBehavior; 

		constructor() {
			super();
			this._wjBehaviour = WjComponentBehavior._attach(<any>this); 
		}

		static get observedAttributes() {
			return WjComponentBehavior.getProps(this);
		}

		connectedCallback() {
			this._wjBehaviour.lhConnected();
		}

		attributeChangedCallback(name: string, oldValue: string, newValue: string) {
			this._wjBehaviour.lhAttributeChanged(name, oldValue, newValue);
		}

		disconnectedCallback() {
			this._wjBehaviour.lhDisconnected();
		} 
	}  
    if (_wj_ns_exists_6) {
		WjComponentBehavior.register('wjc-flex-chart-gestures', WjcFlexChartGestures); 
	}
  
    }
    


    module wijmo.webcomponents {
    

    }
    

    module wijmo.webcomponents {
    

let _wj_ns_exists_7 = wijmo.webcomponents.WjComponentBehavior.ensureNs('wijmo.chart.radar', 'FlexRadar', 'FlexRadarAxis', 'FlexRadarSeries');









    export class WjcFlexRadar extends wijmo.chart.radar.FlexRadar { 
		_wjBehaviour: WjComponentBehavior; 

		constructor() {
			super(document.createElement('div'));
			this._wjBehaviour = WjComponentBehavior._attach(<any>this); 
		}

		static get observedAttributes() {
			return WjComponentBehavior.getProps(this);
		}

		connectedCallback() {
			this._wjBehaviour.lhConnected();
		}

		attributeChangedCallback(name: string, oldValue: string, newValue: string) {
			this._wjBehaviour.lhAttributeChanged(name, oldValue, newValue);
		}

		disconnectedCallback() {
			this._wjBehaviour.lhDisconnected();
		}

        addEventListener(...args) {
            if (typeof args[0] === 'string') {
                HTMLElement.prototype.addEventListener.apply(this, args);
            } else {
                super.addEventListener.apply(this, args);
            }
        } 
	}  
    if (_wj_ns_exists_7) {
		WjComponentBehavior.register('wjc-flex-radar', WjcFlexRadar); 
	}
  
    export class WjcFlexRadarAxis extends HTMLElement {
        static wrappedClass = () => { return wijmo.chart.radar.FlexRadarAxis; };
        static parentProp = 'axes'; 
		_wjBehaviour: WjComponentBehavior; 

		constructor() {
			super();
			this._wjBehaviour = WjComponentBehavior._attach(<any>this); 
		}

		static get observedAttributes() {
			return WjComponentBehavior.getProps(this);
		}

		connectedCallback() {
			this._wjBehaviour.lhConnected();
		}

		attributeChangedCallback(name: string, oldValue: string, newValue: string) {
			this._wjBehaviour.lhAttributeChanged(name, oldValue, newValue);
		}

		disconnectedCallback() {
			this._wjBehaviour.lhDisconnected();
		} 
	}  
    if (_wj_ns_exists_7) {
		WjComponentBehavior.register('wjc-flex-radar-axis', WjcFlexRadarAxis); 
	}
  
    export class WjcFlexRadarSeries extends HTMLElement {
        static wrappedClass = () => { return wijmo.chart.radar.FlexRadarSeries; };
        static parentProp = 'series';
        static siblingId = 'series'; 
		_wjBehaviour: WjComponentBehavior; 

		constructor() {
			super();
			this._wjBehaviour = WjComponentBehavior._attach(<any>this); 
		}

		static get observedAttributes() {
			return WjComponentBehavior.getProps(this);
		}

		connectedCallback() {
			this._wjBehaviour.lhConnected();
		}

		attributeChangedCallback(name: string, oldValue: string, newValue: string) {
			this._wjBehaviour.lhAttributeChanged(name, oldValue, newValue);
		}

		disconnectedCallback() {
			this._wjBehaviour.lhDisconnected();
		} 
	}  
    if (_wj_ns_exists_7) {
		WjComponentBehavior.register('wjc-flex-radar-series', WjcFlexRadarSeries); 
	}
  
    }
    


    module wijmo.webcomponents {
    

    }
    

    module wijmo.webcomponents {
    

let _wj_ns_exists_8 = wijmo.webcomponents.WjComponentBehavior.ensureNs('wijmo.chart', 'FlexChart', 'FlexPie', 'Axis', 'Legend', 'DataLabel', 'PieDataLabel', 'Series', 'LineMarker', 'DataPoint', 'PlotArea');









    export class WjcFlexChart extends wijmo.chart.FlexChart { 
		_wjBehaviour: WjComponentBehavior; 

		constructor() {
			super(document.createElement('div'));
			this._wjBehaviour = WjComponentBehavior._attach(<any>this); 
		}

		static get observedAttributes() {
			return WjComponentBehavior.getProps(this);
		}

		connectedCallback() {
			this._wjBehaviour.lhConnected();
		}

		attributeChangedCallback(name: string, oldValue: string, newValue: string) {
			this._wjBehaviour.lhAttributeChanged(name, oldValue, newValue);
		}

		disconnectedCallback() {
			this._wjBehaviour.lhDisconnected();
		}

        addEventListener(...args) {
            if (typeof args[0] === 'string') {
                HTMLElement.prototype.addEventListener.apply(this, args);
            } else {
                super.addEventListener.apply(this, args);
            }
        } 
	}  
    if (_wj_ns_exists_8) {
		WjComponentBehavior.register('wjc-flex-chart', WjcFlexChart); 
	}
  
    export class WjcFlexPie extends wijmo.chart.FlexPie { 
		_wjBehaviour: WjComponentBehavior; 

		constructor() {
			super(document.createElement('div'));
			this._wjBehaviour = WjComponentBehavior._attach(<any>this); 
		}

		static get observedAttributes() {
			return WjComponentBehavior.getProps(this);
		}

		connectedCallback() {
			this._wjBehaviour.lhConnected();
		}

		attributeChangedCallback(name: string, oldValue: string, newValue: string) {
			this._wjBehaviour.lhAttributeChanged(name, oldValue, newValue);
		}

		disconnectedCallback() {
			this._wjBehaviour.lhDisconnected();
		}

        addEventListener(...args) {
            if (typeof args[0] === 'string') {
                HTMLElement.prototype.addEventListener.apply(this, args);
            } else {
                super.addEventListener.apply(this, args);
            }
        } 
	}  
    if (_wj_ns_exists_8) {
		WjComponentBehavior.register('wjc-flex-pie', WjcFlexPie); 
	}
  
    export class WjcFlexChartAxis extends HTMLElement {
        static wrappedClass = () => { return wijmo.chart.Axis; };
        static parentProp = 'axes'; 
		_wjBehaviour: WjComponentBehavior; 

		constructor() {
			super();
			this._wjBehaviour = WjComponentBehavior._attach(<any>this); 
		}

		static get observedAttributes() {
			return WjComponentBehavior.getProps(this);
		}

		connectedCallback() {
			this._wjBehaviour.lhConnected();
		}

		attributeChangedCallback(name: string, oldValue: string, newValue: string) {
			this._wjBehaviour.lhAttributeChanged(name, oldValue, newValue);
		}

		disconnectedCallback() {
			this._wjBehaviour.lhDisconnected();
		} 
	}  
    if (_wj_ns_exists_8) {
		WjComponentBehavior.register('wjc-flex-chart-axis', WjcFlexChartAxis); 
	}
  
    export class WjcFlexChartLegend extends HTMLElement {
        static wrappedClass = () => { return wijmo.chart.Legend; };
        static parentProp = 'legend';
        static parentInCtor = true; 
		_wjBehaviour: WjComponentBehavior; 

		constructor() {
			super();
			this._wjBehaviour = WjComponentBehavior._attach(<any>this); 
		}

		static get observedAttributes() {
			return WjComponentBehavior.getProps(this);
		}

		connectedCallback() {
			this._wjBehaviour.lhConnected();
		}

		attributeChangedCallback(name: string, oldValue: string, newValue: string) {
			this._wjBehaviour.lhAttributeChanged(name, oldValue, newValue);
		}

		disconnectedCallback() {
			this._wjBehaviour.lhDisconnected();
		} 
	}  
    if (_wj_ns_exists_8) {
		WjComponentBehavior.register('wjc-flex-chart-legend', WjcFlexChartLegend); 
	}
  
    export class WjcFlexChartDataLabel extends HTMLElement {
        static wrappedClass = () => { return wijmo.chart.DataLabel; };
        static parentProp = 'dataLabel'; 
		_wjBehaviour: WjComponentBehavior; 

		constructor() {
			super();
			this._wjBehaviour = WjComponentBehavior._attach(<any>this); 
		}

		static get observedAttributes() {
			return WjComponentBehavior.getProps(this);
		}

		connectedCallback() {
			this._wjBehaviour.lhConnected();
		}

		attributeChangedCallback(name: string, oldValue: string, newValue: string) {
			this._wjBehaviour.lhAttributeChanged(name, oldValue, newValue);
		}

		disconnectedCallback() {
			this._wjBehaviour.lhDisconnected();
		} 
	}  
    if (_wj_ns_exists_8) {
		WjComponentBehavior.register('wjc-flex-chart-data-label', WjcFlexChartDataLabel); 
	}
  
    export class WjcFlexPieDataLabel extends HTMLElement {
        static wrappedClass = () => { return wijmo.chart.PieDataLabel; };
        static parentProp = 'dataLabel'; 
		_wjBehaviour: WjComponentBehavior; 

		constructor() {
			super();
			this._wjBehaviour = WjComponentBehavior._attach(<any>this); 
		}

		static get observedAttributes() {
			return WjComponentBehavior.getProps(this);
		}

		connectedCallback() {
			this._wjBehaviour.lhConnected();
		}

		attributeChangedCallback(name: string, oldValue: string, newValue: string) {
			this._wjBehaviour.lhAttributeChanged(name, oldValue, newValue);
		}

		disconnectedCallback() {
			this._wjBehaviour.lhDisconnected();
		} 
	}  
    if (_wj_ns_exists_8) {
		WjComponentBehavior.register('wjc-flex-pie-data-label', WjcFlexPieDataLabel); 
	}
  
    export class WjcFlexChartSeries extends HTMLElement {
        static wrappedClass = () => { return wijmo.chart.Series; };
        static parentProp = 'series';
        static siblingId = 'series'; 
		_wjBehaviour: WjComponentBehavior; 

		constructor() {
			super();
			this._wjBehaviour = WjComponentBehavior._attach(<any>this); 
		}

		static get observedAttributes() {
			return WjComponentBehavior.getProps(this);
		}

		connectedCallback() {
			this._wjBehaviour.lhConnected();
		}

		attributeChangedCallback(name: string, oldValue: string, newValue: string) {
			this._wjBehaviour.lhAttributeChanged(name, oldValue, newValue);
		}

		disconnectedCallback() {
			this._wjBehaviour.lhDisconnected();
		} 
	}  
    if (_wj_ns_exists_8) {
		WjComponentBehavior.register('wjc-flex-chart-series', WjcFlexChartSeries); 
	}
  
    export class WjcFlexChartLineMarker extends HTMLElement {
        static wrappedClass = () => { return wijmo.chart.LineMarker; };
        static parentInCtor = true; 
		_wjBehaviour: WjComponentBehavior; 

		constructor() {
			super();
			this._wjBehaviour = WjComponentBehavior._attach(<any>this); 
		}

		static get observedAttributes() {
			return WjComponentBehavior.getProps(this);
		}

		connectedCallback() {
			this._wjBehaviour.lhConnected();
		}

		attributeChangedCallback(name: string, oldValue: string, newValue: string) {
			this._wjBehaviour.lhAttributeChanged(name, oldValue, newValue);
		}

		disconnectedCallback() {
			this._wjBehaviour.lhDisconnected();
		} 
	}  
    if (_wj_ns_exists_8) {
		WjComponentBehavior.register('wjc-flex-chart-line-marker', WjcFlexChartLineMarker); 
	}
  
    export class WjcFlexChartDataPoint extends HTMLElement {
        static wrappedClass = () => { return wijmo.chart.DataPoint; };
        static parentProp = ''; 
		_wjBehaviour: WjComponentBehavior; 

		constructor() {
			super();
			this._wjBehaviour = WjComponentBehavior._attach(<any>this); 
		}

		static get observedAttributes() {
			return WjComponentBehavior.getProps(this);
		}

		connectedCallback() {
			this._wjBehaviour.lhConnected();
		}

		attributeChangedCallback(name: string, oldValue: string, newValue: string) {
			this._wjBehaviour.lhAttributeChanged(name, oldValue, newValue);
		}

		disconnectedCallback() {
			this._wjBehaviour.lhDisconnected();
		} 
	}  
    if (_wj_ns_exists_8) {
		WjComponentBehavior.register('wjc-flex-chart-data-point', WjcFlexChartDataPoint); 
	}
  
    export class WjcFlexChartPlotArea extends HTMLElement {
        static wrappedClass = () => { return wijmo.chart.PlotArea; };
        static parentProp = 'plotAreas'; 
		_wjBehaviour: WjComponentBehavior; 

		constructor() {
			super();
			this._wjBehaviour = WjComponentBehavior._attach(<any>this); 
		}

		static get observedAttributes() {
			return WjComponentBehavior.getProps(this);
		}

		connectedCallback() {
			this._wjBehaviour.lhConnected();
		}

		attributeChangedCallback(name: string, oldValue: string, newValue: string) {
			this._wjBehaviour.lhAttributeChanged(name, oldValue, newValue);
		}

		disconnectedCallback() {
			this._wjBehaviour.lhDisconnected();
		} 
	}  
    if (_wj_ns_exists_8) {
		WjComponentBehavior.register('wjc-flex-chart-plot-area', WjcFlexChartPlotArea); 
	}
  
    }
    


    module wijmo.webcomponents {
    

    }
    

    module wijmo.webcomponents {
    

let _wj_ns_exists_9 = wijmo.webcomponents.WjComponentBehavior.ensureNs('wijmo.gauge', 'LinearGauge', 'BulletGraph', 'RadialGauge', 'Range');









    export class WjcLinearGauge extends wijmo.gauge.LinearGauge { 
		_wjBehaviour: WjComponentBehavior; 

		constructor() {
			super(document.createElement('div'));
			this._wjBehaviour = WjComponentBehavior._attach(<any>this); 
		}

		static get observedAttributes() {
			return WjComponentBehavior.getProps(this);
		}

		connectedCallback() {
			this._wjBehaviour.lhConnected();
		}

		attributeChangedCallback(name: string, oldValue: string, newValue: string) {
			this._wjBehaviour.lhAttributeChanged(name, oldValue, newValue);
		}

		disconnectedCallback() {
			this._wjBehaviour.lhDisconnected();
		}

        addEventListener(...args) {
            if (typeof args[0] === 'string') {
                HTMLElement.prototype.addEventListener.apply(this, args);
            } else {
                super.addEventListener.apply(this, args);
            }
        } 
	}  
    if (_wj_ns_exists_9) {
		WjComponentBehavior.register('wjc-linear-gauge', WjcLinearGauge); 
	}
  
    export class WjcBulletGraph extends wijmo.gauge.BulletGraph { 
		_wjBehaviour: WjComponentBehavior; 

		constructor() {
			super(document.createElement('div'));
			this._wjBehaviour = WjComponentBehavior._attach(<any>this); 
		}

		static get observedAttributes() {
			return WjComponentBehavior.getProps(this);
		}

		connectedCallback() {
			this._wjBehaviour.lhConnected();
		}

		attributeChangedCallback(name: string, oldValue: string, newValue: string) {
			this._wjBehaviour.lhAttributeChanged(name, oldValue, newValue);
		}

		disconnectedCallback() {
			this._wjBehaviour.lhDisconnected();
		}

        addEventListener(...args) {
            if (typeof args[0] === 'string') {
                HTMLElement.prototype.addEventListener.apply(this, args);
            } else {
                super.addEventListener.apply(this, args);
            }
        } 
	}  
    if (_wj_ns_exists_9) {
		WjComponentBehavior.register('wjc-bullet-graph', WjcBulletGraph); 
	}
  
    export class WjcRadialGauge extends wijmo.gauge.RadialGauge { 
		_wjBehaviour: WjComponentBehavior; 

		constructor() {
			super(document.createElement('div'));
			this._wjBehaviour = WjComponentBehavior._attach(<any>this); 
		}

		static get observedAttributes() {
			return WjComponentBehavior.getProps(this);
		}

		connectedCallback() {
			this._wjBehaviour.lhConnected();
		}

		attributeChangedCallback(name: string, oldValue: string, newValue: string) {
			this._wjBehaviour.lhAttributeChanged(name, oldValue, newValue);
		}

		disconnectedCallback() {
			this._wjBehaviour.lhDisconnected();
		}

        addEventListener(...args) {
            if (typeof args[0] === 'string') {
                HTMLElement.prototype.addEventListener.apply(this, args);
            } else {
                super.addEventListener.apply(this, args);
            }
        } 
	}  
    if (_wj_ns_exists_9) {
		WjComponentBehavior.register('wjc-radial-gauge', WjcRadialGauge); 
	}
  
    export class WjcRange extends HTMLElement {
        static wrappedClass = () => { return wijmo.gauge.Range; };
        static parentProp = 'ranges'; 
		_wjBehaviour: WjComponentBehavior; 

		constructor() {
			super();
			this._wjBehaviour = WjComponentBehavior._attach(<any>this); 
		}

		static get observedAttributes() {
			return WjComponentBehavior.getProps(this);
		}

		connectedCallback() {
			this._wjBehaviour.lhConnected();
		}

		attributeChangedCallback(name: string, oldValue: string, newValue: string) {
			this._wjBehaviour.lhAttributeChanged(name, oldValue, newValue);
		}

		disconnectedCallback() {
			this._wjBehaviour.lhDisconnected();
		} 
	}  
    if (_wj_ns_exists_9) {
		WjComponentBehavior.register('wjc-range', WjcRange); 
	}
  
    }
    


    module wijmo.webcomponents {
    

    }
    

    module wijmo.webcomponents {
    

let _wj_ns_exists_10 = wijmo.webcomponents.WjComponentBehavior.ensureNs('wijmo.grid.filter', 'FlexGridFilter');









    export class WjcFlexGridFilter extends HTMLElement {
        static wrappedClass = () => { return wijmo.grid.filter.FlexGridFilter; };
        static parentInCtor = true; 
		_wjBehaviour: WjComponentBehavior; 

		constructor() {
			super();
			this._wjBehaviour = WjComponentBehavior._attach(<any>this); 
		}

		static get observedAttributes() {
			return WjComponentBehavior.getProps(this);
		}

		connectedCallback() {
			this._wjBehaviour.lhConnected();
		}

		attributeChangedCallback(name: string, oldValue: string, newValue: string) {
			this._wjBehaviour.lhAttributeChanged(name, oldValue, newValue);
		}

		disconnectedCallback() {
			this._wjBehaviour.lhDisconnected();
		} 
	}  
    if (_wj_ns_exists_10) {
		WjComponentBehavior.register('wjc-flex-grid-filter', WjcFlexGridFilter);
		WjComponentBehavior.register('', wijmo.grid.filter.ColumnFilterEditor);
		WjComponentBehavior.register('', wijmo.grid.filter.ConditionFilterEditor);
		WjComponentBehavior.register('', wijmo.grid.filter.ValueFilterEditor); 
	}
  
    }
    


    module wijmo.webcomponents {
    

    }
    

    module wijmo.webcomponents {
    

let _wj_ns_exists_11 = wijmo.webcomponents.WjComponentBehavior.ensureNs('wijmo.grid.grouppanel', 'GroupPanel');









    export class WjcGroupPanel extends wijmo.grid.grouppanel.GroupPanel { 
		_wjBehaviour: WjComponentBehavior; 

		constructor() {
			super(document.createElement('div'));
			this._wjBehaviour = WjComponentBehavior._attach(<any>this); 
		}

		static get observedAttributes() {
			return WjComponentBehavior.getProps(this);
		}

		connectedCallback() {
			this._wjBehaviour.lhConnected();
		}

		attributeChangedCallback(name: string, oldValue: string, newValue: string) {
			this._wjBehaviour.lhAttributeChanged(name, oldValue, newValue);
		}

		disconnectedCallback() {
			this._wjBehaviour.lhDisconnected();
		}

        addEventListener(...args) {
            if (typeof args[0] === 'string') {
                HTMLElement.prototype.addEventListener.apply(this, args);
            } else {
                super.addEventListener.apply(this, args);
            }
        } 
	}  
    if (_wj_ns_exists_11) {
		WjComponentBehavior.register('wjc-group-panel', WjcGroupPanel); 
	}
  
    }
    


    module wijmo.webcomponents {
    

    }
    

    module wijmo.webcomponents {
    

let _wj_ns_exists_12 = wijmo.webcomponents.WjComponentBehavior.ensureNs('wijmo.grid.search', 'FlexGridSearch');









    export class WjcFlexGridSearch extends wijmo.grid.search.FlexGridSearch { 
		_wjBehaviour: WjComponentBehavior; 

		constructor() {
			super(document.createElement('div'));
			this._wjBehaviour = WjComponentBehavior._attach(<any>this); 
		}

		static get observedAttributes() {
			return WjComponentBehavior.getProps(this);
		}

		connectedCallback() {
			this._wjBehaviour.lhConnected();
		}

		attributeChangedCallback(name: string, oldValue: string, newValue: string) {
			this._wjBehaviour.lhAttributeChanged(name, oldValue, newValue);
		}

		disconnectedCallback() {
			this._wjBehaviour.lhDisconnected();
		}

        addEventListener(...args) {
            if (typeof args[0] === 'string') {
                HTMLElement.prototype.addEventListener.apply(this, args);
            } else {
                super.addEventListener.apply(this, args);
            }
        } 
	}  
    if (_wj_ns_exists_12) {
		WjComponentBehavior.register('wjc-flex-grid-search', WjcFlexGridSearch); 
	}
  
    }
    


    module wijmo.webcomponents {
    

    }
    

    module wijmo.webcomponents {
    

let _wj_ns_exists_17 = wijmo.webcomponents.WjComponentBehavior.ensureNs('wijmo.grid', 'FlexGrid', 'Column', 'ColumnGroup');












    export class WjcFlexGrid extends wijmo.grid.FlexGrid { 
		_wjBehaviour: WjComponentBehavior; 

		constructor() {
			super(document.createElement('div'));
			this._wjBehaviour = WjComponentBehavior._attach(<any>this); 
		}

		static get observedAttributes() {
			return WjComponentBehavior.getProps(this);
		}

		connectedCallback() {
			this._wjBehaviour.lhConnected();
		}

		attributeChangedCallback(name: string, oldValue: string, newValue: string) {
			this._wjBehaviour.lhAttributeChanged(name, oldValue, newValue);
		}

		disconnectedCallback() {
			this._wjBehaviour.lhDisconnected();
		}

        addEventListener(...args) {
            if (typeof args[0] === 'string') {
                HTMLElement.prototype.addEventListener.apply(this, args);
            } else {
                super.addEventListener.apply(this, args);
            }
        } 
	}  
    if (_wj_ns_exists_17) {
		WjComponentBehavior.register('wjc-flex-grid', WjcFlexGrid); 
	}
  
    export class WjcFlexGridColumn extends HTMLElement {
	    
        static wrappedClass = () => { return wijmo.grid.Column; };
        static parentProp = 'columns'; 
		_wjBehaviour: WjComponentBehavior; 

		constructor() {
			super();
			this._wjBehaviour = WjComponentBehavior._attach(<any>this); 
		}

		static get observedAttributes() {
			return WjComponentBehavior.getProps(this);
		}

		connectedCallback() {
			this._wjBehaviour.lhConnected();
		}

		attributeChangedCallback(name: string, oldValue: string, newValue: string) {
			this._wjBehaviour.lhAttributeChanged(name, oldValue, newValue);
		}

		disconnectedCallback() {
			this._wjBehaviour.lhDisconnected();
		}

        _beforeInitParent() {
            let gridCmp = <wijmo.grid.FlexGrid>(<any>this).parentElement.control;
            if (gridCmp.autoGenerateColumns) {
                gridCmp.autoGenerateColumns = false;
                gridCmp.columns.clear();
            }
        } 
	}  
    if (_wj_ns_exists_17) {
		WjComponentBehavior.register('wjc-flex-grid-column', WjcFlexGridColumn); 
	}
  
    export class WjcFlexGridColumnGroup extends HTMLElement {
        static wrappedClass = () => { return wijmo.grid.ColumnGroup; };
        static parentProp = 'columnGroups'; 
		_wjBehaviour: WjComponentBehavior; 

		constructor() {
			super();
			this._wjBehaviour = WjComponentBehavior._attach(<any>this); 
		}

		static get observedAttributes() {
			return WjComponentBehavior.getProps(this);
		}

		connectedCallback() {
			this._wjBehaviour.lhConnected();
		}

		attributeChangedCallback(name: string, oldValue: string, newValue: string) {
			this._wjBehaviour.lhAttributeChanged(name, oldValue, newValue);
		}

		disconnectedCallback() {
			this._wjBehaviour.lhDisconnected();
		} 
	}  
    if (_wj_ns_exists_17) {
		WjComponentBehavior.register('wjc-flex-grid-column-group', WjcFlexGridColumnGroup); 
	}
  
    }
    


    module wijmo.webcomponents {
    

    }
    

    module wijmo.webcomponents {
    

let _wj_ns_exists_13 = wijmo.webcomponents.WjComponentBehavior.ensureNs('wijmo.grid.multirow', 'MultiRow', 'MultiRowCell', 'MultiRowCellGroup');











    export class WjcMultiRow extends wijmo.grid.multirow.MultiRow { 
		_wjBehaviour: WjComponentBehavior; 

		constructor() {
			super(document.createElement('div'));
			this._wjBehaviour = WjComponentBehavior._attach(<any>this); 
		}

		static get observedAttributes() {
			return WjComponentBehavior.getProps(this);
		}

		connectedCallback() {
			this._wjBehaviour.lhConnected();
		}

		attributeChangedCallback(name: string, oldValue: string, newValue: string) {
			this._wjBehaviour.lhAttributeChanged(name, oldValue, newValue);
		}

		disconnectedCallback() {
			this._wjBehaviour.lhDisconnected();
		}

        addEventListener(...args) {
            if (typeof args[0] === 'string') {
                HTMLElement.prototype.addEventListener.apply(this, args);
            } else {
                super.addEventListener.apply(this, args);
            }
        } 
	}  
    if (_wj_ns_exists_13) {
		WjComponentBehavior.register('wjc-multi-row', WjcMultiRow); 
	}
  
    export class WjcMultiRowCell extends HTMLElement {
        static wrappedClass = () => { return wijmo.grid.multirow.MultiRowCell; };
        static parentProp = 'cells'; 
		_wjBehaviour: WjComponentBehavior; 

		constructor() {
			super();
			this._wjBehaviour = WjComponentBehavior._attach(<any>this); 
		}

		static get observedAttributes() {
			return WjComponentBehavior.getProps(this);
		}

		connectedCallback() {
			this._wjBehaviour.lhConnected();
		}

		attributeChangedCallback(name: string, oldValue: string, newValue: string) {
			this._wjBehaviour.lhAttributeChanged(name, oldValue, newValue);
		}

		disconnectedCallback() {
			this._wjBehaviour.lhDisconnected();
		} 
	}  
    if (_wj_ns_exists_13) {
		WjComponentBehavior.register('wjc-multi-row-cell', WjcMultiRowCell); 
	}
  
    export class WjcMultiRowCellGroup extends HTMLElement {
        static wrappedClass = () => { return wijmo.grid.multirow.MultiRowCellGroup; };
        static parentProp = 'layoutDefinition'; 
		_wjBehaviour: WjComponentBehavior; 

		constructor() {
			super();
			this._wjBehaviour = WjComponentBehavior._attach(<any>this); 
		}

		static get observedAttributes() {
			return WjComponentBehavior.getProps(this);
		}

		connectedCallback() {
			this._wjBehaviour.lhConnected();
		}

		attributeChangedCallback(name: string, oldValue: string, newValue: string) {
			this._wjBehaviour.lhAttributeChanged(name, oldValue, newValue);
		}

		disconnectedCallback() {
			this._wjBehaviour.lhDisconnected();
		} 
	}  
    if (_wj_ns_exists_13) {
		WjComponentBehavior.register('wjc-multi-row-cell-group', WjcMultiRowCellGroup); 
	}
  
    }
    


    module wijmo.webcomponents {
    

    }
    

    module wijmo.webcomponents {
    

let _wj_ns_exists_14 = wijmo.webcomponents.WjComponentBehavior.ensureNs('wijmo.grid.sheet', 'FlexSheet', 'Sheet');









    export class WjcFlexSheet extends wijmo.grid.sheet.FlexSheet { 
		_wjBehaviour: WjComponentBehavior; 

		constructor() {
			super(document.createElement('div'));
			this._wjBehaviour = WjComponentBehavior._attach(<any>this); 
		}

		static get observedAttributes() {
			return WjComponentBehavior.getProps(this);
		}

		connectedCallback() {
			this._wjBehaviour.lhConnected();
		}

		attributeChangedCallback(name: string, oldValue: string, newValue: string) {
			this._wjBehaviour.lhAttributeChanged(name, oldValue, newValue);
		}

		disconnectedCallback() {
			this._wjBehaviour.lhDisconnected();
		}

        addEventListener(...args) {
            if (typeof args[0] === 'string') {
                HTMLElement.prototype.addEventListener.apply(this, args);
            } else {
                super.addEventListener.apply(this, args);
            }
        } 
	}  
    if (_wj_ns_exists_14) {
		WjComponentBehavior.register('', wijmo.grid.sheet._TabHolder);
		WjComponentBehavior.register('', wijmo.grid.sheet._ContextMenu);
        WjComponentBehavior.register('', wijmo.grid.sheet._SheetContextMenu);
        WjComponentBehavior.register('', wijmo.grid.sheet._SheetTabContextMenu);
		WjComponentBehavior.register('', wijmo.grid.sheet.FlexSheetColumnFilterEditor);
		WjComponentBehavior.register('', wijmo.grid.sheet.FlexSheetValueFilterEditor);
		WjComponentBehavior.register('', wijmo.grid.sheet._SheetTabs);
    
		WjComponentBehavior.register('wjc-flex-sheet', WjcFlexSheet); 
	}
  
    export class WjcSheet extends HTMLElement {
        static wrappedClass = () => { return wijmo.grid.sheet.Sheet; };
        static parentProp = 'sheets';
        static parentInCtor = true; 
		_wjBehaviour: WjComponentBehavior; 

		constructor() {
			super();
			this._wjBehaviour = WjComponentBehavior._attach(<any>this); 
		}

		static get observedAttributes() {
			return WjComponentBehavior.getProps(this);
		}

		connectedCallback() {
			this._wjBehaviour.lhConnected();
		}

		attributeChangedCallback(name: string, oldValue: string, newValue: string) {
			this._wjBehaviour.lhAttributeChanged(name, oldValue, newValue);
		}

		disconnectedCallback() {
			this._wjBehaviour.lhDisconnected();
		} 
	}  
    if (_wj_ns_exists_14) {
		WjComponentBehavior.register('wjc-sheet', WjcSheet); 
	}
  
    }
    


    module wijmo.webcomponents {
    

    }
    

    module wijmo.webcomponents {
    

let _wj_ns_exists_15 = wijmo.webcomponents.WjComponentBehavior.ensureNs('wijmo.grid.transposed', 'TransposedGrid', 'TransposedGridRow');









    export class WjcTransposedGrid extends wijmo.grid.transposed.TransposedGrid { 
		_wjBehaviour: WjComponentBehavior; 

		constructor() {
			super(document.createElement('div'));
			this._wjBehaviour = WjComponentBehavior._attach(<any>this); 
		}

		static get observedAttributes() {
			return WjComponentBehavior.getProps(this);
		}

		connectedCallback() {
			this._wjBehaviour.lhConnected();
		}

		attributeChangedCallback(name: string, oldValue: string, newValue: string) {
			this._wjBehaviour.lhAttributeChanged(name, oldValue, newValue);
		}

		disconnectedCallback() {
			this._wjBehaviour.lhDisconnected();
		}

        addEventListener(...args) {
            if (typeof args[0] === 'string') {
                HTMLElement.prototype.addEventListener.apply(this, args);
            } else {
                super.addEventListener.apply(this, args);
            }
        } 
	}  
    if (_wj_ns_exists_15) {
		WjComponentBehavior.register('wjc-transposed-grid', WjcTransposedGrid); 
	}
  
    export class WjcTransposedGridRow extends HTMLElement {
	    
        static wrappedClass = () => { return wijmo.grid.transposed.TransposedGridRow; };
        static parentProp = '_rowInfo'; 
		_wjBehaviour: WjComponentBehavior; 

		constructor() {
			super();
			this._wjBehaviour = WjComponentBehavior._attach(<any>this); 
		}

		static get observedAttributes() {
			return WjComponentBehavior.getProps(this);
		}

		connectedCallback() {
			this._wjBehaviour.lhConnected();
		}

		attributeChangedCallback(name: string, oldValue: string, newValue: string) {
			this._wjBehaviour.lhAttributeChanged(name, oldValue, newValue);
		}

		disconnectedCallback() {
			this._wjBehaviour.lhDisconnected();
		}

        _beforeInitParent() {
            let gridCmp = <wijmo.grid.transposed.TransposedGrid>(<any>this).parentElement.control;
            if (gridCmp.autoGenerateRows) {
                gridCmp.autoGenerateRows = false;
                gridCmp._rowInfo.clear();
            }
        } 
	}  
    if (_wj_ns_exists_15) {
		WjComponentBehavior.register('wjc-transposed-grid-row', WjcTransposedGridRow); 
	}
  
    }
    


    module wijmo.webcomponents {
    

    }
    

    module wijmo.webcomponents {
    

let _wj_ns_exists_16 = wijmo.webcomponents.WjComponentBehavior.ensureNs('wijmo.grid.transposedmultirow', 'TransposedMultiRow');









    export class WjcTransposedMultiRow extends wijmo.grid.transposedmultirow.TransposedMultiRow { 
		_wjBehaviour: WjComponentBehavior; 

		constructor() {
			super(document.createElement('div'));
			this._wjBehaviour = WjComponentBehavior._attach(<any>this); 
		}

		static get observedAttributes() {
			return WjComponentBehavior.getProps(this);
		}

		connectedCallback() {
			this._wjBehaviour.lhConnected();
		}

		attributeChangedCallback(name: string, oldValue: string, newValue: string) {
			this._wjBehaviour.lhAttributeChanged(name, oldValue, newValue);
		}

		disconnectedCallback() {
			this._wjBehaviour.lhDisconnected();
		}

        addEventListener(...args) {
            if (typeof args[0] === 'string') {
                HTMLElement.prototype.addEventListener.apply(this, args);
            } else {
                super.addEventListener.apply(this, args);
            }
        } 
	}  
    if (_wj_ns_exists_16) {
		WjComponentBehavior.register('wjc-transposed-multi-row', WjcTransposedMultiRow); 
	}
  
    }
    


    module wijmo.webcomponents {
    

    }
    

    module wijmo.webcomponents {
    

let _wj_ns_exists_18 = wijmo.webcomponents.WjComponentBehavior.ensureNs('wijmo.input', 'ListBox', 'MultiSelectListBox', 'ComboBox', 'AutoComplete', 'Calendar', 'ColorPicker', 'InputMask', 'InputColor', 'MultiSelect', 'MultiAutoComplete', 'InputNumber', 'InputDate', 'InputTime', 'InputDateTime', 'InputDateRange', 'Menu', 'Popup', 'CollectionViewNavigator');









    export class WjcListBox extends wijmo.input.ListBox { 
		_wjBehaviour: WjComponentBehavior; 

		constructor() {
			super(document.createElement('div'));
			this._wjBehaviour = WjComponentBehavior._attach(<any>this); 
		}

		static get observedAttributes() {
			return WjComponentBehavior.getProps(this);
		}

		connectedCallback() {
			this._wjBehaviour.lhConnected();
		}

		attributeChangedCallback(name: string, oldValue: string, newValue: string) {
			this._wjBehaviour.lhAttributeChanged(name, oldValue, newValue);
		}

		disconnectedCallback() {
			this._wjBehaviour.lhDisconnected();
		}

        addEventListener(...args) {
            if (typeof args[0] === 'string') {
                HTMLElement.prototype.addEventListener.apply(this, args);
            } else {
                super.addEventListener.apply(this, args);
            }
        } 
	}  
    if (_wj_ns_exists_18) {
		WjComponentBehavior.register('wjc-list-box', WjcListBox); 
	}
  
    export class WjcMultiSelectListBox extends wijmo.input.MultiSelectListBox { 
		_wjBehaviour: WjComponentBehavior; 

		constructor() {
			super(document.createElement('div'));
			this._wjBehaviour = WjComponentBehavior._attach(<any>this); 
		}

		static get observedAttributes() {
			return WjComponentBehavior.getProps(this);
		}

		connectedCallback() {
			this._wjBehaviour.lhConnected();
		}

		attributeChangedCallback(name: string, oldValue: string, newValue: string) {
			this._wjBehaviour.lhAttributeChanged(name, oldValue, newValue);
		}

		disconnectedCallback() {
			this._wjBehaviour.lhDisconnected();
		}

        addEventListener(...args) {
            if (typeof args[0] === 'string') {
                HTMLElement.prototype.addEventListener.apply(this, args);
            } else {
                super.addEventListener.apply(this, args);
            }
        } 
	}  
    if (_wj_ns_exists_18) {
		WjComponentBehavior.register('wjc-multi-select-list-box', WjcMultiSelectListBox); 
	}
  
    export class WjcComboBox extends wijmo.input.ComboBox { 
		_wjBehaviour: WjComponentBehavior; 

		constructor() {
			super(document.createElement('div'));
			this._wjBehaviour = WjComponentBehavior._attach(<any>this); 
		}

		static get observedAttributes() {
			return WjComponentBehavior.getProps(this);
		}

		connectedCallback() {
			this._wjBehaviour.lhConnected();
		}

		attributeChangedCallback(name: string, oldValue: string, newValue: string) {
			this._wjBehaviour.lhAttributeChanged(name, oldValue, newValue);
		}

		disconnectedCallback() {
			this._wjBehaviour.lhDisconnected();
		}

        addEventListener(...args) {
            if (typeof args[0] === 'string') {
                HTMLElement.prototype.addEventListener.apply(this, args);
            } else {
                super.addEventListener.apply(this, args);
            }
        } 
	}  
    if (_wj_ns_exists_18) {
		WjComponentBehavior.register('wjc-combo-box', WjcComboBox); 
	}
  
    export class WjcAutoComplete extends wijmo.input.AutoComplete { 
		_wjBehaviour: WjComponentBehavior; 

		constructor() {
			super(document.createElement('div'));
			this._wjBehaviour = WjComponentBehavior._attach(<any>this); 
		}

		static get observedAttributes() {
			return WjComponentBehavior.getProps(this);
		}

		connectedCallback() {
			this._wjBehaviour.lhConnected();
		}

		attributeChangedCallback(name: string, oldValue: string, newValue: string) {
			this._wjBehaviour.lhAttributeChanged(name, oldValue, newValue);
		}

		disconnectedCallback() {
			this._wjBehaviour.lhDisconnected();
		}

        addEventListener(...args) {
            if (typeof args[0] === 'string') {
                HTMLElement.prototype.addEventListener.apply(this, args);
            } else {
                super.addEventListener.apply(this, args);
            }
        } 
	}  
    if (_wj_ns_exists_18) {
		WjComponentBehavior.register('wjc-auto-complete', WjcAutoComplete); 
	}
  
    export class WjcCalendar extends wijmo.input.Calendar { 
		_wjBehaviour: WjComponentBehavior; 

		constructor() {
			super(document.createElement('div'));
			this._wjBehaviour = WjComponentBehavior._attach(<any>this); 
		}

		static get observedAttributes() {
			return WjComponentBehavior.getProps(this);
		}

		connectedCallback() {
			this._wjBehaviour.lhConnected();
		}

		attributeChangedCallback(name: string, oldValue: string, newValue: string) {
			this._wjBehaviour.lhAttributeChanged(name, oldValue, newValue);
		}

		disconnectedCallback() {
			this._wjBehaviour.lhDisconnected();
		}

        addEventListener(...args) {
            if (typeof args[0] === 'string') {
                HTMLElement.prototype.addEventListener.apply(this, args);
            } else {
                super.addEventListener.apply(this, args);
            }
        } 
	}  
    if (_wj_ns_exists_18) {
		WjComponentBehavior.register('wjc-calendar', WjcCalendar); 
	}
  
    export class WjcColorPicker extends wijmo.input.ColorPicker { 
		_wjBehaviour: WjComponentBehavior; 

		constructor() {
			super(document.createElement('div'));
			this._wjBehaviour = WjComponentBehavior._attach(<any>this); 
		}

		static get observedAttributes() {
			return WjComponentBehavior.getProps(this);
		}

		connectedCallback() {
			this._wjBehaviour.lhConnected();
		}

		attributeChangedCallback(name: string, oldValue: string, newValue: string) {
			this._wjBehaviour.lhAttributeChanged(name, oldValue, newValue);
		}

		disconnectedCallback() {
			this._wjBehaviour.lhDisconnected();
		}

        addEventListener(...args) {
            if (typeof args[0] === 'string') {
                HTMLElement.prototype.addEventListener.apply(this, args);
            } else {
                super.addEventListener.apply(this, args);
            }
        } 
	}  
    if (_wj_ns_exists_18) {
		WjComponentBehavior.register('wjc-color-picker', WjcColorPicker); 
	}
  
    export class WjcInputMask extends wijmo.input.InputMask { 
		_wjBehaviour: WjComponentBehavior; 

		constructor() {
			super(document.createElement('div'));
			this._wjBehaviour = WjComponentBehavior._attach(<any>this); 
		}

		static get observedAttributes() {
			return WjComponentBehavior.getProps(this);
		}

		connectedCallback() {
			this._wjBehaviour.lhConnected();
		}

		attributeChangedCallback(name: string, oldValue: string, newValue: string) {
			this._wjBehaviour.lhAttributeChanged(name, oldValue, newValue);
		}

		disconnectedCallback() {
			this._wjBehaviour.lhDisconnected();
		}

        addEventListener(...args) {
            if (typeof args[0] === 'string') {
                HTMLElement.prototype.addEventListener.apply(this, args);
            } else {
                super.addEventListener.apply(this, args);
            }
        } 
	}  
    if (_wj_ns_exists_18) {
		WjComponentBehavior.register('wjc-input-mask', WjcInputMask); 
	}
  
    export class WjcInputColor extends wijmo.input.InputColor { 
		_wjBehaviour: WjComponentBehavior; 

		constructor() {
			super(document.createElement('div'));
			this._wjBehaviour = WjComponentBehavior._attach(<any>this); 
		}

		static get observedAttributes() {
			return WjComponentBehavior.getProps(this);
		}

		connectedCallback() {
			this._wjBehaviour.lhConnected();
		}

		attributeChangedCallback(name: string, oldValue: string, newValue: string) {
			this._wjBehaviour.lhAttributeChanged(name, oldValue, newValue);
		}

		disconnectedCallback() {
			this._wjBehaviour.lhDisconnected();
		}

        addEventListener(...args) {
            if (typeof args[0] === 'string') {
                HTMLElement.prototype.addEventListener.apply(this, args);
            } else {
                super.addEventListener.apply(this, args);
            }
        } 
	}  
    if (_wj_ns_exists_18) {
		WjComponentBehavior.register('wjc-input-color', WjcInputColor); 
	}
  
    export class WjcMultiSelect extends wijmo.input.MultiSelect { 
		_wjBehaviour: WjComponentBehavior; 

		constructor() {
			super(document.createElement('div'));
			this._wjBehaviour = WjComponentBehavior._attach(<any>this); 
		}

		static get observedAttributes() {
			return WjComponentBehavior.getProps(this);
		}

		connectedCallback() {
			this._wjBehaviour.lhConnected();
		}

		attributeChangedCallback(name: string, oldValue: string, newValue: string) {
			this._wjBehaviour.lhAttributeChanged(name, oldValue, newValue);
		}

		disconnectedCallback() {
			this._wjBehaviour.lhDisconnected();
		}

        addEventListener(...args) {
            if (typeof args[0] === 'string') {
                HTMLElement.prototype.addEventListener.apply(this, args);
            } else {
                super.addEventListener.apply(this, args);
            }
        } 
	}  
    if (_wj_ns_exists_18) {
		WjComponentBehavior.register('wjc-multi-select', WjcMultiSelect); 
	}
  
    export class WjcMultiAutoComplete extends wijmo.input.MultiAutoComplete { 
		_wjBehaviour: WjComponentBehavior; 

		constructor() {
			super(document.createElement('div'));
			this._wjBehaviour = WjComponentBehavior._attach(<any>this); 
		}

		static get observedAttributes() {
			return WjComponentBehavior.getProps(this);
		}

		connectedCallback() {
			this._wjBehaviour.lhConnected();
		}

		attributeChangedCallback(name: string, oldValue: string, newValue: string) {
			this._wjBehaviour.lhAttributeChanged(name, oldValue, newValue);
		}

		disconnectedCallback() {
			this._wjBehaviour.lhDisconnected();
		}

        addEventListener(...args) {
            if (typeof args[0] === 'string') {
                HTMLElement.prototype.addEventListener.apply(this, args);
            } else {
                super.addEventListener.apply(this, args);
            }
        } 
	}  
    if (_wj_ns_exists_18) {
		WjComponentBehavior.register('wjc-multi-auto-complete', WjcMultiAutoComplete); 
	}
  
    export class WjcInputNumber extends wijmo.input.InputNumber { 
		_wjBehaviour: WjComponentBehavior; 

		constructor() {
			super(document.createElement('div'));
			this._wjBehaviour = WjComponentBehavior._attach(<any>this); 
		}

		static get observedAttributes() {
			return WjComponentBehavior.getProps(this);
		}

		connectedCallback() {
			this._wjBehaviour.lhConnected();
		}

		attributeChangedCallback(name: string, oldValue: string, newValue: string) {
			this._wjBehaviour.lhAttributeChanged(name, oldValue, newValue);
		}

		disconnectedCallback() {
			this._wjBehaviour.lhDisconnected();
		}

        addEventListener(...args) {
            if (typeof args[0] === 'string') {
                HTMLElement.prototype.addEventListener.apply(this, args);
            } else {
                super.addEventListener.apply(this, args);
            }
        } 
	}  
    if (_wj_ns_exists_18) {
		WjComponentBehavior.register('wjc-input-number', WjcInputNumber); 
	}
  
    export class WjcInputDate extends wijmo.input.InputDate { 
		_wjBehaviour: WjComponentBehavior; 

		constructor() {
			super(document.createElement('div'));
			this._wjBehaviour = WjComponentBehavior._attach(<any>this); 
		}

		static get observedAttributes() {
			return WjComponentBehavior.getProps(this);
		}

		connectedCallback() {
			this._wjBehaviour.lhConnected();
		}

		attributeChangedCallback(name: string, oldValue: string, newValue: string) {
			this._wjBehaviour.lhAttributeChanged(name, oldValue, newValue);
		}

		disconnectedCallback() {
			this._wjBehaviour.lhDisconnected();
		}

        addEventListener(...args) {
            if (typeof args[0] === 'string') {
                HTMLElement.prototype.addEventListener.apply(this, args);
            } else {
                super.addEventListener.apply(this, args);
            }
        } 
	}  
    if (_wj_ns_exists_18) {
		WjComponentBehavior.register('wjc-input-date', WjcInputDate); 
	}
  
    export class WjcInputTime extends wijmo.input.InputTime { 
		_wjBehaviour: WjComponentBehavior; 

		constructor() {
			super(document.createElement('div'));
			this._wjBehaviour = WjComponentBehavior._attach(<any>this); 
		}

		static get observedAttributes() {
			return WjComponentBehavior.getProps(this);
		}

		connectedCallback() {
			this._wjBehaviour.lhConnected();
		}

		attributeChangedCallback(name: string, oldValue: string, newValue: string) {
			this._wjBehaviour.lhAttributeChanged(name, oldValue, newValue);
		}

		disconnectedCallback() {
			this._wjBehaviour.lhDisconnected();
		}

        addEventListener(...args) {
            if (typeof args[0] === 'string') {
                HTMLElement.prototype.addEventListener.apply(this, args);
            } else {
                super.addEventListener.apply(this, args);
            }
        } 
	}  
    if (_wj_ns_exists_18) {
		WjComponentBehavior.register('wjc-input-time', WjcInputTime); 
	}
  
    export class WjcInputDateTime extends wijmo.input.InputDateTime { 
		_wjBehaviour: WjComponentBehavior; 

		constructor() {
			super(document.createElement('div'));
			this._wjBehaviour = WjComponentBehavior._attach(<any>this); 
		}

		static get observedAttributes() {
			return WjComponentBehavior.getProps(this);
		}

		connectedCallback() {
			this._wjBehaviour.lhConnected();
		}

		attributeChangedCallback(name: string, oldValue: string, newValue: string) {
			this._wjBehaviour.lhAttributeChanged(name, oldValue, newValue);
		}

		disconnectedCallback() {
			this._wjBehaviour.lhDisconnected();
		}

        addEventListener(...args) {
            if (typeof args[0] === 'string') {
                HTMLElement.prototype.addEventListener.apply(this, args);
            } else {
                super.addEventListener.apply(this, args);
            }
        } 
	}  
    if (_wj_ns_exists_18) {
		WjComponentBehavior.register('wjc-input-date-time', WjcInputDateTime); 
	}
  
    export class WjcInputDateRange extends wijmo.input.InputDateRange { 
		_wjBehaviour: WjComponentBehavior; 

		constructor() {
			super(document.createElement('div'));
			this._wjBehaviour = WjComponentBehavior._attach(<any>this); 
		}

		static get observedAttributes() {
			return WjComponentBehavior.getProps(this);
		}

		connectedCallback() {
			this._wjBehaviour.lhConnected();
		}

		attributeChangedCallback(name: string, oldValue: string, newValue: string) {
			this._wjBehaviour.lhAttributeChanged(name, oldValue, newValue);
		}

		disconnectedCallback() {
			this._wjBehaviour.lhDisconnected();
		}

        addEventListener(...args) {
            if (typeof args[0] === 'string') {
                HTMLElement.prototype.addEventListener.apply(this, args);
            } else {
                super.addEventListener.apply(this, args);
            }
        } 
	}  
    if (_wj_ns_exists_18) {
		WjComponentBehavior.register('wjc-input-date-range', WjcInputDateRange); 
	}
  
    export class WjcMenu extends wijmo.input.Menu { 
		_wjBehaviour: WjComponentBehavior; 

		constructor() {
			super(document.createElement('div'));
			this._wjBehaviour = WjComponentBehavior._attach(<any>this); 
		}

		static get observedAttributes() {
			return WjComponentBehavior.getProps(this);
		}

		connectedCallback() {
			this._wjBehaviour.lhConnected();
		}

		attributeChangedCallback(name: string, oldValue: string, newValue: string) {
			this._wjBehaviour.lhAttributeChanged(name, oldValue, newValue);
		}

		disconnectedCallback() {
			this._wjBehaviour.lhDisconnected();
		}

        addEventListener(...args) {
            if (typeof args[0] === 'string') {
                HTMLElement.prototype.addEventListener.apply(this, args);
            } else {
                super.addEventListener.apply(this, args);
            }
        } 
	}  
    if (_wj_ns_exists_18) {
		WjComponentBehavior.register('wjc-menu', WjcMenu); 
	}
  
    export class WjcPopup extends wijmo.input.Popup { 
		_wjBehaviour: WjComponentBehavior; 

		constructor() {
			super(document.createElement('div'));
			this._wjBehaviour = WjComponentBehavior._attach(<any>this); 
		}

		static get observedAttributes() {
			return WjComponentBehavior.getProps(this);
		}

		connectedCallback() {
			this._wjBehaviour.lhConnected();
		}

		attributeChangedCallback(name: string, oldValue: string, newValue: string) {
			this._wjBehaviour.lhAttributeChanged(name, oldValue, newValue);
		}

		disconnectedCallback() {
			this._wjBehaviour.lhDisconnected();
		}

        addEventListener(...args) {
            if (typeof args[0] === 'string') {
                HTMLElement.prototype.addEventListener.apply(this, args);
            } else {
                super.addEventListener.apply(this, args);
            }
        } 
	}  
    if (_wj_ns_exists_18) {
		WjComponentBehavior.register('wjc-popup', WjcPopup); 
	}
  
    export class WjcCollectionViewNavigator extends wijmo.input.CollectionViewNavigator { 
		_wjBehaviour: WjComponentBehavior; 

		constructor() {
			super(document.createElement('div'));
			this._wjBehaviour = WjComponentBehavior._attach(<any>this); 
		}

		static get observedAttributes() {
			return WjComponentBehavior.getProps(this);
		}

		connectedCallback() {
			this._wjBehaviour.lhConnected();
		}

		attributeChangedCallback(name: string, oldValue: string, newValue: string) {
			this._wjBehaviour.lhAttributeChanged(name, oldValue, newValue);
		}

		disconnectedCallback() {
			this._wjBehaviour.lhDisconnected();
		}

        addEventListener(...args) {
            if (typeof args[0] === 'string') {
                HTMLElement.prototype.addEventListener.apply(this, args);
            } else {
                super.addEventListener.apply(this, args);
            }
        } 
	}  
    if (_wj_ns_exists_18) {
		WjComponentBehavior.register('wjc-collection-view-navigator', WjcCollectionViewNavigator); 
	}
  
    }
    


    module wijmo.webcomponents {
    

    }
    

    module wijmo.webcomponents {
    

let _wj_ns_exists_19 = wijmo.webcomponents.WjComponentBehavior.ensureNs('wijmo.olap', 'PivotGrid', 'PivotChart', 'PivotPanel', 'Slicer');









    export class WjcPivotGrid extends wijmo.olap.PivotGrid { 
		_wjBehaviour: WjComponentBehavior; 

		constructor() {
			super(document.createElement('div'));
			this._wjBehaviour = WjComponentBehavior._attach(<any>this); 
		}

		static get observedAttributes() {
			return WjComponentBehavior.getProps(this);
		}

		connectedCallback() {
			this._wjBehaviour.lhConnected();
		}

		attributeChangedCallback(name: string, oldValue: string, newValue: string) {
			this._wjBehaviour.lhAttributeChanged(name, oldValue, newValue);
		}

		disconnectedCallback() {
			this._wjBehaviour.lhDisconnected();
		}

        addEventListener(...args) {
            if (typeof args[0] === 'string') {
                HTMLElement.prototype.addEventListener.apply(this, args);
            } else {
                super.addEventListener.apply(this, args);
            }
        } 
	}  
    if (_wj_ns_exists_19) {
		WjComponentBehavior.register('', wijmo.olap._GridContextMenu);
		WjComponentBehavior.register('', wijmo.olap.DetailDialog);
		WjComponentBehavior.register('', wijmo.olap.PivotFieldEditor);
		WjComponentBehavior.register('', wijmo.olap.PivotFilterEditor);
    
		WjComponentBehavior.register('wjc-pivot-grid', WjcPivotGrid); 
	}
  
    export class WjcPivotChart extends wijmo.olap.PivotChart { 
		_wjBehaviour: WjComponentBehavior; 

		constructor() {
			super(document.createElement('div'));
			this._wjBehaviour = WjComponentBehavior._attach(<any>this); 
		}

		static get observedAttributes() {
			return WjComponentBehavior.getProps(this);
		}

		connectedCallback() {
			this._wjBehaviour.lhConnected();
		}

		attributeChangedCallback(name: string, oldValue: string, newValue: string) {
			this._wjBehaviour.lhAttributeChanged(name, oldValue, newValue);
		}

		disconnectedCallback() {
			this._wjBehaviour.lhDisconnected();
		}

        addEventListener(...args) {
            if (typeof args[0] === 'string') {
                HTMLElement.prototype.addEventListener.apply(this, args);
            } else {
                super.addEventListener.apply(this, args);
            }
        } 
	}  
    if (_wj_ns_exists_19) {
		WjComponentBehavior.register('wjc-pivot-chart', WjcPivotChart); 
	}
  
    export class WjcPivotPanel extends wijmo.olap.PivotPanel { 
		_wjBehaviour: WjComponentBehavior; 

		constructor() {
			super(document.createElement('div'));
			this._wjBehaviour = WjComponentBehavior._attach(<any>this); 
		}

		static get observedAttributes() {
			return WjComponentBehavior.getProps(this);
		}

		connectedCallback() {
			this._wjBehaviour.lhConnected();
		}

		attributeChangedCallback(name: string, oldValue: string, newValue: string) {
			this._wjBehaviour.lhAttributeChanged(name, oldValue, newValue);
		}

		disconnectedCallback() {
			this._wjBehaviour.lhDisconnected();
		}

        addEventListener(...args) {
            if (typeof args[0] === 'string') {
                HTMLElement.prototype.addEventListener.apply(this, args);
            } else {
                super.addEventListener.apply(this, args);
            }
        } 
	}  
    if (_wj_ns_exists_19) {
		WjComponentBehavior.register('', wijmo.olap._ListContextMenu);
    
		WjComponentBehavior.register('wjc-pivot-panel', WjcPivotPanel); 
	}
  
    export class WjcSlicer extends wijmo.olap.Slicer { 
		_wjBehaviour: WjComponentBehavior; 

		constructor() {
			super(document.createElement('div'));
			this._wjBehaviour = WjComponentBehavior._attach(<any>this); 
		}

		static get observedAttributes() {
			return WjComponentBehavior.getProps(this);
		}

		connectedCallback() {
			this._wjBehaviour.lhConnected();
		}

		attributeChangedCallback(name: string, oldValue: string, newValue: string) {
			this._wjBehaviour.lhAttributeChanged(name, oldValue, newValue);
		}

		disconnectedCallback() {
			this._wjBehaviour.lhDisconnected();
		}

        addEventListener(...args) {
            if (typeof args[0] === 'string') {
                HTMLElement.prototype.addEventListener.apply(this, args);
            } else {
                super.addEventListener.apply(this, args);
            }
        } 
	}  
    if (_wj_ns_exists_19) {
		WjComponentBehavior.register('wjc-slicer', WjcSlicer); 
	}
  
    }
    


    module wijmo.webcomponents {
    

    }
    

    module wijmo.webcomponents {
    

let _wj_ns_exists_20 = wijmo.webcomponents.WjComponentBehavior.ensureNs('wijmo.viewer', 'ReportViewer', 'PdfViewer');









    export class WjcReportViewer extends wijmo.viewer.ReportViewer { 
		_wjBehaviour: WjComponentBehavior; 

		constructor() {
			super(document.createElement('div'));
			this._wjBehaviour = WjComponentBehavior._attach(<any>this); 
		}

		static get observedAttributes() {
			return WjComponentBehavior.getProps(this);
		}

		connectedCallback() {
			this._wjBehaviour.lhConnected();
		}

		attributeChangedCallback(name: string, oldValue: string, newValue: string) {
			this._wjBehaviour.lhAttributeChanged(name, oldValue, newValue);
		}

		disconnectedCallback() {
			this._wjBehaviour.lhDisconnected();
		}

        addEventListener(...args) {
            if (typeof args[0] === 'string') {
                HTMLElement.prototype.addEventListener.apply(this, args);
            } else {
                super.addEventListener.apply(this, args);
            }
        } 
	}  
    if (_wj_ns_exists_20) {
		WjComponentBehavior.register('', wijmo.viewer._MouseTool);
		WjComponentBehavior.register('', wijmo.viewer._Magnifier);
		WjComponentBehavior.register('', wijmo.viewer._PageSetupDialog);
		WjComponentBehavior.register('', wijmo.viewer._Rubberband);
		WjComponentBehavior.register('', wijmo.viewer._ParametersEditor);
		WjComponentBehavior.register('', wijmo.viewer._ReportHamburgerMenu);
		WjComponentBehavior.register('', wijmo.viewer._ViewerMenuBase);
		WjComponentBehavior.register('', wijmo.viewer._HamburgerMenu);
		WjComponentBehavior.register('', wijmo.viewer._SearchOptionsMenu);
		WjComponentBehavior.register('', wijmo.viewer._ViewMenu);
		WjComponentBehavior.register('', wijmo.viewer._SearchBar);
		WjComponentBehavior.register('', wijmo.viewer._Toolbar);
		WjComponentBehavior.register('', wijmo.viewer._ViewerMiniToolbar);
		WjComponentBehavior.register('', wijmo.viewer._ViewerMobileToolbar);
		WjComponentBehavior.register('', wijmo.viewer._ViewerMobileToolbarBase);
		WjComponentBehavior.register('', wijmo.viewer._ViewerToolbar);
		WjComponentBehavior.register('', wijmo.viewer._ViewerToolbarBase);
		WjComponentBehavior.register('', wijmo.viewer._ViewerZoomBar);
		WjComponentBehavior.register('', wijmo.viewer._SideTabs);
		WjComponentBehavior.register('', wijmo.viewer._CompositePageView);
		WjComponentBehavior.register('', wijmo.viewer._ContinuousPageView);
		WjComponentBehavior.register('', wijmo.viewer._PageViewBase);
		WjComponentBehavior.register('', wijmo.viewer._Scroller);
		WjComponentBehavior.register('', wijmo.viewer._SinglePageView);
		WjComponentBehavior.register('', wijmo.viewer._VScroller);
		WjComponentBehavior.register('', wijmo.viewer._PageSetupEditor);
		WjComponentBehavior.register('', wijmo.viewer._ExportOptionEditor);
    
		WjComponentBehavior.register('wjc-report-viewer', WjcReportViewer); 
	}
  
    export class WjcPdfViewer extends wijmo.viewer.PdfViewer { 
		_wjBehaviour: WjComponentBehavior; 

		constructor() {
			super(document.createElement('div'));
			this._wjBehaviour = WjComponentBehavior._attach(<any>this); 
		}

		static get observedAttributes() {
			return WjComponentBehavior.getProps(this);
		}

		connectedCallback() {
			this._wjBehaviour.lhConnected();
		}

		attributeChangedCallback(name: string, oldValue: string, newValue: string) {
			this._wjBehaviour.lhAttributeChanged(name, oldValue, newValue);
		}

		disconnectedCallback() {
			this._wjBehaviour.lhDisconnected();
		}

        addEventListener(...args) {
            if (typeof args[0] === 'string') {
                HTMLElement.prototype.addEventListener.apply(this, args);
            } else {
                super.addEventListener.apply(this, args);
            }
        } 
	}  
    if (_wj_ns_exists_20) {
		WjComponentBehavior.register('wjc-pdf-viewer', WjcPdfViewer); 
	}
  
    }
    


    module wijmo.webcomponents {
    

    }
    

    module wijmo.webcomponents {
    

let _wj_ns_exists_21 = wijmo.webcomponents.WjComponentBehavior.ensureNs('wijmo.nav', 'TreeView', 'TabPanel', 'Tab', 'Accordion', 'AccordionPane');









    export class WjcTreeView extends wijmo.nav.TreeView { 
		_wjBehaviour: WjComponentBehavior; 

		constructor() {
			super(document.createElement('div'));
			this._wjBehaviour = WjComponentBehavior._attach(<any>this); 
		}

		static get observedAttributes() {
			return WjComponentBehavior.getProps(this);
		}

		connectedCallback() {
			this._wjBehaviour.lhConnected();
		}

		attributeChangedCallback(name: string, oldValue: string, newValue: string) {
			this._wjBehaviour.lhAttributeChanged(name, oldValue, newValue);
		}

		disconnectedCallback() {
			this._wjBehaviour.lhDisconnected();
		}

        addEventListener(...args) {
            if (typeof args[0] === 'string') {
                HTMLElement.prototype.addEventListener.apply(this, args);
            } else {
                super.addEventListener.apply(this, args);
            }
        } 
	}  
    if (_wj_ns_exists_21) {
		WjComponentBehavior.register('wjc-tree-view', WjcTreeView); 
	}
    
	WjComponentBehavior.register('', wijmo.nav.TabPanel);        
	WjComponentBehavior.register('', wijmo.nav.Accordion);      
    }
    


    module wijmo.webcomponents {
    

    }
    

    module wijmo.webcomponents {
    

let _wj_ns_exists_22 = wijmo.webcomponents.WjComponentBehavior.ensureNs('wijmo.barcode.common', 'Codabar', 'Ean8', 'Ean13', 'Code39', 'Code128', 'Gs1_128', 'UpcA', 'UpcE0', 'UpcE1', 'QrCode');









    export class WjcBarcodeCodabar extends wijmo.barcode.common.Codabar { 
		_wjBehaviour: WjComponentBehavior; 

		constructor() {
			super(document.createElement('div'));
			this._wjBehaviour = WjComponentBehavior._attach(<any>this); 
		}

		static get observedAttributes() {
			return WjComponentBehavior.getProps(this);
		}

		connectedCallback() {
			this._wjBehaviour.lhConnected();
		}

		attributeChangedCallback(name: string, oldValue: string, newValue: string) {
			this._wjBehaviour.lhAttributeChanged(name, oldValue, newValue);
		}

		disconnectedCallback() {
			this._wjBehaviour.lhDisconnected();
		}

        addEventListener(...args) {
            if (typeof args[0] === 'string') {
                HTMLElement.prototype.addEventListener.apply(this, args);
            } else {
                super.addEventListener.apply(this, args);
            }
        } 
	}  
    if (_wj_ns_exists_22) {
		WjComponentBehavior.register('wjc-barcode-codabar', WjcBarcodeCodabar); 
	}
  
    export class WjcBarcodeEan8 extends wijmo.barcode.common.Ean8 { 
		_wjBehaviour: WjComponentBehavior; 

		constructor() {
			super(document.createElement('div'));
			this._wjBehaviour = WjComponentBehavior._attach(<any>this); 
		}

		static get observedAttributes() {
			return WjComponentBehavior.getProps(this);
		}

		connectedCallback() {
			this._wjBehaviour.lhConnected();
		}

		attributeChangedCallback(name: string, oldValue: string, newValue: string) {
			this._wjBehaviour.lhAttributeChanged(name, oldValue, newValue);
		}

		disconnectedCallback() {
			this._wjBehaviour.lhDisconnected();
		}

        addEventListener(...args) {
            if (typeof args[0] === 'string') {
                HTMLElement.prototype.addEventListener.apply(this, args);
            } else {
                super.addEventListener.apply(this, args);
            }
        } 
	}  
    if (_wj_ns_exists_22) {
		WjComponentBehavior.register('wjc-barcode-ean8', WjcBarcodeEan8); 
	}
  
    export class WjcBarcodeEan13 extends wijmo.barcode.common.Ean13 { 
		_wjBehaviour: WjComponentBehavior; 

		constructor() {
			super(document.createElement('div'));
			this._wjBehaviour = WjComponentBehavior._attach(<any>this); 
		}

		static get observedAttributes() {
			return WjComponentBehavior.getProps(this);
		}

		connectedCallback() {
			this._wjBehaviour.lhConnected();
		}

		attributeChangedCallback(name: string, oldValue: string, newValue: string) {
			this._wjBehaviour.lhAttributeChanged(name, oldValue, newValue);
		}

		disconnectedCallback() {
			this._wjBehaviour.lhDisconnected();
		}

        addEventListener(...args) {
            if (typeof args[0] === 'string') {
                HTMLElement.prototype.addEventListener.apply(this, args);
            } else {
                super.addEventListener.apply(this, args);
            }
        } 
	}  
    if (_wj_ns_exists_22) {
		WjComponentBehavior.register('wjc-barcode-ean13', WjcBarcodeEan13); 
	}
  
    export class WjcBarcodeCode39 extends wijmo.barcode.common.Code39 { 
		_wjBehaviour: WjComponentBehavior; 

		constructor() {
			super(document.createElement('div'));
			this._wjBehaviour = WjComponentBehavior._attach(<any>this); 
		}

		static get observedAttributes() {
			return WjComponentBehavior.getProps(this);
		}

		connectedCallback() {
			this._wjBehaviour.lhConnected();
		}

		attributeChangedCallback(name: string, oldValue: string, newValue: string) {
			this._wjBehaviour.lhAttributeChanged(name, oldValue, newValue);
		}

		disconnectedCallback() {
			this._wjBehaviour.lhDisconnected();
		}

        addEventListener(...args) {
            if (typeof args[0] === 'string') {
                HTMLElement.prototype.addEventListener.apply(this, args);
            } else {
                super.addEventListener.apply(this, args);
            }
        } 
	}  
    if (_wj_ns_exists_22) {
		WjComponentBehavior.register('wjc-barcode-code39', WjcBarcodeCode39); 
	}
  
    export class WjcBarcodeCode128 extends wijmo.barcode.common.Code128 { 
		_wjBehaviour: WjComponentBehavior; 

		constructor() {
			super(document.createElement('div'));
			this._wjBehaviour = WjComponentBehavior._attach(<any>this); 
		}

		static get observedAttributes() {
			return WjComponentBehavior.getProps(this);
		}

		connectedCallback() {
			this._wjBehaviour.lhConnected();
		}

		attributeChangedCallback(name: string, oldValue: string, newValue: string) {
			this._wjBehaviour.lhAttributeChanged(name, oldValue, newValue);
		}

		disconnectedCallback() {
			this._wjBehaviour.lhDisconnected();
		}

        addEventListener(...args) {
            if (typeof args[0] === 'string') {
                HTMLElement.prototype.addEventListener.apply(this, args);
            } else {
                super.addEventListener.apply(this, args);
            }
        } 
	}  
    if (_wj_ns_exists_22) {
		WjComponentBehavior.register('wjc-barcode-code128', WjcBarcodeCode128); 
	}
  
    export class WjcBarcodeGs1_128 extends wijmo.barcode.common.Gs1_128 { 
		_wjBehaviour: WjComponentBehavior; 

		constructor() {
			super(document.createElement('div'));
			this._wjBehaviour = WjComponentBehavior._attach(<any>this); 
		}

		static get observedAttributes() {
			return WjComponentBehavior.getProps(this);
		}

		connectedCallback() {
			this._wjBehaviour.lhConnected();
		}

		attributeChangedCallback(name: string, oldValue: string, newValue: string) {
			this._wjBehaviour.lhAttributeChanged(name, oldValue, newValue);
		}

		disconnectedCallback() {
			this._wjBehaviour.lhDisconnected();
		}

        addEventListener(...args) {
            if (typeof args[0] === 'string') {
                HTMLElement.prototype.addEventListener.apply(this, args);
            } else {
                super.addEventListener.apply(this, args);
            }
        } 
	}  
    if (_wj_ns_exists_22) {
		WjComponentBehavior.register('wjc-barcode-gs1_128', WjcBarcodeGs1_128); 
	}
  
    export class WjcBarcodeUpcA extends wijmo.barcode.common.UpcA { 
		_wjBehaviour: WjComponentBehavior; 

		constructor() {
			super(document.createElement('div'));
			this._wjBehaviour = WjComponentBehavior._attach(<any>this); 
		}

		static get observedAttributes() {
			return WjComponentBehavior.getProps(this);
		}

		connectedCallback() {
			this._wjBehaviour.lhConnected();
		}

		attributeChangedCallback(name: string, oldValue: string, newValue: string) {
			this._wjBehaviour.lhAttributeChanged(name, oldValue, newValue);
		}

		disconnectedCallback() {
			this._wjBehaviour.lhDisconnected();
		}

        addEventListener(...args) {
            if (typeof args[0] === 'string') {
                HTMLElement.prototype.addEventListener.apply(this, args);
            } else {
                super.addEventListener.apply(this, args);
            }
        } 
	}  
    if (_wj_ns_exists_22) {
		WjComponentBehavior.register('wjc-barcode-upc-a', WjcBarcodeUpcA); 
	}
  
    export class WjcBarcodeUpcE0 extends wijmo.barcode.common.UpcE0 { 
		_wjBehaviour: WjComponentBehavior; 

		constructor() {
			super(document.createElement('div'));
			this._wjBehaviour = WjComponentBehavior._attach(<any>this); 
		}

		static get observedAttributes() {
			return WjComponentBehavior.getProps(this);
		}

		connectedCallback() {
			this._wjBehaviour.lhConnected();
		}

		attributeChangedCallback(name: string, oldValue: string, newValue: string) {
			this._wjBehaviour.lhAttributeChanged(name, oldValue, newValue);
		}

		disconnectedCallback() {
			this._wjBehaviour.lhDisconnected();
		}

        addEventListener(...args) {
            if (typeof args[0] === 'string') {
                HTMLElement.prototype.addEventListener.apply(this, args);
            } else {
                super.addEventListener.apply(this, args);
            }
        } 
	}  
    if (_wj_ns_exists_22) {
		WjComponentBehavior.register('wjc-barcode-upc-e0', WjcBarcodeUpcE0); 
	}
  
    export class WjcBarcodeUpcE1 extends wijmo.barcode.common.UpcE1 { 
		_wjBehaviour: WjComponentBehavior; 

		constructor() {
			super(document.createElement('div'));
			this._wjBehaviour = WjComponentBehavior._attach(<any>this); 
		}

		static get observedAttributes() {
			return WjComponentBehavior.getProps(this);
		}

		connectedCallback() {
			this._wjBehaviour.lhConnected();
		}

		attributeChangedCallback(name: string, oldValue: string, newValue: string) {
			this._wjBehaviour.lhAttributeChanged(name, oldValue, newValue);
		}

		disconnectedCallback() {
			this._wjBehaviour.lhDisconnected();
		}

        addEventListener(...args) {
            if (typeof args[0] === 'string') {
                HTMLElement.prototype.addEventListener.apply(this, args);
            } else {
                super.addEventListener.apply(this, args);
            }
        } 
	}  
    if (_wj_ns_exists_22) {
		WjComponentBehavior.register('wjc-barcode-upc-e1', WjcBarcodeUpcE1); 
	}
  
    export class WjcBarcodeQrCode extends wijmo.barcode.common.QrCode { 
		_wjBehaviour: WjComponentBehavior; 

		constructor() {
			super(document.createElement('div'));
			this._wjBehaviour = WjComponentBehavior._attach(<any>this); 
		}

		static get observedAttributes() {
			return WjComponentBehavior.getProps(this);
		}

		connectedCallback() {
			this._wjBehaviour.lhConnected();
		}

		attributeChangedCallback(name: string, oldValue: string, newValue: string) {
			this._wjBehaviour.lhAttributeChanged(name, oldValue, newValue);
		}

		disconnectedCallback() {
			this._wjBehaviour.lhDisconnected();
		}

        addEventListener(...args) {
            if (typeof args[0] === 'string') {
                HTMLElement.prototype.addEventListener.apply(this, args);
            } else {
                super.addEventListener.apply(this, args);
            }
        } 
	}  
    if (_wj_ns_exists_22) {
		WjComponentBehavior.register('wjc-barcode-qr-code', WjcBarcodeQrCode); 
	}
  
    }
    


    module wijmo.webcomponents {
    

    }
    

    module wijmo.webcomponents {
    

let _wj_ns_exists_23 = wijmo.webcomponents.WjComponentBehavior.ensureNs('wijmo.barcode.composite', 'Gs1DataBarOmnidirectional', 'Gs1DataBarTruncated', 'Gs1DataBarStacked', 'Gs1DataBarStackedOmnidirectional', 'Gs1DataBarLimited', 'Gs1DataBarExpanded', 'Gs1DataBarExpandedStacked', 'Pdf417', 'MicroPdf417');









    export class WjcBarcodeGs1DataBarOmnidirectional extends wijmo.barcode.composite.Gs1DataBarOmnidirectional { 
		_wjBehaviour: WjComponentBehavior; 

		constructor() {
			super(document.createElement('div'));
			this._wjBehaviour = WjComponentBehavior._attach(<any>this); 
		}

		static get observedAttributes() {
			return WjComponentBehavior.getProps(this);
		}

		connectedCallback() {
			this._wjBehaviour.lhConnected();
		}

		attributeChangedCallback(name: string, oldValue: string, newValue: string) {
			this._wjBehaviour.lhAttributeChanged(name, oldValue, newValue);
		}

		disconnectedCallback() {
			this._wjBehaviour.lhDisconnected();
		}

        addEventListener(...args) {
            if (typeof args[0] === 'string') {
                HTMLElement.prototype.addEventListener.apply(this, args);
            } else {
                super.addEventListener.apply(this, args);
            }
        } 
	}  
    if (_wj_ns_exists_23) {
		WjComponentBehavior.register('wjc-barcode-gs1-data-bar-omnidirectional', WjcBarcodeGs1DataBarOmnidirectional); 
	}
  
    export class WjcBarcodeGs1DataBarTruncated extends wijmo.barcode.composite.Gs1DataBarTruncated { 
		_wjBehaviour: WjComponentBehavior; 

		constructor() {
			super(document.createElement('div'));
			this._wjBehaviour = WjComponentBehavior._attach(<any>this); 
		}

		static get observedAttributes() {
			return WjComponentBehavior.getProps(this);
		}

		connectedCallback() {
			this._wjBehaviour.lhConnected();
		}

		attributeChangedCallback(name: string, oldValue: string, newValue: string) {
			this._wjBehaviour.lhAttributeChanged(name, oldValue, newValue);
		}

		disconnectedCallback() {
			this._wjBehaviour.lhDisconnected();
		}

        addEventListener(...args) {
            if (typeof args[0] === 'string') {
                HTMLElement.prototype.addEventListener.apply(this, args);
            } else {
                super.addEventListener.apply(this, args);
            }
        } 
	}  
    if (_wj_ns_exists_23) {
		WjComponentBehavior.register('wjc-barcode-gs1-data-bar-truncated', WjcBarcodeGs1DataBarTruncated); 
	}
  
    export class WjcBarcodeGs1DataBarStacked extends wijmo.barcode.composite.Gs1DataBarStacked { 
		_wjBehaviour: WjComponentBehavior; 

		constructor() {
			super(document.createElement('div'));
			this._wjBehaviour = WjComponentBehavior._attach(<any>this); 
		}

		static get observedAttributes() {
			return WjComponentBehavior.getProps(this);
		}

		connectedCallback() {
			this._wjBehaviour.lhConnected();
		}

		attributeChangedCallback(name: string, oldValue: string, newValue: string) {
			this._wjBehaviour.lhAttributeChanged(name, oldValue, newValue);
		}

		disconnectedCallback() {
			this._wjBehaviour.lhDisconnected();
		}

        addEventListener(...args) {
            if (typeof args[0] === 'string') {
                HTMLElement.prototype.addEventListener.apply(this, args);
            } else {
                super.addEventListener.apply(this, args);
            }
        } 
	}  
    if (_wj_ns_exists_23) {
		WjComponentBehavior.register('wjc-barcode-gs1-data-bar-stacked', WjcBarcodeGs1DataBarStacked); 
	}
  
    export class WjcBarcodeGs1DataBarStackedOmnidirectional extends wijmo.barcode.composite.Gs1DataBarStackedOmnidirectional { 
		_wjBehaviour: WjComponentBehavior; 

		constructor() {
			super(document.createElement('div'));
			this._wjBehaviour = WjComponentBehavior._attach(<any>this); 
		}

		static get observedAttributes() {
			return WjComponentBehavior.getProps(this);
		}

		connectedCallback() {
			this._wjBehaviour.lhConnected();
		}

		attributeChangedCallback(name: string, oldValue: string, newValue: string) {
			this._wjBehaviour.lhAttributeChanged(name, oldValue, newValue);
		}

		disconnectedCallback() {
			this._wjBehaviour.lhDisconnected();
		}

        addEventListener(...args) {
            if (typeof args[0] === 'string') {
                HTMLElement.prototype.addEventListener.apply(this, args);
            } else {
                super.addEventListener.apply(this, args);
            }
        } 
	}  
    if (_wj_ns_exists_23) {
		WjComponentBehavior.register('wjc-barcode-gs1-data-bar-stacked-omnidirectional', WjcBarcodeGs1DataBarStackedOmnidirectional); 
	}
  
    export class WjcBarcodeGs1DataBarLimited extends wijmo.barcode.composite.Gs1DataBarLimited { 
		_wjBehaviour: WjComponentBehavior; 

		constructor() {
			super(document.createElement('div'));
			this._wjBehaviour = WjComponentBehavior._attach(<any>this); 
		}

		static get observedAttributes() {
			return WjComponentBehavior.getProps(this);
		}

		connectedCallback() {
			this._wjBehaviour.lhConnected();
		}

		attributeChangedCallback(name: string, oldValue: string, newValue: string) {
			this._wjBehaviour.lhAttributeChanged(name, oldValue, newValue);
		}

		disconnectedCallback() {
			this._wjBehaviour.lhDisconnected();
		}

        addEventListener(...args) {
            if (typeof args[0] === 'string') {
                HTMLElement.prototype.addEventListener.apply(this, args);
            } else {
                super.addEventListener.apply(this, args);
            }
        } 
	}  
    if (_wj_ns_exists_23) {
		WjComponentBehavior.register('wjc-barcode-gs1-data-bar-limited', WjcBarcodeGs1DataBarLimited); 
	}
  
    export class WjcBarcodeGs1DataBarExpanded extends wijmo.barcode.composite.Gs1DataBarExpanded { 
		_wjBehaviour: WjComponentBehavior; 

		constructor() {
			super(document.createElement('div'));
			this._wjBehaviour = WjComponentBehavior._attach(<any>this); 
		}

		static get observedAttributes() {
			return WjComponentBehavior.getProps(this);
		}

		connectedCallback() {
			this._wjBehaviour.lhConnected();
		}

		attributeChangedCallback(name: string, oldValue: string, newValue: string) {
			this._wjBehaviour.lhAttributeChanged(name, oldValue, newValue);
		}

		disconnectedCallback() {
			this._wjBehaviour.lhDisconnected();
		}

        addEventListener(...args) {
            if (typeof args[0] === 'string') {
                HTMLElement.prototype.addEventListener.apply(this, args);
            } else {
                super.addEventListener.apply(this, args);
            }
        } 
	}  
    if (_wj_ns_exists_23) {
		WjComponentBehavior.register('wjc-barcode-gs1-data-bar-expanded', WjcBarcodeGs1DataBarExpanded); 
	}
  
    export class WjcBarcodeGs1DataBarExpandedStacked extends wijmo.barcode.composite.Gs1DataBarExpandedStacked { 
		_wjBehaviour: WjComponentBehavior; 

		constructor() {
			super(document.createElement('div'));
			this._wjBehaviour = WjComponentBehavior._attach(<any>this); 
		}

		static get observedAttributes() {
			return WjComponentBehavior.getProps(this);
		}

		connectedCallback() {
			this._wjBehaviour.lhConnected();
		}

		attributeChangedCallback(name: string, oldValue: string, newValue: string) {
			this._wjBehaviour.lhAttributeChanged(name, oldValue, newValue);
		}

		disconnectedCallback() {
			this._wjBehaviour.lhDisconnected();
		}

        addEventListener(...args) {
            if (typeof args[0] === 'string') {
                HTMLElement.prototype.addEventListener.apply(this, args);
            } else {
                super.addEventListener.apply(this, args);
            }
        } 
	}  
    if (_wj_ns_exists_23) {
		WjComponentBehavior.register('wjc-barcode-gs1-data-bar-expanded-stacked', WjcBarcodeGs1DataBarExpandedStacked); 
	}
  
    export class WjcBarcodePdf417 extends wijmo.barcode.composite.Pdf417 { 
		_wjBehaviour: WjComponentBehavior; 

		constructor() {
			super(document.createElement('div'));
			this._wjBehaviour = WjComponentBehavior._attach(<any>this); 
		}

		static get observedAttributes() {
			return WjComponentBehavior.getProps(this);
		}

		connectedCallback() {
			this._wjBehaviour.lhConnected();
		}

		attributeChangedCallback(name: string, oldValue: string, newValue: string) {
			this._wjBehaviour.lhAttributeChanged(name, oldValue, newValue);
		}

		disconnectedCallback() {
			this._wjBehaviour.lhDisconnected();
		}

        addEventListener(...args) {
            if (typeof args[0] === 'string') {
                HTMLElement.prototype.addEventListener.apply(this, args);
            } else {
                super.addEventListener.apply(this, args);
            }
        } 
	}  
    if (_wj_ns_exists_23) {
		WjComponentBehavior.register('wjc-barcode-pdf417', WjcBarcodePdf417); 
	}
  
    export class WjcBarcodeMicroPdf417 extends wijmo.barcode.composite.MicroPdf417 { 
		_wjBehaviour: WjComponentBehavior; 

		constructor() {
			super(document.createElement('div'));
			this._wjBehaviour = WjComponentBehavior._attach(<any>this); 
		}

		static get observedAttributes() {
			return WjComponentBehavior.getProps(this);
		}

		connectedCallback() {
			this._wjBehaviour.lhConnected();
		}

		attributeChangedCallback(name: string, oldValue: string, newValue: string) {
			this._wjBehaviour.lhAttributeChanged(name, oldValue, newValue);
		}

		disconnectedCallback() {
			this._wjBehaviour.lhDisconnected();
		}

        addEventListener(...args) {
            if (typeof args[0] === 'string') {
                HTMLElement.prototype.addEventListener.apply(this, args);
            } else {
                super.addEventListener.apply(this, args);
            }
        } 
	}  
    if (_wj_ns_exists_23) {
		WjComponentBehavior.register('wjc-barcode-micro-pdf417', WjcBarcodeMicroPdf417); 
	}
  
    }
    


    module wijmo.webcomponents {
    

    }
    

    module wijmo.webcomponents {
    

let _wj_ns_exists_24 = wijmo.webcomponents.WjComponentBehavior.ensureNs('wijmo.barcode.specialized', 'DataMatrixEcc000', 'DataMatrixEcc200', 'Code49', 'Code93', 'Itf14', 'Interleaved2of5', 'JapanesePostal');









    export class WjcBarcodeDataMatrixEcc000 extends wijmo.barcode.specialized.DataMatrixEcc000 { 
		_wjBehaviour: WjComponentBehavior; 

		constructor() {
			super(document.createElement('div'));
			this._wjBehaviour = WjComponentBehavior._attach(<any>this); 
		}

		static get observedAttributes() {
			return WjComponentBehavior.getProps(this);
		}

		connectedCallback() {
			this._wjBehaviour.lhConnected();
		}

		attributeChangedCallback(name: string, oldValue: string, newValue: string) {
			this._wjBehaviour.lhAttributeChanged(name, oldValue, newValue);
		}

		disconnectedCallback() {
			this._wjBehaviour.lhDisconnected();
		}

        addEventListener(...args) {
            if (typeof args[0] === 'string') {
                HTMLElement.prototype.addEventListener.apply(this, args);
            } else {
                super.addEventListener.apply(this, args);
            }
        } 
	}  
    if (_wj_ns_exists_24) {
		WjComponentBehavior.register('wjc-barcode-data-matrix-ecc000', WjcBarcodeDataMatrixEcc000); 
	}
  
    export class WjcBarcodeDataMatrixEcc200 extends wijmo.barcode.specialized.DataMatrixEcc200 { 
		_wjBehaviour: WjComponentBehavior; 

		constructor() {
			super(document.createElement('div'));
			this._wjBehaviour = WjComponentBehavior._attach(<any>this); 
		}

		static get observedAttributes() {
			return WjComponentBehavior.getProps(this);
		}

		connectedCallback() {
			this._wjBehaviour.lhConnected();
		}

		attributeChangedCallback(name: string, oldValue: string, newValue: string) {
			this._wjBehaviour.lhAttributeChanged(name, oldValue, newValue);
		}

		disconnectedCallback() {
			this._wjBehaviour.lhDisconnected();
		}

        addEventListener(...args) {
            if (typeof args[0] === 'string') {
                HTMLElement.prototype.addEventListener.apply(this, args);
            } else {
                super.addEventListener.apply(this, args);
            }
        } 
	}  
    if (_wj_ns_exists_24) {
		WjComponentBehavior.register('wjc-barcode-data-matrix-ecc200', WjcBarcodeDataMatrixEcc200); 
	}
  
    export class WjcBarcodeCode49 extends wijmo.barcode.specialized.Code49 { 
		_wjBehaviour: WjComponentBehavior; 

		constructor() {
			super(document.createElement('div'));
			this._wjBehaviour = WjComponentBehavior._attach(<any>this); 
		}

		static get observedAttributes() {
			return WjComponentBehavior.getProps(this);
		}

		connectedCallback() {
			this._wjBehaviour.lhConnected();
		}

		attributeChangedCallback(name: string, oldValue: string, newValue: string) {
			this._wjBehaviour.lhAttributeChanged(name, oldValue, newValue);
		}

		disconnectedCallback() {
			this._wjBehaviour.lhDisconnected();
		}

        addEventListener(...args) {
            if (typeof args[0] === 'string') {
                HTMLElement.prototype.addEventListener.apply(this, args);
            } else {
                super.addEventListener.apply(this, args);
            }
        } 
	}  
    if (_wj_ns_exists_24) {
		WjComponentBehavior.register('wjc-barcode-code49', WjcBarcodeCode49); 
	}
  
    export class WjcBarcodeCode93 extends wijmo.barcode.specialized.Code93 { 
		_wjBehaviour: WjComponentBehavior; 

		constructor() {
			super(document.createElement('div'));
			this._wjBehaviour = WjComponentBehavior._attach(<any>this); 
		}

		static get observedAttributes() {
			return WjComponentBehavior.getProps(this);
		}

		connectedCallback() {
			this._wjBehaviour.lhConnected();
		}

		attributeChangedCallback(name: string, oldValue: string, newValue: string) {
			this._wjBehaviour.lhAttributeChanged(name, oldValue, newValue);
		}

		disconnectedCallback() {
			this._wjBehaviour.lhDisconnected();
		}

        addEventListener(...args) {
            if (typeof args[0] === 'string') {
                HTMLElement.prototype.addEventListener.apply(this, args);
            } else {
                super.addEventListener.apply(this, args);
            }
        } 
	}  
    if (_wj_ns_exists_24) {
		WjComponentBehavior.register('wjc-barcode-code93', WjcBarcodeCode93); 
	}
  
    export class WjcBarcodeItf14 extends wijmo.barcode.specialized.Itf14 { 
		_wjBehaviour: WjComponentBehavior; 

		constructor() {
			super(document.createElement('div'));
			this._wjBehaviour = WjComponentBehavior._attach(<any>this); 
		}

		static get observedAttributes() {
			return WjComponentBehavior.getProps(this);
		}

		connectedCallback() {
			this._wjBehaviour.lhConnected();
		}

		attributeChangedCallback(name: string, oldValue: string, newValue: string) {
			this._wjBehaviour.lhAttributeChanged(name, oldValue, newValue);
		}

		disconnectedCallback() {
			this._wjBehaviour.lhDisconnected();
		}

        addEventListener(...args) {
            if (typeof args[0] === 'string') {
                HTMLElement.prototype.addEventListener.apply(this, args);
            } else {
                super.addEventListener.apply(this, args);
            }
        } 
	}  
    if (_wj_ns_exists_24) {
		WjComponentBehavior.register('wjc-barcode-itf14', WjcBarcodeItf14); 
	}
  
    export class WjcBarcodeInterleaved2of5 extends wijmo.barcode.specialized.Interleaved2of5 { 
		_wjBehaviour: WjComponentBehavior; 

		constructor() {
			super(document.createElement('div'));
			this._wjBehaviour = WjComponentBehavior._attach(<any>this); 
		}

		static get observedAttributes() {
			return WjComponentBehavior.getProps(this);
		}

		connectedCallback() {
			this._wjBehaviour.lhConnected();
		}

		attributeChangedCallback(name: string, oldValue: string, newValue: string) {
			this._wjBehaviour.lhAttributeChanged(name, oldValue, newValue);
		}

		disconnectedCallback() {
			this._wjBehaviour.lhDisconnected();
		}

        addEventListener(...args) {
            if (typeof args[0] === 'string') {
                HTMLElement.prototype.addEventListener.apply(this, args);
            } else {
                super.addEventListener.apply(this, args);
            }
        } 
	}  
    if (_wj_ns_exists_24) {
		WjComponentBehavior.register('wjc-barcode-interleaved2of5', WjcBarcodeInterleaved2of5); 
	}
  
    export class WjcBarcodeJapanesePostal extends wijmo.barcode.specialized.JapanesePostal { 
		_wjBehaviour: WjComponentBehavior; 

		constructor() {
			super(document.createElement('div'));
			this._wjBehaviour = WjComponentBehavior._attach(<any>this); 
		}

		static get observedAttributes() {
			return WjComponentBehavior.getProps(this);
		}

		connectedCallback() {
			this._wjBehaviour.lhConnected();
		}

		attributeChangedCallback(name: string, oldValue: string, newValue: string) {
			this._wjBehaviour.lhAttributeChanged(name, oldValue, newValue);
		}

		disconnectedCallback() {
			this._wjBehaviour.lhDisconnected();
		}

        addEventListener(...args) {
            if (typeof args[0] === 'string') {
                HTMLElement.prototype.addEventListener.apply(this, args);
            } else {
                super.addEventListener.apply(this, args);
            }
        } 
	}  
    if (_wj_ns_exists_24) {
		WjComponentBehavior.register('wjc-barcode-japanese-postal', WjcBarcodeJapanesePostal); 
	}
  
    }
    


    module wijmo.webcomponents {
    

    }
    

    module wijmo.webcomponents {
    

let _wj_ns_exists_25 = wijmo.webcomponents.WjComponentBehavior.ensureNs('wijmo.chart.map', 'FlexMap', 'ScatterMapLayer', 'GeoMapLayer', 'GeoGridLayer', 'ColorScale');









    export class WjcFlexMap extends wijmo.chart.map.FlexMap { 
		_wjBehaviour: WjComponentBehavior; 

		constructor() {
			super(document.createElement('div'));
			this._wjBehaviour = WjComponentBehavior._attach(<any>this); 
		}

		static get observedAttributes() {
			return WjComponentBehavior.getProps(this);
		}

		connectedCallback() {
			this._wjBehaviour.lhConnected();
		}

		attributeChangedCallback(name: string, oldValue: string, newValue: string) {
			this._wjBehaviour.lhAttributeChanged(name, oldValue, newValue);
		}

		disconnectedCallback() {
			this._wjBehaviour.lhDisconnected();
		}

        addEventListener(...args) {
            if (typeof args[0] === 'string') {
                HTMLElement.prototype.addEventListener.apply(this, args);
            } else {
                super.addEventListener.apply(this, args);
            }
        } 
	}  
    if (_wj_ns_exists_25) {
		WjComponentBehavior.register('wjc-flex-map', WjcFlexMap); 
	}
  
    export class WjcScatterMapLayer extends HTMLElement {
        static wrappedClass = () => { return wijmo.chart.map.ScatterMapLayer; };
        static parentProp = 'layers';
        static siblingId = 'layers'; 
		_wjBehaviour: WjComponentBehavior; 

		constructor() {
			super();
			this._wjBehaviour = WjComponentBehavior._attach(<any>this); 
		}

		static get observedAttributes() {
			return WjComponentBehavior.getProps(this);
		}

		connectedCallback() {
			this._wjBehaviour.lhConnected();
		}

		attributeChangedCallback(name: string, oldValue: string, newValue: string) {
			this._wjBehaviour.lhAttributeChanged(name, oldValue, newValue);
		}

		disconnectedCallback() {
			this._wjBehaviour.lhDisconnected();
		} 
	}  
    if (_wj_ns_exists_25) {
		WjComponentBehavior.register('wjc-scatter-map-layer', WjcScatterMapLayer); 
	}
  
    export class WjcGeoMapLayer extends HTMLElement {
        static wrappedClass = () => { return wijmo.chart.map.GeoMapLayer; };
        static parentProp = 'layers';
        static siblingId = 'layers'; 
		_wjBehaviour: WjComponentBehavior; 

		constructor() {
			super();
			this._wjBehaviour = WjComponentBehavior._attach(<any>this); 
		}

		static get observedAttributes() {
			return WjComponentBehavior.getProps(this);
		}

		connectedCallback() {
			this._wjBehaviour.lhConnected();
		}

		attributeChangedCallback(name: string, oldValue: string, newValue: string) {
			this._wjBehaviour.lhAttributeChanged(name, oldValue, newValue);
		}

		disconnectedCallback() {
			this._wjBehaviour.lhDisconnected();
		} 
	}  
    if (_wj_ns_exists_25) {
		WjComponentBehavior.register('wjc-geo-map-layer', WjcGeoMapLayer); 
	}
  
    export class WjcGeoGridLayer extends HTMLElement {
        static wrappedClass = () => { return wijmo.chart.map.GeoGridLayer; };
        static parentProp = 'layers';
        static siblingId = 'layers'; 
		_wjBehaviour: WjComponentBehavior; 

		constructor() {
			super();
			this._wjBehaviour = WjComponentBehavior._attach(<any>this); 
		}

		static get observedAttributes() {
			return WjComponentBehavior.getProps(this);
		}

		connectedCallback() {
			this._wjBehaviour.lhConnected();
		}

		attributeChangedCallback(name: string, oldValue: string, newValue: string) {
			this._wjBehaviour.lhAttributeChanged(name, oldValue, newValue);
		}

		disconnectedCallback() {
			this._wjBehaviour.lhDisconnected();
		} 
	}  
    if (_wj_ns_exists_25) {
		WjComponentBehavior.register('wjc-geo-grid-layer', WjcGeoGridLayer); 
	}
  
    export class WjcColorScale extends HTMLElement {
        static wrappedClass = () => { return wijmo.chart.map.ColorScale; };
        static parentProp = 'colorScale'; 
		_wjBehaviour: WjComponentBehavior; 

		constructor() {
			super();
			this._wjBehaviour = WjComponentBehavior._attach(<any>this); 
		}

		static get observedAttributes() {
			return WjComponentBehavior.getProps(this);
		}

		connectedCallback() {
			this._wjBehaviour.lhConnected();
		}

		attributeChangedCallback(name: string, oldValue: string, newValue: string) {
			this._wjBehaviour.lhAttributeChanged(name, oldValue, newValue);
		}

		disconnectedCallback() {
			this._wjBehaviour.lhDisconnected();
		} 
	}  
    if (_wj_ns_exists_25) {
		WjComponentBehavior.register('wjc-color-scale', WjcColorScale); 
	}
  
    }
    


    module wijmo.webcomponents {
    

    }
    