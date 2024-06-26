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


    module wijmo.angular {
    







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
    


    module wijmo.angular {
    


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
    


    module wijmo.angular {
    // Entry file. All real code files should be re-exported from here.


wijmo._registerModule('wijmo.meta', wijmo.angular);



    }
    

    module wijmo.angular {
    



export class MetaFactory extends ControlMetaFactory {

    // Override to return wijmo.angular.PropDesc
    public static CreateProp(propertyName: string, propertyType: PropertyType,
        changeEvent?: string, enumType?,
        isNativeControlProperty?: boolean, priority?: number): PropDesc {

        return new PropDesc(propertyName, propertyType, changeEvent, enumType, isNativeControlProperty, priority);
    }

    // Override to return wijmo.angular.EventDesc
    public static CreateEvent(eventName: string, isPropChanged?: boolean): EventDesc {
        return new EventDesc(eventName, isPropChanged);
    }

    // Override to return wijmo.angular.ComplexPropDesc
    public static CreateComplexProp(propertyName: string, isArray: boolean, ownsObject?: boolean): ComplexPropDesc {
        return new ComplexPropDesc(propertyName, isArray, ownsObject);
    }

    // Typecast override.
    public static findProp(propName: string, props: PropDesc[]): PropDesc {
        return <PropDesc>ControlMetaFactory.findProp(propName, props);
    }

    // Typecast override.
    public static findEvent(eventName: string, events: EventDesc[]): EventDesc {
        return <EventDesc>ControlMetaFactory.findEvent(eventName, events);
    }

    // Typecast override.
    public static findComplexProp(propName: string, props: ComplexPropDesc[]): ComplexPropDesc {
        return <ComplexPropDesc>ControlMetaFactory.findComplexProp(propName, props);
    }
}

// Describes a scope property: name, type, binding mode. 
// Also defines enum type and custom watcher function extender
export class PropDesc extends PropDescBase {
    private _scopeBindingMode: string;
    private _customHandler: (scope: any/*ng.IScope*/, control: wijmo.Control, value: any, oldValue: any, link: WjLink) => any;

    // Initializes a new instance of a PropDesc
    constructor(propertyName: string, propertyType: PropertyType, changeEvent?: string,
            enumType?, isNativeControlProperty?: boolean, priority?: number) {

        super(propertyName, propertyType, changeEvent, enumType, isNativeControlProperty, priority);

        this._scopeBindingMode = this.propertyType === PropertyType.EventHandler ? '&' :
            (this.bindingMode == BindingMode.OneWay &&
                isSimpleType(this.propertyType) ? '@' : '=');
    }

    // Gets or sets the property binding mode ('@' - by val, '=' - by ref, '&' - expression)
    get scopeBindingMode(): string {
        return this._scopeBindingMode;
    }
    set scopeBindingMode(value: string) {
        this._scopeBindingMode = value;
    }

    // Defines a custom handler function called before assigning a new value to the control property.
    // The handler may optionally return a 'true' value that indicates that assignment is handled 
    // by the handler and prevents the directive from performing the assignment by itself.
    get customHandler(): (scope: any/*ng.IScope*/, control: wijmo.Control, value: any, oldValue: any, link: WjLink) => any {
        return this._customHandler;
    }
    set customHandler(value: (scope: any/*ng.IScope*/, control: wijmo.Control, value: any, oldValue: any, link: WjLink) => any) {
        this._customHandler = value;
    }

}

// Describes a scope event
export class EventDesc extends EventDescBase {
}

// Describes property info for nested directives.
export class ComplexPropDesc extends ComplexPropDescBase {
}

    }
    


    module wijmo.angular {
    


var wjNg: any = window['angular'];






const _ngModules: string[] = [];
export function _registerNgModule(name: string): any {
    let ret = wjNg.module(name, []);
    _ngModules.push(name);
    return ret;
}

/**
 * Returns an array of all registered so far Wijmo Angular module names.
 * These are the names of Angular modules that allows you to obtain a module
 * reference using the <b>angular.module(moduleName)</b> function.
 */
export function getNgModules(): string[] {
    return _ngModules.slice();
}

// Base class for AngularJS directives (abstract class).
//export class WjDirective implements any/*ng.IDirective*/ {
export class WjDirective {
    // TS 2.2.1 bug(?) workaround:
    // error TS2448: Build: Block-scoped variable '_versionOk' used before its declaration.
    // _versionOk should be declared before its usage

    // Determines whether the specified version is not older than the current Angular version.
    static _versionOk(minVer: string): boolean {
        var angVer = wjNg.version;
        var angVerParts = [angVer.major, angVer.minor, angVer.dot];
        var verParts = minVer.split(".");
        if (verParts.length !== angVerParts.length)
            throw 'Unrecognizable version number.';
        for (var i = 0; i < verParts.length; i++) {
            if (angVerParts[i] < verParts[i]) {
                return false;
            }
            else if (angVerParts[i] > verParts[i]) {
                return true;
            }
        }

        return true;
    }

    // Name of the child directive attribute defining a parent property name to assign to.
    static _parPropAttr = 'wjProperty';
    // Name of the attribute that allows to specify an alternative control property controlled by the ng-model directive.
    static _wjModelPropAttr = 'wjModelProperty';
    // Name of the attribute that provides the 'initialized' state value.
    static _initPropAttr = 'isInitialized';
    // Name of the attribute representing the 'initialized' event.
    static _initEventAttr = 'initialized';
    // Name of the property storing a reference to controller (link) scope in controllers.
    static _cntrlScopeProp = '_cntrlScope';
    // Name of the property storing a reference to a scope in DOM element.
    static _elemScopeProp = '_elemCntrl';
    // Name of the property in controller storing a reference to a link owning this controller.
    // Warning: the name must begin with '$', in order to not break tools like ng-inspector - this differentiate
    // special scope properties from scope's data properties.
    static _cntrlLinkProp = '$_thisLink';
    // Name of the scope property storing a collection of child links.
    static _scopeChildrenProp = '$_childLinks';
    // Name of an attribute storing a directive ID
    static _dirIdAttr = 'wj-directive-id';
    // Indicates whether optional scope attributes ('=?') are supported by the current version of Angular.
    static _optionalAttr: boolean = WjDirective._versionOk("1.1.4");
    // Indicates whether DDO.template function is supported by the current version of Angular.
    static _dynaTemplates: boolean = WjDirective._optionalAttr;
    // Attribute prefixes stripped by Angular
    static _angStripPrefixes: string[] = ['data', 'x'];
    private static _dirIdCounter = 0;


    //#region "Angular directive properties"

    // any/*ng.IDirective*/ interface members that are used in Wijmo-Angular interop

    // Directive compile function
    link: (scope: any/*ng.IScope*/,templateElement: any/*ng.IAugmentedJQuery*/,
        templateAttributes: any/*ng.IAttributes*/, controller: any
    ) => any;

    // Directive controller to communicate between nested and hosting directives
    controller: any;

    // Tells directive to replace or not original tag with the template
    replace = true;

    // Indicates this directive requires a parent directive
    require: any;

    // Defines the way directive can be used in HTML
    restrict = 'E'; // all directives are HTML elements

    // Directive scope definition object.
    // Describes directive scope as collection of 'propertyName' : 'mode',
    // NOT the scope object that reflects directives context.
    scope: any;

    // Defines directive's template
    template: any = '<div />';

    // Tells directive to move content into template element marked with
    // 'ng-transclude' attribute
    transclude: any = false;

    //#endregion "Angular directive properties"

    //#region "WIJMO-ANGULAR INTEROP LOGIC"

    //#region Settings
    // For a child directive, the name of parent's property to assign to. Being assigned indicates that this is a child directive.
    // Beign assigned to an empty string indicates that this is a child directive but parent property name should be defined
    // by the wj-property attribute on directive's tag.
    _property: string;
    // For a child directive indicates whether the parent _property is a collection.
    _isPropertyArray: boolean;
    // For a child directive which is not a collection item indicates whether it should create an object or retrieve it 
    // from parent's _property.
    _ownObject: boolean;
    _parentReferenceProperty: string;
    _ngModelProperty: string;
    _isCustomParentInit: boolean;
    //#endregion Settings

    // Directive property map
    // Holds PropDesc[] array with Wijmo control's properties available in directive's scope
    _props: PropDesc[] = [];

    // Directive events map
    // Holds EventDesc[] array with Wijmo control's events available in directive's scope
    _events: EventDesc[] = [];

    // Property descriptions used by nested directives.
    _complexProps: ComplexPropDesc[] = [];
    
    _$parse: any;
    private _stripReq: string[];

    private _dirId: string;

    // Gets the constructor for the related Wijmo control. 
    // Abstract member, must be overridden in inherited class
    get _controlConstructor(): any {
        throw 'Abstract method call';
    }

    // Gets the metadata ID, see the wijmo.meta.getMetaData method description for details.
    _getMetaDataId(): any {
        return this._controlConstructor;
    }

    // Gets directive metadata.
    _getMetaData(): MetaDataBase {
        return MetaFactory.getMetaData(this._getMetaDataId());
    }

    // Initializes a new instance of the DirectiveBase class 
    constructor() {
        var self = this;
        this._dirId = (++WjDirective._dirIdCounter) + '';
        this.link = this._postLinkFn();
        this.controller = ['$scope', '$parse', '$element', function ($scope, $parse, $element) {
            // 'this' points to the controller instance here
            self._$parse = $parse;
            $element[0][WjDirective._elemScopeProp] = $scope;
            this[WjDirective._cntrlScopeProp] = $scope;
            $scope[WjDirective._scopeChildrenProp] = [];
            self._controllerImpl(this, $scope, $element);
        }];

        this._initDirective();

    }

    // Initializes DDO properties
    private _initDirective() {
        this._initSharedMeta();
        this._prepareProps();
        this._initEvents();
        this._initScopeEvents();
        this._initScopeDescription();
    }

    // Initialize _props, _events and _complexProps with the shared metadata from wijmo.meta.ControlMetaFactory.
    _initSharedMeta() {
        var meta = this._getMetaData();
        this._props = <PropDesc[]>meta.props;
        this._events = <EventDesc[]>meta.events;
        this._complexProps = <ComplexPropDesc[]>meta.complexProps;
        this._property = meta.parentProperty;
        this._isPropertyArray = meta.isParentPropertyArray;
        this._ownObject = meta.ownsObject;
        this._parentReferenceProperty = meta.parentReferenceProperty;
        this._ngModelProperty = meta.ngModelProperty;
    }

    // Initializes control's property map. Abstract member, must be overridden in inherited class
    _initProps() {
    }

    // Initializes control's event map. Abstract member, must be overridden in inherited class
    _initEvents() {
    }

    // Creates and returns WjLink instance pertain to the directive.
    _createLink(): WjLink {
        return new WjLink();
    }

    // Implements a controller body, override it to implement a custom controller logic.
    // controller - a pointer to controller object.
    // scope - controller (and corresponding WjLink) scope.
    //
    // The DDO.controller property is occupied by our wrapper that creates a controller with the _cntrlScope property assigned
    // to the controller's scope. The wrapper then calls this method that is intended to implement a custom controller logic.
    _controllerImpl(controller, scope, tElement) {
    }

    // Initializes control owned by the directive 
    _initControl(element: any): any {

        // Try to create Wijmo Control if directive is related to any
        try {
            var controlConstructor = this._controlConstructor;
            var control = new controlConstructor(element); 
            return control;
        }
        // if not - do nothing
        catch (e) {
            // Do nothing. Return 'undefined' explicitly
            return undefined;
        }
    }

    // Indicates whether this directive can operate as a child directive.
    _isChild(): boolean {
        return this._isParentInitializer() || this._isParentReferencer();
    }

    // Indicates whether this directive operates as a child directive that initializes a property of its parent.
    _isParentInitializer(): boolean {
        return this._property != undefined;
    }

    // Indicates whether this directive operates as a child directive that references a parent in its property or
    // a constructor.
    _isParentReferencer(): boolean {
        return this._parentReferenceProperty != undefined;
    }

    // For the specified scope/control property name returns its corresponding directive tag attribute name.
    _scopeToAttrName(scopeName: string): string {
        var alias: string = this.scope[scopeName];
        if (alias) {
            var bindMarkLen = 1,
                aliasLen = alias.length;
            if (aliasLen < 2) {
                return scopeName;
            }
            if (alias.charAt(1) === '?') {
                bindMarkLen = 2;
            }
            if (aliasLen === bindMarkLen) {
                return scopeName;
            }
            return alias.substr(bindMarkLen);
        }
        return scopeName;
    }

    _getComplexPropDesc(propName: string): ComplexPropDesc {
        return MetaFactory.findComplexProp(propName, this._complexProps);
    }

    // Extends control's property map with events
    // Do not confuse with _initEvents(), which is abstract.
    private _initScopeEvents() {
        for (var i in this._events) {
            var event = this._events[i];
            this._props.push(new PropDesc(event.eventName, PropertyType.EventHandler));
        }
    }

    // Creates isolated scope based on directive property map
    private _initScopeDescription() {
        var props = this._props,
            scope = {},
        // 1.1.1
            byRefMark = WjDirective._optionalAttr ? '=?' : '=';

        // fill result object with control properties
        if (props != null) {
            var prop: PropDesc;
            for (var i = 0; i < props.length; i++) {
                prop = props[i];
                scope[prop.propertyName] = prop.scopeBindingMode;
                //1.1.1
                if (WjDirective._optionalAttr && prop.scopeBindingMode == '=')
                    scope[prop.propertyName] = '=?';
            }
        }

        // add property for control
        scope['control'] = byRefMark;
        scope[WjDirective._initPropAttr] = byRefMark; 
        scope[WjDirective._initEventAttr] = '&'; 
        scope[WjDirective._parPropAttr] = '@';
        scope[WjDirective._wjModelPropAttr] = '@';

        // save result
        this.scope = scope;
    }

    // Returns the directive's 'link' function.
    // This is a virtual method, can be overridden by derived classes.
    // @param beforeLinkDelegate Delegate to run before the link function
    // @param afterLinkDelegate Delegate to run after the link function
    // @return Directive's link function
    _postLinkFn()
        : (scope: any, tElement: any/*ng.IAugmentedJQuery*/, tAttrs: any/*ng.IAttributes*/, controller?: any) => void {
        var self = this;

        // Final directive link function
        var linkFunction = function (scope: any, tElement: any/*ng.IAugmentedJQuery*/, tAttrs: any/*ng.IAttributes*/, controller?: any) {

            var link: WjLink = <WjLink> self._createLink();
            link.directive = self;
            link.scope = scope;
            link.tElement = tElement;
            link.tAttrs = tAttrs;

            if (wijmo.isArray(controller)) {
                var parEl = <any>tElement.parent();
                // If working Angular version supports the isolateScope function then we use it, because in this case
                // the scope function returns a non-isolated scope; otherwise we use scope that returns an isolated scope
                // in this case.

                // isolateScope()/scope() will return undefined in case of disabled debug data
                // ( $compileProvider.debugInfoEnabled(false) ). So we store and retrieve
                // the scope from the DOM element ourselves.
                //var scopeFunc: Function = parEl.isolateScope || parEl.scope;
                //var parScope = scopeFunc.call(parEl);
                var parScope = parEl[0][WjDirective._elemScopeProp];
                for (var i in <any[]>controller) {
                    var curCntrl = controller[i];
                    if (curCntrl != undefined) {
                        //if (!link.controller) {
                            if (curCntrl[WjDirective._cntrlScopeProp] === scope) { //points to itself, indicates recursive hierarchy - resolve to parent controller
                                //require parent controller by name
                                curCntrl = (<any>tElement.parent()).controller(self._stripRequire(+i));
                            }
                            if (curCntrl && curCntrl[WjDirective._cntrlScopeProp] === parScope) { // the found parent is our parent
                                link.controller = curCntrl;
                                break;
                                //continue;
                            }
                        //}

                    }
                }
            }
            else {
                link.controller = controller;
            }

            link.ngModel = tElement.controller('ngModel');

            link._link();

        }
        return linkFunction;
    }

    // Gathers PropertyDesc(s) and sorts them (using stable sort) in a priority order.
    private _prepareProps() {
        // gather property descriptors
        this._initProps();
        // stable sort on priority
        var baseArr: PropDesc[] = [].concat(this._props);
        this._props.sort(function (a: PropDesc, b: PropDesc): number {
            var ret = a.priority - b.priority;
            if (!ret) {
                ret = baseArr.indexOf(a) - baseArr.indexOf(b);
            }
            return ret;
        });
    }

    // For the 'require' property represented by an array, returns its value at the specified index stripped of a leading specifier.
    private _stripRequire(index: number): string {
        if (!this._stripReq) {
            this._stripReq = [];
            this._stripReq.length = this['require'].length;
        }
        if (!this._stripReq[index]) {
            var patt = /^[^A-Za-z]*(.*)/
            var res = patt.exec(this['require'][index]);
            this._stripReq[index] = res ? res[1] : '';
        }
        return this._stripReq[index];
    }

    // Gets a directive unique ID
    _getId(): string {
        return this._dirId;
    }

    // removes ng-transclude from the specified elements and all its child elements
    static _removeTransclude(html: string): string {
        if (!html) {
            return html;
        }
        var root = document.createElement('div');
        root.innerHTML = html;
        var transNodes = root.querySelectorAll('[ng-transclude]');
        [].forEach.call(transNodes, function (elem, idx) {
            elem.removeAttribute('ng-transclude');
        });

        return root.innerHTML;
    }

    //#endregion "WIJMO-ANGULAR INTEROP LOGIC"
}

export class WjLink {
    directive: WjDirective;

    //*** Angular link function parameters
    scope: any/*ng.IScope*/;
    tElement: any/*ng.IAugmentedJQuery*/;
    tAttrs: any/*ng.IAttributes*/;
    controller: any;

    //*** Link context
    // Hosts directive's 'template' element
    directiveTemplateElement: any/*JQuery*/;
    // Reference to Wijmo control represented by directive
    control: any;
    // Reference to the parent link of the child directive.
    parent: WjLink;
    // Reference to ng-model controller, if was specified on the directive's element.
    ngModel: any/*ng.INgModelController*/;
    // PropDesc of the property controlled by the ng-model directive
    private _ngModelPropDesc: PropDesc;
    // Hash containing <property name> - true pairs for scope properties that can't be assigned.
    private _nonAssignable = {};
    //For the child directive, stores the info about the parent property. Initially this is the info retrieved from
    //this link's directive. In _parentReady it can be overridden by the property info defined in the parent link's
    //directive, if such an info is defined there for the property that this child services.
    private _parentPropDesc: ComplexPropDesc;
    // Hash containing <property name> - PropDesc pairs for all properties that have defined tag attributes.
    private _definedProps = {};
    // Hash containing <event name> - EventDesc pairs for all events that have defined tag attributes.
    private _definedEvents = {};
    // Hash containing <property name> - any pairs containing previous scope values for the $watch function. 
    private _oldValues = {};
    /* private */ _isInitialized = false;
    private _hasTriggeredInitialized = false;
    private _isNgModelInitialized = false;
    private _scopeSuspend = 0;
    private _suspendedEvents: ISuspendedEventInfo[] = [];
    private _siblingInsertedEH;
    private _destroyEhUnreg;
    _areChlildrenReady = false;
    _isDestroyed = false;


    constructor() {
    }

    public _link() {
        var dir = this.directive,
            self = this;
        this.tElement[0].setAttribute(WjDirective._dirIdAttr, dir._getId());
        this.directiveTemplateElement = dir.replace ? this.tElement : wjNg.element(this.tElement.children()[0]);
        this._initNonAssignable();
        if (this._isChild()) {
            //Defines initial _parentPropDesc, which can be overridden later in the _parentReady method.
            this._parentPropDesc = new ComplexPropDesc(dir._property, dir._isPropertyArray, dir._ownObject);
            // Register this link as a child in the parent link's scope and postpone initialization
            (<WjLink[]>this.controller[WjDirective._cntrlScopeProp][WjDirective._scopeChildrenProp]).push(this);

            var parentScope = this.controller[WjDirective._cntrlScopeProp],
                parentLink = parentScope[WjDirective._cntrlLinkProp];
            if (parentLink && parentLink._areChlildrenReady) {
                this._parentReady(parentLink);
            }
        }
        else {
            this._createInstance();
            this._notifyReady();
            this._prepareControl();
        }

        this._destroyEhUnreg = this.scope.$on('$destroy', function (event: any/*ng.IAngularEvent*/, ...args: any[]): any {
            self._destroy();
        });
    }

    // This method can be overridden to implement custom application of child directives. Child directives are already 
    // initialized at this moment. 
    public _onChildrenReady(): void {
    }

    private _createInstance() {
        this.control = this._initControl();
        this._safeApply(this.scope, 'control', this.control);
    }

    // This method is called by the parent link for the child link to notify that parent link's control is created.
    private _parentReady(parentLink: WjLink): void {
        if (!this._isChild()) 
            return;
        var self = this;
        // In case where parent property name is defined via attribute by a user, in early Angular versions (e.g. 1.1.1)
        // the scope is not initialized with attribute values defined on directive tag. To manage this we watch this attribute
        // and init the link when its value appears.
        if (this._isAttrDefined(WjDirective._parPropAttr) && !this.scope[WjDirective._parPropAttr]) {
            this.scope.$watch(WjDirective._parPropAttr, function () {
                self._parentReady(parentLink);    
            });
            return;
        }
        var parProp = this._getParentProp();
        //Override _parentPropDesc if it's defined for the servicing property in the parent link's directive.
        var parPropDescOverride: ComplexPropDesc = parentLink.directive._getComplexPropDesc(parProp);
        if (parPropDescOverride) {
            this._parentPropDesc = parPropDescOverride;
        }
        else {
            this._parentPropDesc.propertyName = parProp; 
        }
        this.parent = parentLink;
        if (this._useParentObj()) {
            this.control = parentLink.control[parProp];
            this._safeApply(this.scope, 'control', this.control);
        }
        else {
            this._createInstance();
        }
        this._notifyReady();
        this._prepareControl();
        this._initParent();
        this.directiveTemplateElement[0].style.display = 'none';
        this._appliedToParent(); 
    }

    // Assigns/adds this directive's object to the parent object.
    public _initParent(): void {
        if (this._useParentObj())
            return;
        var dir = this.directive,
            propName = this._getParentProp(),
            parCtrl = this.parent.control,
            ctrl = this.control;
        if (this._isParentInitializer()) {
            if (this._isParentArray()) {
                // insert child at correct index, which is the same as an index of the directive element amid sibling directives
                // of the same type
                var parArr = <any[]>parCtrl[propName],
                    linkIdx = this._getIndex();
                if (linkIdx < 0 || linkIdx >= parArr.length) {
                    linkIdx = parArr.length;
                }
                parArr.splice(linkIdx, 0, ctrl);
                var self = this;
                this._siblingInsertedEH = this._siblingInserted.bind(this);
                this.tElement[0].addEventListener('DOMNodeInserted', this._siblingInsertedEH);
            }
            else {
                parCtrl[propName] = ctrl;
            }
        }
        if (this._isParentReferencer() && !this._parentInCtor()) {
            ctrl[this._getParentReferenceProperty()] = parCtrl;
        }
    }

    // Performes directive removal (currently called for child directives only).
    public _destroy() {
        if (this._isDestroyed) {
            return;
        }
        this._isDestroyed = true;
        var control = this.control;
        if (this._destroyEhUnreg) {
            //this._destroyEhUnreg();
            this._destroyEhUnreg = null;
        }
        if (this._siblingInsertedEH) {
            this.tElement[0].removeEventListener('DOMNodeInserted', this._siblingInsertedEH);
        }
        if (this._isParentArray() && !this.parent._isDestroyed) {
            var parControl = this.parent.control,
                parProp = this._getParentProp();
                
            if (parControl && parProp && control) {
                var parArr: any[] = parControl[parProp];
                if (parArr) {
                    var idx = parArr.indexOf(control);
                    if (idx >= 0) {
                        parArr.splice(idx, 1);
                    }
                }
            }
        }
        this.tElement[0][WjDirective._elemScopeProp] = null;
        if (control instanceof wijmo.Control) {
            // We call dispose() with a delay, to get directives such as ng-if/ng-repeat a chance to remove its child subtree
            // before the control will be disposed. Otherwise, Control.dispose() replaces its host element with an assignment 
            // to outerHTML, that creates an element clone in its parent with a different pointer, not the one that
            // ng-if stores locally, so this clone is out of ng-if control and stays in DOM forever.
            setTimeout(function () {
                if ((<wijmo.Control>control).hostElement) {
                    (<wijmo.Control>control).dispose();
                }
            }, 0);
        }
    }

    private _siblingInserted(e) {
        if (e.target === this.tElement[0]) {
            var lIdx = this._getIndex(),
                parArr = <any[]>this.parent.control[this._getParentProp()],
                ctrl = this.control,
                arrIdx = parArr.indexOf(ctrl);
            if (lIdx >= 0 && arrIdx >= 0 && lIdx !== arrIdx) {
                parArr.splice(arrIdx, 1);
                lIdx = Math.min(lIdx, parArr.length);
                parArr.splice(lIdx, 0, ctrl);
            }
        }
    }

    // Notify child links after this directive was attached to its control.
    private _notifyReady(): void {
        // Notify child links
        //
        this.scope[WjDirective._cntrlLinkProp] = this;
        //
        var childLinks: WjLink[] = [].concat(this.scope[WjDirective._scopeChildrenProp]);
        for (var i = 0; i < childLinks.length; i++) {
            childLinks[i]._parentReady(this);
        }
        // Clear children list to free references for GC.
        //childLinks.length = 0; //cleared one by one by the _childInitialized method
        this._areChlildrenReady = true;

        this._onChildrenReady();
    }

    // Creates a control instance owned by the directive. 
    _initControl(): any {
        return this.directive._initControl(this._parentInCtor() ? this.parent.control : this.directiveTemplateElement[0]);
    }

    // Defines scope's default values, registers properties watchers and event handlers
    private _prepareControl() {
        this._addEventHandlers();
        this._addWatchers();
    }

    // Sets control's default values to scope properties
    private _setupScopeWithControlProperties() {
        var prop: PropDesc,
            name: string,
            scopeValue: any,
            controlValue: any,
            control = this.control,
            scope: any/*ng.IScope*/ = this.scope,
            props: PropDesc[] = this.directive._props;

        for (var i = 0; i < props.length; i++) {
            prop = props[i];
            if (prop.scopeBindingMode === '=' && prop.isNativeControlProperty && prop.shouldUpdateSource) {
                name = prop.propertyName;
                scopeValue = scope[name];
                controlValue = control[name];

                var isFunction = prop.propertyType == PropertyType.Function;
                var isEventHandler = prop.propertyType == PropertyType.EventHandler;

                if (this._canApply(scope, prop.propertyName) && 
                        //controlValue != scopeValue && 
                        !this._isEqual(controlValue, scopeValue) &&
                        !isFunction && !isEventHandler) {
                    scope[prop.propertyName] = controlValue;
                }
            }
        }

        if (!scope['$root'].$$phase) {
            scope.$apply();
        }

    }

    private _initNonAssignable() {
        var parse = this.directive._$parse,
            scopeDef = this.directive.scope,
            //props = Object.getOwnPropertyNames(scopeDef),
            binding;
        for (var name in scopeDef) {
            if (scopeDef[name].charAt(0) === '=') {
                binding = this.tAttrs[this.directive._scopeToAttrName(name)];
                if (binding === undefined || parse(binding).assign == undefined) {
                    this._nonAssignable[name] = true;
                }
            }
        }
    }

    _suspendScope() {
        this._scopeSuspend++;
    }

    _resumeScope() {
        if (this._scopeSuspend > 0) {
            if (--this._scopeSuspend === 0 && this._suspendedEvents.length > 0) {
                this._updateScope();
            }
        }
    }

    _isScopeSuspended() {
        return this._scopeSuspend > 0;
    }

    _isAttrDefined(name: string): boolean {
        return this.tAttrs.$attr[this.directive._scopeToAttrName(name)] != null;
    }


    // #region 'initialized' stuff
    private _isAppliedToParent = false;

    // Called by child link when its fully initialized
    _childInitialized(child: WjLink) {
        var childLinks: WjLink[] = this.scope[WjDirective._scopeChildrenProp],
            idx = childLinks.indexOf(child);
        if (idx >= 0) {
            childLinks.splice(idx, 1);
            this._checkRaiseInitialized();
        }
    }

    // Called after first watch on this links has worked out.
    private _thisInitialized() {
        this._checkRaiseInitialized();
    }

    // Called after this control and all its child directives were initialized.
    _initialized() {
    }

    // For the child link, called after this link has applied (added to array, assigned) its object to the parent.
    private _appliedToParent() {
        this._isAppliedToParent = true;
        this._checkRaiseInitialized();
    }

    private _checkRaiseInitialized() {
        if (!this._hasTriggeredInitialized && this.scope[WjDirective._scopeChildrenProp].length === 0 && this._isInitialized
            && (!this._isChild() || this._isAppliedToParent)) {

            this._hasTriggeredInitialized = true;
            this._initialized();
            // set the scope isInitialized property to true
            this._safeApply(this.scope, WjDirective._initPropAttr, true);
            
            // raise the initialized event
            var handler = this.scope[WjDirective._initEventAttr],
                self = this;
            if (handler) {
                // delay the event to allow the 'isInitialized' property value be propagated to a controller scope before 
                // the event is raised
                setTimeout(function () {
                    handler({ s: self.control, e: undefined });
                }, 0);
            }

            //notify parent
            if (this._isChild() && this.parent) {
                this.parent._childInitialized(this);
            }
        }
    }
    //#endregion 'initialized' stuff

    // Adds watchers for scope properties to update control values
    private _addWatchers() {
        var self = this,
            props = this.directive._props,
            scope = this.scope;
        if (!props) {
            return;
        }

        if (this.ngModel) {
            var ngModel = <any>this.ngModel;
            // Patch: in Angular 1.3+ these classes are initially set but then removed by Angular,
            // probably because directive's replace=true ???
            if (ngModel.$pristine) {
                wijmo.addClass(this.tElement[0], 'ng-pristine');
            }
            if (ngModel.$valid) {
                wijmo.addClass(this.tElement[0], 'ng-valid');
            }
            if (ngModel.$untouched) {
                wijmo.addClass(this.tElement[0], 'ng-untouched');
            }
            // end patch
            ngModel.$render = this._ngModelRender.bind(this);
            this._updateNgModelPropDesc();
            if (this._isAttrDefined(WjDirective._wjModelPropAttr)) {
                scope.$watch(WjDirective._wjModelPropAttr, function () {
                    self._updateNgModelPropDesc();
                    self._ngModelRender();
                });
            }
        }

        var i: number,
            name: string,
            prop: PropDesc;
        for (i = 0; i < props.length; i++) {
            prop = props[i];
            name = prop.propertyName;
            if (prop.propertyType !== PropertyType.EventHandler && this._isAttrDefined(name)) {
                this._definedProps[name] = prop;
            }
        }
        var control = this.control;
        scope.$watch(function (scope) {
            if (self._isDestroyed) {
                return;
            }

            try {
                var assignValues = {};
                for (var name in self._definedProps) {
                    if (scope[name] !== self._oldValues[name]) {
                        assignValues[name] = scope[name];
                    }
                }

                for (var name in assignValues) {
                    var newVal = assignValues[name],
                        oldVal = self._oldValues[name];
                    if (newVal !== oldVal) {
                        self._oldValues[name] = newVal;
                        if (self._isInitialized || newVal !== undefined) {

                            // get value from scope
                            var prop = self._definedProps[name],
                                value = self._nullOrValue(self._castValueToType(newVal, prop));

                            // check that the control value is out-of-date
                            var oldCtrlVal = control[name];
                            //if (oldCtrlVal != value) {
                            if (!self._isEqual(oldCtrlVal, value)) {
                                // invoke custom handler (if any) to handle the change
                                var handled = false;
                                if (prop.customHandler != null) {
                                    handled = prop.customHandler(scope, control, value, oldCtrlVal, self);
                                }

                                // apply value to control if it's a native property
                                // (as opposed to directive-only property) and if custom handler
                                // didn't signal that the assignment is already handled
                                if (prop.isNativeControlProperty && handled !== true) {
                                    control[name] = value;
                                }

                            }
                        }
                    }
                }
            }
            finally {
                if (!self._isInitialized) {
                    self._isNgModelInitialized = true;
                    //TBD: apply it according to the associated property's priority order
                    if (self.ngModel) {
                        if (self.ngModel.$viewValue !== undefined) {
                            self._ngModelRender();
                        } else if (self._ngModelPropDesc) {
                            self.ngModel.$setViewValue(control[self._ngModelPropDesc.propertyName]);
                            (<any>self.ngModel).$setPristine();
                        }
                    }
                    self._isInitialized = true;
                    self._setupScopeWithControlProperties();
                    self._thisInitialized();
                }
            }
        });
    }

    // Adds handlers for control events
    private _addEventHandlers() {
        var i: number,
            event: EventDesc,
            evList = this.directive._events;
        for (i = 0; i < evList.length; i++) {
            event = evList[i];
            this._addEventHandler(event); // avoiding 'i' closure
        }
    }
    private _addEventHandler(eventDesc: EventDesc) {
        var self = this,
            eventName = eventDesc.eventName,
            controlEvent: wijmo.Event = this.control[eventName];

        // check that the event name is valid
        if (controlEvent == null) {
            throw 'Event "' + eventName + '" not found in ' + (<any>self).constructor.name;
        }

        var isDefined = this._isAttrDefined(eventName);
        if (isDefined) {
            this._definedEvents[eventName] = eventDesc;
        } else if (!eventDesc.isPropChanged) {
            // don't subscribe if event is neither subscribed nor "isPropChanged" event.
            return;
        }

        var scope = this.scope,
            props = this.directive._props,
            control = this.control;

        // add the event handler
        controlEvent.addHandler(function (s, e) {
            var eventInfo: ISuspendedEventInfo = { eventDesc: eventDesc, s: s, e: e };
            if (self._isScopeSuspended()) {
                self._suspendedEvents.push(eventInfo);
            }
            else {
                self._updateScope(eventInfo);
            }
        }, control);
    }

    // Updates scope values with control values for two-way bindings.
    private _updateScope(eventInfo: ISuspendedEventInfo = null) {
        if (this._isDestroyed) {
            return;
        }

        // apply changes to scope
        var update = eventInfo ? eventInfo.eventDesc.isPropChanged :
            this._suspendedEvents.some(function (value) {
                return value.eventDesc.isPropChanged;
            }),
            self = this;
        //var hasChanges = false;
        if (update) {
            var props = this.directive._props;
            for (var i = 0; i < props.length; i++) {
                var p = props[i];
                if (p.scopeBindingMode == '=' && p.isNativeControlProperty && p.shouldUpdateSource) {
                    var name = p.propertyName,
                        value = this.control[name];
                    if (this._shouldApply(this.scope, name, value)) {
                        this.scope[name] = value;
                        //
                        this.directive._$parse(this.tAttrs[this.directive._scopeToAttrName(name)]).assign(this.scope.$parent, value);
                        //
                        //hasChanges = true;
                    }
                    if (this._ngModelPropDesc && this._isInitialized &&
                            this._ngModelPropDesc.propertyName == name && this.ngModel.$viewValue !== value) {
                        this.ngModel.$setViewValue(value);
                    }
                }
            }
        }

        var raiseEvents = function () {
            var suspEvArr: ISuspendedEventInfo[] = eventInfo ? [eventInfo] : this._suspendedEvents;
            //for (var i in suspEvArr) { 
            for (var i = 0; i < suspEvArr.length; i++) {
                var suspInfo = suspEvArr[i],
                    eventName = suspInfo.eventDesc.eventName,
                    scopeHandler = this.scope[eventName];
                if (self._definedEvents[eventName] && scopeHandler) {
                    scopeHandler({ s: suspInfo.s, e: suspInfo.e });
                }
            }
            if (!eventInfo) {
                this._suspendedEvents.length = 0;
            }
        }.bind(this);

        if (update) {
            if (!this.scope['$root'].$$phase) {
                this.scope.$apply();
                //raiseEvents();
            }
            else {
                // We may be in a call to directive's scope $watch finalizing the digest, so there is a chance that 
                // there will be no more digests and changes made here to directive scope will not propagate to controller
                // scope. To manage with this we initiate one more digest cycle by adding a dummy watch to the scope.
                // We don't use setTimeout($apply(), 0) for this purpose to guarantee that all changes will be applied
                // in this digest where we are now.
                var dispose = this.scope.$watch('value', function () {
                    // dispose the watch right away
                    dispose();
                    //raiseEvents();
                });
            }
        }
        raiseEvents();
    }

    // ngModel.$render function implementation
    private _ngModelRender() {
        if (!this._isNgModelInitialized) {
            return;
        }
        var viewValue = this.ngModel.$viewValue,
            propDesc = this._ngModelPropDesc;
        if (!propDesc || viewValue === undefined && !this._isInitialized) {
            return;
        }
        var value = this._nullOrValue(this._castValueToType(viewValue, propDesc));
        //if (viewValue !== this.control[propDesc.propertyName]) {
        if (!this._isEqualEx(viewValue, this.control[propDesc.propertyName])) {
            this.control[propDesc.propertyName] = viewValue;
        }
    }

    // Casts value to the property type
    private _castValueToType(value: any, prop: PropDesc) {
        return prop.castValueToType(value);

        //if (value == undefined) {
        //    //return undefined;
        //    return value;
        //}

        //var type = prop.propertyType;
        //switch (type) {
        //    case wijmo.meta.PropertyType.Number:
        //        if (typeof value == 'string') {
        //            if (value.indexOf('*') >= 0) { // hack for star width ('*', '2*'...)
        //                return value;
        //            }
        //            if (value.trim() === '') { // binding to an empty html input means null
        //                return null;
        //            }
        //        }
        //        return +value; // cast to number
        //    case wijmo.meta.PropertyType.Boolean:
        //        if (value === 'true') {
        //            return true;
        //        }
        //        if (value === 'false') {
        //            return false;
        //        }
        //        return !!value; // cast to bool
        //    case wijmo.meta.PropertyType.String:
        //        return value + ''; // cast to string
        //    case wijmo.meta.PropertyType.Date:
        //        return this._parseDate(value);
        //    case wijmo.meta.PropertyType.Enum:
        //        if (typeof value === 'number') {
        //            return value;
        //        }
        //        return prop.enumType[value];
        //    default:
        //        return value;
        //}
    }

    //// Parsing DateTime values from string
    //private _parseDate(value) {
    //    if (value && wijmo.isString(value)) {

    //        // For by-val attributes Angular converts a Date object to a
    //        // string wrapped in quotation marks, so we strip them.
    //        value = value.replace(/["']/g, '');

    //        // parse date/time using RFC 3339 pattern
    //        var dt = changeType(value, DataType.Date, 'r');
    //        if (isDate(dt)) {
    //            return dt;
    //        }
    //    }
    //    return value;
    //}

    //Determines whether this is a child link.
    //NOTE: functionality is *not* based on _parentPropDesc
    private _isChild(): boolean {
        return this.directive._isChild();
    }
    // Indicates whether this directive operates as a child directive that initializes a property of its parent.
    private _isParentInitializer(): boolean {
        return this.directive._isParentInitializer();
    }

    // Indicates whether this directive operates as a child directive that references a parent in its property or
    // a constructor.
    private _isParentReferencer(): boolean {
        return this.directive._isParentReferencer();
    }

    //For the child directives returns parent's property name that it services. Property name defined via
    //the wjProperty attribute of directive tag has priority over the directive._property definition.
    //NOTE: functionality is *not* based on _parentPropDesc
    private _getParentProp(): string {
        return this._isParentInitializer() ? this.scope[WjDirective._parPropAttr] || this.directive._property : undefined;
    }

    // For a child directive, the name of the property of the directive's underlying object that receives the reference
    // to the parent, or an empty string that indicates that the reference to the parent should be passed as the 
    // underlying object's constructor parameter.
    private _getParentReferenceProperty(): string {
        return this.directive._parentReferenceProperty;
    }

    // Determines whether the child link uses an object created by the parent property, instead of creating it by
    // itself, and thus object's initialization should be delayed until parent link's control is created.
    //IMPORTANT: functionality is *based* on _parentPropDesc
    private _useParentObj(): boolean {
        return !this._isParentReferencer() &&
            this._isParentInitializer() && !this._parentPropDesc.isArray && !this._parentPropDesc.ownsObject;
    }

    // For the child link, determines whether the servicing parent property is an array.
    //IMPORTANT: functionality is *based* on _parentPropDesc
    private _isParentArray() {
        return this._isParentInitializer() && this._parentPropDesc.isArray;
    }

    // For the child referencer directive, indicates whether the parent should be passed as a parameter the object
    // constructor.
    private _parentInCtor(): boolean {
        return this._isParentReferencer() && this._getParentReferenceProperty() == '';
    }

    private _getNgModelProperty(): string {
        return this.scope[WjDirective._wjModelPropAttr] || this.directive._ngModelProperty;
    }

    private _updateNgModelPropDesc() {
        var ngModelProp = this._getNgModelProperty();
        this._ngModelPropDesc = wijmo.isNullOrWhiteSpace(ngModelProp) ?
            null :
            MetaFactory.findProp(ngModelProp, this.directive._props);
    }

    // apply value to scope and notify
    _safeApply(scope, name, value): boolean {

        // check that value and scope are defined, and that value changed
        if (this._shouldApply(scope, name, value)) {

            // apply new value to scope and notify
            scope[name] = value;
            if (!scope.$root.$$phase) {
                scope.$apply();
            }

            return true;
        }

        return false;
    }

    // Detrmines whether value should be assigned to scope[name], depending on optional attribute support in current Angular version.
    _shouldApply(scope, name, value): boolean {
        //return this._canApply(scope, name) && value != scope[name];
        return this._canApply(scope, name) && !this._isEqual(value, scope[name]);
    }

    // Detrmines whether scope[name] can be safely updated without getting an exception.
    _canApply(scope, name): boolean {
        return !this._nonAssignable[name];
    }

    _isEqual(v1, v2): boolean {
        return v1 == v2 || this._isSpValEq(v1, v2);
    }

    _isEqualEx(v1, v2): boolean {
        return v1 === v2 || this._isSpValEq(v1, v2);
    }

    _isSpValEq(v1, v2) {
        return wijmo.DateTime.equals(v1, v2);
    }

    // Returns null for undefined or null value; otherwise, the original value.
    _nullOrValue(value): any {
        return value != undefined ? value : null;
    }

    // Gets an index of this link among another links pertain to the same directive type.
    _getIndex() {
        var thisEl = this.tElement[0],
            parEl = thisEl.parentElement;
        // If parentElement is null, e.g. because this element is temporary in DocumentFragment, the index
        // of the element isn't relevant to the item's position in the array, so we return -1 and thus force
        // a calling code to not reposition the item in the array at all.  
        if (!parEl) {
            return -1;
        }
        var siblings = parEl.childNodes,
            idx = -1,
            dirId = this.directive._getId();
        for (var i = 0; i < siblings.length; i++) {
            var curEl = <HTMLElement>siblings[i];
            if (curEl.nodeType == 1 && curEl.getAttribute(WjDirective._dirIdAttr) == dirId) {
                ++idx;
                if (curEl === thisEl) {
                    return idx;
                }
            }
        }

        return -1;
    }

}

interface ISuspendedEventInfo {
    eventDesc: EventDesc;
    s: any;
    e: wijmo.EventArgs;
}

    }
    


    module wijmo.angular {
    






















'use strict';

// IMPORTANT: we use softRef prefix instead of the standard 'soft' one
// in order to not duplicate soft reference functions in the wijmo.meta
// module, which is merged to the global version of wijmo.angular under
// the wijmo.angular namespace.
export function softRefChart(): typeof wijmo.chart {
    return wijmo._getModule('wijmo.chart');
}
export function softRefChartAnalytics(): typeof wijmo.chart.analytics {
    return wijmo._getModule('wijmo.chart.analytics');
}
export function softRefChartAnimation(): typeof wijmo.chart.animation {
    return wijmo._getModule('wijmo.chart.animation');
}
export function softRefChartAnnotation(): typeof wijmo.chart.annotation {
    return wijmo._getModule('wijmo.chart.annotation');
}
export function softRefChartFinance(): typeof wijmo.chart.finance {
    return wijmo._getModule('wijmo.chart.finance');
}
export function softRefChartFinanceAnalytics(): typeof wijmo.chart.finance.analytics {
    return wijmo._getModule('wijmo.chart.finance.analytics');
}
export function softRefChartHierarchical(): typeof wijmo.chart.hierarchical {
    return wijmo._getModule('wijmo.chart.hierarchical');
}
export function softRefChartInteraction(): typeof wijmo.chart.interaction {
    return wijmo._getModule('wijmo.chart.interaction');
}
export function softRefChartRadar(): typeof wijmo.chart.radar {
    return wijmo._getModule('wijmo.chart.radar');
}
export function softRefGauge(): typeof wijmo.gauge {
    return wijmo._getModule('wijmo.gauge');
}
export function softRefGrid(): typeof wijmo.grid {
    return wijmo._getModule('wijmo.grid');
}
export function softRefGridDetail(): typeof wijmo.grid.detail {
    return wijmo._getModule('wijmo.grid.detail');
}
export function softRefGridFilter(): typeof wijmo.grid.filter {
    return wijmo._getModule('wijmo.grid.filter');
}
export function softRefGridGrouppanel(): typeof wijmo.grid.grouppanel {
    return wijmo._getModule('wijmo.grid.grouppanel');
}
export function softRefGridMultirow(): typeof wijmo.grid.multirow {
    return wijmo._getModule('wijmo.grid.multirow');
}
export function softRefGridSheet(): typeof wijmo.grid.sheet {
    return wijmo._getModule('wijmo.grid.sheet');
}
export function softRefNav(): typeof wijmo.nav {
    return wijmo._getModule('wijmo.nav');
}
export function softRefOlap(): typeof wijmo.olap {
    return wijmo._getModule('wijmo.olap');
}
export function softRefViewer(): typeof wijmo.viewer {
    return wijmo._getModule('wijmo.viewer');
}
export function softRefInput(): typeof wijmo.input {
    return wijmo._getModule('wijmo.input');
}

    }
    


    module wijmo.angular {
    

// Note: we export soft references because other modules should
// use them from here, to prevent duplicates in the global module.


    }
    

    module wijmo.angular {
    


var wjNg: any = window['angular'];






//#region "Input directives registration"

const wijmoInputName = 'wj.input';


// do not use moduleName here, it's removed from the global module version
var wijmoInput = _registerNgModule(wijmoInputName); // angular module for Wijmo inputs

// register only if module is loaded
if (softRefInput()) {

    wijmoInput.directive('wjAutoComplete', ['$compile', function ($compile) {
        return new WjAutoComplete($compile);
    }]);

    wijmoInput.directive('wjCalendar', [function () {
        return new WjCalendar();
    }]);

    wijmoInput.directive('wjColorPicker', [function () {
        return new WjColorPicker();
    }]);

    wijmoInput.directive('wjComboBox', ['$compile', function ($compile) {
        return new WjComboBox($compile);
    }]);

    wijmoInput.directive('wjInputDate', [function () {
        return new WjInputDate();
    }]);

    wijmoInput.directive('wjInputDateTime', [function () {
        return new WjInputDateTime();
    }]);

    wijmoInput.directive('wjInputNumber', [function () {
        return new WjInputNumber();
    }]);

    wijmoInput.directive('wjInputMask', [function () {
        return new WjInputMask();
    }]);

    wijmoInput.directive('wjInputTime', ['$compile', function ($compile) {
        return new WjInputTime($compile);
    }]);

    wijmoInput.directive('wjInputColor', [function () {
        return new WjInputColor();
    }]);

    wijmoInput.directive('wjListBox', [function () {
        return new WjListBox();
    }]);

    wijmoInput.directive('wjItemTemplate', ['$compile', function ($compile) {
        return new WjItemTemplate($compile);
    }]);

    wijmoInput.directive('wjMenu', ['$compile', function ($compile) {
        return new WjMenu($compile);
    }]);

    wijmoInput.directive('wjMenuItem', [function ($compile) {
        return new WjMenuItem();
    }]);

    wijmoInput.directive('wjMenuSeparator', [function () {
        return new WjMenuSeparator();
    }]);

    wijmoInput.directive('wjContextMenu', [function () {
        return new WjContextMenu();
    }]);

    wijmoInput.directive('wjCollectionViewNavigator', [function () {
        return new WjCollectionViewNavigator();
    }]);

    wijmoInput.directive('wjCollectionViewPager', [function () {
        return new WjCollectionViewPager();
    }]);

    wijmoInput.directive('wjPopup', [function () {
        return new WjPopup();
    }]);

    wijmoInput.directive('wjMultiSelect', ['$compile', function ($compile) {
        return new WjMultiSelect($compile);
    }]);

    wijmoInput.directive('wjMultiAutoComplete', ['$compile', function ($compile) {
        return new WjMultiAutoComplete($compile);
    }]);
}

//#endregion "Input directives definitions"

//#region "Input directives classes"

// DropDown control directive
// Provides base setup for all directives related to controls derived from DropDown
// Abstract class, not for use in markup
export class WjDropDown extends WjDirective {

    get _controlConstructor() {
        return wijmo.input.DropDown;
    }
}


/**
 * AngularJS directive for the {@link ComboBox} control.
 *
 * Use the <b>wj-combo-box</b> directive to add <b>ComboBox</b> controls to your AngularJS applications. 
 * Note that directive and parameter names must be formatted as lower-case with dashes 
 * instead of camel-case. For example:
 * 
 * <pre>&lt;p&gt;Here is a ComboBox control:&lt;/p&gt;
 * &lt;wj-combo-box 
 *   text="theCountry" 
 *   items-source="countries"
 *   is-editable="false" 
 *   placeholder="country"&gt;
 * &lt;/wj-combo-box&gt;</pre>
 *
 * The example below creates a <b>ComboBox</b> control and binds it to a 'countries' array
 * exposed by the controller. The <b>ComboBox</b> searches for the country as the user
 * types. The <b>isEditable</b> property is set to false, so the user is forced to
 * select one of the items in the list.
 *
 * <a href="https://jsfiddle.net/Wijmo5/37GHw/" target="_blank">Example</a>
 *
 * The <b>wj-combo-box</b> directive supports the following attributes:
 * 
 * <dl class="dl-horizontal">
 *   <dt>ng-model</dt>      <dd><code>@</code> Binds the control's <b>selectedValue</b> property using the ng-model Angular 
 *                          directive. Binding the property using the ng-model directive provides standard benefits 
 *                          like validation, adding the control's state to the form instance, and so on. To redefine 
 *                          properties on a control that is bound by the ng-model directive, use the wj-model-property 
 *                          attribute.</dd>
 *   <dt>wj-model-property</dt>  <dd><code>@</code> Specifies a control property that is bound to a scope using the 
 *                               <b>ng-model</b> directive.</dd>
 *   <dt>control</dt>              <dd><code>=</code> A reference to the {@link ComboBox} control created by this directive.</dd>
 *   <dt>display-member-path</dt>  <dd><code>@</code> The name of the property to use as the visual representation of the items.</dd>
 *   <dt>is-content-html</dt>      <dd><code>@</code> A value indicating whether the drop-down list displays the items as plain text or as HTML.</dd>
 *   <dt>is-dropped-down</dt>      <dd><code>@</code> A value indicating whether the drop down list is currently visible.</dd>
 *   <dt>is-editable</dt>          <dd><code>@</code> A value indicating whether the user can enter values not present on the list.</dd>
 *   <dt>initialized</dt>          <dd><code>&</code> This event occurs after the binding has finished initializing the control with attribute values.</dd>
 *   <dt>is-initialized</dt>       <dd><code>=</code> A value indicating whether the binding has finished initializing the control with attribute values.</dd>
 *   <dt>item-formatter</dt>       <dd><code>=</code> A function used to customize the values shown in the drop-down list.</dd>
 *   <dt>items-source</dt>         <dd><code>=</code> An array or {@link ICollectionView} that contains items to show in the list.</dd>
 *   <dt>max-drop-down-height</dt> <dd><code>@</code> The maximum height of the drop-down list.</dd>
 *   <dt>max-drop-down-width</dt>  <dd><code>@</code> The maximum width of the drop-down list.</dd>
 *   <dt>placeholder</dt>          <dd><code>@</code> A string shown as a hint when the control is empty.</dd>
 *   <dt>is-required</dt>          <dd><code>@</code> A value indicating whether to prevent null values.</dd>
 *   <dt>show-drop-down-button</dt><dd><code>@</code> A value indicating whether the control displays a drop-down button.</dd>
 *   <dt>selected-index</dt>       <dd><code>=</code> The index of the currently selected item in the drop-down list.</dd>
 *   <dt>selected-item</dt>        <dd><code>=</code> The currently selected item in the drop-down list.</dd>
 *   <dt>selected-value</dt>       <dd><code>=</code> The value of the selected item, obtained using the <b>selected-value-path</b>.</dd>
 *   <dt>selected-value-path</dt>  <dd><code>@</code> The name of the property used to get the <b>selected-value</b> from the <b>selected-item</b>.</dd>
 *   <dt>text</dt>                 <dd><code>=</code> The text to show in the control.</dd>
 *   <dt>is-dropped-down-changing</dt> <dd><code>&</code> The {@link ComboBox.isDroppedDownChanging} event handler.</dd>
 *   <dt>is-dropped-down-changed</dt>  <dd><code>&</code> The {@link ComboBox.isDroppedDownChanged} event handler.</dd>
 *   <dt>selected-index-changed</dt>   <dd><code>&</code> The {@link ComboBox.selectedIndexChanged} event handler.</dd>
 *   <dt>got-focus</dt>            <dd><code>&</code> The {@link ComboBox.gotFocus} event handler.</dd>
 *   <dt>lost-focus</dt>           <dd><code>&</code> The {@link ComboBox.lostFocus} event handler.</dd>
 *   <dt>text-changed</dt>         <dd><code>&</code> The {@link ComboBox.textChanged} event handler.</dd>
 * </dl>
 */
export class WjComboBox extends WjDropDown {

    _$compile: any/*ng.ICompileService*/;

    constructor($compile: any/*ng.ICompileService*/) {
        super();

        this._$compile = $compile;

        this.template = '<div ng-transclude />';
        this.transclude = true;
    }

    // Gets the Combobox control constructor
    get _controlConstructor() /* : new (elem: HTMLElement) => wijmo.Control */ {
        return wijmo.input.ComboBox;
    }
}

/**
 * AngularJS directive for the {@link AutoComplete} control.
 *
 * Use the <b>wj-auto-complete</b> directive to add <b>AutoComplete</b> controls to your 
 * AngularJS applications. Note that directive and parameter names must be 
 * formatted as lower-case with dashes instead of camel-case. For example:
 * 
 * <pre>&lt;p&gt;Here is an AutoComplete control:&lt;/p&gt;
 * &lt;wj-auto-complete
 *   text="theCountry" 
 *   items-source="countries"
 *   is-editable="false" 
 *   placeholder="country"&gt;
 * &lt;/wj-auto-complete&gt;</pre>
 *
 * The example below creates an <b>AutoComplete</b> control and binds it to a 'countries' array
 * exposed by the controller. The <b>AutoComplete</b> searches for the country as the user
 * types, and narrows down the list of countries that match the current input.
 * 
 * <a href="https://jsfiddle.net/Wijmo5/37GHw/" target="_blank">Example</a>
 * 
 * The <b>wj-auto-complete</b> directive extends {@link wijmo.angular.input.WjComboBox} with the following attributes:
 * 
 * <dl class="dl-horizontal">
 *   <dt>css-match</dt>            <dd><code>@</code> The name of the CSS class used to highlight 
 *                                 parts of the content that match the search terms.</dd>
 *   <dt>delay</dt>                <dd><code>@</code> The amount of delay in milliseconds between 
 *                                 when a keystroke occurs and when the search is performed.</dd>
 *   <dt>items-source-function</dt><dd><code>=</code> A function that provides the items 
 *                                 dynamically as the user types.</dd>
 *   <dt>max-items</dt>            <dd><code>@</code> The maximum number of items to display 
 *                                 in the dropdown.</dd>
 *   <dt>min-length</dt>           <dd><code>@</code> The minimum input length to require before 
 *                                 triggering autocomplete suggestions.</dd>
 * </dl>
 */
export class WjAutoComplete extends WjComboBox {

    constructor($compile: any/*ng.ICompileService*/) {
        super($compile);
    }

    // Gets AutoComplete control constructor
    get _controlConstructor() /*: new (elem: HTMLElement) => wijmo.Control */ {
        return wijmo.input.AutoComplete;
    }
}

/**
 * AngularJS directive for the {@link Calendar} control.
 *
 * Use the <b>wj-calendar</b> directive to add <b>Calendar</b> controls to your 
 * AngularJS applications. 
 * Note that directive and parameter names must be formatted as lower-case with dashes 
 * instead of camel-case. For example:
 * 
 * <pre>&lt;p&gt;Here is a Calendar control:&lt;/p&gt;
 * &lt;wj-calendar 
 *   value="theDate"&gt;
 * &lt;/wj-calendar&gt;</pre>
 *
 * <a href="https://jsfiddle.net/Wijmo5/46PhD/" target="_blank">Example</a>
 * 
 * This example creates a <b>Calendar</b> control and binds it to a 'date' variable
 * exposed by the controller. The range of dates that may be selected is limited
 * by the <b>min</b> and <b>max</b> properties.
 * 
 * The <b>wj-calendar</b> directive supports the following attributes:
 * 
 * <dl class="dl-horizontal">
 *   <dt>ng-model</dt>      <dd><code>@</code> Binds the control's <b>value</b> property using the ng-model Angular 
 *                          directive. Binding the property using the ng-model directive provides standard benefits 
 *                          like validation, adding the control's state to the form instance, and so on. To redefine 
 *                          properties on a control that is bound by the ng-model directive, use the wj-model-property 
 *                          attribute.</dd>
 *   <dt>wj-model-property</dt>  <dd><code>@</code> Specifies a control property that is bound to a scope using the 
 *                               <b>ng-model</b> directive.</dd>
 *   <dt>control</dt>        <dd><code>=</code> A reference to the {@link Calendar} control 
 *                           created by this directive.</dd>
 *   <dt>display-month</dt>  <dd><code>=</code> The month being displayed in the calendar.</dd>
 *   <dt>first-day-of-week</dt> <dd><code>@</code> The first day of the week.</dd>
 *   <dt>initialized</dt>          <dd><code>&</code> This event occurs after the binding has finished
 *                                 initializing the control with attribute values.</dd>
 *   <dt>is-initialized</dt>       <dd><code>=</code> A value indicating whether the binding has finished
 *                                 initializing the control with attribute values. </dd>
 *   <dt>item-formatter</dt> <dd><code>=</code> The function used to customize the dates 
 *                           shown in the calendar.</dd>
 *   <dt>max</dt>            <dd><code>@</code> The latest valid date (string in the 
 *                           format "yyyy-MM-dd").</dd>
 *   <dt>min</dt>            <dd><code>@</code> The earliest valid date (string in the 
 *                           format "yyyy-MM-dd").</dd>
 *   <dt>month-view</dt>     <dd><code>@</code> A value indicating whether the control displays 
 *                           a month or the entire year.</dd>
 *   <dt>show-header</dt>    <dd><code>@</code> A value indicating whether the control displays 
 *                           the header area.</dd>
 *   <dt>value</dt>          <dd><code>=</code> The date being edited.</dd>
 *   <dt>got-focus</dt>      <dd><code>&</code> The {@link Calendar.gotFocus} event handler.</dd>
 *   <dt>lost-focus</dt>     <dd><code>&</code> The {@link Calendar.lostFocus} event handler.</dd>
 *   <dt>value-changed</dt>  <dd><code>&</code> The {@link Calendar.valueChanged} event handler.</dd>
 * </dl>
 *
 * If provided, the <b>min</b> and <b>max</b> attributes are strings in the format
 * "yyyy-MM-dd." Technically, you can use any full date as defined in the W3C
 * <a href="https://tools.ietf.org/html/rfc3339" target="_blank">[RFC 3339]</a>,
 * which is also the format used with regular HTML5 input elements.
 */
export class WjCalendar extends WjDirective {

    // Gets the Calendar control constructor
    get _controlConstructor(): new (elem: HTMLElement) => wijmo.Control {
        return wijmo.input.Calendar;
    }
}

/**
 * AngularJS directive for the {@link ColorPicker} control.
 *
 * Use the <b>wj-color-picker</b> directive to add <b>ColorPicker</b> controls to your 
 * AngularJS applications. Note that directive and parameter names must be 
 * formatted as lower-case with dashes instead of camel-case. For example:
 * 
 * <pre>&lt;p&gt;Here is a ColorPicker control:&lt;/p&gt;
 * &lt;wj-color-picker
 *   value="theColor"
 *   show-alpha-channel="false"&gt;
 * &lt;/wj-color-picker&gt;</pre>
 *
 * The <b>wj-color-picker</b> directive supports the following attributes:
 * 
 * <dl class="dl-horizontal">
 *   <dt>ng-model</dt>      <dd><code>@</code> Binds the control's <b>value</b> property using the ng-model Angular 
 *                          directive. Binding the property using the ng-model directive provides standard benefits 
 *                          like validation, adding the control's state to the form instance, and so on. To redefine 
 *                          properties on a control that is bound by the ng-model directive, use the wj-model-property 
 *                          attribute.</dd>
 *   <dt>wj-model-property</dt>  <dd><code>@</code> Specifies a control property that is bound to a scope using the 
 *                               <b>ng-model</b> directive.</dd>
 *   <dt>control</dt>           <dd><code>=</code> A reference to the {@link ColorPicker} 
 *                              control created by this directive.</dd>
 *   <dt>initialized</dt>          <dd><code>&</code> This event occurs after the binding has finished
 *                                 initializing the control with attribute values.</dd>
 *   <dt>is-initialized</dt>       <dd><code>=</code> A value indicating whether the binding has finished
 *                                 initializing the control with attribute values. </dd>
 *   <dt>show-alpha-channel</dt><dd><code>@</code> A value indicating whether the control 
 *                              displays the alpha channel (transparency) editor.</dd>
 *   <dt>show-color-string</dt> <dd><code>@</code> A value indicating whether the control 
 *                              displays a string representation of the color being edited.</dd>
 *   <dt>palette</dt>           <dd><code>=</code> An array with ten color values to use 
 *                              as the palette.</dd>
 *   <dt>value</dt>             <dd><code>=</code> The color being edited.</dd>
 *   <dt>got-focus</dt>         <dd><code>&</code> The {@link ColorPicker.gotFocus} event handler.</dd>
 *   <dt>lost-focus</dt>        <dd><code>&</code> The {@link ColorPicker.lostFocus} event handler.</dd>
 *   <dt>value-changed</dt>     <dd><code>&</code> The {@link ColorPicker.valueChanged} event handler.</dd>
 * </dl>
 */
export class WjColorPicker extends WjDirective {

    // Gets the ColorPicker control constructor
    get _controlConstructor(): new (elem: HTMLElement) => wijmo.Control {
        return wijmo.input.ColorPicker;
    }
}

/**
 * AngularJS directive for the {@link ListBox} control.
 *
 * Use the <b>wj-list-box</b> directive to add {@link ListBox} controls to your 
 * AngularJS applications. 
 * Note that directive and parameter names must be formatted as lower-case with dashes 
 * instead of camel-case. For example:
 * 
 * <pre>b&gt;Here is a ListBox control:&lt;/p&gt;
 * &lt;wj-list-box
 *   selected-item="theCountry" 
 *   items-source="countries"
 *   placeholder="country"&gt;
 * &lt;/wj-list-box&gt;</pre>
 *
 * The example below creates a <b>ListBox</b> control and binds it to a 'countries' array
 * exposed by the controller. The value selected is bound to the 'theCountry' 
 * controller property using the <b>selected-item</b> attribute.
 *
 * <a href="https://jsfiddle.net/Wijmo5/37GHw/" target="_blank">Example</a>
 * 
 * The <b>wj-list-box</b> directive supports the following attributes:
 * 
 * <dl class="dl-horizontal">
 *   <dt>ng-model</dt>      <dd><code>@</code> Binds the control's <b>selectedValue</b> property using the ng-model Angular 
 *                          directive. Binding the property using the ng-model directive provides standard benefits 
 *                          like validation, adding the control's state to the form instance, and so on. To redefine 
 *                          properties on a control that is bound by the ng-model directive, use the wj-model-property 
 *                          attribute.</dd>
 *   <dt>wj-model-property</dt>  <dd><code>@</code> Specifies a control property that is bound to a scope using the 
 *                               <b>ng-model</b> directive.</dd>
 *   <dt>control</dt>              <dd><code>=</code> A reference to the {@link ListBox} 
 *                                 control created by this directive.</dd>
 *   <dt>display-member-path</dt>  <dd><code>@</code> The property to use as the visual 
 *                                 representation of the items.</dd>
 *   <dt>is-content-html</dt>      <dd><code>@</code> A value indicating whether items 
 *                                 contain plain text or HTML.</dd>
 *   <dt>initialized</dt>          <dd><code>&</code> This event occurs after the binding has finished
 *                                 initializing the control with attribute values.</dd>
 *   <dt>is-initialized</dt>       <dd><code>=</code> A value indicating whether the binding has finished
 *                                 initializing the control with attribute values. </dd>
 *   <dt>item-formatter</dt>       <dd><code>=</code> A function used to customize the 
 *                                 values to show in the list.</dd>
 *   <dt>items-source</dt>         <dd><code>=</code> An array or {@link ICollectionView} 
 *                                 that contains the list items.</dd>
 *   <dt>max-height</dt>           <dd><code>@</code> The maximum height of the list.</dd>
 *   <dt>selected-index</dt>       <dd><code>=</code> The index of the currently selected 
 *                                 item.</dd>
 *   <dt>selected-item</dt>        <dd><code>=</code> The item that is currently selected.</dd>
 *   <dt>selected-value</dt>       <dd><code>=</code> The value of the <b>selected-item</b> 
 *                                 obtained using the <b>selected-value-path</b>.</dd>
 *   <dt>selected-value-path</dt>  <dd><code>@</code> The property used to get the 
 *                                 <b>selected-value</b> from the <b>selected-item</b>.</dd>
 *   <dt>got-focus</dt>            <dd><code>&</code> The {@link ListBox.gotFocus} event handler.</dd>
 *   <dt>lost-focus</dt>           <dd><code>&</code> The {@link ListBox.lostFocus} event handler.</dd>
 *   <dt>items-changed</dt>        <dd><code>&</code> The {@link ListBox.itemsChanged} event handler.</dd>
 *   <dt>selected-index-changed</dt> <dd><code>&</code> The {@link ListBox.selectedIndexChanged} event handler.</dd>
 * </dl>
 *
 * The <b>wj-list-box</b> directive may contain {@link wijmo.angular.input.WjItemTemplate} child directive.
 */
export class WjListBox extends WjDirective {

    constructor() {
        super();

        this.transclude = true;
        this.template = '<div ng-transclude />';
    }

    // Gets the ListBox control constructor
    get _controlConstructor(): new (elem: HTMLElement) => wijmo.Control {
        return wijmo.input.ListBox;
    }
}

/**
 * AngularJS directive for {@link ListBox} and {@link Menu} item templates.
 *
 * The <b>wj-item-template</b> directive must be contained in a {@link wijmo.angular.input.WjListBox} 
 * or {@link wijmo.angular.input.WjMenu} directives.
 *
 * The <b>wj-item-template</b> directive defines a template for items of <b>ListBox</b> 
 * and data-bound <b>Menu</b> controls. 
 * The template may contain an arbitrary HTML fragment with AngularJS bindings and directives.
 * In addition to any properties available in a controller, the local <b>$item</b>, 
 * <b>$itemIndex</b> and <b>$control</b> template variables can be used in AngularJS bindings
 * that refer to the data item, its index, and the owner control.
 *
 * Note that directive and parameter names must be formatted as lower-case with dashes
 * instead of camel-case. For example:
 *
 * <pre>&lt;p&gt;Here is a ListBox control with an item template:&lt;/p&gt;
 * &lt;wj-list-box items-source="musicians"&gt;
 *     &lt;wj-item-template&gt;
 *         {&#8203;{$itemIndex}}. &lt;b&gt;{&#8203;{$item.name}}&lt;/b&gt;
 *         &lt;br /&gt;
 *         &lt;img ng-src="{&#8203;{$item.photo}}"/&gt;
 *     &lt;/wj-item-template&gt;
 * &lt;/wj-list-box&gt;</pre>
 */
export class WjItemTemplate extends WjDirective {

    static _itemTemplateProp = '$__wjItemTemplate';
    static _itemScopeProp = '$_itemScope';

    _$compile: any/*ng.ICompileService*/;

    constructor($compile: any/*ng.ICompileService*/) {
        super();

        this._$compile = $compile;

        this.require = ['?^wjListBox', '?^wjMenu'];

        // The same approach like in WjFlexGridColumn
        this['terminal'] = true;
        if (WjDirective._dynaTemplates) {
            this.transclude = false;
            this['priority'] = 100;
            this.template = function (tElement, tAttrs) {
                tAttrs[WjItemTemplate._itemTemplateProp] = tElement[0].innerHTML;
                return '<div />';
            }
    } else {
            this.transclude = true;
            this.template = '<div ng-transclude/>';
        }
    }

    _initControl(element: any): any {
        return {};
    }

    _createLink(): WjLink {
        return new WjItemTemplateLink();
    }

    _getMetaDataId(): any {
        return 'ItemTemplate';
    }

}

class WjItemTemplateLink extends WjLink {

    itemTemplate: string;

    private _tmplLink;
    private _closingApplyTimeOut;

    public _initParent(): void {
        super._initParent();

        // get column template (HTML content)
        var dynaTempl = this.tAttrs[WjItemTemplate._itemTemplateProp],
            ownerControl = this.parent.control,
            listBox = this._getListBox();
        this.itemTemplate = dynaTempl != null ? dynaTempl : WjDirective._removeTransclude(this.tElement[0].innerHTML);
        listBox.formatItem.addHandler(this._fmtItem, this);
        listBox.loadingItems.addHandler(this._loadingItems, this);

        if (this.parent._isInitialized) {
            ownerControl.invalidate();
        }
    }

    public _destroy() {
        var ownerControl = this.parent && this.parent.control,
            listBox = this._getListBox();
        if (listBox) {
            listBox.formatItem.removeHandler(this._fmtItem, this);
            listBox.loadingItems.removeHandler(this._loadingItems, this);
        }
        super._destroy();
        this._tmplLink = null;
        if (ownerControl) {
            ownerControl.invalidate();
        }
    }

    private _loadingItems(s: wijmo.Control) {
        var items = s.hostElement.getElementsByClassName('wj-listbox-item');
        for (var i = items.length - 1; i >= 0; i--) {
            var itemEl = items[i],
                itemScope = /*<ng.IScope>*/itemEl[WjItemTemplate._itemScopeProp];
            if (itemScope) {
                itemEl[WjItemTemplate._itemScopeProp] = null;
                itemScope.$destroy();
            }
        }
    }

    private _fmtItem(s: wijmo.Control, e: wijmo.input.FormatItemEventArgs) {
        if (!this._tmplLink) {
            this._tmplLink = (<WjItemTemplate>this.directive)._$compile(
                //'<div style="display:none">' + this.itemTemplate + '</div>');
                '<div>' + this.itemTemplate + '</div>');
        }
        var itemEl = e.item,
            itemScope = this.scope.$parent.$new();
        itemEl[WjItemTemplate._itemScopeProp] = itemScope;
        itemScope['$control'] = s;
        itemScope['$item'] = e.data;
        itemScope['$itemIndex'] = e.index;

        var clonedElement = this._tmplLink(itemScope, function (clonedEl, scope) { })[0];
        //var dispose = itemScope.$watch(function (scope) {
        //    dispose();
        //    clonedElement.style.display = '';
        //});
        if (itemEl.childNodes.length === 1) {
            itemEl.replaceChild(clonedElement, itemEl.firstChild);
        } else {
            itemEl.textContent = '';
            itemEl.appendChild(clonedElement);
        }

        var lag = 40;
        clearTimeout(this._closingApplyTimeOut);
        this._closingApplyTimeOut = setTimeout(function () {
            if (!itemScope['$root'].$$phase) {
                itemScope.$apply();
            }
        }, lag);

    }

    private static _invalidateControl(parentControl: wijmo.Control) {
        if (parentControl) {
            parentControl.invalidate();
        }
    }

    // Gets a ListBox control whose items are templated, it maybe the control itself or internal ListBox used by controls like
    // ComboBox.
    private _getListBox() {
        var ownerControl = this.parent && this.parent.control;
        if (ownerControl) {
            return ownerControl instanceof wijmo.input.ListBox ? ownerControl : ownerControl.listBox;
        }
        return null;
    }
}


/**
 * AngularJS directive for the {@link Menu} control.
 *
 * Use the <b>wj-menu</b> directive to add drop-down menus to your AngularJS applications. 
 * Note that directive and parameter names must be formatted as lower-case with dashes 
 * instead of camel-case. For example:
 * 
 * <pre>&lt;p&gt;Here is a Menu control used as a value picker:&lt;/p&gt;
 * &lt;wj-menu header="Tax" value="tax"&gt;
 *   &lt;wj-menu-item value="0"&gt;Exempt&lt;/wj-menu-item&gt;
 *   &lt;wj-menu-item value=".05"&gt;5%&lt;/wj-menu-item&gt;
 *   &lt;wj-menu-item value=".1"&gt;10%&lt;/wj-menu-item&gt;
 *   &lt;wj-menu-item value=".15"&gt;15%&lt;/wj-menu-item&gt;
 * &lt;/wj-menu&gt;</pre>
 *
 * <a href="https://jsfiddle.net/Wijmo5/Wc5Mq/" target="_blank">Example</a>
 * 
 * This example creates three <b>Menu</b> controls. The first is used as a value picker, 
 * the second uses a list of commands with parameters, and the third is a group of
 * three menus handled by an <b>itemClicked</b> function in the controller.
 *
 * The <b>wj-menu</b> directive extends {@link wijmo.angular.input.WjComboBox} with the following attributes:
 *
 * <dl class="dl-horizontal">
 *   <dt>command-path</dt>          <dd><code>@</code> The command to be executed when the item is clicked.</dd>
 *   <dt>command-parameter-path</dt><dd><code>@</code> The name of the property that contains command parameters.</dd>
 *   <dt>header</dt>                <dd><code>@</code> The text shown on the control.</dd>
 *   <dt>is-button</dt>             <dd><code>@</code> Whether the menu should react to clicks on its header area.</dd>
 *   <dt>value</dt>                 <dd><code>@</code> The value of the selected <b>wj-menu-item</b> value property. </dd>
 *   <dt>item-clicked</dt>          <dd><code>&</code> The {@link Menu.itemClicked} event handler.</dd>
 *   <dt>got-focus</dt>             <dd><code>&</code> The {@link Menu.gotFocus} event handler.</dd>
 *   <dt>lost-focus</dt>            <dd><code>&</code> The {@link Menu.lostFocus} event handler.</dd>
 * </dl>
 *
 *The <b>wj-menu</b> directive may contain the following child directives:
    *{@link wijmo.angular.input.WjMenuItem}, {@link wijmo.angular.input.WjMenuSeparator} and {@link wijmo.angular.input.WjItemTemplate}(in case of data-bound Menu control).
    */
export class WjMenu extends WjComboBox {

    // Initializes a new instance of a WjMenu
    constructor($compile: any/*ng.ICompileService*/) {
        super($compile);
    }

    // Gets the Menu control constructor
    get _controlConstructor() /* : new (elem: HTMLElement) => wijmo.Control */ {
        return wijmo.input.Menu;
    }

    _createLink(): WjLink {
        return new WjMenuLink();
    }

    // WjMenu property map
    _initProps() {
        super._initProps();
        var self = this; // store this in closure as .apply() call overrides the reference
        var valueDesc = MetaFactory.findProp('value', this._props);
        valueDesc.customHandler = function (scope, control, value, oldValue, link) {
            self.updateControlValue(scope, control, link);
        };
    }

    updateControlValue(scope, control, link: WjLink) {
        if (scope.value != null) {
            control.selectedValue = scope.value;
            (<WjMenu>link.directive).updateHeader(scope, control, link);
        }
    }

    // if the scope has a value, show it in the header
    updateHeader(scope, control, link: WjLink) {
        control.header = scope.header || '';
        var selItem = control.selectedItem;
        if (typeof (scope.value) != 'undefined' && selItem && control.displayMemberPath) {
            var itemLink = <WjMenuItemLink>selItem[WjMenuItem._itemLinkProp];
            var currentValue = itemLink ? itemLink.linkedContent.innerHTML : selItem[control.displayMemberPath];
            if (currentValue != null) {
                control.header += ': <b>' + currentValue + '</b>';
            }
        }
    }
}

class WjMenuLink extends WjLink {

    private _closingApplyTimeOut;

    _initControl(): any {
        var self = this,
            control = new wijmo.input.Menu(this.directiveTemplateElement[0],
                {
                    itemsSource: new wijmo.collections.ObservableArray(),
                    selectedIndex: 0,
                    itemClicked: function () {
                        if (!self._safeApply(self.scope, 'value', control.selectedValue)) {
                            // this is necessary to ensure a digest after command's code was executed,
                            // because this code may change controller scope properties
                            if (!self.scope['$root'].$$phase) {
                                self.scope.$apply();
                            }
                        }
                        (<WjMenu>self.directive).updateHeader(self.scope, control, self);
                    }.bind(self),
                });
        control.listBox.formatItem.addHandler(self._fmtItem, this);
        control.listBox.loadingItems.addHandler(this._loadingItems, this);
        return control;
    }

    _initialized() {
        (<WjMenu>this.directive).updateControlValue(this.scope, this.control, this);
    }

    private _fmtItem(s: wijmo.Control, e: wijmo.input.FormatItemEventArgs) {
        var itemLink = <WjMenuItemLink>e.data[WjMenuItem._itemLinkProp];
        if (!itemLink) {
            return;
        }
        if (!itemLink.contentLink) {
            itemLink.contentLink = (<WjItemTemplate>this.directive)._$compile(
                //'<div style="display:none">' + itemLink.itemTemplate + '</div>');
                '<div>' + itemLink.itemTemplate + '</div>');
        }
        var self = this,
            itemEl = e.item,
            itemScope = itemLink.scope.$parent.$new();
        itemEl[WjMenuItem._itemScopeProp] = itemScope;
        itemScope['$control'] = this.control;
        itemScope['$item'] = e.data;
        itemScope['$itemIndex'] = e.index;

        var clonedElement = itemLink.linkedContent = itemLink.contentLink(itemScope, function (clonedEl, scope) { })[0];
        if (itemLink.isSeparator) {
            wijmo.addClass(itemEl, 'wj-state-disabled');
        }
        if (itemEl.childNodes.length === 1) {
            itemEl.replaceChild(clonedElement, itemEl.firstChild);
        } else {
            itemEl.textContent = '';
            itemEl.appendChild(clonedElement);
        }

        var lag = 40;
        clearTimeout(this._closingApplyTimeOut);
        this._closingApplyTimeOut = setTimeout(function () {
            if (!itemScope['$root'].$$phase) {
                itemScope.$apply();
            }
            // update header with a resolved linked content of a selected item
            // if there is a selected item (TFS 193428)
            if (self.control.selectedItem) {
                (<WjMenu>self.directive).updateHeader(self.scope, self.control, self);
            }
        }, lag);
    }

    private _loadingItems(s: wijmo.Control) {
        var items = s.hostElement.getElementsByClassName('wj-listbox-item');
        for (var i = items.length - 1; i >= 0; i--) {
            var itemEl = items[i],
                itemScope = /*<ng.IScope>*/itemEl[WjMenuItem._itemScopeProp];
            if (itemScope) {
                itemEl[WjItemTemplate._itemScopeProp] = null;
                itemScope.$destroy();
            }
        }
    }
}

/**
 * AngularJS directive for menu items.
 *
 * The <b>wj-menu-item</b> directive must be contained in a {@link wijmo.angular.input.WjMenu} directive.
 * It supports the following attributes:
 *
 * <dl class="dl-horizontal">
 *   <dt>cmd</dt>       <dd><code>=</code> The function to execute in the controller 
 *                      when the item is clicked.</dd>
 *   <dt>cmd-param</dt>  <dd><code>=</code> The parameter passed to the <b>cmd</b> function 
 *                      when the item is clicked.</dd>
 *   <dt>value</dt>     <dd><code>=</code> The value to select when the item is clicked 
 *                      (use either this or <b>cmd</b>).</dd>
 * </dl>
 *
 * The content displayed by the item may contain an arbitrary HTML fragment with AngularJS bindings and directives.
 * You can also use <b>ng-repeat</b> and <b>ng-if</b> directives to populate the items in the Menu control.
 * In addition to any properties available in a controller, the local <b>$item</b>, 
 * <b>$itemIndex</b> and <b>$control</b> template variables can be used in AngularJS bindings
 * that refer to the data item, its index, and the owner control.
 */
export class WjMenuItem extends WjDirective {

    static _itemTemplateProp = '$__wjMenuItemTemplate';
    static _itemScopeProp = '$_menuItemScope';
    static _itemLinkProp = '$_menuItemLink';
    static _directiveId = 'menuItemDir';

    constructor() {
        super();

        this.require = '^wjMenu';

        // The same approach like in WjFlexGridColumn
        this['terminal'] = true;
        if (WjDirective._dynaTemplates) {
            this.transclude = false;
            this['priority'] = 100;
            this.template = function (tElement, tAttrs) {
                tAttrs[WjItemTemplate._itemTemplateProp] = tElement[0].innerHTML;
                return '<div />';
            }
        } else {
            this.transclude = true;
                this.template = '<div ng-transclude/>';
        }
    }

    _createLink(): WjLink {
        return new WjMenuItemLink(false);
    }

    _getMetaDataId(): any {
        return 'MenuItem';
    }

    _getId(): string {
        return WjMenuItem._directiveId;
    }
}

// Used for both WjMenuItem and WjMenuSeparator
class WjMenuItemLink extends WjLink {

    itemTemplate: string;
    contentLink: any;
    linkedContent: HTMLElement;
    isSeparator: boolean;

    // parameter indicates whether the link is used with WjMenuItem and WjMenuSeparator.
    constructor(isSeparator) {
        super();
        this.isSeparator = isSeparator;
    }

    _initControl(): any {
        var dynaTempl = this.tAttrs[WjItemTemplate._itemTemplateProp];
        this.itemTemplate = this.isSeparator ?
            '<div class="wj-state-disabled" style="width:100%;height:1px;background-color:lightgray"></div>' :
            dynaTempl != null ? dynaTempl : WjDirective._removeTransclude(this.tElement[0].innerHTML);
        var ret = { value: null, cmd: null, cmdParam: null, header: this.itemTemplate };
        ret[WjMenuItem._itemLinkProp] = this;
        return ret;
    }

    public _initParent(): void {
        super._initParent();
        var ownerControl = <wijmo.input.Menu>this.parent.control;
        if (ownerControl.itemsSource.length == 1 && ownerControl.selectedIndex < 0) {
            ownerControl.selectedIndex = 0;
        }
        if (!ownerControl.displayMemberPath) {
            ownerControl.displayMemberPath = 'header';
        }
        if (!ownerControl.selectedValuePath) {
            ownerControl.selectedValuePath = 'value';
        }
        if (!ownerControl.commandPath) {
            ownerControl.commandPath = 'cmd';
        }
        if (!ownerControl.commandParameterPath) {
            ownerControl.commandParameterPath = 'cmdParam';
        }
    }

    public _destroy() {
        var ownerControl = this.parent && this.parent.control;
        super._destroy();
        if (ownerControl) {
            ownerControl.invalidate();
        }
    }

}


/**
 * AngularJS directive for menu separators.
 *
 * The <b>wj-menu-item-separator</b> directive must be contained in a {@link wijmo.angular.input.WjMenu} directive.
 * It adds a non-selectable separator to the menu, and has no attributes.
 */
export class WjMenuSeparator extends WjDirective {

    // Initializes a new instance of a WjMenuSeparator
    constructor() {
        super();
        this.template = '<span />';
        this.require = '^wjMenu';
    }

    _getMetaDataId(): any {
        return 'MenuSeparator';
    }

    _createLink(): WjLink {
        return new WjMenuItemLink(true);
    }

    _getId(): string {
        return WjMenuItem._directiveId;
    }

}

/**
 * AngularJS directive for context menus.
 *
 * Use the <b>wj-context-menu</b> directive to add context menus to elements
 * on the page. The wj-context-menu directive is based on the <b>wj-menu</b> 
 * directive; it displays a popup menu when the user performs a context menu
 * request on an element (usually a right-click).
 *
 * The wj-context-menu directive is specified as a parameter added to the 
 * element that the context menu applies to. The parameter value is a 
 * CSS selector for the element that contains the menu. For example:
 *
 * <pre>&lt;!-- paragraph with a context menu --&gt;
 *&lt;p wj-context-menu="#idMenu" &gt;
    *  This paragraph has a context menu.&lt;/p&gt;
    *
    *&lt;!-- define the context menu (hidden and with an id) --&gt;
    *&lt;wj-menu id="idMenu" ng-show="false"&gt;
    *  &lt;wj-menu-item cmd="cmdOpen" cmd-param ="1"&gt;Open...&lt;/wj-menu-item&gt;
    *  &lt;wj-menu-item cmd="cmdSave" cmd-param="2"&gt;Save &lt;/wj-menu-item&gt;
    *  &lt;wj-menu-item cmd="cmdSave" cmd-param="3"&gt;Save As...&lt;/wj-menu-item&gt;
    *  &lt;wj-menu-item cmd="cmdNew" cmd-param ="4"&gt;New...&lt;/wj-menu-item&gt;
    *  &lt;wj-menu-separator&gt;&lt;/wj-menu-separator&gt;
    *  &lt;wj-menu-item cmd="cmdExit" cmd-param="5"&gt;Exit&lt;/wj-menu-item&gt;
    *&lt;/wj-menu &gt;</pre>
    */
export class WjContextMenu extends WjDirective {

    // Initializes a new instance of a WjContextMenu
    constructor() {
        super();
        this.template = undefined;
        //this.require = '^wjMenu';
        this.restrict = 'A';
        this.scope = false;
    }

    _getMetaDataId(): any {
        return 'WjContextMenu';
    }

    // Gets the WjContextMenu's link function. Overrides parent member
    _postLinkFn() {
        return function (scope: any, tElement: any/*ng.IAugmentedJQuery*/, tAttrs: any/*ng.IAttributes*/) {

            // get context menu and drop-down list
            var host = wijmo.getElement(tAttrs['wjContextMenu']);

            // show the drop-down list in response to the contextmenu command
            tElement[0].addEventListener('contextmenu', function (e) {
                var menu = <wijmo.input.Menu>wijmo.Control.getControl(host),
                    dropDown = menu.dropDown;
                if (menu && dropDown && !wijmo.closest(e.target, '[disabled]')) {
                    e.preventDefault();
                    menu.owner = tElement[0];
                    menu.show(e);
                }
            });
        };
    }
}

/**
 * AngularJS directive for the {@link InputDate} control.
 *
 * Use the <b>wj-input-date</b> directive to add {@link InputDate} controls to your 
 * AngularJS applications. 
 * Note that directive and parameter names must be formatted as lower-case with dashes 
 * instead of camel-case. For example:
 * 
 * <pre>&lt;p&gt;Here is an InputDate control:&lt;/p&gt;
 * &lt;wj-input-date 
 *   value="theDate" 
 *   format="M/d/yyyy"&gt;
 * &lt;/wj-input-date&gt;</pre>
 *
 * The example below shows a <b>Date</b> value (that includes date and time information)
 * using an {@link InputDate} and an {@link InputTime} control. Notice how both controls
 * are bound to the same controller variable, and each edits the appropriate information
 * (either date or time). The example also shows a {@link Calendar} control that can be
 * used to select the date with a single click.
 *
 * <a href="https://jsfiddle.net/Wijmo5/46PhD/" target="_blank">Example</a>
 * 
 * The <b>wj-input-date</b> directive supports the following attributes:
 * 
 * <dl class="dl-horizontal">
 *   <dt>ng-model</dt>      <dd><code>@</code> Binds the control's <b>value</b> property using the ng-model Angular 
 *                          directive. Binding the property using the ng-model directive provides standard benefits 
 *                          like validation, adding the control's state to the form instance, and so on. To redefine 
 *                          properties on a control that is bound by the ng-model directive, use the wj-model-property 
 *                          attribute.</dd>
 *   <dt>wj-model-property</dt>  <dd><code>@</code> Specifies a control property that is bound to a scope using the <b>ng-model</b> directive.</dd>
 *   <dt>control</dt>            <dd><code>=</code> A reference to the {@link InputDate} control created by this directive.</dd>
 *   <dt>format</dt>             <dd><code>@</code> The format used to display the date being edited (see {@link Globalize}).</dd>
 *   <dt>mask</dt>               <dd><code>@</code> The mask used to validate the input as the user types (see {@link wijmo.input.InputMask}).</dd>
 *   <dt>is-dropped-down</dt>    <dd><code>@</code> A value indicating whether the drop-down is currently visible.</dd>
 *   <dt>initialized</dt>        <dd><code>&</code> This event occurs after the binding has finished initializing the control with attribute values.</dd>
 *   <dt>is-initialized</dt>     <dd><code>=</code> A value indicating whether the binding has finished initializing the control with attribute values. </dd>
 *   <dt>max</dt>                <dd><code>@</code> The latest valid date (a string in the format "yyyy-MM-dd").</dd>
 *   <dt>min</dt>                <dd><code>@</code> The earliest valid date (a string in the format "yyyy-MM-dd").</dd>
 *   <dt>placeholder</dt>        <dd><code>@</code> The string to show as a hint when the control is empty.</dd>
 *   <dt>is-required</dt>        <dd><code>@</code> A value indicating whether to prevent null values.</dd>
 *   <dt>show-drop-down-button</dt><dd><code>@</code> A value indicating whether the control displays a drop-down button.</dd>
 *   <dt>text</dt>               <dd><code>=</code> The text to show in the control.</dd>
 *   <dt>value</dt>              <dd><code>=</code> The date being edited.</dd>
 *   <dt>got-focus</dt>          <dd><code>&</code> The {@link InputDate.gotFocus} event handler.</dd>
 *   <dt>lost-focus</dt>         <dd><code>&</code> The {@link InputDate.lostFocus} event handler.</dd>
 *   <dt>is-dropped-down-changing</dt> <dd><code>&</code> The {@link InputDate.isDroppedDownChanging} event handler.</dd>
 *   <dt>is-dropped-down-changed </dt> <dd><code>&</code> The {@link InputDate.isDroppedDownChanged} event handler.</dd>
 *   <dt>text-changed</dt>       <dd><code>&</code> The {@link InputDate.textChanged} event handler.</dd>
 *   <dt>value-changed</dt>      <dd><code>&</code> The {@link InputDate.valueChanged} event handler.</dd>
 * </dl>
 *
 * If provided, the <b>min</b> and <b>max</b> attributes are strings in the format
 * "yyyy-MM-dd". Technically, you can use any full date as defined in the W3C
 * <a href="https://tools.ietf.org/html/rfc3339" target="_blank">[RFC 3339]</a>, which is also
 * the format used with regular HTML5 input elements.
 */
export class WjInputDate extends WjDropDown {

    // Gets the InputDate control constructor
    get _controlConstructor() /* : new (elem: HTMLElement) => wijmo.Control */ {
        return wijmo.input.InputDate;
    }
}

/**
 * AngularJS directive for the {@link InputDateTime} control.
 *
 * Use the <b>wj-input-date-time</b> directive to add {@link InputDateTime} controls to your 
 * AngularJS applications. 
 * Note that directive and parameter names must be formatted as lower-case with dashes 
 * instead of camel-case. For example:
 * 
 * <pre>&lt;p&gt;Here is an InputDateTime control:&lt;/p&gt;
 * &lt;wj-input-date-time 
 *   value="theDate" 
 *   format="M/d/yyyy"&gt;
 * &lt;/wj-input-date-time&gt;</pre>
 *
 * The <b>wj-input-date-time</b> directive supports the following attributes:
 * 
 * <dl class="dl-horizontal">
 *   <dt>ng-model</dt>      <dd><code>@</code> Binds the control's <b>value</b> property using the ng-model Angular 
 *                          directive. Binding the property using the ng-model directive provides standard benefits 
 *                          like validation, adding the control's state to the form instance, and so on. To redefine 
 *                          properties on a control that is bound by the ng-model directive, use the wj-model-property 
 *                          attribute.</dd>
 *   <dt>wj-model-property</dt>  <dd><code>@</code> Specifies a control property that is bound to a scope using the <b>ng-model</b> directive.</dd>
 *   <dt>control</dt>            <dd><code>=</code> A reference to the {@link InputDate} control created by this directive.</dd>
 *   <dt>format</dt>             <dd><code>@</code> The format used to display the date being edited (see {@link Globalize}).</dd>
 *   <dt>mask</dt>               <dd><code>@</code> The mask used to validate the input as the user types (see {@link wijmo.input.InputMask}).</dd>
 *   <dt>is-dropped-down</dt>    <dd><code>@</code> A value indicating whether the drop-down is currently visible.</dd>
 *   <dt>initialized</dt>        <dd><code>&</code> This event occurs after the binding has finished initializing the control with attribute values.</dd>
 *   <dt>is-initialized</dt>     <dd><code>=</code> A value indicating whether the binding has finished initializing the control with attribute values. </dd>
 *   <dt>max</dt>                <dd><code>@</code> The latest valid date (a string in the format "yyyy-MM-dd").</dd>
 *   <dt>min</dt>                <dd><code>@</code> The earliest valid date (a string in the format "yyyy-MM-dd").</dd>
 *   <dt>placeholder</dt>        <dd><code>@</code> The string to show as a hint when the control is empty.</dd>
 *   <dt>is-required</dt>        <dd><code>@</code> A value indicating whether to prevent null values.</dd>
 *   <dt>show-drop-down-button</dt><dd><code>@</code> A value indicating whether the control displays a drop-down button.</dd>
 *   <dt>text</dt>               <dd><code>=</code> The text to show in the control.</dd>
 *   <dt>timeMax</dt>            <dd><code>@</code> The earliest valid time (a string in the format "hh:mm").</dd>
 *   <dt>timeMin</dt>            <dd><code>@</code> The latest valid time (a string in the format "hh:mm").</dd>
 *   <dt>timeStep</dt>           <dd><code>@</code> The number of minutes between entries in the drop-down list.</dd>
 *   <dt>timeFormat</dt>         <dd><code>@</code> The format sting used to show values in the time drop-down list.</dd>
 *   <dt>value</dt>              <dd><code>=</code> The date being edited.</dd>
 *   <dt>got-focus</dt>          <dd><code>&</code> The {@link InputDateTime.gotFocus} event handler.</dd>
 *   <dt>lost-focus</dt>         <dd><code>&</code> The {@link InputDateTime.lostFocus} event handler.</dd>
 *   <dt>is-dropped-down-changing</dt> <dd><code>&</code> The {@link InputDateTime.isDroppedDownChanging} event handler.</dd>
 *   <dt>is-dropped-down-changed </dt> <dd><code>&</code> The {@link InputDateTime.isDroppedDownChanged} event handler.</dd>
 *   <dt>text-changed</dt>       <dd><code>&</code> The {@link InputDateTime.textChanged} event handler.</dd>
 *   <dt>value-changed</dt>      <dd><code>&</code> The {@link InputDateTime.valueChanged} event handler.</dd>
 * </dl>
 */
export class WjInputDateTime extends WjInputDate {

    // Gets the InputDateTime control constructor
    get _controlConstructor() {
        return wijmo.input.InputDateTime;
    }
}

/**
 * AngularJS directive for the {@link InputNumber} control.
 *
 * Use the <b>wj-input-number</b> directive to add <b>InputNumber</b> controls to your 
 * AngularJS applications. 
 * Note that directive and parameter names must be formatted as lower-case with dashes 
 * instead of camel-case. For example:
 * 
 * <pre>&lt;p&gt;Here is an InputNumber control:&lt;/p&gt;
 * &lt;wj-input-number
 *   value="theNumber"
 *   min="0"
 *   max="10"
 *   format="n0"
 *   placeholder="number between zero and ten"&gt;
 * &lt;/wj-input-number&gt;</pre>
 *
 * The example below creates several <b>InputNumber</b> controls and shows the effect
 * of using different formats, ranges, and step values.
 * 
 * <a href="https://jsfiddle.net/Wijmo5/u7HpD/" target="_blank">Example</a>
 *
 * The <b>wj-input-number</b> directive supports the following attributes:
 * 
 * <dl class="dl-horizontal">
 *   <dt>ng-model</dt>      <dd><code>@</code> Binds the control's <b>value</b> property using the ng-model Angular 
 *                          directive. Binding the property using the ng-model directive provides standard benefits 
 *                          like validation, adding the control's state to the form instance, and so on. To redefine 
 *                          properties on a control that is bound by the ng-model directive, use the wj-model-property 
 *                          attribute.</dd>
 *   <dt>wj-model-property</dt>  <dd><code>@</code> Specifies a control property that is bound to a scope using the <b>ng-model</b> directive.</dd>
 *   <dt>control</dt>       <dd><code>=</code> A reference to the {@link InputNumber} control created by this directive.</dd>
 *   <dt>format</dt>        <dd><code>@</code> The format used to display the number (see {@link Globalize}).</dd>
 *   <dt>input-type</dt>    <dd><code>@</code> The "type" attribute of the HTML input element hosted by the control.</dd>
 *   <dt>initialized</dt>   <dd><code>&</code> This event occurs after the binding has finished initializing the control with attribute values.</dd>
 *   <dt>is-initialized</dt><dd><code>=</code> A value indicating whether the binding has finished initializing the control with attribute values. </dd>
 *   <dt>max</dt>           <dd><code>@</code> The largest valid number.</dd>
 *   <dt>min</dt>           <dd><code>@</code> The smallest valid number.</dd>
 *   <dt>place-holder</dt>  <dd><code>@</code> The string to show as a hint when the control is empty.</dd>
 *   <dt>is-required</dt>   <dd><code>@</code> A value indicating whether to prevent null values.</dd>
 *   <dt>show-spinner</dt>  <dd><code>@</code> A value indicating whether to display spinner buttons to change the value by <b>step</b> units.</dd>
 *   <dt>step</dt>          <dd><code>@</code> The amount to add or subtract to the value when the user clicks the spinner buttons.</dd>
 *   <dt>text</dt>          <dd><code>=</code> The text to show in the control.</dd>
 *   <dt>value</dt>         <dd><code>=</code> The number being edited.</dd>
 *   <dt>got-focus</dt>     <dd><code>&</code> The {@link InputNumber.gotFocus} event handler.</dd>
 *   <dt>lost-focus</dt>    <dd><code>&</code> The {@link InputNumber.lostFocus} event handler.</dd>
 *   <dt>text-changed</dt>  <dd><code>&</code> The {@link InputNumber.textChanged} event handler.</dd>
 *   <dt>value-changed</dt> <dd><code>&</code> The {@link InputNumber.valueChanged} event handler.</dd>
 * </dl>
 */
export class WjInputNumber extends WjDirective {

    // Gets the InputNumber control constructor
    get _controlConstructor(): new (elem: HTMLElement) => wijmo.Control {
        return wijmo.input.InputNumber;
    }
}


/**
 * AngularJS directive for the {@link InputMask} control.
 *
 * Use the <b>wj-input-mask</b> directive to add {@link InputMask} controls to your 
 * AngularJS applications. 
 * Note that directive and parameter names must be formatted as lower-case with dashes 
 * instead of camel-case. For example:
 * 
 * <pre>&lt;p&gt;Here is an InputMask control:&lt;/p&gt;
 * &lt;wj-input-mask
 *   mask="99/99/99"
 *   mask-placeholder="*"&gt;
 * &lt;/wj-input-mask&gt;</pre>
 *
 * The <b>wj-input-mask</b> directive supports the following attributes:
 * 
 * <dl class="dl-horizontal">
 *   <dt>ng-model</dt>      <dd><code>@</code> Binds the control's <b>value</b> property using the ng-model Angular 
 *                          directive. Binding the property using the ng-model directive provides standard benefits 
 *                          like validation, adding the control's state to the form instance, and so on. To redefine 
 *                          properties on a control that is bound by the ng-model directive, use the wj-model-property 
 *                          attribute.</dd>
 *   <dt>wj-model-property</dt> <dd><code>@</code> Specifies a control property that is bound to a scope using the <b>ng-model</b> directive.</dd>
 *   <dt>control</dt>           <dd><code>=</code> A reference to the {@link InputNumber} control created by this directive.</dd>
 *   <dt>initialized</dt>       <dd><code>&</code> This event occurs after the binding has finished initializing the control with attribute values.</dd>
 *   <dt>is-initialized</dt>    <dd><code>=</code> A value indicating whether the binding has finished initializing the control with attribute values. </dd>
 *   <dt>mask</dt>              <dd><code>@</code> The string mask used to format the value as the user types.</dd>
 *   <dt>prompt-char</dt>       <dd><code>@</code> A character used to show input locations within the mask.</dd>
 *   <dt>place-holder</dt>      <dd><code>@</code> The string to show as a hint when the control is empty.</dd>
 *   <dt>value</dt>             <dd><code>=</code> The string being edited.</dd>
 *   <dt>raw-value</dt>         <dd><code>=</code> The string being edited, excluding literal and prompt characters.</dd>
 *   <dt>got-focus</dt>         <dd><code>&</code> The {@link InputMask.gotFocus} event handler.</dd>
 *   <dt>lost-focus</dt>        <dd><code>&</code> The {@link InputMask.lostFocus} event handler.</dd>
 *   <dt>value-changed</dt>     <dd><code>&</code> The {@link InputMask.valueChanged} event handler.</dd>
 * </dl>
 */
export class WjInputMask extends WjDirective {

    // Gets the InputMask control constructor
    get _controlConstructor(): new (elem: HTMLElement) => wijmo.Control {
        return wijmo.input.InputMask;
    }
}

/**
 * AngularJS directive for the {@link InputTime} control.
 *
 * Use the <b>wj-input-time</b> directive to add <b>InputTime</b> controls to your AngularJS applications. 
 * Note that directive and parameter names must be formatted as lower-case with dashes 
 * instead of camel-case. For example:
 * 
 * <pre>&lt;p&gt;Here is an InputTime control:&lt;/p&gt;
 * &lt;wj-input-time 
 *   value="theDate" 
 *   format="h:mm tt"
 *   min="09:00" max="17:00"
 *   step="15"&gt;
 * &lt;/wj-input-time&gt;</pre>
 *
 * <a href="https://jsfiddle.net/Wijmo5/46PhD/" target="_blank">Example</a>
 * 
 * This example edits a <b>Date</b> value (that includes date and time information)
 * using an {@link InputDate} and an InputTime control. Notice how both controls
 * are bound to the same controller variable, and each edits the appropriate information
 * (either date or time). The example also shows a {@link Calendar} control that can be
 * used to select the date with a single click.
 * 
 * The <b>wj-input-time</b> directive extends {@link wijmo.angular.input.WjComboBox} with the following attributes:
 * 
 * <dl class="dl-horizontal">
 *   <dt>ng-model</dt>      <dd><code>@</code> Binds the control's <b>value</b> property using the ng-model Angular 
 *                          directive. Binding the property using the ng-model directive provides standard benefits 
 *                          like validation, adding the control's state to the form instance, and so on. To redefine 
 *                          properties on a control that is bound by the ng-model directive, use the wj-model-property 
 *                          attribute.</dd>
 *   <dt>wj-model-property</dt><dd><code>@</code> Specifies a control property that is bound to a scope using the <b>ng-model</b> directive.</dd>
 *   <dt>control</dt>       <dd><code>=</code> A reference to the {@link InputDate} control created by this directive.</dd>
 *   <dt>format</dt>        <dd><code>@</code> The format used to display the selected time.</dd>
 *   <dt>mask</dt>          <dd><code>@</code> A mask used to validate the input as the user types (see {@link InputMask}).</dd>
 *   <dt>max</dt>           <dd><code>@</code> The earliest valid time (a string in the format "hh:mm").</dd>
 *   <dt>min</dt>           <dd><code>@</code> The latest valid time (a string in the format "hh:mm").</dd>
 *   <dt>step</dt>          <dd><code>@</code> The number of minutes between entries in the drop-down list.</dd>
 *   <dt>value</dt>         <dd><code>=</code> The time being edited (as a Date object).</dd>
 *   <dt>value-changed</dt> <dd><code>&</code> The!@see: valueChanged event handler.</dd>
 * </dl>
 *
 * If provided, the <b>min</b> and <b>max</b> attributes are strings in the format
 * "hh:mm". Technically, you can use any full date as defined in the W3C
 * <a href="https://tools.ietf.org/html/rfc3339" target="_blank">[RFC 3339]</a>, which is also the format
 * used with regular HTML5 input elements.
 */
export class WjInputTime extends WjComboBox {

    constructor($compile: any/*ng.ICompileService*/) {
        super($compile);
    }

    // Gets the InputTime control constructor
    get _controlConstructor() /* : new (elem: HTMLElement) => wijmo.Control */ {
        return wijmo.input.InputTime;
    }
}

/**
 * AngularJS directive for the {@link InputColor} control.
 *
 * Use the <b>wj-input-color</b> directive to add {@link InputColor} controls to your 
 * AngularJS applications. 
 * Note that directive and parameter names must be formatted as lower-case with dashes 
 * instead of camel-case. For example:
 * 
 * <pre>&lt;p&gt;Here is an InputColor control:&lt;/p&gt;
 * &lt;wj-input-color 
 *   value="theColor" 
 *   show-alpha-channel="false"&gt;
 * &lt;/wj-input-color&gt;</pre>
 *
 * The <b>wj-input-color</b> directive supports the following attributes:
 * 
 * <dl class="dl-horizontal">
 *   <dt>ng-model</dt>      <dd><code>@</code> Binds the control's <b>value</b> property using the ng-model Angular 
 *                          directive. Binding the property using the ng-model directive provides standard benefits 
 *                          like validation, adding the control's state to the form instance, and so on. To redefine 
 *                          properties on a control that is bound by the ng-model directive, use the wj-model-property 
 *                          attribute.</dd>
 *   <dt>wj-model-property</dt>     <dd><code>@</code> Specifies a control property that is bound to a scope using the <b>ng-model</b> directive.</dd>
 *   <dt>control</dt>               <dd><code>=</code> A reference to the InputColor control created by this directive.</dd>
 *   <dt>is-dropped-down</dt>       <dd><code>@</code> A value indicating whether the drop-down is currently visible.</dd>
 *   <dt>initialized</dt>           <dd><code>&</code> This event occurs after the binding has finished initializing the control with attribute values.</dd>
 *   <dt>is-initialized</dt>        <dd><code>=</code> A value indicating whether the binding has finished initializing the control with attribute values. </dd>
 *   <dt>show-alpha-channel</dt>    <dd><code>@</code> A value indicating whether the drop-down displays the alpha channel (transparency) editor.</dd>
 *   <dt>placeholder</dt>           <dd><code>@</code> The string to show as a hint when the control is empty.</dd>
 *   <dt>is-required</dt>           <dd><code>@</code> A value indicating whether to prevent null values.</dd>
 *   <dt>show-drop-down-button</dt> <dd><code>@</code> A value indicating whether the control displays a drop-down button.</dd>
 *   <dt>text</dt>                  <dd><code>=</code> The text to show in the control.</dd>
 *   <dt>value</dt>                 <dd><code>=</code> The color being edited.</dd>
 *   <dt>got-focus</dt>             <dd><code>&</code> The {@link InputColor.gotFocus} event handler.</dd>
 *   <dt>lost-focus</dt>            <dd><code>&</code> The {@link InputColor.lostFocus} event handler.</dd>
 *   <dt>is-dropped-down-changing</dt><dd><code>&</code> The {@link InputColor.isDroppedDownChanging} event handler.</dd>
 *   <dt>is-dropped-down-changed</dt><dd><code>&</code> The {@link InputColor.isDroppedDownChanged} event handler.</dd>
 *   <dt>text-changed</dt>          <dd><code>&</code> The {@link InputColor.textChanged} event handler.</dd>
 *   <dt>value-changed</dt>         <dd><code>&</code> The {@link InputColor.valueChanged} event handler.</dd>
 * </dl>
 */
export class WjInputColor extends WjDropDown {

    // Gets the InputColor control constructor
    get _controlConstructor() /* : new (elem: HTMLElement) => wijmo.Control */ {
        return wijmo.input.InputColor;
    }
}

/**
 * AngularJS directive for the {@link Popup} control.
 *
 * Use the <b>wj-popup</b> directive to add {@link Popup} controls to your 
 * AngularJS applications.
 *
 * The popup content may be specified inside the <b>wj-popup</b> tag, and can
 * contain an arbitrary HTML fragment with AngularJS bindings and directives.
 *
 * Note that directive and parameter names must be formatted as lower-case with dashes
 * instead of camel-case. For example:
 *
 * <pre>&lt;p&gt;Here is a Popup control triggered by a button:&lt;/p&gt;
 * &lt;button id="btn2" type="button"&gt;
 *     Click to show Popup
 * &lt;/button&gt;
 * &lt;wj-popup owner="#btn2" show-trigger="Click" hide-trigger="Blur"&gt;
 *     &lt;h3&gt;
 *         Salutation
 *     &lt;/h3&gt;
 *     &lt;div class="popover-content"&gt;
 *         Hello {&#8203;{firstName}} {&#8203;{lastName}}
 *     &lt;/div&gt;
 * &lt;/wj-popup&gt;</pre>
 *
 * The <b>wj-popup</b> directive supports the following attributes:
 * 
 * <dl class="dl-horizontal">
 *   <dt>control</dt>         <dd><code>=</code> A reference to the Popup control created by this directive.</dd>
 *   <dt>fade-in</dt>         <dd><code>@</code> A boolean value that determines whether popups should be shown using a fade-in animation.</dd>
 *   <dt>fade-out</dt>        <dd><code>@</code> A boolean value that determines whether popups should be hidden using a fade-out animation.</dd>
 *   <dt>hide-trigger</dt>    <dd><code>@</code> A {@link PopupTrigger} value defining the action that hides the {@link Popup}.</dd>
 *   <dt>initialized</dt>     <dd><code>&</code> This event occurs after the binding has finished initializing the control with attribute values.</dd>
 *   <dt>is-initialized</dt>  <dd><code>=</code> A value indicating whether the binding has finished initializing the control with attribute values. </dd>
 *   <dt>owner</dt>           <dd><code>@</code> A CSS selector referencing an element that controls the popup visibility.</dd>
 *   <dt>show-trigger</dt>    <dd><code>@</code> A {@link PopupTrigger} value defining the action that shows the {@link Popup}.</dd>
 *   <dt>modal</dt>           <dd><code>@</code> A boolean value that determines whether the {@link Popup} should be displayed as a modal dialog.</dd>
 *   <dt>got-focus</dt>       <dd><code>&</code> The {@link Popup.gotFocus} event handler.</dd>
 *   <dt>lost-focus</dt>      <dd><code>&</code> The {@link Popup.lostFocus} event handler.</dd>
 *   <dt>showing</dt>         <dd><code>&</code> The {@link Popup.showing} event handler.</dd>
 *   <dt>shown</dt>           <dd><code>&</code> The {@link Popup.shown} event handler.</dd>
 *   <dt>hiding</dt>          <dd><code>&</code> The {@link Popup.hiding} event handler.</dd>
 *   <dt>hidden</dt>          <dd><code>&</code> The {@link Popup.hidden} event handler.</dd>
 * </dl>
 */
export class WjPopup extends WjDirective {

    constructor() {
        super();
        this.transclude = true;
        this.template = '<div ng-transclude/>';
    }

    get _controlConstructor() {
        return wijmo.input.Popup; 
    }

    _initProps() {
        super._initProps();
        MetaFactory.findProp('owner', this._props).customHandler =
            function (scope: any/*ng.IScope*/, control: wijmo.Control, value: any, oldValue: any, link: WjLink) {
                // set modal if not specified
                var modal = scope['modal'];
                if (modal == null) {
                    // not specified, make it modal if it has no owner 
                    control['modal'] = value ? false : true;
                }
            };
    }

}

/**
 * AngularJS directive for the {@link MultiSelect} control.
 *
 * Use the <b>wj-multi-select</b> directive to add <b>MultiSelect</b> controls to your AngularJS applications. 
 * Note that directive and parameter names must be formatted as lower-case with dashes 
 * instead of camel-case. For example:
 * 
 * <pre>&lt;p&gt;Here is a MultiSelect bound to a collection of objects:&lt;/p&gt;
 * &lt;wj-multi-select
 *     placeholder="Select Countries"
 *     items-source="ctx.items"
 *     header-format="{count} countries selected"
 *     display-Member-path="country"
 *     checked-Member-path="selected"&gt;
 * &lt;/wj-multi-select&gt;</pre>
 *
 * The <b>wj-multi-select</b> directive extends {@link wijmo.angular.input.WjComboBox} with the following attributes:
 * 
 * <dl class="dl-horizontal">
 *   <dt>checked-member-path</dt>  <dd><code>@</code> The name of the property used to control the checkboxes placed next to each item.</dd>
 *   <dt>header-format</dt>        <dd><code>@</code> The format string used to create the header content when the control has more than <b>maxHeaderItems</b> items checked.</dd>
 *   <dt>header-formatter</dt>     <dd><code>=</code> A function that gets the HTML in the control header.</dd>
 *   <dt>max-header-items</dt>     <dd><code>@</code> The maximum number of items to display on the control header.</dd>
 *   <dt>checked-items-changed</dt><dd><code>&</code> The {@link MultiSelect.checkedItemsChanged} event handler.</dd>
 * </dl>
 */
export class WjMultiSelect extends WjComboBox {

    constructor($compile: any/*ng.ICompileService*/) {
        super($compile);
    }

    // Gets the InputColor control constructor
    get _controlConstructor() {
        return wijmo.input.MultiSelect;
    }
}

/**
 * AngularJS directive for the {@link MultiAutoComplete} control.
 *
 * Use the <b>wj-multi-auto-complete</b> directive to add <b>MultiAutoComplete</b> controls to your AngularJS applications.
 * Note that directive and parameter names must be formatted as lower-case with dashes 
 * instead of camel-case. For example:
 * 
 * <pre>&lt;p&gt;Here is a InputTags bound to a collection of objects:&lt;/p&gt;
 * &lt;wj-multi-auto-complete
 *     max-selected-items="8"
 *     items-source="ctx.items"
 *     selected-Member-path="selected"&gt;
 * &lt;/wj-multi-auto-complete&gt;</pre>

    * The <b>wj-multi-auto-complete</b> directive extends {@link wijmo.angular.input.WjAutoComplete} with the following attributes:
    *
    * <dl class="dl-horizontal">
    *   <dt>max-selected-items</dt>   <dd><code>@</code> The maximum number of items that can be selected.</dd>
    *   <dt>selected-member-path</dt> <dd><code>@</code> The name of the property used to control which 
    *                                 item will be selected.</dd>
    *   <dt>selected-items</dt>       <dd><code>@</code> An array containing the items that are currently selected.
    *   <dt>selected-items-changed</dt> <dd><code>&</code> The {@link MultiAutoComplete.selectedItemsChanged} event handler.</dd>
    * </dl>
    */
export class WjMultiAutoComplete extends WjAutoComplete {

    constructor($compile: any/*ng.ICompileService*/) {
        super($compile);
    }

    // Gets the MultiAutoComplete control constructor
    get _controlConstructor() {
        return wijmo.input.MultiAutoComplete;
    }
}

/**
 * AngularJS directive for an {@link ICollectionView} navigator element.
 *
 * Use the <b>wj-collection-view-navigator</b> directive to add an element that allows users to
 * navigate through the items in an {@link ICollectionView}. 
 * Note that directive and parameter names must be formatted as lower-case with dashes 
 * instead of camel-case. For example:
 * 
 * <pre>Here is a CollectionViewNavigator:&lt;/p&gt;
 * &lt;wj-collection-view-navigator 
 *   cv="myCollectionView"&gt;
 * &lt;/wj-collection-view-navigator&gt;</pre>
 *
 * <a href="https://jsfiddle.net/Wijmo5/s8tT4/" target="_blank">Example</a>
 * 
 * This example creates a CollectionView with 100,000 items and 20 items per page.
 * It defines a navigator to select the current page, another to select the current item,
 * and shows the data in a {@link FlexGrid}.
 * 
 * The <b>wj-collection-view-navigator</b> directive has a single attribute:
 * 
 * <dl class="dl-horizontal">
 *   <dt>cv</dt>  <dd><code>=</code> A reference to the {@link ICollectionView} object to navigate.</dd>
 * </dl>
 */
export class WjCollectionViewNavigator extends WjDirective {
    
    // Initializes a new instance of a WjCollectionViewNavigator
    constructor() {
        super();

        this.template = '<div class="wj-control wj-content wj-pager">' +
            '<div class="wj-input-group">' +
                '<span class="wj-input-group-btn">' +
                    '<button class="wj-btn wj-btn-default" type="button"' +
                        ' ng-click="cv.moveCurrentToFirst()"' +
                        ' ng-disabled="cv.currentPosition <= 0">' +
                        '<span class="wj-glyph-left" style="margin-right:-4px"></span>' +
                        '<span class="wj-glyph-left"></span>' +
                    ' </button>' +
                '</span>' +
                '<span class="wj-input-group-btn">' +
                    ' <button class="wj-btn wj-btn-default" type="button"' +
                        ' ng-click="cv.moveCurrentToPrevious()"' +
                        ' ng-disabled="cv.currentPosition <= 0">' +
                        '<span class="wj-glyph-left"></span>' +
                    ' </button>' +
                '</span>' +
                '<input type="text" class="wj-form-control" value="' +
                    ' {{cv.currentPosition + 1 | number}} / {{cv.itemCount | number}}' +
                    ' " disabled />' +
                '<span class="wj-input-group-btn">' +
                    '<button class="wj-btn wj-btn-default" type="button"' +
                        ' ng-click="cv.moveCurrentToNext()"' +
                        ' ng-disabled="cv.currentPosition >= cv.itemCount - 1">' +
                        '<span class="wj-glyph-right"></span>' +
                    '</button>' +
                '</span>' +
                '<span class="wj-input-group-btn">' +
                    '<button class="wj-btn wj-btn-default" type="button"' +
                        ' ng-click="cv.moveCurrentToLast()"' +
                        ' ng-disabled="cv.currentPosition >= cv.itemCount - 1">' +
                        '<span class="wj-glyph-right"></span>' +
                        '<span class="wj-glyph-right" style="margin-left:-4px"></span>' +
                    '</button>' +
                '</span>' +
            '</div>' +
        '</div>';
    }

    _getMetaDataId(): any {
        return 'CollectionViewNavigator';
    }

    // Gets the WjCollectionViewNavigator directive's link function. Overrides parent member
    _postLinkFn() {
        return function (scope: any, tElement: any/*ng.IAugmentedJQuery*/, tAttrs: any/*ng.IAttributes*/, dropDownController) {
        };
    }
}

/**
 * AngularJS directive for an {@link ICollectionView} pager element.
 *
 * Use the <b>wj-collection-view-pager</b> directive to add an element that allows users to
 * navigate through the pages in a paged {@link ICollectionView}. 
 * Note that directive and parameter names must be formatted as lower-case with dashes 
 * instead of camel-case. For example:
 * 
 * <pre>Here is a CollectionViewPager:&lt;/p&gt;
 * &lt;wj-collection-view-pager
 *   cv="myCollectionView"&gt;
 * &lt;/wj-collection-view-pager&gt;</pre>
 *
 * <a href="https://jsfiddle.net/Wijmo5/s8tT4/" target="_blank">Example</a>
 * 
 * This example creates a CollectionView with 100,000 items and 20 items per page.
 * It defines a navigator to select the current page, another to select the current item,
 * and shows the data in a {@link FlexGrid}.
 * 
 * The <b>wj-collection-view-pager</b> directive has a single attribute:
 * 
 * <dl class="dl-horizontal">
 *   <dt>cv</dt>  <dd><code>=</code> A reference to the paged {@link ICollectionView} object to navigate.</dd>
 * </dl>
 */
export class WjCollectionViewPager extends WjDirective {

    // Initializes a new instance of a WjCollectionViewPager
    constructor() {
        super();

        this.template = '<div class="wj-control wj-content wj-pager">' +
            '<div class="wj-input-group">' +
                '<span class="wj-input-group-btn">' +
                    '<button class="wj-btn wj-btn-default" type="button"' +
                        'ng-click="cv.moveToFirstPage()"' +
                        'ng-disabled="cv.pageIndex <= 0">' +
                        '<span class="wj-glyph-left" style="margin-right:-4px"></span>' +
                        '<span class="wj-glyph-left"></span>' +
                    '</button>' +
                '</span>' +
                '<span class="wj-input-group-btn">' +
                '<button class="wj-btn wj-btn-default" type="button"' +
                        'ng-click="cv.moveToPreviousPage()"' +
                        'ng-disabled="cv.pageIndex <= 0">' +
                        '<span class="wj-glyph-left"></span>' +
                    '</button>' +
                '</span>' +
                '<input type="text" class="wj-form-control" value="' +
                    '{{cv.pageIndex + 1 | number}} / {{cv.pageCount | number}}' +
                '" disabled />' +
                '<span class="wj-input-group-btn">' +
                    '<button class="wj-btn wj-btn-default" type="button"' +
                        'ng-click="cv.moveToNextPage()"' +
                        'ng-disabled="cv.pageIndex >= cv.pageCount - 1">' +
                        '<span class="wj-glyph-right"></span>' +
                    '</button>' +
                '</span>' +
                '<span class="wj-input-group-btn">' +
                    '<button class="wj-btn wj-btn-default" type="button"' +
                        'ng-click="cv.moveToLastPage()"' +
                        'ng-disabled="cv.pageIndex >= cv.pageCount - 1">' +
                        '<span class="wj-glyph-right"></span>' +
                        '<span class="wj-glyph-right" style="margin-left:-4px"></span>' +
                    '</button>' +
                '</span>' +
            '</div>' +
        '</div>';
    }

    _getMetaDataId(): any {
        return 'CollectionViewPager';
    }

    // Gets the WjCollectionViewPager directive's link function. Overrides parent member
    _postLinkFn() {
        return function (scope: any, tElement: any/*ng.IAugmentedJQuery*/, tAttrs: any/*ng.IAttributes*/, dropDownController) {
        };
    }
}

//#endregion "Input directives classes"

    }
    


    module wijmo.angular {
    

    }
    

    module wijmo.angular {
    


var wjNg: any = window['angular'];




//#region "Gauge directives registration"

const wijmoGaugeName = 'wj.gauge';


// do not use moduleName here, it's removed from the global module version
var wijmoGauge = _registerNgModule(wijmoGaugeName);

// register only if module is loaded
if (softRefGauge() && softRefGauge().LinearGauge) {

    wijmoGauge.directive('wjLinearGauge', [function () {
        return new WjLinearGauge();
    }]);

    wijmoGauge.directive('wjBulletGraph', [function () {
        return new WjBulletGraph();
    }]);

    wijmoGauge.directive('wjRadialGauge', [function () {
        return new WjRadialGauge();
    }]);

    wijmoGauge.directive('wjRange', [function () {
        return new WjRange();
    }]);
}

//#endregion "Gauge directives definitions"

//#region "Gauge directives classes"

// Gauge control directive
// Provides base setup for all directives related to controls derived from Gauge
// Abstract class, not for use in markup
export class WjGauge extends WjDirective {

    // Creates a new instance of a WjGauge
    constructor() {
        super();
        this.template = '<div ng-transclude />';
        this.transclude = true;
    }

    get _controlConstructor() {
        return wijmo.gauge.Gauge;
    }
}

/**
 * AngularJS directive for the {@link LinearGauge} control.
 *
 * Use the <b>wj-linear-gauge</b> directive to add linear gauges to your AngularJS applications. 
 * Note that directive and parameter names must be formatted in lower-case with dashes 
 * instead of camel-case. For example:
 *
 * <pre>&lt;wj-linear-gauge 
 *   value="ctx.gauge.value" 
 *   show-text="Value"
 *   is-read-only="false"&gt;
 *   &lt;wj-range 
 *     wj-property="pointer" 
 *     thickness="0.2"&gt;
 *     &lt;wj-range 
 *       min="0" 
 *       max="33" 
 *       color="green"&gt;
 *     &lt;/wj-range&gt;
 *     &lt;wj-range 
 *       min="33" 
 *       max="66" 
 *       color="yellow"&gt;
 *     &lt;/wj-range&gt;
 *     &lt;wj-range 
 *       min="66" 
 *       max="100" 
 *       color="red"&gt;
 *     &lt;/wj-range&gt;
 *   &lt;/wj-range&gt;
 * &lt;/wj-linear-gauge&gt;</pre>
 *
 * The <b>wj-linear-gauge</b> directive supports the following attributes:
 * 
 * <dl class="dl-horizontal">
 *   <dt>ng-model</dt>      <dd><code>@</code> Binds the control's <b>value</b> property using the ng-model Angular 
 *                          directive. Binding the property using the ng-model directive provides standard benefits 
 *                          like validation, adding the control's state to the form instance, and so on. To redefine 
 *                          properties on a control that is bound by the ng-model directive, use the wj-model-property 
 *                          attribute.</dd>
 *   <dt>wj-model-property</dt>  <dd><code>@</code> Specifies a control property that is bound to a scope using the 
 *                               <b>ng-model</b> directive.</dd>
 *   <dt>control</dt>       <dd><code>=</code> A reference to the {@link LinearGauge} 
 *                          control created by this directive.</dd>
 *   <dt>direction</dt>     <dd><code>@</code> The {@link GaugeDirection} value in 
 *                          which the gauge fills as the value grows.</dd>
 *   <dt>format</dt>        <dd><code>@</code> The format string used for displaying 
 *                          the gauge values as text.</dd>
 *   <dt>has-shadow</dt>    <dd><code>@</code> A value indicating whether the gauge 
 *                          displays a shadow effect.</dd>
 *   <dt>initialized</dt>   <dd><code>&</code> This event occurs after the binding has finished
 *                          initializing the control with attribute values.</dd>
 *   <dt>is-initialized</dt> <dd><code>=</code> A value indicating whether the binding has finished
 *                           initializing the control with attribute values. </dd>
 *   <dt>is-animated</dt>   <dd><code>@</code> A value indicating whether the gauge 
 *                          animates value changes.</dd>
 *   <dt>is-read-only</dt>  <dd><code>@</code> A value indicating whether users are 
 *                          prevented from editing the value.</dd>
 *   <dt>min</dt>           <dd><code>@</code> The minimum value that the gauge  
 *                          can display.</dd>
 *   <dt>max</dt>           <dd><code>@</code> The maximum value that the gauge  
 *                          can display.</dd>
 *   <dt>show-text</dt>     <dd><code>@</code> The {@link ShowText} value indicating 
 *                          which values display as text within the gauge.</dd>
 *   <dt>step</dt>          <dd><code>@</code> The amount to add or subtract to the value 
 *                          property when the user presses the arrow keys.</dd>
 *   <dt>thickness</dt>     <dd><code>@</code> The thickness of the gauge, on a scale 
 *                          of zero to one.</dd>
 *   <dt>value</dt>         <dd><code>=</code> The value displayed on the gauge.</dd>
 *   <dt>got-focus</dt>     <dd><code>&</code> The {@link LinearGauge.gotFocus} event handler.</dd>
 *   <dt>lost-focus</dt>    <dd><code>&</code> The {@link LinearGauge.lostFocus} event handler.</dd>
 * </dl>
 *
 * The <b>wj-linear-gauge</b> directive may contain one or more {@link wijmo.angular.gauge.WjRange} directives.
 *
 * <a href="https://jsfiddle.net/Wijmo5/t842jozb/" target="_blank">Example</a>
 */
export class WjLinearGauge extends WjGauge {

    // Initializes a new instance of a WjLinearGauge
    constructor() {
        super();
    }

    // gets the Wijmo LinearGauge control constructor
    get _controlConstructor() {
        return wijmo.gauge.LinearGauge;
    }
}

/**
 * AngularJS directive for the {@link BulletGraph} control.
 *
 * Use the <b>wj-bullet-graph</b> directive to add bullet graphs to your AngularJS applications. 
 * Note that directive and parameter names must be formatted as lower-case with dashes 
 * instead of camel-case. For example:
 *
 * <pre>&lt;wj-bullet-graph 
 *   value="ctx.gauge.value" 
 *   min="0" max="10"
 *   target="{&#8203;{item.target}}"
 *   bad="{&#8203;{item.target * .75}}"
 *   good="{&#8203;{item.target * 1.25}}"&gt;
 * &lt;/wj-bullet-graph&gt;</pre>
 *
 * The <b>wj-bullet-graph</b> directive supports the following attributes:
 * 
 * <dl class="dl-horizontal">
 *   <dt>control</dt>       <dd><code>=</code> A reference to the BulletGraph control 
 *                          created by this directive.</dd>
 *   <dt>direction</dt>     <dd><code>@</code> The {@link GaugeDirection} value 
 *                          indicating which direction the gauge fills as the value grows.</dd>
 *   <dt>initialized</dt>   <dd><code>&</code> This event occurs after the binding has finished
 *                          initializing the control with attribute values.</dd>
 *   <dt>is-initialized</dt> <dd><code>=</code> A value indicating whether the binding has finished
 *                           initializing the control with attribute values. </dd>
 *   <dt>target</dt>        <dd><code>@</code> The target value for the measure.</dd>
 *   <dt>good</dt>          <dd><code>@</code> A reference value considered good for the 
 *                          measure.</dd>
 *   <dt>bad</dt>           <dd><code>@</code> A reference value considered bad for the 
 *                          measure.</dd>
 *   <dt>value</dt>         <dd><code>=</code> The actual value of the measure.</dd>
 * </dl>
 *
 * The <b>wj-bullet-graph</b> directive may contain one or more {@link wijmo.angular.gauge.WjRange} directives.
 *
 * <a href="https://jsfiddle.net/Wijmo5/8uxb1vwf/" target="_blank">Example</a>
 */
export class WjBulletGraph extends WjLinearGauge {

    // Initializes a new instance of a WjBulletGraph
    constructor() {
        super();
    }

    // gets the Wijmo BulletGraph control constructor
    get _controlConstructor() {
        return wijmo.gauge.BulletGraph;
    }
}

/**
 * AngularJS directive for the {@link RadialGauge} control.
 *
 * Use the <b>wj-radial-gauge</b> directive to add radial gauges to your AngularJS applications. 
 * Note that directive and parameter names must be formatted as lower-case with dashes 
 * instead of camel-case. For example:
 * 
 * <pre>Here is a &lt;b&gt;RadialGauge&lt;/b&gt; control:&lt;/p&gt;
 * &lt;wj-radial-gauge
 *   style="height:300px" 
 *   value="count" 
 *   min="0" max="10"
 *   is-read-only="false"&gt;
 * &lt;/wj-radial-gauge&gt;</pre>
 *
 * The <b>wj-radial-gauge</b> directive supports the following attributes:
 * 
 * <dl class="dl-horizontal">
 *   <dt>ng-model</dt>      <dd><code>@</code> Binds the control's <b>value</b> property using the ng-model Angular 
 *                          directive. Binding the property using the ng-model directive provides standard benefits 
 *                          like validation, adding the control's state to the form instance, and so on. To redefine 
 *                          properties on a control that is bound by the ng-model directive, use the wj-model-property 
 *                          attribute.</dd>
 *   <dt>wj-model-property</dt>  <dd><code>@</code> Specifies a control property that is bound to a scope using the 
 *                               <b>ng-model</b> directive.</dd>
 *   <dt>control</dt>       <dd><code>=</code> A reference to the RadialGauge 
 *                          control created by this directive.</dd>
 *   <dt>auto-scale</dt>    <dd><code>@</code> A value indicating whether the gauge 
 *                          scales the display to fill the host element.</dd>
 *   <dt>format</dt>        <dd><code>@</code> The format string used for displaying 
 *                          gauge values as text.</dd>
 *   <dt>has-shadow</dt>    <dd><code>@</code> A value indicating whether the gauge 
 *                          displays a shadow effect.</dd>
 *   <dt>initialized</dt>   <dd><code>&</code> This event occurs after the binding has finished
 *                          initializing the control with attribute values.</dd>
 *   <dt>is-initialized</dt> <dd><code>=</code> A value indicating whether the binding has finished
 *                           initializing the control with attribute values. </dd>
 *   <dt>is-animated</dt>   <dd><code>@</code> A value indicating whether the gauge 
 *                          animates value changes.</dd>
 *   <dt>is-read-only</dt>  <dd><code>@</code> A value indicating whether users are 
 *                          prevented from editing the value.</dd>
 *   <dt>min</dt>           <dd><code>@</code> The minimum value that the gauge  
 *                          can display.</dd>
 *   <dt>max</dt>           <dd><code>@</code> The maximum value that the gauge  
 *                          can display.</dd>
 *   <dt>show-text</dt>     <dd><code>@</code> A {@link ShowText} value indicating 
 *                          which values display as text within the gauge.</dd>
 *   <dt>step</dt>          <dd><code>@</code> The amount to add or subtract to the 
 *                          value property when the user presses the arrow keys.</dd>
 *   <dt>start-angle</dt>   <dd><code>@</code> The starting angle for the gauge, in 
 *                          degreees, measured clockwise from the 9 o'clock position.</dd>
 *   <dt>sweep-angle</dt>   <dd><code>@</code> The sweeping angle for the gauge in degrees 
 *                          (may be positive or negative).</dd>
 *   <dt>thickness</dt>     <dd><code>@</code> The thickness of the gauge, on a scale 
 *                          of zero to one.</dd>
 *   <dt>value</dt>         <dd><code>=</code> The value displayed on the gauge.</dd>
 *   <dt>got-focus</dt>     <dd><code>&</code> The {@link RadialGauge.gotFocus} event handler.</dd>
 *   <dt>lost-focus</dt>    <dd><code>&</code> The {@link RadialGauge.lostFocus} event handler.</dd>
 * </dl>
 *
 * The <b>wj-radial-gauge</b> directive may contain one or more {@link wijmo.angular.gauge.WjRange} directives.
 *
 * <a href="https://jsfiddle.net/Wijmo5/7ec2144u/" target="_blank">Example</a>
 */
export class WjRadialGauge extends WjGauge {

    // Initializes a new instance of a WjRadialGauge
    constructor() {
        super();
    }

    // gets the Wijmo RadialGauge control constructor
    get _controlConstructor() {
        return wijmo.gauge.RadialGauge;
    }
}

/**
 * AngularJS directive for the {@link Range} object.
 *
 * The <b>wj-range</b> directive must be contained in a {@link wijmo.angular.gauge.WjLinearGauge}, {@link wijmo.angular.gauge.WjRadialGauge} 
 * or {@link wijmo.angular.gauge.WjBulletGraph} directive. It adds the Range object to the 'ranges' array property 
 * of the parent directive. You may also initialize other Range type properties of the parent 
 * directive by specifying the property name with the wj-property attribute.
 *
 * For example:
 * <pre>&lt;wj-radial-gauge 
 *     min="0" 
 *     max="200" 
 *     step="20" 
 *     value="theValue" 
 *     is-read-only="false"&gt;
 *     &lt;wj-range 
 *       min="0" 
 *       max="100" 
 *       color="red"&gt;
 *     &lt;/wj-range&gt;
 *     &lt;wj-range 
 *       min="100" 
 *       max="200" 
 *       color="green"&gt;
 *     &lt;/wj-range&gt;
 *     &lt;wj-range 
 *       wj-property="pointer" 
 *       color="blue"&gt;
 *     &lt;/wj-range&gt;
 * &lt;/wj-radial-gauge&gt;</pre>
 *
 * The <b>wj-range</b> directive supports the following attributes:
 * 
 * <dl class="dl-horizontal">
 *   <dt>min</dt>           <dd><code>@</code> The minimum value in the range.</dd>
 *   <dt>max</dt>           <dd><code>@</code> The maximum value in the range.</dd>
 *   <dt>color</dt>         <dd><code>@</code> The color used to display the range.</dd>
 *   <dt>thickness</dt>     <dd><code>@</code> The thickness of the range, on a scale 
 *                          of zero to one.</dd>
 *   <dt>name</dt>          <dd><code>@</code> The name of the range.</dd>
 *   <dt>wj-property</dt>   <dd><code>@</code> The name of the property to initialize 
 *                          with this directive.</dd>
 * </dl>
 */
export class WjRange extends WjDirective {

    // Initializes a new instance of a WjRange
    constructor() {
        super();
        this.require = ['?^wjLinearGauge', '?^wjRadialGauge', '?^wjBulletGraph'];
        this.template = '<div ng-transclude />';
        this.transclude = true;

        // set up as a child directive
        this._property = 'ranges';
        this._isPropertyArray = true;
    }

    // Returns constructor of related Wijmo object. Abstract member, must be overridden in inherited class
    get _controlConstructor(): any { //: new (elem: HTMLElement) => wijmo.Control {
        return wijmo.gauge.Range;
    }

    _initControl(element: any): any {
        return new wijmo.gauge.Range();
    }
}

//#endregion "Gauge directives classes"
 
    }
    


    module wijmo.angular {
    

    }
    

    module wijmo.angular {
    


var wjNg: any = window['angular'];

//import { Control, ObservableArray, addClass, getElement, closest } from '@grapecity/wijmo';



//#region "TreeView directives registration"

const wijmoNavName = 'wj.nav';


// do not use moduleName here, it's removed from the global module version
var wijmoNav = _registerNgModule(wijmoNavName);

// register only if module is loaded
if (softRefNav()) {
    wijmoNav.directive('wjTreeView', [function () {
        return new WjTreeView();
    }]);
    wijmoNav.directive('wjTabPanel', [function () {
        return new WjTabPanel();
    }]);
    wijmoNav.directive('wjTab', [function () {
        return new WjTab();
    }]);
}

//#endregion "Nav directives definitions"

//#region "TreeView directives classes"

/**
 * AngularJS directive for the {@link TreeView} control.
 *
 * Use the <b>wj-tree-view</b> directive to add TreeView to your AngularJS applications.
 * Note that directive and parameter names must be formatted as lower-case with dashes 
 * instead of camel-case. For example:
 *
 * <pre>&lt;wj-tree-view  items-source="items"
 *   display-member-path="ctx.displayMemberPath"
 *   child-items-path="ctx.childItemsPath"
 *   is-animated="ctx.isAnimated"&gt;
 * &lt;/wj-tree-view&gt;</pre>
 *
 * The <b>wj-tree-view</b> directive supports the following attributes:
 * 
 * <dl class="dl-horizontal">
 *   <dt>items-source</dt>          <dd><code>=</code>An array that contains the {@link TreeView} items. </dd>
 *   <dt>child-items-path</dt>      <dd><code>@</code> A value indicating the name of the property (or properties) 
 *                                  that contains the child items for each node.</dd>
 *   <dt>control</dt>               <dd><code>=</code> A reference to the {@link TreeView}
 *                                  control created by this directive. </dd>
 *   <dt>display-member-path</dt>   <dd><code>@</code> A value indicating the name of the property (or properties) 
 *                                  to use as the visual representation of the nodes. </dd>
 *   <dt>image-member-path</dt>     <dd><code>@</code> A value indicating the name of the property (or properties) to
 *                                  use as a source of images for the nodes. </dd>
 *   <dt>is-content-html</dt>       <dd><code>@</code> A value indicating whether whether items 
 *                                  are bound to plain text or HTML. </dd>
 *   <dt>initialized</dt>           <dd><code>&</code> This event occurs after the binding has finished
 *                                  initializing the control with attribute values.</dd>
 *   <dt>is-initialized</dt>        <dd><code>=</code> A value indicating whether the binding has finished
 *                                  initializing the control with attribute values. </dd>
 *   <dt>show-checkboxes</dt>       <dd><code>@</code> A value determines whether the {@link TreeView} should
 *                                  add checkboxes to nodes and manage their state.</dd>
 *   <dt>auto-collapse</dt>         <dd><code>@</code> A value determines if sibling nodes should be collapsed
 *                                  when a node is expanded.</dd>
 *   <dt>is-animated</dt>           <dd><code>@</code> A value indicating whether to use animations when expanding
 *                                  or collapsing nodes.</dd>
 *   <dt>is-readOnly</dt>           <dd><code>@</code> A value determines whether users can edit the text in the
 *                                  nodes.</dd>
 *   <dt>allow-dragging</dt>        <dd><code>@</code> A value determines whether users can drag and drop nodes
 *                                  within the {@link TreeView}.</dd>
 *   <dt>expand-on-click</dt>       <dd><code>@</code> A value determines whether to expand collapsed nodes when
 *                                  the user clicks the node header.</dd>
 *   <dt>selected-item</dt>         <dd><code>@</code> A value indicating the data item that is currently 
 *                                  selected.</dd>
 *   <dt>selected-node</dt>         <dd><code>@</code> A value indicating {@link TreeNode} that is currently 
 *                                  selected.</dd>
 *   <dt>checked-items</dt>         <dd><code>@</code> An array containing the items that are currently 
 *                                  checked.</dd>
 *   <dt>lazy-load-function</dt>   <dd><code>=</code> A function that loads child nodes on demand.</dd>
 *   <dt>items-source-changed</dt>  <dd><code>&</code> The {@link TreeView.itemsSourceChanged} event handler.</dd>
 *   <dt>loading-items</dt>         <dd><code>&</code> The {@link TreeView.loadingItems} event handler.</dd>
 *   <dt>loaded-items</dt>          <dd><code>&</code> The {@link TreeView.loadedItems} event handler.</dd>
 *   <dt>item-clicked</dt>          <dd><code>&</code> The {@link TreeView.itemClicked} event handler.</dd>
 *   <dt>selected-item-changed</dt> <dd><code>&</code> The {@link TreeView.selectedItemChanged} event handler.</dd>
 *   <dt>checked-items-Changed</dt> <dd><code>&</code> The {@link TreeView.checkedItemsChanged} event handler.</dd>
 *   <dt>is-collapsed-changing</dt> <dd><code>&</code> The {@link TreeView.isCollapsedChanging} event handler.</dd>
 *   <dt>is-collapsed-changed</dt>  <dd><code>&</code> The {@link TreeView.isCollapsedChanged} event handler.</dd>
 *   <dt>is-checked-changing</dt>   <dd><code>&</code> The {@link TreeView.isCheckedChanging} event handler.</dd>
 *   <dt>is-checked-changed</dt>    <dd><code>&</code> The {@link TreeView.isCheckedChanged} event handler.</dd>
 *   <dt>format-item</dt>           <dd><code>&</code> The {@link TreeView.formatItem} event handler.</dd>
 *   <dt>drag-start</dt>            <dd><code>&</code> The {@link TreeView.dragStart} event handler.</dd>
 *   <dt>drag-over</dt>             <dd><code>&</code> The {@link TreeView.dragOver} event handler.</dd>
 *   <dt>drop</dt>                  <dd><code>&</code> The {@link TreeView.drop} event handler.</dd>
 *   <dt>drag-end</dt>              <dd><code>&</code> The {@link TreeView.dragEnd} event handler.</dd>
 *   <dt>node-edit-starting</dt>    <dd><code>&</code> The {@link TreeView.nodeEditStarting} event handler.</dd>
 *   <dt>node-edit-started</dt>     <dd><code>&</code> The {@link TreeView.nodeEditStarted} event handler.</dd>
 *   <dt>node-edit-ending</dt>      <dd><code>&</code> The {@link TreeView.nodeEditEnding} event handler.</dd>
 *   <dt>node-edit-ended</dt>       <dd><code>&</code> The {@link TreeView.nodeEditEnded} event handler.</dd>
 * </dl>
 */
export class WjTreeView extends WjDirective {

    constructor() {
        super();
        this.transclude = true;
        this.template = '<div ng-transclude />';
    }

    get _controlConstructor() {
        return wijmo.nav.TreeView;
    }
}
//#endregion "TreeView directives classes"

/**
 * AngularJS directive for the {@link TabPanel} control.
 *
 * Use the <b>wj-tab-panel</b> directive to add TabPanel to your AngularJS applications.
 * Note that directive and parameter names must be formatted as lower-case with dashes 
 * instead of camel-case. For example:
 *
 * <pre>&lt;wj-tab-panel&gt;
 *    &lt;wj-tab&gt;
 *      &lt;a&gt;Tab1 Header&lt;/a&gt;
 *      &lt;div&gt;
 *          Tab1 content
 *      &lt;/div&gt;
 *    &lt;/wj-tab&gt;
 *    &lt;wj-tab is-disabled="true"&gt;
 *      &lt;a&gt;Tab2 Header&lt;/a&gt;
 *      &lt;div&gt;
 *          Tab2 content
 *      &lt;/div&gt;
 *    &lt;/wj-tab&gt;
 * &lt;/wj-tab-panel&gt;</pre>
 *
 * The <b>wj-tab-panel</b> directive supports the following attributes:
 * 
 * <dl class="dl-horizontal">
 *   <dt>is-animated</dt>           <dd><code>@</code>A value that determines whether tab changes should be animated
 *                                  with a fade-in effect. </dd>
 *   <dt>auto-switch</dt>           <dd><code>@</code> A value that determines whether the control should switch
 *                                  tabs automatically when the user selects a tab using the arrow keys.</dd>
 *   <dt>control</dt>               <dd><code>=</code> A reference to the {@link TabPanel}
 *                                  control created by this directive. </dd>
 *   <dt>selected-index</dt>        <dd><code>=</code> The index of the currently selected (active) tab. </dd>
 *   <dt>selected-tab</dt>        <dd><code>=</code> The {@link Tab} object that is currently selected. </dd>
 *   <dt>initialized</dt>           <dd><code>&</code> This event occurs after the binding has finished
 *                                  initializing the control with attribute values.</dd>
 *   <dt>is-initialized</dt>        <dd><code>=</code> A value indicating whether the binding has finished
 *                                  initializing the control with attribute values. </dd>
 *   <dt>selected-index-changed</dt>  <dd><code>&</code> The {@link TabPanel.selectedIndexChanged} event handler.</dd>
 * </dl>
 *
 * The <b>wj-tab-panel</b> directive may contain one or more {@link wijmo.angular.nav.WjTab} directives.
 *
 */
export class WjTabPanel extends WjDirective {

    constructor() {
        super();
        this.transclude = true;
        this.template = '<div ng-transclude />';
    }

    get _controlConstructor() {
        return wijmo.nav.TabPanel;
    }

    _initControl(element: any): any {
        let ret = new wijmo.nav.TabPanel(element, null, true);
        ret.tabs.beginUpdate();
        return ret;
    }

    _createLink(): WjLink {
        return new WjTabPanelLink();
    }
}
class WjTabPanelLink extends WjLink {
    public _onChildrenReady(): void {
        super._onChildrenReady();
        let ctrl = <wijmo.nav.TabPanel>this.control;
        ctrl.tabs.endUpdate();
        if (ctrl.selectedIndex < 0 && ctrl.tabs.length) {
            ctrl.selectedIndex = 0;
        }
    }

}

/**
 * AngularJS directive for the {@link Tab} object.
 *
 * The <b>wj-tab</b> directive must be contained in a {@link TabPanel} directive.
 * It adds the Tab object to the 'tabs' array property of the parent directive. 
 *
 * For example:
 * <pre>&lt;wj-tab-panel&gt;
 *    &lt;wj-tab&gt;
 *      &lt;a&gt;Tab1 Header&lt;/a&gt;
 *      &lt;div&gt;
 *          Tab1 content
 *      &lt;/div&gt;
 *    &lt;/wj-tab&gt;
 *    &lt;wj-tab is-disabled="true"&gt;
 *      &lt;a&gt;Tab2 Header&lt;/a&gt;
 *      &lt;div&gt;
 *          Tab2 content
 *      &lt;/div&gt;
 *    &lt;/wj-tab&gt;
 * &lt;/wj-tab-panel&gt;</pre>
 *
 * The <b>wj-tab</b> directive supports the following attributes:
 * 
 * <dl class="dl-horizontal">
 *   <dt>is-disabled</dt>   <dd><code>@</code> A value that determines whether this {@link Tab} is disabled.</dd>
 *   <dt>is-visible</dt>    <dd><code>@</code> A value that determines whether this {@link Tab} is visible.</dd>
 * </dl>
 */
export class WjTab extends WjDirective {

    constructor() {
        super();
        this.transclude = true;
        this.template = '<div ng-transclude />';
        this.require = '^wjTabPanel';
    }

    get _controlConstructor() {
        return wijmo.nav.Tab;
    }

    _initControl(element: any): any {
        return new wijmo.nav.Tab(element.children[0], element.children[1]);
    }
}


    }
    


    module wijmo.angular {
    

    }
    

    module wijmo.angular {
    


var wjNg: any = window['angular'];




//#region "Charts directives registration"

const wijmoChartName = 'wj.chart';


// do not use moduleName here, it's removed from the global module version
var wijmoChart = _registerNgModule(wijmoChartName);

// register only if module is loaded
if (softRefChart() && softRefChart().FlexChart) {
    wijmoChart.directive('wjFlexChart', [function () {
        return new WjFlexChart();
    }]);

    wijmoChart.directive('wjFlexChartAxis', [function () {
        return new WjFlexChartAxis();
    }]);

    wijmoChart.directive('wjFlexChartSeries', [function () {
        return new WjFlexChartSeries();
    }]);

    wijmoChart.directive('wjFlexChartLegend', [function () {
        return new WjFlexChartLegend();
    }]);

    wijmoChart.directive('wjFlexChartDataLabel', [function () {
        return new WjFlexChartDataLabel();
    }]);

    wijmoChart.directive('wjFlexPieDataLabel', [function () {
        return new WjFlexPieDataLabel();
    }]);

    wijmoChart.directive('wjFlexChartLineMarker', [function () {
        return new WjFlexChartLineMarker();
    }]);

    wijmoChart.directive('wjFlexChartPlotArea', [function () {
        return new WjFlexChartPlotArea();
    }]);

    wijmoChart.directive('wjFlexChartDataPoint', [function () {
        return new WjFlexChartDataPoint();
    }]);

    wijmoChart.directive('wjFlexPie', [function() {
        return new WjFlexPie();
    }]);





}

//#endregion "Charts directives definitions"

//#region "Charts directives classes"

// Base class for WjFlexCore and FlexPie directives with common prop and event dictionaries
export class WjFlexChartBase extends WjDirective {

    // Initializes a new instance of a WjFlexChart
    constructor() {
        super();

        var self = this;

        this.template = '<div ng-transclude />';
        this.transclude = true;
    }

    get _controlConstructor() {
        return wijmo.chart.FlexChartBase;
    }

    _initProps() {
        super._initProps();
        var self = this; // store this in closure as .apply() call overrides the reference
        var tooltipDesc = MetaFactory.findProp('tooltipContent', this._props);
        tooltipDesc.customHandler = function (scope, control, value, oldValue, link) {
            if (value != null) {
                (<wijmo.chart.FlexChart>control).tooltip.content = value;
            }
        };
    }

    }

// Base class for WjFlexChart and WjFinancialChart
export class WjFlexChartCore extends WjFlexChartBase {

    // gets the Wijmo FlexChart control constructor
    get _controlConstructor() {
        return wijmo.chart.FlexChartCore;
    }

    _initProps() {
        super._initProps();
        var self = this; // store this in closure as .apply() call overrides the reference

        var lblContentDesc = MetaFactory.findProp('labelContent', this._props);
        lblContentDesc.customHandler = function (scope, control, value, oldValue, link) {
            if (value != null) {
                (<wijmo.chart.FlexChart>control).dataLabel.content = value;
            }
        };
    }
}


/**
 * AngularJS directive for the {@link FlexChart} control.
 *
 * Use the <b>wj-flex-chart</b> directive to add charts to your AngularJS applications.
 * Note that directive and parameter names must be formatted using lower-case letters
 * with dashes instead of camel case. For example:
 *
 * <pre>&lt;p&gt;Here is a FlexChart control:&lt;/p&gt;
 * &lt;wj-flex-chart
 *   style="height:300px"
 *   items-source="data"
 *   binding-x="country"&gt;
 *   &lt;wj-flex-chart-axis
 *     wj-property="axisY"
 *     major-unit="5000"&gt;
 *   &lt;/wj-flex-chart-axis&gt;
 *   &lt;wj-flex-chart-series
 *     binding="sales"
 *     name="Sales"&gt;
 *   &lt;/wj-flex-chart-series&gt;
 *   &lt;wj-flex-chart-series
 *     binding="expenses"
 *     name="Expenses"&gt;
 *   &lt;/wj-flex-chart-series&gt;
 *   &lt;wj-flex-chart-series
 *     binding="downloads"
 *     name="Downloads"
 *     chart-type="LineSymbols"&gt;
 *   &lt;/wj-flex-chart-series&gt;
 * &lt;/wj-flex-chart&gt;</pre>
 *
 * The example below creates a {@link FlexChart} control and binds it to a 'data' array
 * exposed by the controller. The chart has three series objects, each corresponding to
 * a property in the objects contained in the source array. The last series in the
 * example uses the 'chart-type' attribute to override the default chart type used
 * for the other series objects.
 *
 * <a href="https://jsfiddle.net/Wijmo5/QNb9X/" target="_blank">Example</a>
 *
 * The wj-flex-chart directive supports the following attributes:
 *
 * <dl class="dl-horizontal">
 *   <dt>binding</dt>           <dd><code>@</code> The name of the property that contains Y
 *                              values for the chart. You can override this at the series level.</dd>
 *   <dt>binding-x</dt>         <dd><code>@</code> The name of the property that contains X
 *                              values for the chart. You can override this at the series level.</dd>
 *   <dt>chart-type</dt>        <dd><code>@</code> The default chart type to use in rendering series
 *                              objects. You can override this at the series level. See {@link ChartType}.</dd>
 *   <dt>control</dt>           <dd><code>=</code> A reference to the {@link FlexChart} control
 *                              that this directive creates.</dd>
 *   <dt>footer</dt>            <dd><code>@</code> The text to display in the chart footer (plain
 *                              text).</dd>
 *   <dt>footer-style</dt>       <dd><code>=</code> The style to apply to the chart footer.</dd>
 *   <dt>header</dt>            <dd><code>@</code> The text to display in the chart header (plain
 *                              text).</dd>
 *   <dt>header-style</dt>      <dd><code>=</code> The style to apply to the chart header.</dd>
 *   <dt>initialized</dt>       <dd><code>&</code> This event occurs after the binding has finished
 *                              initializing the control with attribute values.</dd>
 *   <dt>is-initialized</dt><dd><code>=</code> A value indicating whether the binding has finished
 *                              initializing the control with attribute values. </dd>
 *   <dt>interpolate-nulls</dt> <dd><code>@</code> The value indicating whether to interpolate or
 *                              leave gaps when there are null values in the data.</dd>
 *   <dt>item-formatter</dt>    <dd><code>=</code> The formatter function that customizes the
 *                              appearance of data points.</dd>
 *   <dt>items-source</dt>      <dd><code>=</code> An array or {@link ICollectionView} object that contains
 *                              the data used to create the chart.</dd>
 *   <dt>legend-toggle</dt>     <dd><code>@</code> The value indicating whether clicking legend items
 *                              toggles series visibility.</dd>
 *   <dt>options</dt>           <dd><code>=</code> Chart options that only apply to certain chart types.
 *                              See <b>options</b> under {@link FlexChart} for details.</dd>
 *   <dt>palette</dt>           <dd><code>=</code> An array that contains the default colors used for
 *                              displaying each series.</dd>
 *   <dt>plot-margin</dt>       <dd><code>=</code> The number of pixels of space to leave between the
 *                              edges of the control and the plot area, or CSS-style margins.</dd>
 *   <dt>rotated</dt>           <dd><code>@</code> The value indicating whether to flip the axes so that
 *                              X is vertical and Y is horizontal.</dd>
 *   <dt>selection</dt>         <dd><code>=</code> The series object that is selected.</dd>
 *   <dt>selection-mode</dt>    <dd><code>@</code> The {@link SelectionMode} value indicating whether or what is
 *                              selected when the user clicks a series.</dd>
 *   <dt>stacking</dt>          <dd><code>@</code> The {@link Stacking} value indicating whether or how series
 *                              objects are stacked or plotted independently.</dd>
 *   <dt>symbol-size</dt>       <dd><code>@</code> The size of the symbols used to render data points in Scatter,
 *                              LineSymbols, and SplineSymbols charts, in pixels. You can override
 *                              this at the series level.</dd>
 *   <dt>tooltip-content</dt>   <dd><code>@</code> The value to display in the
 *                              {@link ChartTooltip} content property.</dd>
 *   <dt>got-focus</dt>         <dd><code>&</code> The {@link FlexChart.gotFocus} event handler.</dd>
 *   <dt>lost-focus</dt>        <dd><code>&</code> The {@link FlexChart.lostFocus} event handler.</dd>
 *   <dt>rendering</dt>         <dd><code>&</code> The {@link FlexChart.rendering} event handler.</dd>
 *   <dt>rendered</dt>          <dd><code>&</code> The {@link FlexChart.rendered} event handler.</dd>
 *   <dt>series-visibility-changed</dt>
 *                              <dd><code>&</code> The {@link FlexChart.seriesVisibilityChanged} event handler.</dd>
 *   <dt>selection-changed</dt> <dd><code>&</code> The {@link FlexChart.selectionChanged} event handler.</dd>
 * </dl>
 *
 * The wj-flex-chart directive may contain the following child directives:
 * {@link wijmo.angular.chart.WjFlexChartAxis}, {@link wijmo.angular.chart.WjFlexChartSeries}, {@link wijmo.angular.chart.WjFlexChartLegend} and {@link wijmo.angular.chart.WjFlexChartDataLabel}.
 */
export class WjFlexChart extends WjFlexChartCore {

    // gets the Wijmo FlexChart control constructor
    get _controlConstructor() {
        return wijmo.chart.FlexChart;
    }
}


/**
 * AngularJS directive for the {@link FlexChart} {@link Axis} object.
 *
 * The <b>wj-flex-chart-axis</b> directive must be contained in a {@link wijmo.angular.chart.WjFlexChart} directive or {@link wijmo.angular.chart.finance.WjFinancialChart} directive.
 * It supports the following attributes:
 *
 * <dl class="dl-horizontal">
 *   <dt>wj-property</dt>     <dd><code>@</code> Defines the {@link FlexChart} property name,
 *                            axis-x or axis-y, to initialize with the directive.</dd>
 *   <dt>axis-line</dt>       <dd><code>@</code> The value indicating whether the axis line is visible.</dd>
 *   <dt>binding</dt>         <dd><code>@</code> Gets or sets the comma-separated property names for
 *                            the {@link wijmo.chart.Axis.itemsSource} property to use in axis labels.
 *                            The first name specifies the value on the axis, the second represents
 *                            the corresponding axis label. The default value is 'value,text'.</dd>
 *   <dt>format</dt>          <dd><code>@</code> The format string used for the axis labels
 *                            (see {@link Globalize}).</dd>
 *   <dt>item-formatter</dt>  <dd><code>=</code> The formatter function that customizes the
 *                            appearance of axis labels.</dd>
 *   <dt>items-source</dt>    <dd><code>=</code> The items source for the axis labels.</dd>
 *   <dt>labels</dt>          <dd><code>@</code> The value indicating whether the axis labels are visible.</dd>
 *   <dt>label-angle</dt>     <dd><code>@</code> The rotation angle of axis labels in degrees.</dd>
 *   <dt>label-align</dt>     <dd><code>@</code> The alignment of axis labels.</dd>
 *   <dt>label-padding</dt>   <dd><code>@</code> The padding of axis labels.</dd>
 *   <dt>major-grid</dt>      <dd><code>@</code> The value indicating whether the axis includes grid lines.</dd>
 *   <dt>major-tick-marks</dt><dd><code>@</code> Defines the appearance of tick marks on the axis
 *                            (see {@link TickMark}).</dd>
 *   <dt>major-unit</dt>      <dd><code>@</code> The number of units between axis labels.</dd>
 *   <dt>max</dt>             <dd><code>@</code> The minimum value shown on the axis.</dd>
 *   <dt>min</dt>             <dd><code>@</code> The maximum value shown on the axis.</dd>
 *   <dt>minor-grid</dt>      <dd><code>@</code> The value indicating whether the axis includes minor grid lines.</dd>
 *   <dt>minor-tick-marks</dt><dd><code>@</code> Defines the appearance of minor tick marks on the axis
 *                            (see {@link TickMark}).</dd>
 *   <dt>minor-unit</dt>      <dd><code>@</code> The number of units between minor axis ticks.</dd>
 *   <dt>origin</dt>          <dd><code>@</code> The axis origin.</dd>
 *   <dt>overlappingLabels</dt><dd><code>@</code> The {@link OverlappingLabels} value indicating how to handle the overlapping axis labels.</dd>
 *   <dt>position</dt>        <dd><code>@</code> The {@link Position} value indicating the position of the axis.</dd>
 *   <dt>reversed</dt>        <dd><code>@</code> The value indicating whether the axis is reversed (top to
 *                            bottom or right to left).</dd>
 *   <dt>title</dt>           <dd><code>@</code> The title text shown next to the axis.</dd>
 * </dl>
 */
export class WjFlexChartAxis extends WjDirective {

    // Initializes a new instance of a WjFlexCharAxis.
    constructor() {
        super();

        this.require = ['?^wjFlexChartSeries', '?^wjFinancialChartSeries', '?^wjFlexChart', '?^wjFinancialChart', '?^wjFlexRadar'];
        this.template = '<div class="wjFlexChartAxis" />';
    }

    get _controlConstructor() {
        return wijmo.chart.Axis;
    }

    _initControl(element: any): any {
        return super._initControl(undefined);
    }

}

/**
 * AngularJS directive for the {@link FlexChart} {@link Legend} object.
 *
 * The <b>wj-flex-chart-legend</b> directive must be contained in a {@link wijmo.angular.chart.WjFlexChart} directive, {@link wijmo.angular.chart.WjFlexPie} directive or {@link wijmo.angular.chart.finance.WjFinancialChart} directive.
 * It supports the following attributes:
 *
 * <dl class="dl-horizontal">
 *   <dt>position</dt>       <dd><code>@</code> The {@link Position} value indicating the position of the
 *                           legend.</dd>
 * </dl>
 *
 * The example below shows how you can use the wj-flex-chart-legend directive
 * to change the position of the chart legend:
 *
 * <pre>&lt;wj-flex-chart
 *   items-source="data"
 *   binding-x="country"&gt;
 *   &lt;wj-flex-chart-axis
 *       wj-property="axisY"
 *       major-unit="5000"&gt;
 *     &lt;/wj-flex-chart-axis&gt;
 *     &lt;wj-flex-chart-series
 *       binding="sales"
 *       name="Sales"&gt;
 *     &lt;/wj-flex-chart-series&gt;
 *   &lt;wj-flex-chart-legend
 *     position="Bottom"&gt;
 *   &lt;/wj-flex-chart-legend&gt;
 * &lt;/wj-flex-chart&gt;</pre>
 */
export class WjFlexChartLegend extends WjDirective {

    // Initializes a new instance of a WjFlexChartLegend.
    constructor() {
        super();

        this.require = ['?^wjFlexChart', '?^wjFlexPie', '?^wjSunburst', '?^wjFinancialChart', '?^wjFlexRadar'];
        this.template = '<div />';
    }

    get _controlConstructor() {
        return wijmo.chart.Legend;
    }

}

// abstract
export class WjFlexChartDataLabelBase extends WjDirective {

    constructor() {
        super();

        this.require = ['?^wjFlexChart', '?^wjFlexPie', '?^wjSunburst', '?^wjTreeMap'];
        this.template = '<div />';
    }

    get _controlConstructor() {
        return wijmo.chart.DataLabelBase;
    }

}

/**
 * AngularJS directive for the {@link FlexChart} {@link DataLabel} object.
 *
 * The <b>wj-flex-chart-data-label</b> directive must be contained in a {@link wijmo.angular.chart.WjFlexChart} directive.
 * It supports the following attributes:
 *
 * <dl class="dl-horizontal">
 *   <dt>content</dt>       <dd><code>=</code> A string or function that gets or sets the content of the data labels.</dd>
 *   <dt>border</dt>        <dd><code>@</code> Gets or sets a value indicating whether the data labels have borders.</dd>
 *   <dt>position</dt>      <dd><code>@</code> The {@link LabelPosition} value indicating the position of the data labels.</dd>
 * </dl>
 */
export class WjFlexChartDataLabel extends WjFlexChartDataLabelBase {

    constructor() {
        super();
        this.require = ['^wjFlexChart', '?^wjTreeMap'];
    }

    get _controlConstructor() {
        return wijmo.chart.DataLabel;
    }

}

/**
 * AngularJS directive for the {@link FlexPie} {@link PieDataLabel} object.
 *
 * The <b>wj-flex-pie-data-label</b> directive must be contained in a {@link wijmo.angular.chart.WjFlexPie} directive.
 * It supports the following attributes:
 *
 * <dl class="dl-horizontal">
 *   <dt>content</dt>       <dd><code>=</code> A string or function that gets or sets the content of the data labels.</dd>
 *   <dt>border</dt>        <dd><code>@</code> Gets or sets a value indicating whether the data labels have borders.</dd>
 *   <dt>position</dt>      <dd><code>@</code> The {@link PieLabelPosition} value indicating the position of the data labels.</dd>
 * </dl>
 */
export class WjFlexPieDataLabel extends WjFlexChartDataLabelBase {

    constructor() {
        super();
        this.require = ['^wjFlexPie', '?^wjSunburst'];
    }

    get _controlConstructor() {
        return wijmo.chart.PieDataLabel;
    }

}

// abstract for FlexChart and FinancialChart series
export class WjSeriesBase extends WjDirective {
    constructor() {
        super();
        this.require = ['?^wjFlexChart', '?^wjFinancialChart', '?^wjFlexRadar'];
        this.template = '<div class="wjSeriesBase" ng-transclude />';
        this.transclude = true;
    }

    get _controlConstructor(): any {
        return wijmo.chart.SeriesBase;
    }

    _initControl(element: any): any {
        return super._initControl(undefined);
    }

    _getId(): string {
        // fixes issue with ordering of series that
        // are of different types
        return 'series';
    }
}

/**
 * AngularJS directive for the {@link FlexChart} {@link Series} object.
 *
 * The <b>wj-flex-chart-series</b> directive must be contained in a {@link wijmo.angular.chart.WjFlexChart} directive.
 * It supports the following attributes:
 *
 * <dl class="dl-horizontal">
 *   <dt>axis-x</dt>       <dd><code>@</code> X-axis for the series.</dd>
 *   <dt>axis-y</dt>       <dd><code>@</code> Y-axis for the series.</dd>
 *   <dt>binding</dt>      <dd><code>@</code> The name of the property that contains Y values for the
 *                         series. This value overrides any binding set for the chart.</dd>
 *   <dt>binding-x</dt>    <dd><code>@</code> The name of the property that contains X values for the
 *                         series. This value overrides any binding set for the chart.</dd>
 *   <dt>chart-type</dt>   <dd><code>@</code> The chart type to use in rendering objects for this series
 *                         objects. This value overrides the default chart type set on the chart. See
 *                         {@link ChartType}.</dd>
 *   <dt>css-class</dt>    <dd><code>@</code> The CSS class to use for the series.</dd>
 *   <dt>items-source</dt> <dd><code>=</code> An array or {@link ICollectionView} object that contains
 *                         data for this series.</dd>
 *   <dt>name</dt>         <dd><code>@</code> The name of the series to show in the legend.</dd>
 *   <dt>style</dt>        <dd><code>=</code> The series style. Use ng-attr-style to specify the series
 *                         style object as an object. See the section on ngAttr attribute bindings in
 *                         <a target="_blank" href="https://docs.angularjs.org/guide/directive">
 *                         AngularJS Creating Custom Directives</a> and the <a target="_blank" href=
 *                         "https://demos.wijmo.com/5/Angular/FlexChartIntro/FlexChartIntro/#Styling">
 *                         FlexChart 101 Styling Series</a> sample for more information.</dd>
 *   <dt>altStyle</dt>     <dd><code>=</code> The series alternative style.</dd>
 *   <dt>symbol-marker</dt><dd><code>@</code> The shape of marker to use for the series. This value
 *                         overrides the default marker set on the chart. See {@link Marker}.</dd>
 *   <dt>symbol-size</dt>  <dd><code>@</code> The size of the symbols used to render data points in this series
 *                         for Scatter, LineSymbols, and SplineSymbols charts, in pixels.
 *                         This value overrides any settings at the chart level.</dd>
 *   <dt>symbol-style</dt> <dd><code>=</code> The style of the symbols used to render data
 *                         points in this series for Scatter, LineSymbols, and SplineSymbols charts.
 *                         This value overrides any settings at the chart level.</dd>
 *   <dt>visibility</dt>   <dd><code>=</code> The {@link SeriesVisibility} value indicating whether and where to
 *                         display the series.</dd>
 * </dl>
 *
 * In most cases, the <b>wj-flex-chart-series</b> specifies only the <b>name</b> and <b>binding</b> properties.
 * The remaining values are inherited from the parent <b>wj-flex-chart</b> directive.
 */
export class WjFlexChartSeries extends WjSeriesBase {

    // Initializes a new instance of a WjFlexChartSeries
    constructor() {
        super();
        this.require = '^wjFlexChart';
        this.template = '<div class="wjFlexChartSeries" ng-transclude />';
        //this.transclude = true;
    }

    // Returns constructor of related Wijmo object. Abstract member, must be overridden in inherited class
    get _controlConstructor(): any { //: new (elem: HTMLElement) => wijmo.Control {
        return wijmo.chart.Series;
    }
}

/**
 * AngularJS directive for the {@link FlexChart} {@link LineMarker} object.
 *
 * The <b>wj-flex-line-marker</b> directive must be contained in a {@link wijmo.angular.chart.WjFlexChart} directive or {@link wijmo.angular.chart.finance.WjFinancialChart} directive.
 * It supports the following attributes:
 *
 * <dl class="dl-horizontal">
 *   <dt>is-visible</dt>             <dd><code>@</code> The value indicating whether the LineMarker is visible.</dd>
 *   <dt>series-index</dt>           <dd><code>@</code> The index of the series in the chart in which the LineMarker appears.</dd>
 *   <dt>horizontal-position</dt>    <dd><code>@</code> The horizontal position of the LineMarker relative to the plot area.</dd>
 *   <dt>content</dt>               <dd><code>@</code> The function that allows you to customize the text content of the LineMarker.</dd>
 *   <dt>vertical-position</dt>      <dd><code>@</code> The vertical position of the LineMarker relative to the plot area.</dd>
 *   <dt>alignment</dt>             <dd><code>@</code> The {@link LineMarkerAlignment} value indicating the alignment of the LineMarker content.</dd>
 *   <dt>lines</dt>                 <dd><code>@</code> The {@link LineMarkerLines} value indicating the appearance of the LineMarker's lines.</dd>
 *   <dt>interaction</dt>           <dd><code>@</code> The {@link LineMarkerInteraction} value indicating the interaction mode of the LineMarker.</dd>
 *   <dt>drag-threshold</dt>         <dd><code>@</code> The maximum distance from the horizontal or vertical line that you can drag the marker.</dd>
 *   <dt>drag-content</dt>           <dd><code>@</code> The value indicating whether you can drag the content of the marker when the interaction mode is "Drag".</dd>
 *   <dt>drag-lines</dt>             <dd><code>@</code> The value indicating whether the lines are linked when you drag the horizontal or vertical line when the interaction mode is "Drag".</dd>
 * </dl>
 */
export class WjFlexChartLineMarker extends WjDirective {

    // Initializes a new instance of a WjFlexChartLineMarker
    constructor() {
        super();
        this.require = ['?^wjFlexChart', '?^wjFinancialChart'];
    }

    get _controlConstructor(): any {
        return wijmo.chart.LineMarker;
    }
}


/**
 * AngularJS directive for the {@link FlexChart} {@link DataPoint} object.
 *
 * The <b>wj-flex-chart-data-point</b> directive must be contained in a
 * {@link wijmo.angular.chart.annotation.WjFlexChartAnnotation} directive.
 * The property of the parent directive's object
 * where <b>wj-flex-data-point</b> should assign a value is specified in the
 * <b>wj-property</b> attribute.
 *
 * The directive supports the following attributes:
 *
 * <dl class="dl-horizontal">
 *
 *   <dt>wj-property</dt>        <dd><code>@</code> The name of the parent directive object's property where the
 *                                <b>DataPoint</b> will be assigned.</dd>
 *   <dt>x</dt>                  <dd><code>@</code> x coordinate, can be a numeric or date value.</dd>
 *   <dt>y</dt>                  <dd><code>@</code> y coordinate, can be a numeric or date value.</dd>
 * </dl>
 */
export class WjFlexChartDataPoint extends WjDirective {

    // Initializes a new instance of a WjFlexChartDataPoint
    constructor() {
        super();
        this.require = ['?^wjFlexChartAnnotation'];
    }

    get _controlConstructor(): any {
        return wijmo.chart.DataPoint;
    }
}

/**
 * AngularJS directive for the {@link FlexPie} control.
 *
 * <dl class="dl-horizontal">
 *   <dt>items-source</dt>      <dd><code>=</code> An array or {@link ICollectionView}
 *                              object that contains data for the chart.</dd>
 *   <dt>binding</dt>           <dd><code>@</code> The name of the property that
 *                              contains item values.</dd>
 *   <dt>binding-name</dt>      <dd><code>@</code> The name of the property that
 *                              contains item names.</dd>
 *   <dt>footer</dt>            <dd><code>@</code> The text to display in the chart footer (plain
 *                              text).</dd>
 *   <dt>footer-style</dt>       <dd><code>=</code> The style to apply to the chart footer.</dd>
 *   <dt>header</dt>            <dd><code>@</code> The text to display in the chart header (plain
 *                              text).</dd>
 *   <dt>header-style</dt>      <dd><code>=</code> The style to apply to the chart header.</dd>
 *   <dt>initialized</dt>       <dd><code>&</code> This event occurs after the binding has finished
 *                              initializing the control with attribute values.</dd>
 *   <dt>is-initialized</dt><dd><code>=</code> A value indicating whether the binding has finished
 *                              initializing the control with attribute values. </dd>
 *   <dt>inner-radius</dt>      <dd><code>@</code> The size of the hole inside the
 *                              pie, measured as a fraction of the pie radius.</dd>
 *   <dt>is-animated</dt>       <dd><code>@</code> A value indicating whether to use animation
 *                              to move selected items to the selectedItemPosition.</dd>
 *   <dt>item-formatter</dt>    <dd><code>=</code> The formatter function that customizes the
 *                              appearance of data points.</dd>
 *   <dt>offset</dt>            <dd><code>@</code> The extent to which pie slices are pulled
 *                              out from the center, as a fraction of the pie radius.</dd>
 *   <dt>palette</dt>           <dd><code>=</code> An array that contains the default colors used for
 *                              displaying pie slices.</dd>
 *   <dt>plot-margin</dt>       <dd><code>=</code> The number of pixels of space to leave between the
 *                              edges of the control and the plot area, or CSS-style margins.</dd>
 *   <dt>reversed</dt>          <dd><code>@</code> A value indicating whether to draw pie
 *                              slices in a counter-clockwise direction.</dd>
 *   <dt>start-angle</dt>       <dd><code>@</code> The starting angle for pie slices,
 *                              measured clockwise from the 9 o'clock position.</dd>
 *   <dt>selected-item-offset</dt>
 *                              <dd><code>@</code> The extent to which the selected pie slice is
 *                              pulled out from the center, as a fraction of the pie radius.</dd>
 *   <dt>selected-item-position</dt>
 *                              <dd><code>@</code> The {@link Position} value indicating where to display
 *                              the selected slice.</dd>
 *   <dt>selection-mode</dt>    <dd><code>@</code> The {@link SelectionMode} value indicating whether or what is
 *                              selected when the user clicks a series.</dd>
 *   <dt>tooltip-content</dt>   <dd><code>@</code> The value to display in the
 *                              {@link ChartTooltip} content property.</dd>
 *   <dt>got-focus</dt>         <dd><code>&</code> The {@link FlexPie.gotFocus} event handler.</dd>
 *   <dt>lost-focus</dt>        <dd><code>&</code> The {@link FlexPie.lostFocus} event handler.</dd>
 *   <dt>rendering</dt>         <dd><code>&</code> The {@link FlexPie.rendering} event handler.</dd>
 *   <dt>rendered</dt>          <dd><code>&</code> The {@link FlexPie.rendered} event handler.</dd>
 * </dl>
 *
 * The wj-flex-pie directive may contain the following child directives:
 * {@link wijmo.angular.chart.WjFlexChartLegend} and {@link wijmo.angular.chart.WjFlexPieDataLabel}.
 */
export class WjFlexPie extends WjFlexChartBase {

    // gets the Wijmo FlexPie control constructor
    get _controlConstructor() {
        return wijmo.chart.FlexPie;
    }

    _initProps() {
        super._initProps();
        var self = this; // store this in closure as .apply() call overrides the reference

        var lblContentDesc = MetaFactory.findProp('labelContent', this._props);
        lblContentDesc.customHandler = function (scope, control, value, oldValue, link) {
            if (value != null) {
                (<wijmo.chart.FlexPie>control).dataLabel.content = value;
            }
        };
    }

}



export class WjFlexChartPlotArea extends WjDirective {

    // Initializes a new instance of a WjFlexChartPlotArea.
    constructor() {
        super();

        this.require = ['?^wjFlexChartPlotArea', '?^wjFlexChart', '?^wjFinancialChart'];
        this.template = '<div class="wjFlexChartPlotArea" />';
    }

    get _controlConstructor() {
        return wijmo.chart.PlotArea;
    }

    _initControl(element: any): any {
        return super._initControl(undefined);
    }

}



//#endregion "Chart directives classes"

    }
    


    module wijmo.angular {
    

    }
    

    module wijmo.angular {
    


var wjNg: any = window['angular'];





const wijmoChartAnalyticsName = 'wj.chart.analytics'


// do not use moduleName here, it's removed from the global module version
var wijmoChartAnalytics = _registerNgModule(wijmoChartAnalyticsName);

if (softRefChartAnalytics()) {
    wijmoChartAnalytics.directive('wjFlexChartTrendLine', [function() {
        return new WjFlexChartTrendLine();
    }]);

    wijmoChartAnalytics.directive('wjFlexChartMovingAverage', [function() {
        return new WjFlexChartMovingAverage();
    }]);

    wijmoChartAnalytics.directive('wjFlexChartYFunctionSeries', [function () {
        return new WjFlexChartYFunctionSeries();
    }]);

    wijmoChartAnalytics.directive('wjFlexChartParametricFunctionSeries', [function () {
        return new WjFlexChartParametricFunctionSeries();
    }]);

    wijmoChartAnalytics.directive('wjFlexChartWaterfall', [function () {
        return new WjFlexChartWaterfall();
    }]);

    wijmoChartAnalytics.directive('wjFlexChartBoxWhisker', [function () {
        return new WjFlexChartBoxWhisker();
    }]);

    wijmoChartAnalytics.directive('wjFlexChartErrorBar', [function () {
        return new WjFlexChartErrorBar();
    }]);
}

// abstract for FlexChart and FinancialChart trendlines
export class WjTrendLineBase extends WjSeriesBase {
    constructor() {
        super();
        this.require = ['?^wjFlexChart', '?^wjFinancialChart'];
        this.template = '<div class="wjTrendLineBase" ng-transclude />';
        //this.transclude = true;
    }

    get _controlConstructor(): any {
        return wijmo.chart.analytics.TrendLineBase;
    }
}



/**
 * AngularJS directive for the {@link FlexChart} and {@link FinancialChart} {@link TrendLine} object.
 *
 * The <b>wj-flex-chart-trend-line</b> directive must be contained in a {@link wijmo.angular.chart.WjFlexChart} or {@link wijmo.angular.chart.finance.WjFinancialChart} directive.
 * It supports the following attributes:
 *
 * <dl class="dl-horizontal">
 *   <dt>binding</dt>      <dd><code>@</code> The name of the property that contains Y values for the
 *                         series. This value overrides any binding set for the chart.</dd>
 *   <dt>binding-x</dt>    <dd><code>@</code> The name of the property that contains X values for the
 *                         series. This value overrides any binding set for the chart.</dd>
 *   <dt>chart-type</dt>   <dd><code>@</code> The chart type to use in rendering objects for this series
 *                         objects. This value overrides the default chart type set on the chart. See
 *                         {@link ChartType}.</dd>
 *   <dt>css-class</dt>    <dd><code>@</code> The CSS class to use for the series.</dd>
 *   <dt>items-source</dt> <dd><code>=</code> An array or {@link ICollectionView} object that contains
 *                         data for this series.</dd>
 *   <dt>name</dt>         <dd><code>@</code> The name of the series to show in the legend.</dd>
 *   <dt>style</dt>        <dd><code>=</code> The series style. Use ng-attr-style to specify the series
 *                         style object as an object. See the section on ngAttr attribute bindings in
 *                         <a target="_blank" href="https://docs.angularjs.org/guide/directive">
 *                         AngularJS Creating Custom Directives</a> and the <a target="_blank" href=
 *                         "https://demos.wijmo.com/5/Angular/FlexChartIntro/FlexChartIntro/#Styling">
 *                         FlexChart 101 Styling Series</a> sample for more information.</dd>
 *   <dt>symbol-marker</dt><dd><code>@</code> The shape of marker to use for the series. This value
 *                         overrides the default marker set on the chart. See {@link Marker}.</dd>
 *   <dt>symbol-size</dt>  <dd><code>@</code> The size of the symbols used to render data
 *                         points in this series for Scatter, LineSymbols, and SplineSymbols charts, in pixels.
 *                         This value overrides any setting at the chart level.</dd>
 *   <dt>symbol-style</dt> <dd><code>=</code> The style of the symbols used to render data
 *                         points in this series for Scatter, LineSymbols, and SplineSymbols charts.
 *                         This value overrides any setting at the chart level.</dd>
 *   <dt>visibility</dt>   <dd><code>=</code> The {@link SeriesVisibility} value indicating whether and where to
 *                         display the series.</dd>
 *   <dt>sample-count</dt> <dd><code>@</code> The sample count for the calculation.</dd>
 *   <dt>fit-type</dt>     <dd><code>@</code> The {@link TrendLineFitType} value for the trend line.</dd>
 *   <dt>order</dt>        <dd><code>@</code> The number of terms in a polynomial or fourier equation.</dd>
 * </dl>
 *
 */
export class WjFlexChartTrendLine extends WjTrendLineBase {
    constructor() {
        super();
        //this.require = ['?^wjFlexChart', '?^wjFinancialChart'];
        this.template = '<div class="wjTrendLine" ng-transclude />';
        //this.transclude = true;
    }

    get _controlConstructor(): any {
        return wijmo.chart.analytics.TrendLine;
    }
}

/**
 * AngularJS directive for the {@link FlexChart} and {@link FinancialChart} {@link MovingAverage} object.
 *
 * The <b>wj-flex-chart-moving-average</b> directive must be contained in a {@link wijmo.angular.chart.WjFlexChart} or {@link wijmo.angular.chart.finance.WjFinancialChart} directive.
 * It supports the following attributes:
 *
 * <dl class="dl-horizontal">
 *   <dt>binding</dt>      <dd><code>@</code> The name of the property that contains Y values for the
 *                         series. This value overrides any binding set for the chart.</dd>
 *   <dt>binding-x</dt>    <dd><code>@</code> The name of the property that contains X values for the
 *                         series. This value overrides any binding set for the chart.</dd>
 *   <dt>chart-type</dt>   <dd><code>@</code> The chart type to use in rendering objects for this series
 *                         objects. This value overrides the default chart type set on the chart. See
 *                         {@link ChartType}.</dd>
 *   <dt>css-class</dt>    <dd><code>@</code> The CSS class to use for the series.</dd>
 *   <dt>items-source</dt> <dd><code>=</code> An array or {@link ICollectionView} object that contains
 *                         data for this series.</dd>
 *   <dt>name</dt>         <dd><code>@</code> The name of the series to show in the legend.</dd>
 *   <dt>style</dt>        <dd><code>=</code> The series style. Use ng-attr-style to specify the series
 *                         style object as an object. See the section on ngAttr attribute bindings in
 *                         <a target="_blank" href="https://docs.angularjs.org/guide/directive">
 *                         AngularJS Creating Custom Directives</a> and the <a target="_blank" href=
 *                         "https://demos.wijmo.com/5/Angular/FlexChartIntro/FlexChartIntro/#Styling">
 *                         FlexChart 101 Styling Series</a> sample for more information.</dd>
 *   <dt>symbol-marker</dt><dd><code>@</code> The shape of marker to use for the series. This value
 *                         overrides the default marker set on the chart. See {@link Marker}.</dd>
 *   <dt>symbol-size</dt>  <dd><code>@</code> The size of the symbols used to render data
 *                         points in this series for Scatter, LineSymbols, and SplineSymbols charts, in pixels.
 *                         This value overrides any set at the chart level.</dd>
 *   <dt>symbol-style</dt> <dd><code>=</code> The style of the symbols used to render data
 *                         points in this series for Scatter, LineSymbols, and SplineSymbols charts.
 *                         This value overrides any setting at the chart level.</dd>
 *   <dt>visibility</dt>   <dd><code>=</code> The {@link SeriesVisibility} value indicating whether and where to
 *                         display the series.</dd>
 *   <dt>type</dt>         <dd><code>@</code> The {@link MovingAverageType} value for the moving average series.</dd>
 *   <dt>period</dt>       <dd><code>@</code> The period for the moving average calculation.</dd>
 * </dl>
 *
 */
export class WjFlexChartMovingAverage extends WjTrendLineBase {
    constructor() {
        super();
        //this.require = ['?^wjFlexChart', '?^wjFinancialChart'];
        this.template = '<div class="wjMovingAverage" ng-transclude />';
        //this.transclude = true;
    }

    get _controlConstructor(): any {
        return wijmo.chart.analytics.MovingAverage;
    }
}
/**
 * AngularJS directive for the {@link FlexChart} and {@link FinancialChart} {@link YFunctionSeries} object.
 *
 * The <b>wj-flex-chart-y-function-series</b> directive must be contained in a {@link wijmo.angular.chart.WjFlexChart} or {@link wijmo.angular.chart.finance.WjFinancialChart} directive.
 * It supports the following attributes:
 *
 * <dl class="dl-horizontal">
 *   <dt>binding</dt>      <dd><code>@</code> The name of the property that contains Y values for the
 *                         series. This value overrides any binding set for the chart.</dd>
 *   <dt>binding-x</dt>    <dd><code>@</code> The name of the property that contains X values for the
 *                         series. This value overrides any binding set for the chart.</dd>
 *   <dt>chart-type</dt>   <dd><code>@</code> The chart type to use in rendering objects for this series
 *                         objects. This value overrides the default chart type set on the chart. See
 *                         {@link ChartType}.</dd>
 *   <dt>css-class</dt>    <dd><code>@</code> The CSS class to use for the series.</dd>
 *   <dt>items-source</dt> <dd><code>=</code> An array or {@link ICollectionView} object that contains
 *                         data for this series.</dd>
 *   <dt>name</dt>         <dd><code>@</code> The name of the series to show in the legend.</dd>
 *   <dt>style</dt>        <dd><code>=</code> The series style. Use ng-attr-style to specify the series
 *                         style object as an object. See the section on ngAttr attribute bindings in
 *                         <a target="_blank" href="https://docs.angularjs.org/guide/directive">
 *                         AngularJS Creating Custom Directives</a> and the <a target="_blank" href=
 *                         "https://demos.wijmo.com/5/Angular/FlexChartIntro/FlexChartIntro/#Styling">
 *                         FlexChart 101 Styling Series</a> sample for more information.</dd>
 *   <dt>symbol-marker</dt><dd><code>@</code> The shape of marker to use for the series. This value
 *                         overrides the default marker set on the chart. See {@link Marker}.</dd>
 *   <dt>symbol-size</dt>  <dd><code>@</code> The size of the symbols used to render data
 *                         points in this series for Scatter, LineSymbols, and SplineSymbols charts, in pixels.
 *                         This value overrides any set at the chart level.</dd>
 *   <dt>symbol-style</dt> <dd><code>=</code> The style of the symbols used to render data
 *                         points in this series for Scatter, LineSymbols, and SplineSymbols charts.
 *                         This value overrides any setting at the chart level.</dd>
 *   <dt>visibility</dt>   <dd><code>=</code> The {@link SeriesVisibility} value indicating whether and where to
 *                         display the series.</dd>
 *   <dt>sample-count</dt> <dd><code>@</code> The sample count for the calculation.</dd>
 *   <dt>min</dt>       <dd><code>@</code> The minimum value of the parameter for calculating a function.</dd>
 *   <dt>max</dt>       <dd><code>@</code> The maximum value of the parameter for calculating a function.</dd>
 *   <dt>func</dt>       <dd><code>@</code> The function used to calculate Y value.</dd>
 * </dl>
 *
 */
export class WjFlexChartYFunctionSeries extends WjTrendLineBase {
    constructor() {
        super();
        //this.require = ['?^wjFlexChart', '?^wjFinancialChart'];
        this.template = '<div class="wjYFunctionSeries" ng-transclude />';
        //this.transclude = true;
    }

    get _controlConstructor(): any {
        return wijmo.chart.analytics.YFunctionSeries;
    }
}
/**
 * AngularJS directive for the {@link FlexChart} and {@link FinancialChart} {@link wijmo.angular.chart.analytics.WjFlexChartParametricFunctionSeries} object.
 *
 * The <b>wj-flex-chart-parametric-function-series</b> directive must be contained in a {@link wijmo.angular.chart.WjFlexChart} or {@link wijmo.angular.chart.finance.WjFinancialChart} directive.
 * It supports the following attributes:
 *
 * <dl class="dl-horizontal">
 *   <dt>binding</dt>      <dd><code>@</code> The name of the property that contains Y values for the
 *                         series. This value overrides any binding set for the chart.</dd>
 *   <dt>binding-x</dt>    <dd><code>@</code> The name of the property that contains X values for the
 *                         series. This value overrides any binding set for the chart.</dd>
 *   <dt>chart-type</dt>   <dd><code>@</code> The chart type to use in rendering objects for this series
 *                         objects. This value overrides the default chart type set on the chart. See
 *                         {@link ChartType}.</dd>
 *   <dt>css-class</dt>    <dd><code>@</code> The CSS class to use for the series.</dd>
 *   <dt>items-source</dt> <dd><code>=</code> An array or {@link ICollectionView} object that contains
 *                         data for this series.</dd>
 *   <dt>name</dt>         <dd><code>@</code> The name of the series to show in the legend.</dd>
 *   <dt>style</dt>        <dd><code>=</code> The series style. Use ng-attr-style to specify the series
 *                         style object as an object. See the section on ngAttr attribute bindings in
 *                         <a target="_blank" href="https://docs.angularjs.org/guide/directive">
 *                         AngularJS Creating Custom Directives</a> and the <a target="_blank" href=
 *                         "https://demos.wijmo.com/5/Angular/FlexChartIntro/FlexChartIntro/#Styling">
 *                         FlexChart 101 Styling Series</a> sample for more information.</dd>
 *   <dt>symbol-marker</dt><dd><code>@</code> The shape of marker to use for the series. This value
 *                         overrides the default marker set on the chart. See {@link Marker}.</dd>
 *   <dt>symbol-size</dt>  <dd><code>@</code> The size of the symbols used to render data
 *                         points in this series for Scatter, LineSymbols, and SplineSymbols charts, in pixels.
 *                         This value overrides any set at the chart level.</dd>
 *   <dt>symbol-style</dt> <dd><code>=</code> The style of the symbols used to render data
 *                         points in this series for Scatter, LineSymbols, and SplineSymbols charts.
 *                         This value overrides any setting at the chart level.</dd>
 *   <dt>visibility</dt>   <dd><code>=</code> The {@link SeriesVisibility} value indicating whether and where to
 *                         display the series.</dd>
 *   <dt>sample-count</dt> <dd><code>@</code> The sample count for the calculation.</dd>
 *   <dt>min</dt>       <dd><code>@</code> The minimum value of the parameter for calculating a function.</dd>
 *   <dt>max</dt>       <dd><code>@</code> The maximum value of the parameter for calculating a function.</dd>
 *   <dt>x-func</dt>       <dd><code>@</code> The function used to calculate the x value.</dd>
 *   <dt>y-func</dt>       <dd><code>@</code> The function used to calculate the y value.</dd>
 * </dl>
 *
 */
export class WjFlexChartParametricFunctionSeries extends WjTrendLineBase {
    constructor() {
        super();
        //this.require = ['?^wjFlexChart', '?^wjFinancialChart'];
        this.template = '<div class="wjParametricFunctionSeries" ng-transclude />';
        //this.transclude = true;
    }

    get _controlConstructor(): any {
        return wijmo.chart.analytics.ParametricFunctionSeries;
    }

    _initProps() {
        super._initProps();
        var self = this; // store this in closure as .apply() call overrides the reference

        var funcDesc = MetaFactory.findProp('func', this._props);
        funcDesc.customHandler = function (scope, control, value, oldValue, link) {
            if (value != null) {
                (<wijmo.chart.analytics.ParametricFunctionSeries><any>control).xFunc = value;
            }
        };
    }
}

/**
 * AngularJS directive for the {@link FlexChart} and {@link FinancialChart} {@link Waterfall} object.
 *
 * The <b>wj-flex-chart-waterfall</b> directive must be contained in a {@link wijmo.angular.chart.WjFlexChart} or {@link wijmo.angular.chart.finance.WjFinancialChart} directive.
 * It supports the following attributes:
 *
 * <dl class="dl-horizontal">
 *   <dt>binding</dt>      <dd><code>@</code> The name of the property that contains Y values for the
 *                         series. This value overrides any binding set for the chart.</dd>
 *   <dt>binding-x</dt>    <dd><code>@</code> The name of the property that contains X values for the
 *                         series. This value overrides any binding set for the chart.</dd>
 *   <dt>items-source</dt> <dd><code>=</code> An array or {@link ICollectionView} object that contains
 *                         data for this series.</dd>
 *   <dt>name</dt>         <dd><code>@</code> The name of the series to show in the legend.</dd>
 *   <dt>visibility</dt>   <dd><code>=</code> The {@link SeriesVisibility} value indicating whether and where to
 *                         display the series.</dd>
 *   <dt>relative-data</dt> <dd><code>@</code> The value that determines whether the given data is relative.</dd>
 *   <dt>start</dt>        <dd><code>@</code> The value of the start bar.</dd>
 *   <dt>start-label</dt>  <dd><code>@</code> The label of the start bar.</dd>
 *   <dt>show-total</dt>   <dd><code>@</code> The value that determines whether the show the total bar.</dd>
 *   <dt>total-label</dt>  <dd><code>@</code> The label of the total bar.</dd>
 *   <dt>show-intermediate-total</dt>      <dd><code>@</code> The value that determines whether to show the intermediate total bar.</dd>
 *   <dt>intermediate-total-positions</dt> <dd><code>@</code> The value that contains the index for positions of the intermediate total bar.</dd>
 *   <dt>intermediate-total-labels</dt>    <dd><code>@</code> The value that contains the label of the intermediate total bar.</dd>
 *   <dt>connector-lines</dt>  <dd><code>@</code> The value that determines whether to show connector lines.</dd>
 *   <dt>styles</dt>       <dd><code>@</code> The value of the waterfall styles.</dd>
 * </dl>
 */
export class WjFlexChartWaterfall extends WjSeriesBase {
    constructor() {
        super();
        this.require = ['?^wjFlexChart', '?^wjFinancialChart'];
        this.template = '<div class="wjWaterfall" ng-transclude />';
        //this.transclude = true;
    }

    get _controlConstructor(): any {
        return wijmo.chart.analytics.Waterfall;
    }
}

/**
 * AngularJS directive for the {@link FlexChart} and {@link FinancialChart} {@link BoxWhisker} object.
 *
 * The <b>wj-flex-chart-box-whisker</b> directive must be contained in a {@link wijmo.angular.chart.WjFlexChart} or {@link wijmo.angular.chart.finance.WjFinancialChart} directive.
 * It supports the following attributes:
 *
 * <dl class="dl-horizontal">
 *   <dt>binding</dt>      <dd><code>@</code> The name of the property that contains Y values for the
 *                         series. This value overrides any binding set for the chart.</dd>
 *   <dt>binding-x</dt>    <dd><code>@</code> The name of the property that contains X values for the
 *                         series. This value overrides any binding set for the chart.</dd>
 *   <dt>items-source</dt> <dd><code>=</code> An array or {@link ICollectionView} object that contains
 *                         data for this series.</dd>
 *   <dt>name</dt>         <dd><code>@</code> The name of the series to show in the legend.</dd>
 *   <dt>visibility</dt>   <dd><code>=</code> The {@link SeriesVisibility} value indicating whether and where to
 *                         display the series.</dd>
 *   <dt>quartile-calculation</dt> <dd><code>@</code> The value that specifies the quartile calculation for the Box&Whisker chart.</dd>
 *   <dt>group-width</dt>        <dd><code>@</code> The value that determines the group width as a percentage for the Box&Whisker chart.</dd>
 *   <dt>gap-width</dt>  <dd><code>@</code> The value that determines the gap width as a percentage for the Box&Whisker chart.</dd>
 *   <dt>show-mean-line</dt>   <dd><code>@</code> The value that determines whether to show the mean line for the Box&Whisker chart.</dd>
 *   <dt>mean-line-style</dt>  <dd><code>@</code> The value that specifies the style for the mean line.</dd>
 *   <dt>show-mean-marker</dt>      <dd><code>@</code> The value that determines whether to show the mean marker for the Box&Whisker chart.</dd>
 *   <dt>mean-marker-style</dt> <dd><code>@</code> The value that specifies the style for the mean marker.</dd>
 *   <dt>show-inner-points</dt>    <dd><code>@</code> The value that determines whether to show the inner points for the Box&Whisker chart.</dd>
 *   <dt>show-outliers</dt>  <dd><code>@</code> The value that determines whether to show the outliers for the Box&Whisker chart.</dd>
 * </dl>
 *
 */
export class WjFlexChartBoxWhisker extends WjSeriesBase {
    constructor() {
        super();
        this.require = ['?^wjFlexChart', '?^wjFinancialChart'];
        this.template = '<div class="wjBoxWhisker" ng-transclude />';
        //this.transclude = true;
    }

    get _controlConstructor(): any {
        return wijmo.chart.analytics.BoxWhisker;
    }
}

/**
 * AngularJS directive for the {@link FlexChart} {@link ErrorBar} object.
 *
 * The <b>wj-flex-chart-error-bar</b> directive must be contained in a {@link wijmo.angular.chart.WjFlexChart} directive.
 * It supports the following attributes:
 *
 * <dl class="dl-horizontal">
 *   <dt>binding</dt>      <dd><code>@</code> The name of the property that contains Y values for the
 *                         series. This value overrides any binding set for the chart.</dd>
 *   <dt>binding-x</dt>    <dd><code>@</code> The name of the property that contains X values for the
 *                         series. This value overrides any binding set for the chart.</dd>
 *   <dt>items-source</dt> <dd><code>=</code> An array or {@link ICollectionView} object that contains
 *                         data for this series.</dd>
 *   <dt>name</dt>         <dd><code>@</code> The name of the series to show in the legend.</dd>
 *   <dt>visibility</dt>   <dd><code>=</code> The {@link SeriesVisibility} value indicating whether and where to
 *                         display the series.</dd>
 *   <dt>error-bar-style</dt> <dd><code>@</code> The value that specifies the ErrorBar style.</dd>
 *   <dt>value</dt>        <dd><code>@</code> The value that specifies the error value of the series.</dd>
 *   <dt>error-amount</dt>  <dd><code>@</code> The value that specifies the error amount of the series.</dd>
 *   <dt>end-style</dt>   <dd><code>@</code> The value that specifies the end style of the series.</dd>
 *   <dt>direction</dt>  <dd><code>@</code> The value that specifies the direction of the series.</dd>
 * </dl>
 *
 */
export class WjFlexChartErrorBar extends WjFlexChartSeries {
    constructor() {
        super();
        this.require = ['?^wjFlexChart'];
        this.template = '<div class="wjErrorBar" ng-transclude />';
        //this.transclude = true;
    }

    get _controlConstructor(): any {
        return wijmo.chart.analytics.ErrorBar;
    }
}


    }
    


    module wijmo.angular {
    

    }
    

    module wijmo.angular {
    


var wjNg: any = window['angular'];


//import * as wjcChart from '@grapecity/@grapecity/wijmo.chart';


const wijmoChartAnimationName = 'wj.chart.animation'


// do not use moduleName here, it's removed from the global module version
var wijmoChartAnimation = _registerNgModule(wijmoChartAnimationName);

if (softRefChartAnimation()) {
    wijmoChartAnimation.directive('wjFlexChartAnimation', [function () {
        return new WjFlexChartAnimation();
    }]);
}

/**
 * AngularJS directive for the {@link FlexChart} {@link wijmo.chart.animation.ChartAnimation} object.
 *
 * The <b>wj-flex-chart-animation</b> directive must be contained in a {@link wijmo.angular.chart.WjFlexChart} or {@link wijmo.angular.chart.WjFlexPie} or {@link wijmo.angular.chart.finance.WjFinancialChart} directive.
 * It supports the following attributes:
 *
 * <dl class="dl-horizontal">
 *   <dt>animation-mode</dt>     <dd><code>@</code> The value indicating whether the plot points animate one at a time, series by series, or all at once.</dd>
 *   <dt>easing</dt>           <dd><code>@</code> The value indicating the easing function applied to the animation.</dd>
 *   <dt>duration</dt>           <dd><code>@</code> The value indicating the length of entire animation in milliseconds.</dd>
 *   <dt>axis-animation</dt>           <dd><code>@</code> The value indicating whether the axis animation is enabled.</dd>
 * </dl>
 */
export class WjFlexChartAnimation extends WjDirective {

    // Initializes a new instance of a WjFlexChartRangeSelector
    constructor() {
        super();
        this.require = ['?^wjFlexChart', '?^wjFlexPie', '?^wjSunburst', '?^wjFinancialChart', '?^wjFlexRadar'];
    }

    get _controlConstructor(): any {
        return wijmo.chart.animation.ChartAnimation;
    }
}

    }
    


    module wijmo.angular {
    

    }
    

    module wijmo.angular {
    


var wjNg: any = window['angular'];




const wijmoChartAnnotationName = 'wj.chart.annotation'


// do not use moduleName here, it's removed from the global module version
var wijmoChartAnnotation = _registerNgModule(wijmoChartAnnotationName);

if (softRefChartAnnotation()) {
    wijmoChartAnnotation.directive('wjFlexChartAnnotationLayer', [function () {
        return new WjFlexChartAnnotationLayer();
    }]);
    wijmoChartAnnotation.directive('wjFlexChartAnnotation', [function () {
        return new WjFlexChartAnnotation();
    }]);
}



/**
 * AngularJS directive for the {@link FlexChart} {@link AnnotationLayer} object.
 *
 * The <b>wj-flex-chart-annotation-layer</b> directive must be contained in a {@link wijmo.angular.chart.WjFlexChart} directive
 * or {@link wijmo.angular.chart.finance.WjFinancialChart} directive.
 *
 */
export class WjFlexChartAnnotationLayer extends WjDirective {

    // Initializes a new instance of a WjFlexChartAnnotationLayer
    constructor() {
        super();
        this.require = ['?^wjFlexChart', '?^wjFinancialChart'];
        this.template = '<div class="wjFlexChartAnnotationLayer" ng-transclude />';
        this.transclude = true;
    }

    get _controlConstructor(): any {
        return wijmo.chart.annotation.AnnotationLayer;
    }
}


/**
 * AngularJS directive for the annotations.
 *
 * The <b>wj-flex-chart-annotation</b> directive must be contained in a
 * {@link wijmo.angular.chart.annotation.WjFlexChartAnnotationLayer} directive.
 *
 * The <b>wj-flex-chart-annotation</b> directive is used to represent all types of
 * possible annotation shapes like <b>Circle</b>, <b>Rectangle</b>, <b>Polygon</b>
 * and so on. The type of annotation shape is specified
 * in the directive's <b>type</b> attribute.
 *
 * The directive supports the following attributes:
 *
 * <dl class="dl-horizontal">
 *
 *   <dt>type</dt>                  <dd><code>@</code> The class name of the annotation shape represented by the directive.
 *                                      The possible values are {@link Circle}, {@link Ellipse}, {@link Image}, {@link Line}, {@link Polygon},
 *                                      {@link Rectangle}, {@link Square}, {@link Text}.</dd>
 *   <dt>attachment</dt>            <dd><code>@</code> An {@link AnnotationAttachment} value defining the attachment of the annotation.
 *                                      </dd>
 *   <dt>content</dt>               <dd><code>@</code> The text of the <b>Circle</b>, <b>Ellipse</b>, <b>Image</b>, <b>Line</b>,
 *                                      <b>Polygon</b>, <b>Rectangle</b> or <b>Square</b> annotation.</dd>
 *   <dt>end</dt>                   <dd><code>@</code> The end point of the <b>Line</b> annotation.</dd>
 *   <dt>height</dt>                <dd><code>@</code> The height of the <b>Ellipse</b>, <b>Image</b> or <b>Rectangle</b> annotation.</dd>
 *   <dt>href</dt>                  <dd><code>@</code> The href of the <b>Image</b> annotation.</dd>
 *   <dt>is-visible</dt>             <dd><code>@</code> The visibility of the annotation.</dd>
 *   <dt>length</dt>                <dd><code>@</code> The length of the <b>Square</b> annotation.</dd>
 *   <dt>name</dt>                  <dd><code>@</code> The name of the annotation.</dd>
 *   <dt>offset</dt>                <dd><code>@</code> The offset of the annotation.</dd>
 *   <dt>point</dt>                 <dd><code>@</code> The point of the annotation, the coordinate space of the point depends on the <b>attachment</b>  property value.
 *                                      The property works for <b>Circle</b>, <b>Ellipse</b>, <b>Image</b>, <b>Rectangle</b>, <b>Square</b>
 *                                      and <b>Text</b> annotation.</dd>
 *   <dt>point-index</dt>           <dd><code>@</code> The index of the data point in the specified series where the annotation is attached to.</dd>
 *   <dt>position</dt>              <dd><code>@</code> An {@link AnnotationPosition} value defining the position of the annotation
 *                                      relative to the <b>point</b>.</dd>
 *   <dt>radius</dt>                <dd><code>@</code> The radius of the <b>Circle</b> annotation.</dd>
 *   <dt>series-index</dt>          <dd><code>@</code> The index of the data series where the annotation is attached to.</dd>
 *   <dt>start</dt>                 <dd><code>@</code> The start point of the <b>Line</b> annotation.</dd>
 *   <dt>style</dt>                 <dd><code>@</code> The style of the annotation.</dd>
 *   <dt>text</dt>                  <dd><code>@</code> The text of the <b>Text</b> annotation.</dd>
 *   <dt>tooltip</dt>               <dd><code>@</code> The tooltip of the annotation.</dd>
 *   <dt>width</dt>                 <dd><code>@</code> The width of the <b>Ellipse</b>, <b>Image</b> or <b>Rectangle</b> annotation.</dd>
 * </dl>
 */
export class WjFlexChartAnnotation extends WjDirective {

    // Initializes a new instance of a WjFlexChartAnnotation
    constructor() {
        super();
        this.require = '^wjFlexChartAnnotationLayer';
        this.template = '<div class="wjFlexChartAnnotation" ng-transclude />';
        this.transclude = true;
    }

    _createLink(): WjLink {
        return new WjFlexChartAnnotationLink();
    }

    _getMetaDataId(): any {
        return 'FlexChartAnnotation';
    }
}

export class WjFlexChartAnnotationLink extends WjLink {

    _initControl(): any {
        return new wijmo.chart.annotation[this.scope['type']]();
    }

}


    }
    


    module wijmo.angular {
    

    }
    

    module wijmo.angular {
    


var wjNg: any = window['angular'];





const wijmoChartFinanceName = 'wj.chart.finance'


// do not use moduleName here, it's removed from the global module version
var wijmoChartFinance = _registerNgModule(wijmoChartFinanceName);

if (softRefChartFinance()) {
    wijmoChartFinance.directive('wjFinancialChart', [function () {
        return new WjFinancialChart();
    }]);

    wijmoChartFinance.directive('wjFinancialChartSeries', [function () {
        return new WjFinancialChartSeries();
    }]);

}


/**
 * AngularJS directive for the {@link FinancialChart} control.
 *
 * Use the <b>wj-financial-chart</b> directive to add financial charts to your AngularJS applications.
 * Note that directive and parameter names must be formatted using lower-case letters
 * with dashes instead of camel case.
 *
 * The wj-financial-chart directive supports the following attributes:
 *
 * <dl class="dl-horizontal">
 *   <dt>binding</dt>           <dd><code>@</code> The name of the property that contains Y
 *                              values for the chart. You can override this at the series level.</dd>
 *   <dt>binding-x</dt>         <dd><code>@</code> The name of the property that contains X
 *                              values for the chart. You can override this at the series level.</dd>
 *   <dt>chart-type</dt>        <dd><code>@</code> The default chart type to use in rendering series
 *                              objects. You can override this at the series level. See {@link FinancialChartType}.</dd>
 *   <dt>control</dt>           <dd><code>=</code> A reference to the {@link FinancialChart} control
 *                              that this directive creates.</dd>
 *   <dt>footer</dt>            <dd><code>@</code> The text to display in the chart footer (plain
 *                              text).</dd>
 *   <dt>footer-style</dt>       <dd><code>=</code> The style to apply to the chart footer.</dd>
 *   <dt>header</dt>            <dd><code>@</code> The text to display in the chart header (plain
 *                              text).</dd>
 *   <dt>header-style</dt>      <dd><code>=</code> The style to apply to the chart header.</dd>
 *   <dt>initialized</dt>       <dd><code>&</code> This event occurs after the binding has finished
 *                              initializing the control with attribute values.</dd>
 *   <dt>is-initialized</dt><dd><code>=</code> A value indicating whether the binding has finished
 *                              initializing the control with attribute values. </dd>
 *   <dt>interpolate-nulls</dt> <dd><code>@</code> The value indicating whether to interpolate or
 *                              leave gaps when there are null values in the data.</dd>
 *   <dt>item-formatter</dt>    <dd><code>=</code> The formatter function that customizes the
 *                              appearance of data points.</dd>
 *   <dt>items-source</dt>      <dd><code>=</code> An array or {@link ICollectionView} object that contains
 *                              the data used to create the chart.</dd>
 *   <dt>legend-toggle</dt>     <dd><code>@</code> The value indicating whether clicking legend items
 *                              toggles series visibility.</dd>
 *   <dt>options</dt>           <dd><code>=</code> Chart options that only apply to certain chart types.
 *                              See <b>options</b> under {@link FinancialChart} for details.</dd>
 *   <dt>palette</dt>           <dd><code>=</code> An array that contains the default colors used for
 *                              displaying each series.</dd>
 *   <dt>plot-margin</dt>       <dd><code>=</code> The number of pixels of space to leave between the
 *                              edges of the control and the plot area, or CSS-style margins.</dd>
 *   <dt>selection</dt>         <dd><code>=</code> The series object that is selected.</dd>
 *   <dt>selection-mode</dt>    <dd><code>@</code> The {@link SelectionMode} value indicating whether or what is
 *                              selected when the user clicks a series.</dd>
 *   <dt>symbol-size</dt>       <dd><code>@</code> The size of the symbols used to render data
 *                              points in Scatter, LineSymbols, and SplineSymbols charts, in pixels. You can override
 *                              this at the series level.</dd>
 *   <dt>tooltip-content</dt>   <dd><code>@</code> The value to display in the
 *                              {@link ChartTooltip} content property.</dd>
 *   <dt>got-focus</dt>         <dd><code>&</code> The {@link FinancialChart.gotFocus} event handler.</dd>
 *   <dt>lost-focus</dt>        <dd><code>&</code> The {@link FinancialChart.lostFocus} event handler.</dd>
 *   <dt>rendering</dt>         <dd><code>&</code> The {@link FinancialChart.rendering} event handler.</dd>
 *   <dt>rendered</dt>          <dd><code>&</code> The {@link FinancialChart.rendered} event handler.</dd>
 *   <dt>series-visibility-changed</dt>
 *                              <dd><code>&</code> The {@link FinancialChart.seriesVisibilityChanged} event handler.</dd>
 *   <dt>selection-changed</dt> <dd><code>&</code> The {@link FinancialChart.selectionChanged} event handler.</dd>
 * </dl>
 *
 * The wj-financial-chart directive may contain the following child directives:
 * {@link wijmo.angular.chart.WjFlexChartAxis}, {@link wijmo.angular.chart.WjFlexChartSeries}, {@link wijmo.angular.chart.WjFlexChartLegend} and {@link wijmo.angular.chart.WjFlexChartDataLabel}.
 */
export class WjFinancialChart extends WjFlexChartCore {

    // gets the Wijmo FinancialChart control constructor
    get _controlConstructor() {
        return wijmo.chart.finance.FinancialChart;
    }
}

/**
 * AngularJS directive for the {@link FinancialChart} {@link FinancialSeries} object.
 *
 * The <b>wj-financial-chart-series</b> directive must be contained in a {@link wijmo.angular.chart.finance.WjFinancialChart} directive.
 * It supports the following attributes:
 *
 * <dl class="dl-horizontal">
 *   <dt>axis-x</dt>       <dd><code>@</code> X-axis for the series.</dd>
 *   <dt>axis-y</dt>       <dd><code>@</code> Y-axis for the series.</dd>
 *   <dt>binding</dt>      <dd><code>@</code> The name of the property that contains Y values for the
 *                         series. This value overrides any binding set for the chart.</dd>
 *   <dt>binding-x</dt>    <dd><code>@</code> The name of the property that contains X values for the
 *                         series. This value overrides any binding set for the chart.</dd>
 *   <dt>chart-type</dt>   <dd><code>@</code> The chart type to use in rendering objects for this series
 *                         objects. This value overrides the default chart type set on the chart. See
 *                         {@link FinancialChartType}.</dd>
 *   <dt>css-class</dt>    <dd><code>@</code> The CSS class to use for the series.</dd>
 *   <dt>items-source</dt> <dd><code>=</code> An array or {@link ICollectionView} object that contains
 *                         data for this series.</dd>
 *   <dt>name</dt>         <dd><code>@</code> The name of the series to show in the legend.</dd>
 *   <dt>style</dt>        <dd><code>=</code> The series style. Use ng-attr-style to specify the series
 *                         style object as an object. See the section on ngAttr attribute bindings in
 *                         <a target="_blank" href="https://docs.angularjs.org/guide/directive">
 *                         AngularJS Creating Custom Directives</a> and the <a target="_blank" href=
 *                         "https://demos.wijmo.com/5/Angular/FlexChartIntro/FlexChartIntro/#Styling">
 *                         FlexChart 101 Styling Series</a> sample for more information.</dd>
 *   <dt>altStyle</dt>     <dd><code>=</code> The series alternative style.</dd>
 *   <dt>symbol-marker</dt><dd><code>@</code> The shape of marker to use for the series. This value
 *                         overrides the default marker set on the chart. See {@link Marker}.</dd>
 *   <dt>symbol-size</dt>  <dd><code>@</code> The size of the symbols used to render data points in this
 *                         series for Scatter, LineSymbols, and SplineSymbols charts, in pixels.
 *                         This value overrides any setting at the chart level.</dd>
 *   <dt>symbol-style</dt> <dd><code>=</code> The style of the symbols used to render data
 *                         points in this series for Scatter, LineSymbols, and SplineSymbols charts.
 *                         This value overrides any setting at the chart level.</dd>
 *   <dt>visibility</dt>   <dd><code>=</code> The {@link SeriesVisibility} value indicating whether and where to
 *                         display the series.</dd>
 * </dl>
 *
 * In most cases, the <b>wj-financial-chart-series</b> specifies the <b>name</b> and <b>binding</b> properties only.
 * The remaining values are inherited from the parent <b>wj-financial-chart</b> directive.
 */
export class WjFinancialChartSeries extends WjSeriesBase {

    // Initializes a new instance of a WjFinancialChartSeries
    constructor() {
        super();
        this.require = '^wjFinancialChart';
        this.template = '<div class="wjFinancialChartSeries" ng-transclude />';
        //this.transclude = true;
    }

    // Returns constructor of related Wijmo object. Abstract member, must be overridden in inherited class
    get _controlConstructor(): any { //: new (elem: HTMLElement) => wijmo.Control {
        return wijmo.chart.finance.FinancialSeries;
    }
}


    }
    


    module wijmo.angular {
    

    }
    

    module wijmo.angular {
    


var wjNg: any = window['angular'];





const wijmoChartFinAnName = 'wj.chart.finance.analytics';


// do not use moduleName here, it's removed from the global module version
var wijmoChartFinAn = _registerNgModule(wijmoChartFinAnName);


if (softRefChartFinanceAnalytics()) {
    wijmoChartFinAn.directive('wjFlexChartFibonacci', [function () {
        return new WjFlexChartFibonacci();
    }]);

    wijmoChartFinAn.directive('wjFlexChartFibonacciArcs', [function () {
        return new WjFlexChartFibonacciArcs();
    }]);

    wijmoChartFinAn.directive('wjFlexChartFibonacciFans', [function () {
        return new WjFlexChartFibonacciFans();
    }]);

    wijmoChartFinAn.directive('wjFlexChartFibonacciTimeZones', [function () {
        return new WjFlexChartFibonacciTimeZones();
    }]);

    wijmoChartFinAn.directive('wjFlexChartAtr', [function () {
        return new WjFlexChartAtr();
    }]);

    wijmoChartFinAn.directive('wjFlexChartCci', [function () {
        return new WjFlexChartCci();
    }]);

    wijmoChartFinAn.directive('wjFlexChartRsi', [function () {
        return new WjFlexChartRsi();
    }]);

    wijmoChartFinAn.directive('wjFlexChartWilliamsR', [function () {
        return new WjFlexChartWilliamsR();
    }]);

    wijmoChartFinAn.directive('wjFlexChartMacd', [function () {
        return new WjFlexChartMacd();
    }]);

    wijmoChartFinAn.directive('wjFlexChartMacdHistogram', [function () {
        return new WjFlexChartMacdHistogram();
    }]);

    wijmoChartFinAn.directive('wjFlexChartStochastic', [function () {
        return new WjFlexChartStochastic();
    }]);

    wijmoChartFinAn.directive('wjFlexChartBollingerBands', [function () {
        return new WjFlexChartBollingerBands();
    }]);

    wijmoChartFinAn.directive('wjFlexChartEnvelopes', [function () {
        return new WjFlexChartEnvelopes();
    }]);
}

// abstract for FinancialChart's overlays and indicators
export class WjBaseOverlayIndicator extends WjSeriesBase {
    constructor() {
        super();
        this.require = '^wjFinancialChart';
        this.template = '<div class="wjBaseOverlayIndicator" ng-transclude />';
    }

    get _controlConstructor(): any {
        return wijmo.chart.finance.analytics.OverlayIndicatorBase;
    }
}

// abstract for FinancialChart's overlays and indicators
export class WjBaseSingleOverlayIndicator extends WjBaseOverlayIndicator {
    constructor() {
        super();
        this.template = '<div class="wjBaseSingleOverlayIndicator" ng-transclude />';
    }

    get _controlConstructor(): any {
        return wijmo.chart.finance.analytics.SingleOverlayIndicatorBase;
    }
}



/**
 * AngularJS directive for the {@link FinancialChart} {@link Fibonacci} object.
 *
 * The <b>wj-flex-chart-fibonacci</b> directive must be contained in a {@link wijmo.angular.chart.finance.WjFinancialChart} directive.
 * It supports the following attributes:
 *
 * <dl class="dl-horizontal">
 *   <dt>binding</dt>      <dd><code>@</code> The name of the property that contains Y values for the
 *                         series. This value overrides any binding set for the chart.</dd>
 *   <dt>binding-x</dt>    <dd><code>@</code> The name of the property that contains X values for the
 *                         series. This value overrides any binding set for the chart.</dd>
 *   <dt>css-class</dt>    <dd><code>@</code> The CSS class to use for the series.</dd>
 *   <dt>items-source</dt> <dd><code>=</code> An array or {@link ICollectionView} object that contains
 *                         data for this series.</dd>
 *   <dt>high</dt>         <dd><code>@</code> The high value of {@link Fibonacci} tool.</dd>
 *   <dt>labelPosition</dt> <dd><code>@</code> The label position for levels in {@link Fibonacci} tool.</dd>
 *   <dt>levels</dt>       <dd><code>@</code> The levels value of {@link Fibonacci} tool.</dd>
 *   <dt>low</dt>          <dd><code>@</code> The low value of {@link Fibonacci} tool.</dd>
 *   <dt>minX</dt>         <dd><code>@</code> The x minimum value of {@link Fibonacci} tool.</dd>
 *   <dt>maxX</dt>         <dd><code>@</code> The x maximum value of {@link Fibonacci} tool.</dd>
 *   <dt>name</dt>         <dd><code>@</code> The name of the series to show in the legend.</dd>
 *   <dt>style</dt>        <dd><code>=</code> The series style. Use ng-attr-style to specify the series
 *                         style object as an object. See the section on ngAttr attribute bindings in
 *                         <a target="_blank" href="https://docs.angularjs.org/guide/directive">
 *                         AngularJS Creating Custom Directives</a> and the <a target="_blank" href=
 *                         "https://demos.wijmo.com/5/Angular/FlexChartIntro/FlexChartIntro/#Styling">
 *                         FlexChart 101 Styling Series</a> sample for more information.</dd>
 *   <dt>altStyle</dt>     <dd><code>=</code> The series alternative style.</dd>
 *   <dt>visibility</dt>   <dd><code>=</code> The {@link SeriesVisibility} value indicating whether and where to
 *                         display the series.</dd>
 *   <dt>uptrend</dt>      <dd><code>@</code> The value indicating whether to create uptrending {@link Fibonacci} tool.</dd>
 * </dl>
 *
 */
export class WjFlexChartFibonacci extends WjSeriesBase {

    // Initializes a new instance of a WjFlexChartFibonacci
    constructor() {
        super();
        this.require = ['?^wjFinancialChart'];
        this.template = '<div class="wjFlexChartFibonacci" ng-transclude />';
        //this.transclude = true;
    }

    // Returns constructor of related Wijmo object. Abstract member, must be overridden in inherited class
    get _controlConstructor(): any { //: new (elem: HTMLElement) => wijmo.Control {
        return wijmo.chart.finance.analytics.Fibonacci;
    }

    _initControl(element: any): any {
        return super._initControl(undefined);
    }
}

/**
 * AngularJS directive for the {@link FinancialChart} {@link FibonacciArcs} object.
 *
 * The <b>wj-flex-chart-fibonacci-arcs</b> directive must be contained in a {@link wijmo.angular.chart.finance.WjFinancialChart} directive.
 * It supports the following attributes:
 *
 * <dl class="dl-horizontal">
 *   <dt>binding</dt>      <dd><code>@</code> The name of the property that contains Y values for the
 *                         series. This value overrides any binding set for the chart.</dd>
 *   <dt>binding-x</dt>    <dd><code>@</code> The name of the property that contains X values for the
 *                         series. This value overrides any binding set for the chart.</dd>
 *   <dt>css-class</dt>    <dd><code>@</code> The CSS class to use for the series.</dd>
 *   <dt>items-source</dt> <dd><code>=</code> An array or {@link ICollectionView} object that contains
 *                         data for this series.</dd>
 *   <dt>labelPosition</dt> <dd><code>@</code> The {@link LabelPosition} for levels in {@link FibonacciArcs} tool.</dd>
 *   <dt>levels</dt>       <dd><code>@</code> The levels value of {@link FibonacciArcs} tool.</dd>
 *   <dt>start-x</dt>       <dd><code>@</code> The starting X value of {@link FibonacciArcs} tool.</dd>
 *   <dt>end-x</dt>         <dd><code>@</code> The ending X value of {@link FibonacciArcs} tool.</dd>
 *   <dt>name</dt>         <dd><code>@</code> The name of the series to show in the legend.</dd>
 *   <dt>style</dt>        <dd><code>=</code> The series style. Use ng-attr-style to specify the series
 *                         style object as an object. See the section on ngAttr attribute bindings in
 *                         <a target="_blank" href="https://docs.angularjs.org/guide/directive">
 *                         AngularJS Creating Custom Directives</a> and the <a target="_blank" href=
 *                         "https://demos.wijmo.com/5/Angular/FlexChartIntro/FlexChartIntro/#Styling">
 *                         FlexChart 101 Styling Series</a> sample for more information.</dd>
 *   <dt>altStyle</dt>     <dd><code>=</code> The series alternative style.</dd>
 *   <dt>visibility</dt>   <dd><code>=</code> The {@link SeriesVisibility} value indicating whether and where to
 *                         display the series.</dd>
 * </dl>
 *
 */
export class WjFlexChartFibonacciArcs extends WjSeriesBase {
    constructor() {
        super();
        this.require = ['?^wjFinancialChart'];
        this.template = '<div class="wjFlexChartFibonacciArcs" ng-transclude />';
    }

    get _controlConstructor(): any {
        return wijmo.chart.finance.analytics.FibonacciArcs;
    }

    _initControl(element: any): any {
        return super._initControl(undefined);
    }
}

/**
 * AngularJS directive for the {@link FinancialChart} {@link FibonacciFans} object.
 *
 * The <b>wj-flex-chart-fibonacci-fans</b> directive must be contained in a {@link wijmo.angular.chart.finance.WjFinancialChart} directive.
 * It supports the following attributes:
 *
 * <dl class="dl-horizontal">
 *   <dt>binding</dt>      <dd><code>@</code> The name of the property that contains Y values for the
 *                         series. This value overrides any binding set for the chart.</dd>
 *   <dt>binding-x</dt>    <dd><code>@</code> The name of the property that contains X values for the
 *                         series. This value overrides any binding set for the chart.</dd>
 *   <dt>css-class</dt>    <dd><code>@</code> The CSS class to use for the series.</dd>
 *   <dt>items-source</dt> <dd><code>=</code> An array or {@link ICollectionView} object that contains
 *                         data for this series.</dd>
 *   <dt>labelPosition</dt> <dd><code>@</code> The {@link LabelPosition} for levels in {@link FibonacciFans} tool.</dd>
 *   <dt>levels</dt>       <dd><code>@</code> The levels value of {@link FibonacciFans} tool.</dd>
 *   <dt>start</dt>        <dd><code>@</code> The starting {@link DataPoint} of {@link FibonacciFans} tool.</dd>
 *   <dt>end</dt>          <dd><code>@</code> The ending {@link DataPoint} of {@link FibonacciFans} tool.</dd>
 *   <dt>name</dt>         <dd><code>@</code> The name of the series to show in the legend.</dd>
 *   <dt>style</dt>        <dd><code>=</code> The series style. Use ng-attr-style to specify the series
 *                         style object as an object. See the section on ngAttr attribute bindings in
 *                         <a target="_blank" href="https://docs.angularjs.org/guide/directive">
 *                         AngularJS Creating Custom Directives</a> and the <a target="_blank" href=
 *                         "https://demos.wijmo.com/5/Angular/FlexChartIntro/FlexChartIntro/#Styling">
 *                         FlexChart 101 Styling Series</a> sample for more information.</dd>
 *   <dt>altStyle</dt>     <dd><code>=</code> The series alternative style.</dd>
 *   <dt>visibility</dt>   <dd><code>=</code> The {@link SeriesVisibility} value indicating whether and where to
 *                         display the series.</dd>
 * </dl>
 *
 */
export class WjFlexChartFibonacciFans extends WjSeriesBase {
    constructor() {
        super();
        this.require = ['?^wjFinancialChart'];
        this.template = '<div class="wjFlexChartFibonacciFans" ng-transclude />';
    }

    get _controlConstructor(): any {
        return wijmo.chart.finance.analytics.FibonacciFans;
    }

    _initControl(element: any): any {
        return super._initControl(undefined);
    }
}

/**
 * AngularJS directive for the {@link FinancialChart} {@link FibonacciTimeZones} object.
 *
 * The <b>wj-flex-chart-fibonacci-time-zones</b> directive must be contained in a {@link wijmo.angular.chart.finance.WjFinancialChart} directive.
 * It supports the following attributes:
 *
 * <dl class="dl-horizontal">
 *   <dt>binding</dt>      <dd><code>@</code> The name of the property that contains Y values for the
 *                         series. This value overrides any binding set for the chart.</dd>
 *   <dt>binding-x</dt>    <dd><code>@</code> The name of the property that contains X values for the
 *                         series. This value overrides any binding set for the chart.</dd>
 *   <dt>css-class</dt>    <dd><code>@</code> The CSS class to use for the series.</dd>
 *   <dt>items-source</dt> <dd><code>=</code> An array or {@link ICollectionView} object that contains
 *                         data for this series.</dd>
 *   <dt>labelPosition</dt> <dd><code>@</code> The {@link LabelPosition} for levels in {@link FibonacciTimeZones} tool.</dd>
 *   <dt>levels</dt>       <dd><code>@</code> The levels value of {@link FibonacciTimeZones} tool.</dd>
 *   <dt>startX</dt>       <dd><code>@</code> The starting X value of {@link FibonacciTimeZones} tool.</dd>
 *   <dt>endX</dt>         <dd><code>@</code> The ending X value of {@link FibonacciTimeZones} tool.</dd>
 *   <dt>name</dt>         <dd><code>@</code> The name of the series to show in the legend.</dd>
 *   <dt>style</dt>        <dd><code>=</code> The series style. Use ng-attr-style to specify the series
 *                         style object as an object. See the section on ngAttr attribute bindings in
 *                         <a target="_blank" href="https://docs.angularjs.org/guide/directive">
 *                         AngularJS Creating Custom Directives</a> and the <a target="_blank" href=
 *                         "https://demos.wijmo.com/5/Angular/FlexChartIntro/FlexChartIntro/#Styling">
 *                         FlexChart 101 Styling Series</a> sample for more information.</dd>
 *   <dt>altStyle</dt>     <dd><code>=</code> The series alternative style.</dd>
 *   <dt>visibility</dt>   <dd><code>=</code> The {@link SeriesVisibility} value indicating whether and where to
 *                         display the series.</dd>
 * </dl>
 *
 */
export class WjFlexChartFibonacciTimeZones extends WjSeriesBase {
    constructor() {
        super();
        this.require = ['?^wjFinancialChart'];
        this.template = '<div class="wjFlexChartFibonacciTimeZones" ng-transclude />';
    }

    get _controlConstructor(): any {
        return wijmo.chart.finance.analytics.FibonacciTimeZones;
    }

    _initControl(element: any): any {
        return super._initControl(undefined);
    }
}

/**
 * AngularJS directive for the {@link FinancialChart} {@link ATR} object.
 *
 * The <b>wj-flex-chart-atr</b> directive must be contained in a {@link wijmo.angular.chart.finance.WjFinancialChart} directive.
 * It supports the following attributes:
 *
 * <dl class="dl-horizontal">
 *   <dt>binding</dt>      <dd><code>@</code> The name of the property that contains Y values for the
 *                         series. This value overrides any binding set for the chart.</dd>
 *   <dt>binding-x</dt>    <dd><code>@</code> The name of the property that contains X values for the
 *                         series. This value overrides any binding set for the chart.</dd>
 *   <dt>css-class</dt>    <dd><code>@</code> The CSS class to use for the series.</dd>
 *   <dt>items-source</dt> <dd><code>=</code> An array or {@link ICollectionView} object that contains
 *                         data for this series.</dd>
 *   <dt>name</dt>         <dd><code>@</code> The name of the series to show in the legend.</dd>
 *   <dt>style</dt>        <dd><code>=</code> The series style. Use ng-attr-style to specify the series
 *                         style object as an object. See the section on ngAttr attribute bindings in
 *                         <a target="_blank" href="https://docs.angularjs.org/guide/directive">
 *                         AngularJS Creating Custom Directives</a> and the <a target="_blank" href=
 *                         "https://demos.wijmo.com/5/Angular/FlexChartIntro/FlexChartIntro/#Styling">
 *                         FlexChart 101 Styling Series</a> sample for more information.</dd>
 *   <dt>symbol-marker</dt><dd><code>@</code> The shape of marker to use for the series. This value
 *                         overrides the default marker set on the chart. See {@link Marker}.</dd>
 *   <dt>symbol-size</dt>  <dd><code>@</code> The size of the symbols used to render data
 *                         points in this series for Scatter, LineSymbols, and SplineSymbols charts, in pixels.
 *                         This value overrides any set at the chart level.</dd>
 *   <dt>symbol-style</dt> <dd><code>=</code> The style of the symbols used to render data
 *                         points in this series for Scatter, LineSymbols, and SplineSymbols charts.
 *                         This value overrides any setting at the chart level.</dd>
 *   <dt>visibility</dt>   <dd><code>=</code> The {@link SeriesVisibility} value indicating whether and where to
 *                         display the series.</dd>
 *   <dt>period</dt>       <dd><code>@</code> The period for the average true range calculation.</dd>
 * </dl>
 *
 */
export class WjFlexChartAtr extends WjBaseSingleOverlayIndicator {
    constructor() {
        super();
        this.template = '<div class="wjFlexChartAtr" ng-transclude />';
    }

    get _controlConstructor(): any {
        return wijmo.chart.finance.analytics.ATR;
    }
}

/**
 * AngularJS directive for the {@link FinancialChart} {@link CCI} object.
 *
 * The <b>wj-flex-chart-cci</b> directive must be contained in a {@link wijmo.angular.chart.finance.WjFinancialChart} directive.
 * It supports the following attributes:
 *
 * <dl class="dl-horizontal">
 *   <dt>binding</dt>      <dd><code>@</code> The name of the property that contains Y values for the
 *                         series. This value overrides any binding set for the chart.</dd>
 *   <dt>binding-x</dt>    <dd><code>@</code> The name of the property that contains X values for the
 *                         series. This value overrides any binding set for the chart.</dd>
 *   <dt>css-class</dt>    <dd><code>@</code> The CSS class to use for the series.</dd>
 *   <dt>items-source</dt> <dd><code>=</code> An array or {@link ICollectionView} object that contains
 *                         data for this series.</dd>
 *   <dt>name</dt>         <dd><code>@</code> The name of the series to show in the legend.</dd>
 *   <dt>style</dt>        <dd><code>=</code> The series style. Use ng-attr-style to specify the series
 *                         style object as an object. See the section on ngAttr attribute bindings in
 *                         <a target="_blank" href="https://docs.angularjs.org/guide/directive">
 *                         AngularJS Creating Custom Directives</a> and the <a target="_blank" href=
 *                         "https://demos.wijmo.com/5/Angular/FlexChartIntro/FlexChartIntro/#Styling">
 *                         FlexChart 101 Styling Series</a> sample for more information.</dd>
 *   <dt>symbol-marker</dt><dd><code>@</code> The shape of marker to use for the series. This value
 *                         overrides the default marker set on the chart. See {@link Marker}.</dd>
 *   <dt>symbol-size</dt>  <dd><code>@</code> The size of the symbols used to render data
 *                         points in this series for Scatter, LineSymbols, and SplineSymbols charts, in pixels.
 *                         This value overrides any set at the chart level.</dd>
 *   <dt>symbol-style</dt> <dd><code>=</code> The style of the symbols used to render data
 *                         points in this series for Scatter, LineSymbols, and SplineSymbols charts.
 *                         This value overrides any setting at the chart level.</dd>
 *   <dt>visibility</dt>   <dd><code>=</code> The {@link SeriesVisibility} value indicating whether and where to
 *                         display the series.</dd>
 *   <dt>period</dt>       <dd><code>@</code> The period for the commodity channel index calculation.</dd>
 * </dl>
 *
 */
export class WjFlexChartCci extends WjBaseSingleOverlayIndicator {
    constructor() {
        super();
        this.template = '<div class="wjFlexChartCci" ng-transclude />';
    }

    get _controlConstructor(): any {
        return wijmo.chart.finance.analytics.CCI;
    }
}

/**
 * AngularJS directive for the {@link FinancialChart} {@link RSI} object.
 *
 * The <b>wj-flex-chart-rsi</b> directive must be contained in a {@link wijmo.angular.chart.finance.WjFinancialChart} directive.
 * It supports the following attributes:
 *
 * <dl class="dl-horizontal">
 *   <dt>binding</dt>      <dd><code>@</code> The name of the property that contains Y values for the
 *                         series. This value overrides any binding set for the chart.</dd>
 *   <dt>binding-x</dt>    <dd><code>@</code> The name of the property that contains X values for the
 *                         series. This value overrides any binding set for the chart.</dd>
 *   <dt>css-class</dt>    <dd><code>@</code> The CSS class to use for the series.</dd>
 *   <dt>items-source</dt> <dd><code>=</code> An array or {@link ICollectionView} object that contains
 *                         data for this series.</dd>
 *   <dt>name</dt>         <dd><code>@</code> The name of the series to show in the legend.</dd>
 *   <dt>style</dt>        <dd><code>=</code> The series style. Use ng-attr-style to specify the series
 *                         style object as an object. See the section on ngAttr attribute bindings in
 *                         <a target="_blank" href="https://docs.angularjs.org/guide/directive">
 *                         AngularJS Creating Custom Directives</a> and the <a target="_blank" href=
 *                         "https://demos.wijmo.com/5/Angular/FlexChartIntro/FlexChartIntro/#Styling">
 *                         FlexChart 101 Styling Series</a> sample for more information.</dd>
 *   <dt>symbol-marker</dt><dd><code>@</code> The shape of marker to use for the series. This value
 *                         overrides the default marker set on the chart. See {@link Marker}.</dd>
 *   <dt>symbol-size</dt>  <dd><code>@</code> The size of the symbols used to render data
 *                         points in this series for Scatter, LineSymbols, and SplineSymbols charts, in pixels.
 *                         This value overrides any set at the chart level.</dd>
 *   <dt>symbol-style</dt> <dd><code>=</code> The style of the symbols used to render data
 *                         points in this series for Scatter, LineSymbols, and SplineSymbols charts.
 *                         This value overrides any setting at the chart level.</dd>
 *   <dt>visibility</dt>   <dd><code>=</code> The {@link SeriesVisibility} value indicating whether and where to
 *                         display the series.</dd>
 *   <dt>period</dt>       <dd><code>@</code> The period for the relative strength index calculation.</dd>
 * </dl>
 *
 */
export class WjFlexChartRsi extends WjBaseSingleOverlayIndicator {
    constructor() {
        super();
        this.template = '<div class="wjFlexChartRsi" ng-transclude />';
    }

    get _controlConstructor(): any {
        return wijmo.chart.finance.analytics.RSI;
    }
}

/**
 * AngularJS directive for the {@link FinancialChart} {@link WilliamsR} object.
 *
 * The <b>wj-flex-chart-williams-r</b> directive must be contained in a {@link wijmo.angular.chart.finance.WjFinancialChart} directive.
 * It supports the following attributes:
 *
 * <dl class="dl-horizontal">
 *   <dt>binding</dt>      <dd><code>@</code> The name of the property that contains Y values for the
 *                         series. This value overrides any binding set for the chart.</dd>
 *   <dt>binding-x</dt>    <dd><code>@</code> The name of the property that contains X values for the
 *                         series. This value overrides any binding set for the chart.</dd>
 *   <dt>css-class</dt>    <dd><code>@</code> The CSS class to use for the series.</dd>
 *   <dt>items-source</dt> <dd><code>=</code> An array or {@link ICollectionView} object that contains
 *                         data for this series.</dd>
 *   <dt>name</dt>         <dd><code>@</code> The name of the series to show in the legend.</dd>
 *   <dt>style</dt>        <dd><code>=</code> The series style. Use ng-attr-style to specify the series
 *                         style object as an object. See the section on ngAttr attribute bindings in
 *                         <a target="_blank" href="https://docs.angularjs.org/guide/directive">
 *                         AngularJS Creating Custom Directives</a> and the <a target="_blank" href=
 *                         "https://demos.wijmo.com/5/Angular/FlexChartIntro/FlexChartIntro/#Styling">
 *                         FlexChart 101 Styling Series</a> sample for more information.</dd>
 *   <dt>symbol-marker</dt><dd><code>@</code> The shape of marker to use for the series. This value
 *                         overrides the default marker set on the chart. See {@link Marker}.</dd>
 *   <dt>symbol-size</dt>  <dd><code>@</code> The size of the symbols used to render data
 *                         points in this series for Scatter, LineSymbols, and SplineSymbols charts, in pixels.
 *                         This value overrides any set at the chart level.</dd>
 *   <dt>symbol-style</dt> <dd><code>=</code> The style of the symbols used to render data
 *                         points in this series for Scatter, LineSymbols, and SplineSymbols charts.
 *                         This value overrides any setting at the chart level.</dd>
 *   <dt>visibility</dt>   <dd><code>=</code> The {@link SeriesVisibility} value indicating whether and where to
 *                         display the series.</dd>
 *   <dt>period</dt>       <dd><code>@</code> The period for the Williams %R calculation.</dd>
 * </dl>
 *
 */
export class WjFlexChartWilliamsR extends WjBaseSingleOverlayIndicator {
    constructor() {
        super();
        this.template = '<div class="wjFlexChartWilliamsR" ng-transclude />';
    }

    get _controlConstructor(): any {
        return wijmo.chart.finance.analytics.WilliamsR;
    }
}

// base for MACD
export class WjFlexChartMacdBase extends WjBaseOverlayIndicator {
    constructor() {
        super();
        this.template = '<div class="wjFlexChartBaseMacd" ng-transclude />';
    }

    get _controlConstructor(): any {
        return wijmo.chart.finance.analytics.MacdBase;
    }
}

/**
 * AngularJS directive for the {@link FinancialChart} {@link Macd} object.
 *
 * The <b>wj-flex-chart-macd</b> directive must be contained in a {@link wijmo.angular.chart.finance.WjFinancialChart} directive.
 * It supports the following attributes:
 *
 * <dl class="dl-horizontal">
 *   <dt>binding</dt>      <dd><code>@</code> The name of the property that contains Y values for the
 *                         series. This value overrides any binding set for the chart.</dd>
 *   <dt>binding-x</dt>    <dd><code>@</code> The name of the property that contains X values for the
 *                         series. This value overrides any binding set for the chart.</dd>
 *   <dt>css-class</dt>    <dd><code>@</code> The CSS class to use for the series.</dd>
 *   <dt>items-source</dt> <dd><code>=</code> An array or {@link ICollectionView} object that contains
 *                         data for this series.</dd>
 *   <dt>name</dt>         <dd><code>@</code> The name of the series to show in the legend.</dd>
 *   <dt>style</dt>        <dd><code>=</code> The series style. Use ng-attr-style to specify the series
 *                         style object as an object. See the section on ngAttr attribute bindings in
 *                         <a target="_blank" href="https://docs.angularjs.org/guide/directive">
 *                         AngularJS Creating Custom Directives</a> and the <a target="_blank" href=
 *                         "https://demos.wijmo.com/5/Angular/FlexChartIntro/FlexChartIntro/#Styling">
 *                         FlexChart 101 Styling Series</a> sample for more information.</dd>
 *   <dt>styles/dt>        <dd><code></code> The styles for the MACD and Signal lines.</dd>
 *   <dt>symbol-marker</dt><dd><code>@</code> The shape of marker to use for the series. This value
 *                         overrides the default marker set on the chart. See {@link Marker}.</dd>
 *   <dt>symbol-size</dt>  <dd><code>@</code> The size of the symbols used to render data
 *                         points in this series for Scatter, LineSymbols, and SplineSymbols charts, in pixels.
 *                         This value overrides any set at the chart level.</dd>
 *   <dt>symbol-style</dt> <dd><code>=</code> The style of the symbols used to render data
 *                         points in this series for Scatter, LineSymbols, and SplineSymbols charts.
 *                         This value overrides any setting at the chart level.</dd>
 *   <dt>visibility</dt>   <dd><code>=</code> The {@link SeriesVisibility} value indicating whether and where to
 *                         display the series.</dd>
 *   <dt>fast-period</dt>  <dd><code>@</code>  The fast moving average period for the MACD calculation.</dd>
 *   <dt>slow-period</dt>  <dd><code>@</code> The slow moving average period for the MACD calculation.</dd>
 *   <dt>signal-smoothing-period/dt>    <dd><code>@</code> The smoothing period for the MACD calculation.</dd>
 * </dl>
 *
 */
export class WjFlexChartMacd extends WjFlexChartMacdBase {
    constructor() {
        super();
        this.template = '<div class="wjFlexChartMacd" ng-transclude />';
    }

    get _controlConstructor(): any {
        return wijmo.chart.finance.analytics.Macd;
    }
}

/**
 * AngularJS directive for the {@link FinancialChart} {@link MacdHistogram} object.
 *
 * The <b>wj-flex-chart-macd-histogram</b> directive must be contained in a {@link wijmo.angular.chart.finance.WjFinancialChart} directive.
 * It supports the following attributes:
 *
 * <dl class="dl-horizontal">
 *   <dt>binding</dt>      <dd><code>@</code> The name of the property that contains Y values for the
 *                         series. This value overrides any binding set for the chart.</dd>
 *   <dt>binding-x</dt>    <dd><code>@</code> The name of the property that contains X values for the
 *                         series. This value overrides any binding set for the chart.</dd>
 *   <dt>css-class</dt>    <dd><code>@</code> The CSS class to use for the series.</dd>
 *   <dt>items-source</dt> <dd><code>=</code> An array or {@link ICollectionView} object that contains
 *                         data for this series.</dd>
 *   <dt>name</dt>         <dd><code>@</code> The name of the series to show in the legend.</dd>
 *   <dt>style</dt>        <dd><code>=</code> The series style. Use ng-attr-style to specify the series
 *                         style object as an object. See the section on ngAttr attribute bindings in
 *                         <a target="_blank" href="https://docs.angularjs.org/guide/directive">
 *                         AngularJS Creating Custom Directives</a> and the <a target="_blank" href=
 *                         "https://demos.wijmo.com/5/Angular/FlexChartIntro/FlexChartIntro/#Styling">
 *                         FlexChart 101 Styling Series</a> sample for more information.</dd>
 *   <dt>symbol-marker</dt><dd><code>@</code> The shape of marker to use for the series. This value
 *                         overrides the default marker set on the chart. See {@link Marker}.</dd>
 *   <dt>symbol-size</dt>  <dd><code>@</code> The size of the symbols used to render data
 *                         points in this series for Scatter, LineSymbols, and SplineSymbols charts, in pixels.
 *                         This value overrides any set at the chart level.</dd>
 *   <dt>symbol-style</dt> <dd><code>=</code> The style of the symbols used to render data
 *                         points in this series for Scatter, LineSymbols, and SplineSymbols charts.
 *                         This value overrides any setting at the chart level.</dd>
 *   <dt>visibility</dt>   <dd><code>=</code> The {@link SeriesVisibility} value indicating whether and where to
 *                         display the series.</dd>
 *   <dt>fast-period</dt>  <dd><code>@</code>  The fast moving average period for the MACD calculation.</dd>
 *   <dt>slow-period</dt>  <dd><code>@</code> The slow moving average period for the MACD calculation.</dd>
 *   <dt>signal-smoothing-period/dt>    <dd><code>@</code> The smoothing period for the MACD calculation.</dd>
 * </dl>
 *
 */
export class WjFlexChartMacdHistogram extends WjFlexChartMacdBase {
    constructor() {
        super();
        this.template = '<div class="wjFlexChartMacdHistogram" ng-transclude />';
    }

    get _controlConstructor(): any {
        return wijmo.chart.finance.analytics.MacdHistogram;
    }
}

/**
 * AngularJS directive for the {@link FinancialChart} {@link Stochastic} object.
 *
 * The <b>wj-flex-chart-stochastic</b> directive must be contained in a {@link wijmo.angular.chart.finance.WjFinancialChart} directive.
 * It supports the following attributes:
 *
 * <dl class="dl-horizontal">
 *   <dt>binding</dt>      <dd><code>@</code> The name of the property that contains Y values for the
 *                         series. This value overrides any binding set for the chart.</dd>
 *   <dt>binding-x</dt>    <dd><code>@</code> The name of the property that contains X values for the
 *                         series. This value overrides any binding set for the chart.</dd>
 *   <dt>css-class</dt>    <dd><code>@</code> The CSS class to use for the series.</dd>
 *   <dt>items-source</dt> <dd><code>=</code> An array or {@link ICollectionView} object that contains
 *                         data for this series.</dd>
 *   <dt>name</dt>         <dd><code>@</code> The name of the series to show in the legend.</dd>
 *   <dt>style</dt>        <dd><code>=</code> The series style. Use ng-attr-style to specify the series
 *                         style object as an object. See the section on ngAttr attribute bindings in
 *                         <a target="_blank" href="https://docs.angularjs.org/guide/directive">
 *                         AngularJS Creating Custom Directives</a> and the <a target="_blank" href=
 *                         "https://demos.wijmo.com/5/Angular/FlexChartIntro/FlexChartIntro/#Styling">
 *                         FlexChart 101 Styling Series</a> sample for more information.</dd>
 *   <dt>styles/dt>        <dd><code></code> The styles for the %K and %D lines.</dd>
 *   <dt>symbol-marker</dt><dd><code>@</code> The shape of marker to use for the series. This value
 *                         overrides the default marker set on the chart. See {@link Marker}.</dd>
 *   <dt>symbol-size</dt>  <dd><code>@</code> The size of the symbols used to render data
 *                         points in this series for Scatter, LineSymbols, and SplineSymbols charts, in pixels.
 *                         This value overrides any set at the chart level.</dd>
 *   <dt>symbol-style</dt> <dd><code>=</code> The style of the symbols used to render data
 *                         points in this series for Scatter, LineSymbols, and SplineSymbols charts.
 *                         This value overrides any setting at the chart level.</dd>
 *   <dt>visibility</dt>   <dd><code>=</code> The {@link SeriesVisibility} value indicating whether and where to
 *                         display the series.</dd>
 *   <dt>k-period</dt>     <dd><code>@</code>  The period for the %K calculation.</dd>
 *   <dt>d-period</dt>     <dd><code>@</code>  The period for the %D calculation.</dd>
 *   <dt>smoothing-period</dt>     <dd><code>@</code>  The smoothing period for the %K calculation.</dd>
 * </dl>
 *
 */
export class WjFlexChartStochastic extends WjBaseOverlayIndicator {
    constructor() {
        super();
        this.template = '<div class="wjFlexChartStochastic" ng-transclude />';
    }

    get _controlConstructor(): any {
        return wijmo.chart.finance.analytics.Stochastic;
    }
}

/**
 * AngularJS directive for the {@link FinancialChart} {@link BollingerBands} object.
 *
 * The <b>wj-flex-chart-bollinger-bands</b> directive must be contained in a {@link wijmo.angular.chart.finance.WjFinancialChart} directive.
 * It supports the following attributes:
 *
 * <dl class="dl-horizontal">
 *   <dt>binding</dt>      <dd><code>@</code> The name of the property that contains Y values for the
 *                         series. This value overrides any binding set for the chart.</dd>
 *   <dt>binding-x</dt>    <dd><code>@</code> The name of the property that contains X values for the
 *                         series. This value overrides any binding set for the chart.</dd>
 *   <dt>css-class</dt>    <dd><code>@</code> The CSS class to use for the series.</dd>
 *   <dt>items-source</dt> <dd><code>=</code> An array or {@link ICollectionView} object that contains
 *                         data for this series.</dd>
 *   <dt>name</dt>         <dd><code>@</code> The name of the series to show in the legend.</dd>
 *   <dt>style</dt>        <dd><code>=</code> The series style. Use ng-attr-style to specify the series
 *                         style object as an object. See the section on ngAttr attribute bindings in
 *                         <a target="_blank" href="https://docs.angularjs.org/guide/directive">
 *                         AngularJS Creating Custom Directives</a> and the <a target="_blank" href=
 *                         "https://demos.wijmo.com/5/Angular/FlexChartIntro/FlexChartIntro/#Styling">
 *                         FlexChart 101 Styling Series</a> sample for more information.</dd>
 *   <dt>symbol-marker</dt><dd><code>@</code> The shape of marker to use for the series. This value
 *                         overrides the default marker set on the chart. See {@link Marker}.</dd>
 *   <dt>symbol-size</dt>  <dd><code>@</code> The size of the symbols used to render data
 *                         points in this series for Scatter, LineSymbols, and SplineSymbols charts, in pixels.
 *                         This value overrides any set at the chart level.</dd>
 *   <dt>symbol-style</dt> <dd><code>=</code> The style of the symbols used to render data
 *                         points in this series for Scatter, LineSymbols, and SplineSymbols charts.
 *                         This value overrides any setting at the chart level.</dd>
 *   <dt>visibility</dt>   <dd><code>=</code> The {@link SeriesVisibility} value indicating whether and where to
 *                         display the series.</dd>
 *   <dt>period</dt>       <dd><code>@</code>  The period for the Bollinger Bands calculation.</dd>
 *   <dt>multiplier/dt>    <dd><code>@</code> The standard deviation multiplier for the Bollinger Bands calculation.</dd>
 * </dl>
 *
 */
export class WjFlexChartBollingerBands extends WjBaseOverlayIndicator {
    constructor() {
        super();
        this.template = '<div class="wjFlexChartBollingerBands" ng-transclude />';
    }

    get _controlConstructor(): any {
        return wijmo.chart.finance.analytics.BollingerBands;
    }
}

/**
 * AngularJS directive for the {@link FinancialChart} {@link Envelopes} object.
 *
 * The <b>wj-flex-chart-envelopes</b> directive must be contained in a {@link wijmo.angular.chart.finance.WjFinancialChart} directive.
 * It supports the following attributes:
 *
 * <dl class="dl-horizontal">
 *   <dt>binding</dt>      <dd><code>@</code> The name of the property that contains Y values for the
 *                         series. This value overrides any binding set for the chart.</dd>
 *   <dt>binding-x</dt>    <dd><code>@</code> The name of the property that contains X values for the
 *                         series. This value overrides any binding set for the chart.</dd>
 *   <dt>css-class</dt>    <dd><code>@</code> The CSS class to use for the series.</dd>
 *   <dt>items-source</dt> <dd><code>=</code> An array or {@link ICollectionView} object that contains
 *                         data for this series.</dd>
 *   <dt>name</dt>         <dd><code>@</code> The name of the series to show in the legend.</dd>
 *   <dt>style</dt>        <dd><code>=</code> The series style. Use ng-attr-style to specify the series
 *                         style object as an object. See the section on ngAttr attribute bindings in
 *                         <a target="_blank" href="https://docs.angularjs.org/guide/directive">
 *                         AngularJS Creating Custom Directives</a> and the <a target="_blank" href=
 *                         "https://demos.wijmo.com/5/Angular/FlexChartIntro/FlexChartIntro/#Styling">
 *                         FlexChart 101 Styling Series</a> sample for more information.</dd>
 *   <dt>symbol-marker</dt><dd><code>@</code> The shape of marker to use for the series. This value
 *                         overrides the default marker set on the chart. See {@link Marker}.</dd>
 *   <dt>symbol-size</dt>  <dd><code>@</code> The size of the symbols used to render data
 *                         points in this series for Scatter, LineSymbols, and SplineSymbols charts, in pixels.
 *                         This value overrides any set at the chart level.</dd>
 *   <dt>symbol-style</dt> <dd><code>=</code> The style of the symbols used to render data
 *                         points in this series for Scatter, LineSymbols, and SplineSymbols charts.
 *                         This value overrides any setting at the chart level.</dd>
 *   <dt>visibility</dt>   <dd><code>=</code> The {@link SeriesVisibility} value indicating whether and where to
 *                         display the series.</dd>
 *   <dt>period</dt>       <dd><code>@</code>  The period for the moving average envelopes calculation.</dd>
 *   <dt>size/dt>          <dd><code>@</code> The size of the moving average envelopes.</dd>
 *   <dt>type/dt>          <dd><code>@</code> The {@link MovingAverageType} of the moving average to be used for the envelopes.</dd>
 * </dl>
 *
 */
export class WjFlexChartEnvelopes extends WjBaseOverlayIndicator {
    constructor() {
        super();
        this.template = '<div class="wjFlexChartEnvelopes" ng-transclude />';
    }

    get _controlConstructor(): any {
        return wijmo.chart.finance.analytics.Envelopes;
    }
}

    }
    


    module wijmo.angular {
    

    }
    

    module wijmo.angular {
    


var wjNg: any = window['angular'];





const wijmoChartHierarchicalName = 'wj.chart.hierarchical'


// do not use moduleName here, it's removed from the global module version
var wijmoChartHierarchical = _registerNgModule(wijmoChartHierarchicalName);

if (softRefChartHierarchical) {
    wijmoChartHierarchical.directive('wjSunburst', [function () {
        return new WjSunburst();
    }]);

    wijmoChartHierarchical.directive('wjTreeMap', [function () {
        return new WjTreeMap();
    }]);
}



/**
 * AngularJS directive for the {@link Sunburst} control.
 *
 * <dl class="dl-horizontal">
 *   <dt>child-items-path</dt>  <dd><code>=</code> An array or string object used to generate child items in hierarchical data.</dd>
 * </dl>
 *
 */
export class WjSunburst extends WjFlexPie {

    // gets the Wijmo Sunburst control constructor
    get _controlConstructor() {
        return wijmo.chart.hierarchical.Sunburst;
    }
}

/**
 * AngularJS directive for the {@link TreeMap} control.
 *
 * <dl class="dl-horizontal">
 *   <dt>items-source</dt>      <dd><code>=</code> An array or {@link ICollectionView}
 *                              object that contains data for the chart.</dd>
 *   <dt>binding</dt>           <dd><code>@</code> The name of the property that
 *                              contains item values.</dd>
 *   <dt>binding-name</dt>      <dd><code>@</code> The name of the property that
 *                              contains item names. It should be an array or a string.</dd>
 *   <dt>footer</dt>            <dd><code>@</code> The text to display in the chart footer (plain
 *                              text).</dd>
 *   <dt>footer-style</dt>       <dd><code>=</code> The style to apply to the chart footer.</dd>
 *   <dt>header</dt>            <dd><code>@</code> The text to display in the chart header (plain
 *                              text).</dd>
 *   <dt>header-style</dt>      <dd><code>=</code> The style to apply to the chart header.</dd>
 *   <dt>initialized</dt>       <dd><code>&</code> This event occurs after the binding has finished
 *                              initializing the control with attribute values.</dd>
 *   <dt>is-initialized</dt>    <dd><code>=</code> A value indicating whether the binding has finished
 *                              initializing the control with attribute values. </dd>
 *   <dt>type</dt>              <dd><code>@</code> The type of the TreeMap.</dd>
 *   <dt>child-items-path</dt>  <dd><code>@</code> A value indicating the name of the property (or properties) used to generate
 *                              child items in hierarchical data.</dd>
 *   <dt>max-depth</dt>         <dd><code>=</code> The maximum number of node levels to show in the current view.</dd>
 *   <dt>palette</dt>           <dd><code>=</code> An array that contains the default colors used for
 *                              displaying TreeMap items.</dd>
 *   <dt>plot-margin</dt>       <dd><code>=</code> The number of pixels of space to leave between the
 *                              edges of the control and the plot area, or CSS-style margins.</dd>
 *   <dt>tooltip-content</dt>   <dd><code>@</code> The value to display in the
 *                              {@link ChartTooltip} content property.</dd>
 *   <dt>label-content</dt>     <dd><code>@</code> The value to display in the
 *                              {@link DataLabel} content property.</dd>
 *   <dt>rendering</dt>         <dd><code>&</code> The {@link FlexPie.rendering} event handler.</dd>
 *   <dt>rendered</dt>          <dd><code>&</code> The {@link FlexPie.rendered} event handler.</dd>
 * </dl>
 *
 * The wj-tree-map directive may contain the following child directives:
 * {@link wijmo.angular.chart.WjFlexChartLegend} and {@link wijmo.angular.chart.WjFlexChartDataLabel}.
 */
export class WjTreeMap extends WjFlexChartBase {

    // gets the Wijmo TreeMap control constructor
    get _controlConstructor() {
        return wijmo.chart.hierarchical.TreeMap;
    }

    _initProps() {
        super._initProps();
        var self = this; // store this in closure as .apply() call overrides the reference

        var lblContentDesc = MetaFactory.findProp('labelContent', this._props);
        lblContentDesc.customHandler = function (scope, control, value, oldValue, link) {
            if (value != null) {
                (<wijmo.chart.hierarchical.TreeMap>control).dataLabel.content = value;
            }
        };
    }

}


    }
    


    module wijmo.angular {
    

    }
    

    module wijmo.angular {
    


var wjNg: any = window['angular'];




const wijmoChartInteractionName = 'wj.chart.interaction'


// do not use moduleName here, it's removed from the global module version
var wijmoChartInteraction = _registerNgModule(wijmoChartInteractionName);

if (softRefChartInteraction()) {
    wijmoChartInteraction.directive('wjFlexChartRangeSelector', [function () {
        return new WjFlexChartRangeSelector();
    }]);
    wijmoChartInteraction.directive('wjFlexChartGestures', [function () {
        return new WjFlexChartChartGestures();
    }]);
    wijmoChartInteraction.directive('wjFlexChartChartGestures', [function () {
        return new WjFlexChartChartGestures();
    }]);
}



/**
 * AngularJS directive for the {@link FlexChart} {@link wijmo.chart.interaction.RangeSelector} object.
 *
 * The <b>wj-flex-chart-range-selector</b> directive must be contained in a {@link wijmo.angular.chart.WjFlexChart} directive or {@link wijmo.angular.chart.finance.WjFinancialChart} directive.
 * It supports the following attributes:
 *
 * <dl class="dl-horizontal">
 *   <dt>is-visible</dt>     <dd><code>@</code> The value indicating whether the RangeSelector is visible.</dd>
 *   <dt>min</dt>           <dd><code>@</code> The minimum value of the range.</dd>
 *   <dt>max</dt>           <dd><code>@</code> The maximum value of the range.</dd>
 *   <dt>orientation</dt>   <dd><code>@</code> The orientation of the RangeSelector.</dd>
 *   <dt>seamless</dt>      <dd><code>@</code> The value indicating whether the minimal and maximal handler will move seamlessly.</dd>
 *   <dt>min-scale</dt>      <dd><code>@</code> the valid minimum range of the RangeSelector.</dd>
 *   <dt>max-scale</dt>      <dd><code>@</code> the valid maximum range of the RangeSelector.</dd>
 * </dl>
 */
export class WjFlexChartRangeSelector extends WjDirective {

    // Initializes a new instance of a WjFlexChartRangeSelector
    constructor() {
        super();
        this.require = ['?^wjFlexChart', '?^wjFinancialChart'];
    }

    get _controlConstructor(): any {
        return wijmo.chart.interaction.RangeSelector;
    }
}

/**
 * AngularJS directive for the {@link FlexChart} {@link wijmo.chart.interaction.ChartGestures} object.
 *
 * The <b>wj-flex-chart-gestures</b> directive must be contained in a {@link wijmo.angular.chart.WjFlexChart} directive or {@link wijmo.angular.chart.finance.WjFinancialChart} directive.
 * It supports the following attributes:
 *
 * <dl class="dl-horizontal">
 *   <dt>mouse-action</dt>     <dd><code>@</code> The value indicating mouse action is zooming or panning.</dd>
 *   <dt>interactive-axes</dt> <dd><code>@</code> The value indicating which axis is interactive.</dd>
 *   <dt>enable</dt>          <dd><code>@</code> The value indicating the gestures action is enabled or not.</dd>
 *   <dt>scale-x</dt>          <dd><code>@</code> The value indicating axisX initial range between Min and Max.</dd>
 *   <dt>scale-y</dt>          <dd><code>@</code> The value indicating axisY initial range between Min and Max.</dd>
 *   <dt>pos-x</dt>            <dd><code>@</code> The value indicating initial position on the axisX.</dd>
 *   <dt>pos-y</dt>            <dd><code>@</code> The value indicating initial position on the axisY.</dd>
 * </dl>
 */
export class WjFlexChartChartGestures extends WjDirective {

    // Initializes a new instance of a WjFlexChartChartGestures
    constructor() {
        super();
        this.require = ['?^wjFlexChart', '?^wjFinancialChart'];
    }

    get _controlConstructor(): any {
        return wijmo.chart.interaction.ChartGestures;
    }
}


    }
    


    module wijmo.angular {
    

    }
    

    module wijmo.angular {
    


var wjNg: any = window['angular'];





const wijmoChartRadarName = 'wj.chart.radar'


// do not use moduleName here, it's removed from the global module version
var wijmoChartRadar = _registerNgModule(wijmoChartRadarName);

if (softRefChartRadar()) {
    wijmoChartRadar.directive('wjFlexRadar', [function () {
        return new WjFlexRadar();
    }]);

    wijmoChartRadar.directive('wjFlexRadarSeries', [function () {
        return new WjFlexRadarSeries();
    }]);

    wijmoChartRadar.directive('wjFlexRadarAxis', [function () {
        return new WjFlexRadarAxis();
    }]);
}


/**
 * AngularJS directive for the {@link FlexRadar} control.
 *
 * Use the <b>wj-flex-radar</b> directive to add radar charts to your AngularJS applications.
 * Note that directive and parameter names must be formatted using lower-case letters
 * with dashes instead of camel case.
 *
 * The wj-flex-radar directive supports the following attributes:
 *
 * <dl class="dl-horizontal">
 *   <dt>binding</dt>           <dd><code>@</code> The name of the property that contains Y
 *                              values for the chart. You can override this at the series level.</dd>
 *   <dt>binding-x</dt>         <dd><code>@</code> The name of the property that contains X
 *                              values for the chart. You can override this at the series level.</dd>
 *   <dt>chart-type</dt>        <dd><code>@</code> The default chart type to use in rendering series
 *                              objects. You can override this at the series level. See {@link RadarChartType}.</dd>
 *   <dt>control</dt>           <dd><code>=</code> A reference to the {@link FlexRadar} control
 *                              that this directive creates.</dd>
 *   <dt>footer</dt>            <dd><code>@</code> The text to display in the chart footer (plain
 *                              text).</dd>
 *   <dt>footer-style</dt>       <dd><code>=</code> The style to apply to the chart footer.</dd>
 *   <dt>header</dt>            <dd><code>@</code> The text to display in the chart header (plain
 *                              text).</dd>
 *   <dt>header-style</dt>      <dd><code>=</code> The style to apply to the chart header.</dd>
 *   <dt>initialized</dt>       <dd><code>&</code> This event occurs after the binding has finished
 *                              initializing the control with attribute values.</dd>
 *   <dt>is-initialized</dt><dd><code>=</code> A value indicating whether the binding has finished
 *                              initializing the control with attribute values. </dd>
 *   <dt>interpolate-nulls</dt> <dd><code>@</code> The value indicating whether to interpolate or
 *                              leave gaps when there are null values in the data.</dd>
 *   <dt>item-formatter</dt>    <dd><code>=</code> The formatter function that customizes the
 *                              appearance of data points.</dd>
 *   <dt>items-source</dt>      <dd><code>=</code> An array or {@link ICollectionView} object that contains
 *                              the data used to create the chart.</dd>
 *   <dt>legend-toggle</dt>     <dd><code>@</code> The value indicating whether clicking legend items
 *                              toggles series visibility.</dd>
 *   <dt>options</dt>           <dd><code>=</code> Chart {@link FlexChart.options} that only apply to certain
 *                              chart types.</dd>
 *   <dt>palette</dt>           <dd><code>=</code> An array that contains the default colors used for
 *                              displaying each series.</dd>
 *   <dt>plot-margin</dt>       <dd><code>=</code> The number of pixels of space to leave between the
 *                              edges of the control and the plot area, or CSS-style margins.</dd>
 *   <dt>stacking</dt>          <dd><code>@</code> The {@link Stacking} value indicating whether or how series
 *                              objects are stacked or plotted independently.</dd>
 *   <dt>reversed</dt>          <dd><code>@</code> The {@link FlexRadar.reversed} value indicating whether angles are reversed
 *                              (counter-clockwise).</dd>
 *   <dt>startAngle</dt>        <dd><code>@</code> The {@link FlexRadar.startAngle} value indicating the starting angle for the radar in degrees.</dd>
 *   <dt>totalAngle</dt>        <dd><code>@</code> The {@link FlexRadar.totalAngle} value indicating the total angle for the radar in degrees.</dd>
 *   <dt>symbol-size</dt>       <dd><code>@</code> The size of the symbols used to render data points in Scatter,
 *                              LineSymbols, and SplineSymbols charts, in pixels. You can override
 *                              this at the series level.</dd>
 *   <dt>tooltip-content</dt>   <dd><code>@</code> The value to display in the
 *                              {@link ChartTooltip} content property.</dd>
 *   <dt>rendering</dt>         <dd><code>&</code> The {@link FlexRadar.rendering} event handler.</dd>
 *   <dt>rendered</dt>          <dd><code>&</code> The {@link FlexRadar.rendered} event handler.</dd>
 *   <dt>series-visibility-changed</dt>
 *                              <dd><code>&</code> The {@link FlexRadar.seriesVisibilityChanged} event handler.</dd>
 * </dl>
 *
 * The wj-flex-radar directive may contain the following child directives:
 * {@link wijmo.angular.chart.WjFlexChartAxis}, {@link wijmo.angular.chart.radar.WjFlexRadarSeries}, {@link wijmo.angular.chart.WjFlexChartLegend} and {@link wijmo.angular.chart.WjFlexChartDataLabel}.
 */
export class WjFlexRadar extends WjFlexChartCore {

    // gets the Wijmo FlexRadar control constructor
    get _controlConstructor() {
        return wijmo.chart.radar.FlexRadar;
    }
}

/**
 * AngularJS directive for the {@link FinancialChart} {@link FinancialSeries} object.
 *
 * The <b>wj-financial-chart-series</b> directive must be contained in a {@link wijmo.angular.chart.finance.WjFinancialChart} directive.
 * It supports the following attributes:
 *
 * <dl class="dl-horizontal">
 *   <dt>axis-x</dt>       <dd><code>@</code> X-axis for the series.</dd>
 *   <dt>axis-y</dt>       <dd><code>@</code> Y-axis for the series.</dd>
 *   <dt>binding</dt>      <dd><code>@</code> The name of the property that contains Y values for the
 *                         series. This value overrides any binding set for the chart.</dd>
 *   <dt>binding-x</dt>    <dd><code>@</code> The name of the property that contains X values for the
 *                         series. This value overrides any binding set for the chart.</dd>
 *   <dt>chart-type</dt>   <dd><code>@</code> The chart type to use in rendering objects for this series
 *                         objects. This value overrides the default chart type set on the chart. See
 *                         {@link FinancialChartType}.</dd>
 *   <dt>css-class</dt>    <dd><code>@</code> The CSS class to use for the series.</dd>
 *   <dt>items-source</dt> <dd><code>=</code> An array or {@link ICollectionView} object that contains
 *                         data for this series.</dd>
 *   <dt>name</dt>         <dd><code>@</code> The name of the series to show in the legend.</dd>
 *   <dt>style</dt>        <dd><code>=</code> The series style. Use ng-attr-style to specify the series
 *                         style object as an object. See the section on ngAttr attribute bindings in
 *                         <a target="_blank" href="https://docs.angularjs.org/guide/directive">
 *                         AngularJS Creating Custom Directives</a> and the <a target="_blank" href=
 *                         "https://demos.wijmo.com/5/Angular/FlexChartIntro/FlexChartIntro/#Styling">
 *                         FlexChart 101 Styling Series</a> sample for more information.</dd>
 *   <dt>altStyle</dt>     <dd><code>=</code> The series alternative style.</dd>
 *   <dt>symbol-marker</dt><dd><code>@</code> The shape of marker to use for the series. This value
 *                         overrides the default marker set on the chart. See {@link Marker}.</dd>
 *   <dt>symbol-size</dt>  <dd><code>@</code> The size of the symbols used to render data points in this
 *                         series for Scatter, LineSymbols, and SplineSymbols charts, in pixels.
 *                         This value overrides any setting at the chart level.</dd>
 *   <dt>symbol-style</dt> <dd><code>=</code> The style of the symbols used to render data
 *                         points in this series for Scatter, LineSymbols, and SplineSymbols charts.
 *                         This value overrides any setting at the chart level.</dd>
 *   <dt>visibility</dt>   <dd><code>=</code> The {@link SeriesVisibility} value indicating whether and where to
 *                         display the series.</dd>
 * </dl>
 *
 * In most cases, the <b>wj-financial-chart-series</b> specifies the <b>name</b> and <b>binding</b> properties only.
 * The remaining values are inherited from the parent <b>wj-financial-chart</b> directive.
 */
export class WjFlexRadarSeries extends WjSeriesBase {

    // Initializes a new instance of a WjFinancialChartSeries
    constructor() {
        super();
        this.require = '^wjFlexRadar';
        this.template = '<div class="wjFlexRadarSeries" ng-transclude />';
        //this.transclude = true;
    }

    // Returns constructor of related Wijmo object. Abstract member, must be overridden in inherited class
    get _controlConstructor(): any { //: new (elem: HTMLElement) => wijmo.Control {
        return wijmo.chart.radar.FlexRadarSeries;
    }
}

/**
 * AngularJS directive for the {@link FlexRadar} {@link FlexRadarAxis} {@link Axis} object.
 *
 * The <b>wj-flex-radar-axis</b> directive must be contained in a {@link wijmo.angular.chart.radar.WjFlexRadar} directive.
 * It supports the following attributes:
 *
 * <dl class="dl-horizontal">
 *   <dt>wj-property</dt>     <dd><code>@</code> Defines the {@link FlexChart} property name,
 *                            axis-x or axis-y, to initialize with the directive.</dd>
 *   <dt>axis-line</dt>       <dd><code>@</code> The value indicating whether the axis line is visible.</dd>
 *   <dt>binding</dt>         <dd><code>@</code> Gets or sets the comma-separated property names for
 *                            the {@link wijmo.chart.Axis.itemsSource} property to use in axis labels.
 *                            The first name specifies the value on the axis, the second represents
 *                            the corresponding axis label. The default value is 'value,text'.</dd>
 *   <dt>format</dt>          <dd><code>@</code> The format string used for the axis labels
 *                            (see {@link wijmo.Globalize}).</dd>
 *   <dt>item-formatter</dt>  <dd><code>=</code> The formatter function that customizes the
 *                            appearance of axis labels.</dd>
 *   <dt>items-source</dt>    <dd><code>=</code> The items source for the axis labels.</dd>
 *   <dt>labels</dt>          <dd><code>@</code> The value indicating whether the axis labels are visible.</dd>
 *   <dt>label-angle</dt>     <dd><code>@</code> The rotation angle of axis labels in degrees.</dd>
 *   <dt>label-align</dt>     <dd><code>@</code> The alignment of axis labels.</dd>
 *   <dt>label-padding</dt>   <dd><code>@</code> The padding of axis labels.</dd>
 *   <dt>major-grid</dt>      <dd><code>@</code> The value indicating whether the axis includes grid lines.</dd>
 *   <dt>major-tick-marks</dt><dd><code>@</code> Defines the appearance of tick marks on the axis
 *                            (see {@link TickMark}).</dd>
 *   <dt>major-unit</dt>      <dd><code>@</code> The number of units between axis labels.</dd>
 *   <dt>max</dt>             <dd><code>@</code> The minimum value shown on the axis.</dd>
 *   <dt>min</dt>             <dd><code>@</code> The maximum value shown on the axis.</dd>
 *   <dt>minor-grid</dt>      <dd><code>@</code> The value indicating whether the axis includes minor grid lines.</dd>
 *   <dt>minor-tick-marks</dt><dd><code>@</code> Defines the appearance of minor tick marks on the axis
 *                            (see {@link TickMark}).</dd>
 *   <dt>minor-unit</dt>      <dd><code>@</code> The number of units between minor axis ticks.</dd>
 *   <dt>origin</dt>          <dd><code>@</code> The axis origin.</dd>
 *   <dt>overlappingLabels</dt><dd><code>@</code> The {@link OverlappingLabels} value indicating how to handle the overlapping axis labels.</dd>
 *   <dt>position</dt>        <dd><code>@</code> The {@link Position} value indicating the position of the axis.</dd>
 *   <dt>title</dt>           <dd><code>@</code> The title text shown next to the axis.</dd>
 * </dl>
 */
export class WjFlexRadarAxis extends WjDirective {

    // Initializes a new instance of a WjFlexCharAxis.
    constructor() {
        super();

        this.require = ['?^wjFlexRadarSeries', '?^wjFlexRadar'];
        this.template = '<div class="wjFlexRadarAxis" />';
    }

    get _controlConstructor() {
        return wijmo.chart.radar.FlexRadarAxis;
    }

    _initControl(element: any): any {
        return super._initControl(undefined);
    }

}


    }
    


    module wijmo.angular {
    

    }
    

    module wijmo.angular {
    

//#region "Container directives registration"


var wjNg: any = window['angular'];




const wijmoContainersName = 'wj.container';


// do not use moduleName here, it's removed from the global module version
var wijmoContainers = _registerNgModule(wijmoContainersName);

wijmoContainers.directive('wjTooltip', [function () {
    return new WjTooltip();
}]);

wijmoContainers.directive('wjValidationError', [function () {
    return new WjValidationError();
}]);
//#endregion "Container directives definitions"

//#region "Container directives classes"

/**
 * AngularJS directive for the {@link Tooltip} class.
 *
 * Use the <b>wj-tooltip</b> directive to add tooltips to elements on the page. 
 * The wj-tooltip directive supports HTML content, smart positioning, and touch.
 *
 * The wj-tooltip directive is specified as a parameter added to the 
 * element that the tooltip applies to. The parameter value is the tooltip
 * text or the id of an element that contains the text. For example:
 *
 * <pre>&lt;p wj-tooltip="#fineprint" &gt;
 *     Regular paragraph content...&lt;/p&gt;
 * ...
 * &lt;div id="fineprint" style="display:none"&gt;
 *   &lt;h3&gt;Important Note&lt;/h3&gt;
 *   &lt;p&gt;
 *     Data for the current quarter is estimated 
 *     by pro-rating etc.&lt;/p&gt;
 * &lt;/div&gt;</pre>
 */
export class WjTooltip extends WjDirective {

    // Initializes a new instance of WjTooltip
    constructor() {
        super();
        this.restrict = 'A';
        this.template = '';
    }
    
    // Returns Wijmo Tooltip control constructor
    get _controlConstructor() : any { 
        return wijmo.Tooltip;
    }
    
    _initControl(element: any): any {
        return new wijmo.Tooltip();
    }

    _createLink(): WjLink {
        return new WjTooltipLink();
    }
}

class WjTooltipLink extends WjLink {
    //override
    public _link() {
        super._link();

        var tt = <wijmo.Tooltip><any>this.control, // hack as Tooltip is not Control
            self = this;
        (<any>this.tAttrs).$observe('wjTooltip', function (value) {
            tt.setTooltip(self.tElement[0], value);
        });
    }
}

/**
 * AngularJS directive for custom validations based on expressions.
 *
 * The <b>wj-validation-error</b> directive supports both AngularJS and native HTML5 
 * validation mechanisms. It accepts an arbitrary AngularJS expression that should return 
 * an error message string in case of the invalid input and an empty string if the input is valid.
 * 
 * For AngularJS validation it should be used together with the <b>ng-model</b> directive. 
 * In this case the <b>wj-validation-error</b> directive reports an error using a call
 * to the <b>NgModelController.$setValidity</b> method with the <b>wjValidationError</b> error key , 
 * in the same way as it happens with AngularJS native and custom validation directives.
 * 
 * For HTML5 validation, the <b>wj-validation-error</b> directive sets the error state to the 
 * element using the <b>setCustomValidity</b> method from the HTML5 validation API. For example:
 *
 * <pre>&lt;p&gt;HTML5 validation:&lt;/p&gt;
 * &lt;form&gt;
 *     &lt;input type="password"
 *         placeholder="Password" 
 *         name="pwd" ng-model="thePwd" 
 *         required minlength="2" /&gt;
 *     &lt;input type="password"
 *         placeholder="Check Password"
 *         name="chk" ng-model="chkPwd"
 *         wj-validation-error="chkPwd != thePwd ? 'Passwords don\'t match' : ''" /&gt;
 * &lt;/form&gt;
 *
 * &lt;p&gt;AngularJS validation:&lt;/p&gt;
 * &lt;form name="ngForm" novalidate&gt;
 *     &lt;input type="password"
 *         placeholder="Password" 
 *         name="pwd" ng-model="thePwd" 
 *         required minlength="2" /&gt;
 *     &lt;input type="password"
 *         placeholder="Check Password"
 *         name="chk" ng-model="chkPwd"
 *         wj-validation-error="chkPwd != thePwd" /&gt;
 *     &lt;div 
 *         ng-show="ngForm.chk.$error.wjValidationError && !ngForm.chk.$pristine"&gt;
 *         Sorry, the passwords don't match.
 *     &lt;/div&gt;
 * &lt;/form&gt;</pre>
 *
 */
export class WjValidationError extends WjDirective {

    // Initializes a new instance of WjValidationError
    constructor() {
        super();
        this.restrict = 'A';
        this.template = '';
        this.require = 'ngModel';
        this.scope = false;
    }

    _postLinkFn() {
        return function (scope: any, tElement: any/*ng.IAugmentedJQuery*/, tAttrs: any/*ng.IAttributes*/, controller: any) {
                        // scope, elm, attrs, ctl
            // directive name
            var dn = 'wjValidationError';

            // update valid state when the expression result changes
            scope.$watch(tAttrs[dn], function (errorMsg) {

                // get input element to validate
                var e = <any>(tElement[0].tagName == 'INPUT' ? tElement[0] : tElement[0].querySelector('input'));

                // accept booleans as well as strings
                if (typeof (errorMsg) == 'boolean') {
                    errorMsg = errorMsg ? 'error' : '';
                }

                // HTML5 validation
                if (e && e.setCustomValidity) {
                    e.setCustomValidity(errorMsg);
                }

                // AngularJS validation
                if (controller) {
                    controller.$setValidity(dn, errorMsg ? false : true);
                }
            });
        };
    }

    _getMetaDataId(): any {
        return 'ValidationError';
    }

}


//#endregion "Container directives classes"
 
    }
    


    module wijmo.angular {
    

    }
    

    module wijmo.angular {
    


var wjNg: any = window['angular'];






const wijmoGridName = 'wj.grid';


// do not use moduleName here, it's removed from the global module version
var wijmoGrid = _registerNgModule(wijmoGridName);

//#region "Grid directives registration"

// register only if module is loaded
if (softRefGrid() && softRefGrid().FlexGrid) {

    wijmoGrid.directive('wjFlexGrid', ['$compile', '$interpolate', function ($compile, $interpolate) {
        return new WjFlexGrid($compile, $interpolate);
    }]);

    wijmoGrid.directive('wjFlexGridColumn', ['$compile', function ($compile) {
        return new WjFlexGridColumn($compile);
    }]);

    wijmoGrid.directive('wjFlexGridCellTemplate', [function () {
        return new WjFlexGridCellTemplate();
    }]);



}

//#endregion "Grid directives definitions"

//#region "Grid directives classes"

/**
    * AngularJS directive for the {@link FlexGrid} control.
    *
    * Use the <b>wj-flex-grid</b> directive to add grids to your AngularJS applications. 
    * Note that directive and parameter names must be formatted as lower-case with dashes 
    * instead of camel-case. For example:
    * 
    * <pre>&lt;p&gt;Here is a FlexGrid control:&lt;/p&gt;
    * &lt;wj-flex-grid items-source="data"&gt;
    *   &lt;wj-flex-grid-column 
    *     header="Country" 
    *     binding="country"&gt;
    *   &lt;/wj-flex-grid-column&gt;
    *   &lt;wj-flex-grid-column 
    *     header="Sales" 
    *     binding="sales"&gt;
    *   &lt;/wj-flex-grid-column&gt;
    *   &lt;wj-flex-grid-column 
    *     header="Expenses" 
    *     binding="expenses"&gt;
    *   &lt;/wj-flex-grid-column&gt;
    *   &lt;wj-flex-grid-column 
    *     header="Downloads" 
    *     binding="downloads"&gt;
    *   &lt;/wj-flex-grid-column&gt;
    * &lt;/wj-flex-grid&gt;</pre>
    *
    * The example below creates a FlexGrid control and binds it to a 'data' array
    * exposed by the controller. The grid has three columns, each corresponding to 
    * a property of the objects contained in the source array.
    *
    * <a href="https://jsfiddle.net/Wijmo5/QNb9X/" target="_blank">Example</a>
    * 
    * The <b>wj-flex-grid</b> directive supports the following attributes:
    * 
    * <dl class="dl-horizontal">
    *   <dt>allow-add-new</dt>              <dd><code>@</code> A value indicating whether to show a new row 
    *                                     template so users can add items to the source collection.</dd>
    *   <dt>allow-delete</dt>             <dd><code>@</code> A value indicating whether the grid deletes the
    *                                     selected rows when the Delete key is pressed.</dd>
    *   <dt>allow-dragging</dt>           <dd><code>@</code> An {@link AllowDragging} value indicating 
    *                                     whether and how the user can drag rows and columns with the mouse.</dd>
    *   <dt>allow-merging</dt>            <dd><code>@</code> An {@link AllowMerging} value indicating 
    *                                     which parts of the grid provide cell merging.</dd>
    *   <dt>allow-resizing</dt>           <dd><code>@</code> An {@link AllowResizing} value indicating 
    *                                     whether users are allowed to resize rows and columns with the mouse.</dd>
    *   <dt>allow-sorting</dt>            <dd><code>@</code> A boolean value indicating whether users can sort 
    *                                     columns by clicking the column headers.</dd>
    *   <dt>auto-generate-columns</dt>    <dd><code>@</code> A boolean value indicating whether the grid generates 
    *                                     columns automatically based on the <b>items-source</b>.</dd>
    *   <dt>child-items-path</dt>         <dd><code>@</code> The name of the property used to generate 
    *                                     child rows in hierarchical grids (or an array of property names if items
    *                                     at different hierarchical levels use different names for their child items).</dd>
    *   <dt>control</dt>                  <dd><code>=</code> A reference to the {@link FlexGrid} control 
    *                                     created by this directive.</dd>
    *   <dt>defer-resizing</dt>           <dd><code>=</code> A boolean value indicating whether row and column 
    *                                     resizing should be deferred until the user releases the mouse button.</dd>
    *   <dt>frozen-columns</dt>           <dd><code>@</code> The number of frozen (non-scrollable) columns in the grid.</dd>
    *   <dt>frozen-rows</dt>              <dd><code>@</code> The number of frozen (non-scrollable) rows in the grid.</dd>
    *   <dt>group-header-format</dt>      <dd><code>@</code> The format string used to create the group 
    *                                     header content.</dd>
    *   <dt>headers-visibility</dt>       <dd><code>=</code> A {@link HeadersVisibility} value 
    *                                     indicating whether the row and column headers are visible. </dd>
    *   <dt>ime-enabled</dt>              <dd><code>@</code> Gets or sets a value that determines whether the grid should 
    *                                     support Input Method Editors (IME) while not in edit mode.</dd>
    *   <dt>initialized</dt>              <dd><code>&</code> This event occurs after the binding has finished
    *                                     initializing the control with attribute values.</dd>
    *   <dt>is-initialized</dt>           <dd><code>=</code> A value indicating whether the binding has finished
    *                                     initializing the control with attribute values. </dd>
    *   <dt>item-formatter</dt>           <dd><code>=</code> A function that customizes 
    *                                     cells on this grid.</dd>
    *   <dt>items-source</dt>             <dd><code>=</code> An array or {@link ICollectionView} object that 
    *                                     contains the items shown on the grid.</dd>
    *   <dt>is-read-only</dt>             <dd><code>@</code> A boolean value indicating whether the user is 
    *                                     prevented from editing grid cells by typing into them.</dd>
    *   <dt>merge-manager</dt>            <dd><code>=</code> A {@link MergeManager} object that specifies  
    *                                     the merged extent of the specified cell.</dd>
    *   <dt>selection-mode</dt>           <dd><code>@</code> A {@link SelectionMode} value 
    *                                     indicating whether and how the user can select cells.</dd>
    *   <dt>show-groups</dt>              <dd><code>@</code> A boolean value indicating whether to insert group 
    *                                     rows to delimit data groups.</dd>
    *   <dt>show-sort</dt>                <dd><code>@</code> A boolean value indicating whether to display sort 
    *                                     indicators in the column headers.</dd>
    *   <dt>sort-row-index</dt>           <dd><code>@</code> A number specifying the index of row in the column 
    *                                     header panel that shows and changes the current sort.</dd>
    *   <dt>tree-indent</dt>              <dd><code>@</code> The indentation, in pixels, used to offset row 
    *                                     groups of different levels.</dd>
    *   <dt>beginning-edit</dt>           <dd><code>&</code> Handler for the {@link FlexGrid.beginningEdit} event.</dd>
    *   <dt>cell-edit-ended</dt>          <dd><code>&</code> Handler for the {@link FlexGrid.cellEditEnded} event.</dd>
    *   <dt>cell-edit-ending</dt>         <dd><code>&</code> Handler for the {@link FlexGrid.cellEditEnding} event.</dd>
    *   <dt>prepare-cell-for-edit</dt>    <dd><code>&</code> Handler for the {@link FlexGrid.prepareCellForEdit} event.</dd>
    *   <dt>resizing-column</dt>          <dd><code>&</code> Handler for the {@link FlexGrid.resizingColumn} event.</dd>
    *   <dt>resized-column</dt>           <dd><code>&</code> Handler for the {@link FlexGrid.resizedColumn} event.</dd>
    *   <dt>dragged-column</dt>           <dd><code>&</code> Handler for the {@link FlexGrid.draggedColumn} event.</dd>
    *   <dt>dragging-column</dt>          <dd><code>&</code> Handler for the {@link FlexGrid.draggingColumn} event.</dd>
    *   <dt>sorted-column</dt>            <dd><code>&</code> Handler for the {@link FlexGrid.sortedColumn} event.</dd>
    *   <dt>sorting-column</dt>           <dd><code>&</code> Handler for the {@link FlexGrid.sortingColumn} event.</dd>
    *   <dt>deleting-row</dt>             <dd><code>&</code> Handler for the {@link FlexGrid.deletingRow} event.</dd>
    *   <dt>dragging-row</dt>             <dd><code>&</code> Handler for the {@link FlexGrid.draggingRow} event.</dd>
    *   <dt>dragged-row</dt>              <dd><code>&</code> Handler for the {@link FlexGrid.draggedRow} event.</dd>
    *   <dt>resizing-row</dt>             <dd><code>&</code> Handler for the {@link FlexGrid.resizingRow} event.</dd>
    *   <dt>resized-row</dt>              <dd><code>&</code> Handler for the {@link FlexGrid.resizedRow} event.</dd>
    *   <dt>row-added</dt>                <dd><code>&</code> Handler for the {@link FlexGrid.rowAdded} event.</dd>
    *   <dt>row-edit-ended</dt>           <dd><code>&</code> Handler for the {@link FlexGrid.rowEditEnded} event.</dd>
    *   <dt>row-edit-ending</dt>          <dd><code>&</code> Handler for the {@link FlexGrid.rowEditEnding} event.</dd>
    *   <dt>loaded-rows</dt>              <dd><code>&</code> Handler for the {@link FlexGrid.loadedRows} event.</dd>
    *   <dt>loading-rows</dt>             <dd><code>&</code> Handler for the {@link FlexGrid.loadingRows} event.</dd>
    *   <dt>group-collapsed-changed</dt>  <dd><code>&</code> Handler for the {@link FlexGrid.groupCollapsedChanged} event.</dd>
    *   <dt>group-collapsed-changing</dt> <dd><code>&</code> Handler for the {@link FlexGrid.groupCollapsedChanging} event.</dd>
    *   <dt>items-source-changed</dt>     <dd><code>&</code> Handler for the {@link FlexGrid.itemsSourceChanged} event.</dd>
    *   <dt>selection-changing</dt>       <dd><code>&</code> Handler for the {@link FlexGrid.selectionChanging} event.</dd>
    *   <dt>selection-changed</dt>        <dd><code>&</code> Handler for the {@link FlexGrid.selectionChanged} event.</dd>
    *   <dt>got-focus</dt>                <dd><code>&</code> Handler for the {@link FlexGrid.gotFocus} event.</dd>
    *   <dt>lost-focus</dt>               <dd><code>&</code> Handler for the {@link FlexGrid.lostFocus} event.</dd>
    *   <dt>scroll-position-changed</dt>  <dd><code>&</code> Handler for the {@link FlexGrid.scrollPositionChanged} event.</dd>
    * </dl>
    *
    * The <b>wj-flex-grid</b> directive may contain {@link wijmo.angular.grid.WjFlexGridColumn}, {@link wijmo.angular.grid.WjFlexGridCellTemplate} and 
    * {@link wijmo.angular.grid.detail.WjFlexGridDetail} child directives.
    */
export class WjFlexGrid extends WjDirective {

    // Stores instance of Angular $compile and $interpolate services
    _$compile: any/*ng.ICompileService*/;
    _$interpolate: any/*ng.IInterpolateService*/;

    // Initializes a new instance of a WjFlexGrid
    constructor($compile: any/*ng.ICompileService*/, $interpolate: any/*ng.IInterpolateService*/) {
        super();

        this._$compile = $compile;
        this._$interpolate = $interpolate;
        var self = this;

        //super();

        this.transclude = true;
        this.template = '<div ng-transclude />';

    }

    // Gets the Wijmo FlexGrid control constructor
    get _controlConstructor() {
        return wijmo.grid.FlexGrid;
    }

    _createLink(): WjLink {
        return new WjFlexGridLink();
    }

    // Initializes WjFlexGrid property map
    _initProps() {
        var childPathDesc = MetaFactory.findProp('childItemsPath', this._props);
        childPathDesc.scopeBindingMode = '@';
        childPathDesc.customHandler = function (scope, control, value, oldValue, link) {
            if (value) {
                value = (<string>value).trim();
                if (value && value[0] === '[') {
                    var arr = scope.$parent.$eval(value);
                    control['childItemsPath'] = arr;
                    return true;
                }
            }
            return false;
        }
    }

}

class WjFlexGridLink extends WjLink {

    _initControl(): any {
        var grid = super._initControl();
        new DirectiveCellFactory(grid, this);
        return grid;
    }

}

// Mockup for CellFactory, to allow DirectiveCellFactory be loaded in case of absent wijmo.grid module.
var gridModule = wijmo.grid && wijmo.grid.CellFactory;
if (!gridModule) {
    (<any>window['wijmo']).grid = {};
    (<any>window['wijmo'].grid).CellFactory = function () { };
}

class DirectiveCellFactory extends wijmo.grid.CellFactory {
    // Array of string members of the CellTemplateType enum.
    private static _templateTypes: string[];
    private static _cellStampProp = '__wjCellStamp';
    private static _FOCUS_INTERVAL = wijmo.Control._FOCUS_INTERVAL + 20; // TFS 316133

    // Determine whether we are in IE (but not in Edge) in the same way as Ng does it.
    // The approach is based on this:
    // http://msdn.microsoft.com/en-us/library/ie/cc196988(v=vs.85).aspx
    private static isNgIE = !!document['documentMode'];

    private _grid: wijmo.grid.FlexGrid;
    private _gridLink: WjFlexGridLink;
    private _baseCf: wijmo.grid.CellFactory;
    private _rowHeightUpdates: _RowHeightUpdateQueue;

    private _closingApplyTimeOut;
    private _lastApplyTimeStamp = 0;
    private _noApplyLag = false;
    private _editChar;
    private _startingEditing = false;
    private _evtInput: any;
    private _evtChange: any;
    private _evtBlur: any;
    private _cellStampCounter = 0;

    private _cellEditorScope;
    private _composing = false;

    constructor(grid: wijmo.grid.FlexGrid, gridLink: WjFlexGridLink) {
        super();

        this._grid = grid;
        this._gridLink = gridLink;
        this._rowHeightUpdates = new _RowHeightUpdateQueue(this);

        // init _templateTypes
        if (!DirectiveCellFactory._templateTypes) {
            DirectiveCellFactory._templateTypes = [];
            for (var templateType in CellTemplateType) {
                if (isNaN(<any>templateType)) {
                    DirectiveCellFactory._templateTypes.push(templateType);
                }
            }
        }

        // override grid's cell factory
        var self = this;
        this._baseCf = grid.cellFactory;
        grid.cellFactory = this;


        // initialize input event dispatcher
        this._evtInput = document.createEvent('HTMLEvents');
        this._evtInput.initEvent('input', true, false);
        // initialize change event dispatcher
        this._evtChange = document.createEvent('HTMLEvents');
        this._evtChange.initEvent('change', true, false);
        // initialize blur event dispatcher
        this._evtBlur = document.createEvent('HTMLEvents');
        this._evtBlur.initEvent('blur', false, false);

        // no $apply() lag while editing
        grid.prepareCellForEdit.addHandler(function (s, e) {
            self._noApplyLag = true;
        });
        grid.cellEditEnded.addHandler(function (s, e: wijmo.grid.CellRangeEventArgs) {
            // If column has no cell edit template, clear _editChar buffer.
            if (e.range.col < 0 ||
                !grid.columns[e.range.col][WjFlexGridCellTemplate._getTemplContextProp(CellTemplateType.CellEdit)]) {
                self._editChar = null;
            }
            setTimeout(function () {
                self._noApplyLag = false;
            }, 300);
        });
        grid.beginningEdit.addHandler(function (s, e: wijmo.grid.CellRangeEventArgs) {
            // if editing is started by a user interaction (e.data != null), and not by pressing
            // a char key, clear the char buffer, because it may contain previous key presses 
            // that didn't cause editing starting (like typing to a read-only cell, or like)
            if (e.data && (!(e.data instanceof KeyboardEvent) || (<KeyboardEvent>e.data).charCode <= 32)) {
                self._editChar = null;
            }
            self._startingEditing = true;
        });

        grid.hostElement.addEventListener('keydown', function (e) {
            self._startingEditing = false;
        }, true);

        grid.hostElement.addEventListener('keypress', function (e) {
            var char = e.charCode > 32 ? String.fromCharCode(e.charCode) : null;
            if (char && wijmo.closest(e.target, '.wj-flexgrid') === grid.hostElement) {
                // Grid's _KeyboardHandler may receive 'keypress' before or after this handler (observed at least in IE,
                // not clear why this happens). So both grid.activeEditor and _startingEditing (the latter is initialized in
                // beginningEdit and cleared in 'keydown') participate in detecting whether this char has initialized a cell
                // editing.
                if (!grid.activeEditor || self._startingEditing) {
                    self._editChar = char;
                } else if (self._editChar) {
                    self._editChar += char;
                }
            }
        }, true);

        grid.hostElement.addEventListener('compositionstart', function (e) {
            self._composing = true;
        }, true);

        grid.hostElement.addEventListener('compositionend', function (e) {
            self._composing = false;
        }, true);


    }

    public updateCell(panel: wijmo.grid.GridPanel, rowIndex: number, colIndex: number, cell: HTMLElement, rng?: wijmo.grid.CellRange) {

        this._cellStampCounter = (this._cellStampCounter + 1) % 10000000;
        let cellStamp = cell[DirectiveCellFactory._cellStampProp] = this._cellStampCounter;

        // restore overflow for any cell
        if (cell.style.overflow) {
            cell.style.overflow = '';
        }

        let riOriginal = rowIndex,
            ciOriginal = colIndex;
        if (rng && !rng.isSingleCell) {
            rowIndex = rng.row;
            colIndex = rng.col;
        }

        let self = this,
            grid = <wijmo.grid.FlexGrid>panel.grid,
            editRange = grid.editRange,
            templateType: CellTemplateType,
            row = <wijmo.grid.Row>panel.rows[rowIndex],
            dataItem = row.dataItem,
            isGridCtx = false,
            needCellValue = false,
            isEdit = false,
            isCvGroup = false;

        // determine template type
        switch (panel.cellType) {
            case wijmo.grid.CellType.Cell:
                if (editRange && editRange.row === rowIndex && editRange.col === colIndex) {
                    templateType = CellTemplateType.CellEdit;
                    needCellValue = isEdit = true;
                } else if (row instanceof wijmo.grid.GroupRow) {
                    isCvGroup = dataItem instanceof wijmo.collections.CollectionViewGroup;
                    var isHierNonGroup = !(isCvGroup || (<wijmo.grid.GroupRow>row).hasChildren);
                    if (colIndex == panel.columns.firstVisibleIndex) {
                        templateType = isHierNonGroup ? CellTemplateType.Cell : CellTemplateType.GroupHeader;
                    } else {
                        templateType = isHierNonGroup ? CellTemplateType.Cell : CellTemplateType.Group;
                        needCellValue = true;
                    }
                    // } else if (!(wijmo.grid['detail'] && wijmo.grid['detail'].DetailRow &&
                    //     (row instanceof wijmo.grid['detail'].DetailRow))) {
                    } else if (!(softRefGridDetail() && softRefGridDetail().DetailRow &&
                        (row instanceof softRefGridDetail().DetailRow))) {
                    templateType = CellTemplateType.Cell;
                }
                break;
            case wijmo.grid.CellType.ColumnHeader:
                templateType = CellTemplateType.ColumnHeader;
                break;
            case wijmo.grid.CellType.RowHeader:
                templateType = grid.collectionView &&
                    (<wijmo.collections.IEditableCollectionView>grid.collectionView).currentEditItem === dataItem
                    ? CellTemplateType.RowHeaderEdit
                    : CellTemplateType.RowHeader;
                isGridCtx = true;
                break;
            case wijmo.grid.CellType.TopLeft:
                templateType = CellTemplateType.TopLeft;
                isGridCtx = true;
                break;
            case wijmo.grid.CellType.ColumnFooter:
                templateType = CellTemplateType.ColumnFooter;
                needCellValue = true;
                break;
            case wijmo.grid.CellType.BottomLeft:
                templateType = CellTemplateType.BottomLeft;
                isGridCtx = true;
                break;
        }

        var isUpdated = false;

        if (templateType != null) {

            var col = <wijmo.grid.Column>(isCvGroup && templateType == CellTemplateType.GroupHeader ?
                grid.getColumn(dataItem.groupDescription['propertyName']) :
                (colIndex >= 0 && colIndex < panel.columns.length ? panel.columns[colIndex] : null));

            if (col) {
                var templContextProp = WjFlexGridCellTemplate._getTemplContextProp(templateType),
                    templContext = <_ICellTemplateContext>(isGridCtx ? <any>grid : <any>col)[templContextProp];

                // maintain template inheritance
                if (!templContext) {
                    if (templateType === CellTemplateType.RowHeaderEdit) {
                        templateType = CellTemplateType.RowHeader;
                        templContextProp = WjFlexGridCellTemplate._getTemplContextProp(templateType);
                        templContext = grid[templContextProp];
                    } else if (templateType === CellTemplateType.Group || templateType === CellTemplateType.GroupHeader) {
                        if (!isCvGroup) {
                            templateType = CellTemplateType.Cell;
                            templContextProp = WjFlexGridCellTemplate._getTemplContextProp(templateType);
                            templContext = col[templContextProp];
                        }
                    }
                }

                if (templContext) {
                    // apply directive template and style
                    var tpl = self._getCellTemplate(templContext.cellTemplate),
                        cellStyle = templContext.cellStyle,
                        cellClass = templContext.cellClass,
                        isTpl = !wijmo.isNullOrWhiteSpace(tpl),
                        isStyle = !wijmo.isNullOrWhiteSpace(cellStyle),
                        isClass = !wijmo.isNullOrWhiteSpace(cellClass),
                        cellValue;
                    if (needCellValue) {
                        cellValue = panel.getCellData(rowIndex, colIndex, false);
                    }

                    // apply cell template
                    if (isTpl) {
                        var measureAttr = cell.getAttribute(wijmo.grid.FlexGrid._WJS_MEASURE),
                            isMeasuring = measureAttr && measureAttr.toLowerCase() === 'true';
                        isUpdated = true;
                        if (isEdit) {
                            this._baseCf.updateCell(panel, riOriginal, ciOriginal, cell, rng, true);
                        }

                        // if this is false then we can't reuse previously cached scope and linked tree.
                        var cellContext = <_ICellTemplateCache>(cell[templContextProp] || {}),
                            isForeignCell = cellContext.column !== col || !cellContext.cellScope || !cellContext.cellScope.$root,
                            isImeInput = isEdit && this._composing && grid.imeEnabled;

                        // create a new cell scope, as a child of the column's parent scope 
                        // (which could be ng-repeat with its specific properties), 
                        // or reuse the one created earlier for this cell and cached in the 
                        // cellContext.cellScope property. 
                        // in any case initialize the scope with cell specific properties.
                        var cellScope = cellContext.cellScope;

                        if (isForeignCell) {
                            this._doDisposeCell(cell);
                            cellContext.cellScope = cellScope = templContext.templLink.scope.$parent.$new();
                            cellContext.column = col;
                            cell[templContextProp] = cellContext;
                        }

                        var scopeChanged = cellScope.$row !== row || cellScope.$col !== col || cellScope.$item !== dataItem ||
                            cellScope.$value !== cellValue;
                        if (scopeChanged) {
                            self._initCellScope(cellScope, row, col, dataItem, cellValue);
                        }

                        // compile column template to get a link function, or reuse the 
                        // link function got earlier for this column and cached in the 
                        // templContext.cellLink property. 
                        var cellLink = templContext.cellLink;
                        if (!cellLink) {
                            cellLink = templContext.cellLink = (<WjFlexGrid>this._gridLink.directive)._$compile(
                                '<div style="display:none"' + (isStyle ? ' ng-style="' + cellStyle + '"' : '') +
                                (isClass ? ' ng-class="' + cellClass + '"' : '') + '>' + tpl + '</div>');
                            //'<div ' + (isStyle ? ' ng-style="' + cellStyle + '"' : '') + '>' + tpl + '</div>');
                        }

                        // link the cell template to the cell scope and get a bound DOM 
                        // subtree to use as the cell content, 
                        // or reuse the bound subtree linked earlier and cached in the
                        // cellContext.clonedElement property.
                        // we pass a clone function to the link function to force it to 
                        // return a clone of the template.
                        var clonedElement = cellContext.clonedElement;
                        if (isForeignCell) {
                            //register watch before link, it'll then unhide the root element before linked element binding
                            var dispose = cellScope.$watch(function (scope) {
                                if (!clonedElement) {
                                    return;
                                }
                                dispose();
                                clonedElement[0].style.display = '';

                                // This resolves the problem with non-painting header cells in IE, whose reason
                                // is unclear (appeared after we started to add invisible clonedElement). 
                                // We change some style property, which forces IE to repaint the cell, 
                                // and after some delay restore its original value.
                                if (panel.cellType === wijmo.grid.CellType.ColumnHeader || panel.cellType === wijmo.grid.CellType.TopLeft) {
                                    var clonedStyle = clonedElement[0].style,
                                        prevColor = clonedStyle.outlineColor,
                                        prevWidth = clonedStyle.outlineWidth;
                                    clonedStyle.outlineColor = 'white';
                                    clonedStyle.outlineWidth = '0px';
                                    setTimeout(function () {
                                        clonedStyle.outlineColor = prevColor;
                                        clonedStyle.outlineWidth = prevWidth;
                                    }, 0);
                                }

                                //clonedElement[0].style.visibility = 'visible';
                            });

                            cellContext.clonedElement = clonedElement = cellLink(cellScope, function (clonedEl, scope) { });
                            //clonedElement[0].style.display = 'none';
                            //clonedElement[0].style.visibility = 'collapse';
                        }

                        // insert the bound content subtree to the cell, 
                        // after $apply to prevent flickering.
                        // TBD: check whether this code is really necessary
                        if (isMeasuring /*&& clonedElement[0].style.display == 'none'*/) {
                            clonedElement[0].style.display = '';
                        }
                        var replaceFirst = false;
                        if (isEdit) {
                            var rootEl = cell.firstElementChild;
                            if (rootEl) {
                                // set focus to cell, because hiding a focused element may move focus to a page body
                                // that will force Grid to finish editing.
                                if (!isImeInput) {
                                    cell.focus();
                                }
                                (<HTMLElement>rootEl).style.display = 'none';

                                //cell.textContent = '';

                            }
                        } else {
                            replaceFirst = cell.childNodes.length == 1;
                            if (!replaceFirst) {
                                cell.textContent = '';
                            }
                        }
                        if (replaceFirst) {
                            if (clonedElement[0] !== cell.firstChild) {
                                cell.replaceChild(clonedElement[0], cell.firstChild);
                            }
                        } else {
                            cell.appendChild(clonedElement[0]);
                        }

                        if (templContext.cellOverflow) {
                            cell.style.overflow = templContext.cellOverflow;
                        }

                        var lag = 40,
                            closingLag = 10;
                        if (this._closingApplyTimeOut) {
                            clearTimeout(this._closingApplyTimeOut);
                        }
                        self._rowHeightUpdates.add({
                            panel: panel, cell: cell, rng: rng, cellStamp: cellStamp,
                            templateContext: templContext
                        });
                        if (isMeasuring || editRange || this._noApplyLag || scopeChanged && (Date.now() - this._lastApplyTimeStamp) > lag) {
                            clearTimeout(this._closingApplyTimeOut);
                            if (cellScope.$root && !cellScope.$root.$$phase) {
                                cellScope.$apply();
                            }
                            if (!editRange && !isMeasuring) {
                                self._rowHeightUpdates.execute();
                            }
                            this._lastApplyTimeStamp = Date.now();
                        }
                        else {
                            clearTimeout(this._closingApplyTimeOut);
                            this._closingApplyTimeOut = setTimeout(function () {
                                clearTimeout(this._closingApplyTimeOut);
                                if (cellScope.$root && !cellScope.$root.$$phase) {
                                    cellScope.$apply();
                                }
                                self._rowHeightUpdates.execute();
                            }, closingLag);
                        }

                        if (!isImeInput) {
                            // increase row height if cell doesn't fit in the current row height.
                            setTimeout(function () {
                                //var cellHeight = cell.scrollHeight,
                                //    panelRows = panel.rows;
                                //if (rowIndex < panelRows.length && panelRows[rowIndex].renderHeight < cellHeight) {
                                //    panelRows.defaultSize = cellHeight;
                                if (self._updateRowHeight(panel, cell, rng, cellStamp, templContext)) {
                                    if (isEdit) {
                                        self._rowHeightUpdates.clear();
                                        let isFullEdit = self._isFullEdit();
                                        grid.refresh();
                                        grid.startEditing(isFullEdit);
                                        return;
                                    }
                                    //} else if (isEdit && !contains(clonedElement[0], wijmo.getActiveElement())) {
                                } else if (isEdit) {
                                    self._initEditInput(cellContext, templContext, null);
                                }
                            }, 0);
                        } else if (isEdit) {
                            setTimeout(() => {
                                if (isImeInput) {
                                    this._initImeEditInput(cellContext, templContext);
                                } else {
                                    this._initEditInput(cellContext, templContext, null);
                                }
                            }, 0);
                        }

                        if (isEdit) {

                            self._cellEditorScope = cellScope;
                            var editEndingEH = function (s, e: wijmo.grid.CellEditEndingEventArgs) {
                                grid.cellEditEnding.removeHandler(editEndingEH);
                                // Move focus out of the current input element, in order to let it to save
                                // its value (necessary for controls like InputDate that can't update value immediately
                                // as user typing).
                                // We do it via event emulation, instead of moving focus to another element,
                                // because in IE an element doesn't fit in time to receive the 'blur' event.
                                if (!e.stayInEditMode) {
                                    var activeElement = wijmo.getActiveElement();
                                    if (activeElement) {
                                        activeElement.dispatchEvent(self._evtBlur);
                                    }
                                    // We need to move focus nevertheless, because without this grid may lose focus at all in IE.
                                    if (wijmo.contains(cell, wijmo.getActiveElement())) {
                                        cell.focus();
                                    }
                                }
                                if (!(e.cancel || e.stayInEditMode)) {
                                    e.cancel = true;
                                    panel.grid.setCellData(rowIndex, colIndex, cellScope.$value);
                                }

                                // close all open dropdowns 
                                var dropDowns = cell.querySelectorAll('.wj-dropdown');
                                [].forEach.call(dropDowns, function (el) {
                                    var ctrl = wijmo.Control.getControl(el);
                                    if (ctrl && softRefInput() && 
                                            ctrl instanceof softRefInput().DropDown) {
                                        (<wijmo.input.DropDown>ctrl).isDroppedDown = false;
                                    }
                                });
                            };

                            // subscribe the handler to the cellEditEnding event
                            grid.cellEditEnding.addHandler(editEndingEH);
                            grid.cellEditEnded.addHandler(() => {
                                self._cellEditorScope = null;
                            });
                        } else {
                            this._baseCf.updateCell(panel, riOriginal, ciOriginal, cell, rng, false);
                        }

                    }
                }
            }
        }

        if (!isUpdated) {
            this._doDisposeCell(cell);
            this._baseCf.updateCell(panel, riOriginal, ciOriginal, cell, rng);
        }

        // apply cell style
        if (!isTpl && (isStyle || isClass)) {

            // build cell style object
            var cellScopeSt = self._initCellScope({}, row, col, dataItem, cellValue),
                style = isStyle ? this._gridLink.scope.$parent.$eval(cellStyle, cellScopeSt) : null,
                classObj = isClass ? this._gridLink.scope.$parent.$eval(cellClass, cellScopeSt) : null;

            // apply style to cell
            if (style || classObj) {
                var rootElement = document.createElement('div');

                // copy elements instead of innerHTML in order to keep bindings 
                // in templated cells
                while (cell.firstChild) {
                    rootElement.appendChild(cell.firstChild);
                }
                cell.appendChild(rootElement);
                // apply style
                if (style) {
                    for (var key in style) {
                        rootElement.style[key] = style[key];
                    }
                }
                // apply classes
                if (classObj) {
                    var classArr = <any[]>(wijmo.isArray(classObj) ? classObj : [classObj]),
                        clStr = '';
                    for (var i = 0; i < classArr.length; i++) {
                        var curPart = classArr[i];
                        if (curPart) {
                            if (wijmo.isString(curPart)) {
                                clStr += ' ' + curPart;
                            } else {
                                for (var clName in curPart) {
                                    if (curPart[clName]) {
                                        clStr += ' ' + clName;
                                    }
                                }
                            }
                        }
                    }
                    rootElement.className = clStr;
                }
            }
        }
    }

    public getEditorValue(g: wijmo.grid.FlexGrid): any {
        if (this._cellEditorScope) {
            return this._cellEditorScope.$value;
        } else {
            return super.getEditorValue(g);
        }
    }

    disposeCell(cell: HTMLElement) {
        this._doDisposeCell(cell);
    }

    _doDisposeCell(cell: HTMLElement) {
        var ttm = DirectiveCellFactory._templateTypes;
        for (var i = 0; i < ttm.length; i++) {
            var templContextProp = WjFlexGridCellTemplate._getTemplContextProp(CellTemplateType[ttm[i]]),
                cellContext = <_ICellTemplateCache>(cell[templContextProp]);
            if (cellContext && cellContext.cellScope && cellContext.cellScope.$root) {
                cellContext.cellScope.$destroy();
                // this is necessary to avoid a memory leak probably caused by JQLite implementation.
                if (cellContext.clonedElement) {
                    cellContext.clonedElement.remove();
                    cellContext.clonedElement = null;
                }
                cell[templContextProp] = null;
            }
        }
    }

    _updateRowHeight(panel: wijmo.grid.GridPanel, cell: HTMLElement, rng: wijmo.grid.CellRange, cellStamp: number,
            templateContext: _ICellTemplateContext): boolean {
        if (templateContext.autoSizeRows) {
            var cellHeight = cell.scrollHeight,
                panelRows = panel.rows,
                rowSpan = rng && rng.rowSpan || 1;
            if (cellStamp === cell[DirectiveCellFactory._cellStampProp] && (panelRows.defaultSize * rowSpan) < cellHeight) {
                panelRows.defaultSize = cellHeight / rowSpan;
                return true;
            }
        }

        return false;
    }

    private _initCellScope(scope, row: wijmo.grid.Row, col: wijmo.grid.Column, dataItem, cellValue) {
        scope.$row = row;
        scope.$col = col;
        scope.$item = dataItem;
        scope.$value = cellValue;
        return scope;
    }

    private _getCellTemplate(tpl) {
        if (tpl) {
            tpl = tpl.replace(/ class\=\"ng\-scope\"( \"ng\-binding\")?/g, '');
            tpl = tpl.replace(/<span>\s*<\/span>/g, '');
            tpl = tpl.trim();
        }
        return tpl;
    }

    private _isFullEdit() {
        let grid = this._grid;
        return !grid.activeEditor || grid._edtHdl._fullEdit;
    }
    private _setFullEdit(templContext: _ICellTemplateContext) {
        let grid = this._grid;
        if (templContext.forceFullEdit && grid.activeEditor) {
            grid._edtHdl._fullEdit = true;
        }
    }

    private _initEditInput(cellContext: _ICellTemplateCache, templContext: _ICellTemplateContext,
        initialValue: string) {
        // make sure we're in full edit mode (so editor gets cursor keys: TFS 288442)
        this._setFullEdit(templContext);

        // Find first visible input element and focus it. 
        var input = this._findInitialInput(cellContext);
        if (input) {
            let inpFocusEh = () => {
                input.removeEventListener('focus', inpFocusEh);
                //setTimeout(() => {
                    // at this moment control had to select the whole content
                    setTimeout(() => {
                        let value = initialValue != null ? initialValue : this._editChar;
                        if (value) {
                            //let caretPos = input.selectionStart + value.length;
                            input.value = value;
                            this._editChar = null;
                            //DirectiveCellFactory._setSelectionRange(input, input.value.length);
                            DirectiveCellFactory._setSelectionRange(input, value.length, value.length);
                            // ngModel doesn't listen to the 'input' event
                            // in IE, so we send 'change' event instead, 
                            // but only for inputs which are not parts
                            // of Wijmo controls.
                            if (DirectiveCellFactory.isNgIE &&
                                !(wijmo.hasClass(input, 'wj-form-control') ||
                                    input.getAttribute('wj-part'))) {
                                input.dispatchEvent(this._evtChange);
                            } else {
                                input.dispatchEvent(this._evtInput);
                            }
                            //setTimeout(() => {
                            //    // at this moment control had to process 'input' event,
                            //    // even if it happens asynchronously 
                            //    setTimeout(() => {
                            //        //TBD: should use wijmo.setSelectionRange which needs adaption to HTMLTextAreaElement
                            //        //wijmo.setSelectionRange(input,
                            //        //    Math.min(caretPos, input.value.length), input.value.length);
                            //        DirectiveCellFactory._setSelectionRange(input,
                            //            Math.min(caretPos, input.value.length), input.value.length);
                            //    }, 0);
                            //}, 0);
                        }
                    }, DirectiveCellFactory._FOCUS_INTERVAL);
                //}, 50);
            };

            input.addEventListener('focus', inpFocusEh);
            input.focus();
        }
    }

    private _initImeEditInput(cellContext: _ICellTemplateCache, templContext: _ICellTemplateContext) {
        let imeEditor = <HTMLInputElement>wijmo.getActiveElement();
        if (imeEditor && (imeEditor instanceof HTMLInputElement) && wijmo.hasClass(imeEditor, 'wj-grid-ime')) {
            let compEndEh = (e) => {
                imeEditor.removeEventListener('compositionend', compEndEh);
                wijmo.setCss(imeEditor, wijmo.grid._ImeHandler._cssHidden);
                this._initEditInput(cellContext, templContext, imeEditor.value);
            };
            imeEditor.addEventListener('compositionend', compEndEh);
            // position/size the editor
            let templateInput = this._findInitialInput(cellContext);
            if (templateInput) {
                let tRect = templateInput.getBoundingClientRect(),
                    imeRect = imeEditor.getBoundingClientRect(),
                    imeStyle = window.getComputedStyle(imeEditor),
                    imeStyleLeft = parseFloat(imeStyle.left),
                    imeStyleTop = parseFloat(imeStyle.top);
                wijmo.setCss(imeEditor, {
                    left: (imeStyleLeft + tRect.left - imeRect.left) + 'px',
                    top: (imeStyleTop + tRect.top - imeRect.top) + 'px',
                    width: tRect.width + 'px',
                    height: tRect.height + 'px'
                });
            }
        }
    }

    private _findInitialInput(cellContext: _ICellTemplateCache): HTMLInputElement | HTMLTextAreaElement {
        let inputs = cellContext.clonedElement[0].querySelectorAll('input,textarea');
        if (inputs) {
            for (var i = 0; i < inputs.length; i++) {
                var input = <HTMLInputElement | HTMLTextAreaElement>inputs[i],
                    inpSt = window.getComputedStyle(input);
                if (inpSt.display !== 'none' && inpSt.visibility === 'visible') {
                    return input;
                }
            }
        }

        return null;
    }

    private static _setSelectionRange(e: HTMLInputElement | HTMLTextAreaElement, start: number, end = start) {
        //e = asType(e, HTMLInputElement);
        if (wijmo.contains(document.body, e) && !e.disabled && e.style.display != 'none') {
            try {

                // use 'backward' to keep the start in view (but not in Edge! TFS 228053)
                (<HTMLInputElement>e).setSelectionRange(wijmo.asNumber(start), wijmo.asNumber(end), wijmo.isIE() ? null : 'backward');

                // focus needed in Chrome (TFS 124102, 142672) 
                // and after setRange (TFS 228053)
                e.focus();

            } catch (x) { }
        }
    }


}

interface _RowHeightUpdateRequest {
    panel: wijmo.grid.GridPanel;
    cell: HTMLElement;
    rng: wijmo.grid.CellRange
    cellStamp: number;
    templateContext: _ICellTemplateContext;
}
class _RowHeightUpdateQueue {
    private _requests: _RowHeightUpdateRequest[] = [];
    private _timeOuts = [];
    private _cellFactory: DirectiveCellFactory;

    constructor(cellFactory: DirectiveCellFactory) {
        this._cellFactory = cellFactory;
    }

    add(request: _RowHeightUpdateRequest) {
        this._requests.push(request);
    }

    execute() {
        var requests = this._requests;
        while (requests.length > 0) {
            var request = this._requests.shift(),
                self = this;
            var timeOut = (function (request) {
                return setTimeout(function () {
                    if (self._cellFactory._updateRowHeight(request.panel, request.cell, request.rng,
                            request.cellStamp, request.templateContext)) {
                        self.clear();
                    } else {
                        var toIdx = self._timeOuts.indexOf(timeOut);
                        if (toIdx > -1) {
                            self._timeOuts.splice(toIdx, 1);
                        }
                    }
                }, 0)
            })(request);
            this._timeOuts.push(timeOut);
        }
    }

    clear() {
        this._requests.splice(0, this._requests.length);
        this._clearTimeouts();
    }

    private _clearTimeouts() {
        var timeOuts = this._timeOuts;
        for (var i = 0; i < timeOuts.length; i++) {
            clearTimeout(timeOuts[i]);
        }
        timeOuts.splice(0, timeOuts.length);
    }
}

// Remove wijmo.grid mockup after DirectiveCellFactory has been loaded.
if (!gridModule) {
    (<any>window['wijmo']).grid = null;
}

/**
 * AngularJS directive for the {@link Column} object.
 *
 * The <b>wj-flex-grid-column</b> directive must be contained in a {@link wijmo.angular.grid.WjFlexGrid} directive.
 * It supports the following attributes:
 *
 * <dl class="dl-horizontal">
 *   <dt>aggregate</dt>         <dd><code>@</code> The {@link Aggregate} object to display in 
 *                              the group header rows for this column.</dd>
 *   <dt>align</dt>             <dd><code>@</code> The string value that sets the horizontal 
 *                              alignment of items in the column to left, right, or center.</dd>
 *   <dt>allow-dragging</dt>    <dd><code>@</code> The value indicating whether the user can move 
 *                              the column to a new position with the mouse.</dd>
 *   <dt>allow-sorting</dt>     <dd><code>@</code> The value indicating whether the user can sort 
 *                              the column by clicking its header.</dd>
 *   <dt>allow-resizing</dt>    <dd><code>@</code> The value indicating whether the user can 
 *                              resize the column with the mouse.</dd>
 *   <dt>allow-merging</dt>     <dd><code>@</code> The value indicating whether the user can merge 
 *                              cells in the column.</dd>
 *   <dt>binding</dt>           <dd><code>@</code> The name of the property to which the column is 
 *                              bound.</dd>
 *   <dt>css-class</dt>         <dd><code>@</code> The name of a CSS class to use when 
 *                              rendering the column.</dd>
 *   <dt>data-map</dt>          <dd><code>=</code> The {@link DataMap} object to use to convert raw  
 *                              values into display values for the column.</dd>
 *   <dt>data-type</dt>         <dd><code>@</code> The enumerated {@link DataType} value that indicates 
 *                              the type of value stored in the column.</dd>
 *   <dt>format</dt>            <dd><code>@</code> The format string to use to convert raw values 
 *                              into display values for the column (see {@link Globalize}).</dd>
 *   <dt>header</dt>            <dd><code>@</code> The string to display in the column header.</dd>
 *   <dt>input-type</dt>        <dd><code>@</code> The type attribute to specify the input element 
 *                              used to edit values in the column. The default is "tel" for numeric 
 *                              columns, and "text" for all other non-Boolean columns.</dd>
 *   <dt>is-content-html</dt>   <dd><code>@</code> The value indicating whether cells in the column 
 *                              contain HTML content rather than plain text.</dd>
 *   <dt>is-read-only</dt>      <dd><code>@</code> The value indicating whether the user is prevented 
 *                              from editing values in the column.</dd>
 *   <dt>is-selected</dt>       <dd><code>@</code> The value indicating whether the column is selected.</dd>
 *   <dt>mask</dt>              <dd><code>@</code> The mask string used to edit values in the 
 *                              column.</dd>
 *   <dt>max-width</dt>         <dd><code>@</code> The maximum width for the column.</dd>
 *   <dt>min-width</dt>         <dd><code>@</code> The minimum width for the column.</dd>
 *   <dt>name</dt>              <dd><code>@</code> The column name. You can use it to retrieve the 
 *                              column.</dd>
 *   <dt>is-required</dt>       <dd><code>@</code> The value indicating whether the column must contain 
 *                              non-null values.</dd>
 *   <dt>show-drop-down</dt>    <dd><code>@</code> The value indicating whether to show drop-down buttons 
 *                              for editing based on the column's {@link DataMap}.</dd>
 *   <dt>visible</dt>           <dd><code>@</code> The value indicating whether the column is visible.</dd>
 *   <dt>width</dt>             <dd><code>@</code> The width of the column in pixels or as a 
 *                              star value.</dd>
 *   <dt>word-wrap</dt>         <dd><code>@</code> The value indicating whether cells in the column wrap 
 *                              their content.</dd>
 * </dl>
 *
 * Any html content within the <b>wj-flex-grid-column</b> directive is treated as a template for the cells in that column. 
 * The template is applied only to regular cells. If you wish to apply templates to specific cell types such as 
 * column or group headers, then please see the {@link wijmo.angular.grid.WjFlexGridCellTemplate} directive.
 *
 * The following example creates two columns with a template and a conditional style:
 *
 * <a href="https://jsfiddle.net/Wijmo5/5L423/" target="_blank">Example</a>
 *
 * The <b>wj-flex-grid-column</b> directive may contain {@link wijmo.angular.grid.WjFlexGridCellTemplate} child directives.
 */
export class WjFlexGridColumn extends WjDirective {

    static _colTemplateProp = '$__wjColTemplate';
    static _colWjLinkProp = '$__wjLink';
    static _cellCtxProp = '$_cellCtxProp';

    _$compile: any/*ng.ICompileService*/;

    // Initializes a new instance of a WjGridColumn
    constructor($compile: any/*ng.ICompileService*/) {
        super();

        this._$compile = $compile;

        // The 'data-map' HTML attribute is converted to 'map' by Angular, so we give it the 'map' alias.
        this.scope["dataMap"] += "map";
        this.scope["dataType"] += "type";

        this.require = '^wjFlexGrid';

        this['terminal'] = true;
        // If Angular supports template definition via a function (available starting with ver. 1.1.4) then we utilize this
        // possibility, because this is the only entry point where we have an access to an unprocessed version of a column 
        // cell template with element level directives definitions in their original state.
        if (WjDirective._dynaTemplates) {
            // must be false, otherwise directive's subtree will no be available in the template function
            this.transclude = false;
            // should be less then at ng-repeat/ng-if etc (to let them take a control over a column directive creation), 
            // but bigger than at ordinal directives (like ng-style, to not allow them to evaluate during the column directive
            // linking).
            this['priority'] = 100;
            this.template = function (tElement, tAttrs) {
                // stores cell template definition, tAttrs is the only object that allows us to share a data
                // with the link function.
                tAttrs[WjFlexGridColumn._colTemplateProp] = tElement[0].innerHTML;
                return '<div class="wjGridColumn"/>';
            }
            // under old Angular work in the degraded mode without element level directives support, 
            // retrieve cell template in the link function where element level directives are already compiled.
        } else {
            this.transclude = true;
            this.template = '<div class="wjGridColumn" ng-transclude/>';
        }

    }

    get _controlConstructor() {
        return wijmo.grid.Column;
    }

    _initControl(element: any): any {
        return new wijmo.grid.Column();
    }

    _createLink(): WjLink {
        return new WjFlexGridColumnLink();
    }

}

interface _ICellTemplateContext {
    cellTemplate?: string;
    cellStyle?: string;
    cellClass?: string;
    cellLink?: any;
    templLink?: WjLink;
    cellOverflow?: string;
    forceFullEdit?: boolean;
    //editorAutoFocus: boolean;
    autoSizeRows?: boolean;
}

interface _ICellTemplateCache {
    column?: wijmo.grid.Column;
    cellScope?: any;
    clonedElement?: any;
}

class WjFlexGridColumnLink extends WjLink {

    public _initParent(): void {
        var grid = <wijmo.grid.FlexGrid>this.parent.control;
        if (grid.autoGenerateColumns) {
            grid.autoGenerateColumns = false;
            this._safeApply(this.scope, 'autoGenerateColumns', false);
            grid.columns.clear();
        }

        super._initParent();

        // Assign cell template defined without WjFlexGridCellTemplate tag if the latter was not specified.
        var cellCtxProp = WjFlexGridCellTemplate._getTemplContextProp(CellTemplateType.Cell),
            cellCtxByTag = this.control[cellCtxProp],
            cellCtxWoTag = this[WjFlexGridColumn._cellCtxProp];
        if (!cellCtxByTag && cellCtxWoTag) {
            this.control[cellCtxProp] = cellCtxWoTag;
        }

        this.control[WjFlexGridColumn._colWjLinkProp] = this;

    }

    public _link() {

        // get column template (HTML content)
        var rootEl = this.tElement[0],
            dynaTempl = this.tAttrs[WjFlexGridColumn._colTemplateProp],
            template = dynaTempl != null ? dynaTempl : WjDirective._removeTransclude(rootEl.innerHTML),
            cellTemplContext = <_ICellTemplateContext>{};
        if (!wijmo.isNullOrWhiteSpace(template)) {
            //this.control['cellTemplate'] = template;
            var templRoot = document.createElement('div');
            templRoot.innerHTML = template;
            var childElements = [];
            [].forEach.call(templRoot.children, function (value) {
                childElements.push(value);
            });
            var linkScope;
            for (var i = 0; i < childElements.length; i++) {
                var curTempl = <HTMLElement>childElements[i];
                if (curTempl.tagName.toLocaleLowerCase() === WjFlexGridCellTemplate._tagName) {
                    if (!linkScope) {
                        //linkScope = this.scope.$parent;
                        linkScope = this.scope.$parent.$new();
                    }
                    // remove cell template directive from cell's template
                    templRoot.removeChild(curTempl);

                    // compile and link cell template directive
                    rootEl.appendChild(curTempl);
                    (<WjFlexGridColumn>this.directive)._$compile(curTempl)(linkScope);
                }
            }

            var cleanCellTempl = templRoot.innerHTML;
            if (!wijmo.isNullOrWhiteSpace(cleanCellTempl)) {
                cellTemplContext.cellTemplate = cleanCellTempl;
            }

        }

        // get column style
        var style = this.tAttrs['ngStyle'],
            ngClass = this.tAttrs['ngClass'];
        if (style) {
            cellTemplContext.cellStyle = style;
        }
        if (ngClass) {
            cellTemplContext.cellClass = ngClass;
        }

        if (cellTemplContext.cellTemplate || cellTemplContext.cellStyle || cellTemplContext.cellClass) {
            cellTemplContext.templLink = this;
            this[WjFlexGridColumn._cellCtxProp] = cellTemplContext;
        }

        super._link();
    }

}

/**
 * Defines the type of cell to which the template applies.
 * This value is specified in the <b>cell-type</b> attribute
 * of the {@link wijmo.angular.grid.WjFlexGridCellTemplate} directive.
 */
export enum CellTemplateType {
    /** Defines a regular (data) cell. */
    Cell,
    /** Defines a cell in edit mode. */
    CellEdit,
    /** Defines a column header cell. */
    ColumnHeader,
    /** Defines a row header cell. */
    RowHeader,
    /** Defines a row header cell in edit mode. */
    RowHeaderEdit,
    /** Defines a top left cell. */
    TopLeft,
    /** Defines a group header cell in a group row. */
    GroupHeader,
    /** Defines a regular cell in a group row. */
    Group,
    /** Defines a column footer cell. */
    ColumnFooter,
    /** Defines a bottom left cell (at the intersection of the row header and column footer cells). **/
    BottomLeft
}

/**
 * AngularJS directive for the {@link FlexGrid} cell templates.
 *
 * The <b>wj-flex-grid-cell-template</b> directive defines a template for a certain 
 * cell type in {@link FlexGrid}, and must contain a <b>cell-type</b> attribute that 
 * specifies the {@link CellTemplateType}. Depending on the template's cell type, 
 * the <b>wj-flex-grid-cell-template</b> directive must be a child of either {@link wijmo.angular.grid.WjFlexGrid} 
 * or {@link wijmo.angular.grid.WjFlexGridColumn} directives.
 *
 * Column-specific cell templates must be contained in <b>wj-flex-grid-column</b>
 * directives, and cells that are not column-specific (like row header or top left cells)
 * must be contained in the <b>wj-flex-grid directive</b>.
 *
 * In addition to an HTML fragment, <b>wj-flex-grid-cell-template</b> directives may 
 * contain an <b>ng-style</b> or <b>ng-class</b> attribute that provides conditional formatting for cells.
 * 
 * Both the <b>ng-style/ng-class</b> attributes and the HTML fragment can use the <b>$col</b>, 
 * <b>$row</b> and <b>$item</b> template variables that refer to the {@link Column}, 
 * {@link Row} and <b>Row.dataItem</b> objects pertaining to the cell.
 *
 * For cell types like <b>Group</b> and <b>CellEdit</b>, an additional <b>$value</b> 
 * variable containing an unformatted cell value is provided. For example, here is a 
 * FlexGrid control with templates for row headers and for the Country column's regular
 * and column header cells:
 *
 * <pre>&lt;wj-flex-grid items-source="data"&gt;
 *   &lt;wj-flex-grid-cell-template cell-type="RowHeader"&gt;
 *     {&#8203;{$row.index}}
 *   &lt;/wj-flex-grid-cell-template&gt;
 *   &lt;wj-flex-grid-cell-template cell-type="RowHeaderEdit"&gt;
 *     ...
 *   &lt;/wj-flex-grid-cell-template&gt;
 * &nbsp;
 *   &lt;wj-flex-grid-column header="Country" binding="country"&gt;
 *     &lt;wj-flex-grid-cell-template cell-type="ColumnHeader"&gt;
 *       &lt;img ng-src="resources/globe.png" /&gt;
 *         {&#8203;{$col.header}}
 *       &lt;/wj-flex-grid-cell-template&gt;
 *       &lt;wj-flex-grid-cell-template cell-type="Cell"&gt;
 *         &lt;img ng-src="resources/{&#8203;{$item.country}}.png" /&gt;
 *         {&#8203;{$item.country}}
 *       &lt;/wj-flex-grid-cell-template&gt;
 *     &lt;/wj-flex-grid-column&gt;
 *   &lt;wj-flex-grid-column header="Sales" binding="sales"&gt;&lt;/wj-flex-grid-column&gt;
 * &lt;/wj-flex-grid&gt;</pre>
 *
 * For more detailed information on specific cell type templates refer to the 
 * documentation for the {@link CellTemplateType} enumeration.
 *
 * Note that the <b>wj-flex-grid-column</b> directive may also contain arbitrary content 
 * that is treated as a template for a regular data cell (<i>cell-type="Cell"</i>). But if
 * a <b>wj-flex-grid-cell-template</b> directive exists and is set to <i>cell-type="Cell"</i>
 * under the <b>wj-flex-grid-column</b> directive, it takes priority and overrides the
 * arbitrary content.
 *
 * The <b>wj-flex-grid-cell-template</b> directive supports the following attributes:
 *
 * <dl class="dl-horizontal">
 *   <dt>cell-type</dt>
 *   <dd><code>@</code>
 *     The {@link CellTemplateType} value defining the type of cell the template applies to.
 *   </dd>
 *   <dt>auto-size-rows</dt>
 *   <dd><code>@</code>
 *     Indicates whether the cell template will increase grid's default row height to accommodate
 *     cells content. Defaults to true.
 *   </dd>
 *   <dt>cell-overflow</dt>
 *   <dd><code>@</code>
 *     Defines the <b>style.overflow</b> property value for cells.
 *   </dd>
 *   <dt>force-full-edit</dt>
 *   <dd><code>@</code>
 *     For cell edit templates, indicates whether cell editing forcibly starts in full edit mode,
 *     regardless of how the editing was initiated. In full edit mode pressing cursor keys don't finish editing. 
 *     Defaults to true. 
 *   </dd>
 * </dl>
 *
 * The <b>cell-type</b> attribute takes any of the following enumerated values:
 *
 * <b>Cell</b>
 *
 * Defines a regular (data) cell template. Must be a child of the {@link wijmo.angular.grid.WjFlexGridColumn} directive.
 * For example, this cell template shows flags in the Country column's cells:
 *
 * <pre>&lt;wj-flex-grid-column header="Country" binding="country"&gt;
 *   &lt;wj-flex-grid-cell-template cell-type="Cell"&gt;
 *     &lt;img ng-src="resources/{&#8203;{$item.country}}.png" /&gt;
 *     {&#8203;{$item.country}}
 *   &lt;/wj-flex-grid-cell-template&gt;
 * &lt;/wj-flex-grid-column&gt;</pre>
 *
 * For a hierarchical {@link FlexGrid} (that is, one with the <b>childItemsPath</b> property 
 * specified), if no <b>Group</b> template is provided, non-header cells in group rows in 
 * this {@link Column} also use this template.
 *
 * <b>CellEdit</b>
 *
 * Defines a template for a cell in edit mode. Must be a child of the {@link wijmo.angular.grid.WjFlexGridColumn} directive. 
 * This cell type has an additional <b>$value</b> property available for binding. It contains the
 * original cell value before editing, and the updated value after editing.
 
    * For example, here is a template that uses the Wijmo {@link InputNumber} control as an editor
    * for the "Sales" column:
    *
    * <pre>&lt;wj-flex-grid-column header="Sales" binding="sales"&gt;
    *   &lt;wj-flex-grid-cell-template cell-type="CellEdit"&gt;
    *     &lt;wj-input-number value="$value" step="1"&gt;&lt;/wj-input-number&gt;
    *   &lt;/wj-flex-grid-cell-template&gt;
    * &lt;/wj-flex-grid-column&gt;</pre>
    *
    * <b>ColumnHeader</b>
    *
    * Defines a template for a column header cell. Must be a child of the {@link wijmo.angular.grid.WjFlexGridColumn} directive. 
    * For example, this template adds an image to the header of the "Country" column:
    *
    * <pre>&lt;wj-flex-grid-column header="Country" binding="country"&gt;
    *   &lt;wj-flex-grid-cell-template cell-type="ColumnHeader"&gt;
    *     &lt;img ng-src="resources/globe.png" /&gt;
    *     {&#8203;{$col.header}}
    *   &lt;/wj-flex-grid-cell-template&gt;
    * &lt;/wj-flex-grid-column&gt;</pre>
    *
    * <b>RowHeader</b>
    *
    * Defines a template for a row header cell. Must be a child of the {@link wijmo.angular.grid.WjFlexGrid} directive.
    * For example, this template shows row indices in the row headers:
    *
    * <pre>&lt;wj-flex-grid items-source="data"&gt;
    *   &lt;wj-flex-grid-cell-template cell-type="RowHeader"&gt;
    *     {&#8203;{$row.index}}
    *   &lt;/wj-flex-grid-cell-template&gt;
    * &lt;/wj-flex-grid&gt;</pre>
    *
    * Note that this template is applied to a row header cell, even if it is in a row that is 
    * in edit mode. In order to provide an edit-mode version of a row header cell with alternate 
    * content, define the <b>RowHeaderEdit</b> template.
    *
    * <b>RowHeaderEdit</b>
    *
    * Defines a template for a row header cell in edit mode. Must be a child of the 
    * {@link wijmo.angular.grid.WjFlexGrid} directive. For example, this template shows dots in the header
    * of rows being edited:
    *
    * <pre>&lt;wj-flex-grid items-source="data"&gt;
    *   &lt;wj-flex-grid-cell-template cell-type="RowHeaderEdit"&gt;
    *       ...
    *   &lt;/wj-flex-grid-cell-template&gt;
    * &lt;/wj-flex-grid&gt;</pre>
    *
    * To add the standard edit-mode indicator to cells where the <b>RowHeader</b> template 
    * applies, use the following <b>RowHeaderEdit</b> template:
    *
    * <pre>&lt;wj-flex-grid items-source="data"&gt;
    *   &lt;wj-flex-grid-cell-template cell-type="RowHeaderEdit"&gt;
    *     {&#8203;{&amp;#x270e;}}
    *   &lt;/wj-flex-grid-cell-template&gt;
    * &lt;/wj-flex-grid&gt;</pre>
    *
    * <b>TopLeft</b>
    *
    * Defines a template for the top left cell. Must be a child of the {@link wijmo.angular.grid.WjFlexGrid} directive. 
    * For example, this template shows a down/right glyph in the top-left cell of the grid:
    *
    * <pre>&lt;wj-flex-grid items-source="data"&gt;
    *   &lt;wj-flex-grid-cell-template cell-type="TopLeft"&gt;
    *     &lt;span class="wj-glyph-down-right"&gt;&lt;/span&gt;
    *   &lt;/wj-flex-grid-cell-template&gt;
    * &lt;/wj-flex-grid&gt;</pre>
    *
    * <p><b>GroupHeader</b></p>
    *
    * Defines a template for a group header cell in a {@link GroupRow}, Must be a child of the {@link wijmo.angular.grid.WjFlexGridColumn} directive.
    *
    * The <b>$row</b> variable contains an instance of the <b>GroupRow</b> class. If the grouping comes 
    * from the a {@link CollectionView}, the <b>$item</b> variable references the {@link CollectionViewGroup} object.
    *
    * For example, this template uses a checkbox element as an expand/collapse toggle:
    *
    * <pre>&lt;wj-flex-grid-column header="Country" binding="country"&gt;
    *   &lt;wj-flex-grid-cell-template cell-type="GroupHeader"&gt;
    *     &lt;input type="checkbox" ng-model="$row.isCollapsed"/&gt; 
    *     {&#8203;{$item.name}} ({&#8203;{$item.items.length}} items)
    *   &lt;/wj-flex-grid-cell-template&gt;
    * &lt;/wj-flex-grid-column&gt;</pre>
    *
    * <b>Group</b>
    *
    * Defines a template for a regular cell (not a group header) in a {@link GroupRow}. Must be a child of the 
    * {@link wijmo.angular.grid.WjFlexGridColumn} directive. This cell type has an additional <b>$value</b> varible available for 
    * binding. In cases where columns have the <b>aggregate</b> property specified, it contains the unformatted 
    * aggregate value.
    *
    * For example, this template shows an aggregate's value and kind for group row cells in the "Sales"
    * column:
    *
    * <pre>&lt;wj-flex-grid-column header="Sales" binding="sales" aggregate="Avg"&gt;
    *   &lt;wj-flex-grid-cell-template cell-type="Group"&gt;
    *     Average: {&#8203;{$value | number:2}}
    *   &lt;/wj-flex-grid-cell-template&gt;
    * &lt;/wj-flex-grid-column&gt;</pre>
*
* <b>ColumnFooter</b>
*
* Defines a template for a regular cell in a <b>columnFooters</b> panel. Must be a child of the
* {@link wijmo.angular.grid.WjFlexGridColumn} directive. This cell type has an additional <b>$value</b>
* property available for binding that contains a cell value.
*
* For example, this template shows aggregate's value and kind for a footer cell in the "Sales"
* column:
*
* <pre>&lt;wj-flex-grid-column header="Sales" binding="sales" aggregate="Avg"&gt;
*   &lt;wj-flex-grid-cell-template cell-type="ColumnFooter"&gt;
*     Average: {&#8203;{$value | number:2}}
*   &lt;/wj-flex-grid-cell-template&gt;
* &lt;/wj-flex-grid-column&gt;</pre>
*
* <b>BottomLeft</b>
*
* Defines a template for the bottom left cells (at the intersection of the row header and column footer cells).
* Must be a child of the {@link wijmo.angular.grid.WjFlexGrid} directive.
* For example, this template shows a sigma glyph in the bottom-left cell of the grid:
*
* <pre>&lt;wj-flex-grid items-source="data"&gt;
*   &lt;wj-flex-grid-cell-template cell-type="BottomLeft"&gt;
*    &amp;#931;
*   &lt;/wj-flex-grid-cell-template&gt;
* &lt;/wj-flex-grid&gt;</pre>
    */
export class WjFlexGridCellTemplate extends WjDirective {

    static _tagName = 'wj-flex-grid-cell-template';

    // returns the name of the property on control instance that stores info for the specified cell template type.
    static _getTemplContextProp(templateType: CellTemplateType) {
        return '$__cellTempl' + CellTemplateType[templateType];
    }

    constructor() {
        super();

        this.require = ['?^wjFlexGridColumn', '?^wjFlexGrid'];

        // The same approach like in WjFlexGridColumn
        this['terminal'] = true;
        if (WjDirective._dynaTemplates) {
            this.transclude = false;
            this['priority'] = 100;
            this.template = function (tElement, tAttrs) {
                tAttrs[WjFlexGridColumn._colTemplateProp] = tElement[0].innerHTML;
                return '<div />';
            }
        } else {
            this.transclude = true;
            this.template = '<div ng-transclude/>';
        }
    }

    _initControl(element: any): any {
        return {};
    }

    _createLink(): WjLink {
        return new WjFlexGridCellTemplateLink();
    }

    _getMetaDataId(): any {
        return 'FlexGridCellTemplate';
    }

}

class WjFlexGridCellTemplateLink extends WjLink {

    public _initParent(): void {
        super._initParent();

        var cts: string = this.scope['cellType'],
            cellType: CellTemplateType;
        if (cts) {
            cellType = CellTemplateType[cts];
        } else {
            return;
        }

        // get column template (HTML content)
        var dynaTempl = this.tAttrs[WjFlexGridColumn._colTemplateProp],
            template = dynaTempl != null ? dynaTempl : WjDirective._removeTransclude(this.tElement[0].innerHTML),
            control = <_ICellTemplateContext>this.control;
        if (!wijmo.isNullOrWhiteSpace(template)) {
            control.cellTemplate = template;
        }

        // get column style
        var style = this.tAttrs['ngStyle'],
            ngClass = this.tAttrs['ngClass'];
            //editorAutoFocus = this.tAttrs['editorAutoFocus'];
        if (style) {
            control.cellStyle = style;
        }
        if (ngClass) {
            control.cellClass = ngClass;
        }
        if (!this.tAttrs['forceFullEdit']) {
            control.forceFullEdit = true;
        }
        let autoSizeRows = this.tAttrs['autoSizeRows'];
        control.autoSizeRows = autoSizeRows == null || autoSizeRows === 'true';
        //control.editorAutoFocus = editorAutoFocus
        //    ? wijmo.changeType(editorAutoFocus, wijmo.DataType.Boolean, '') :
        //    true;

        if (control.cellTemplate || control.cellStyle || control.cellClass) {
            control.templLink = this;
            let parentCtrl = this.parent.control;
            parentCtrl[WjFlexGridCellTemplate._getTemplContextProp(cellType)] = control;
            if (parentCtrl instanceof wijmo.grid.Column) {
                // TBD: set to false when removed
                parentCtrl._setFlag(wijmo.grid.RowColFlags.HasTemplate, true);
            }
        }

        WjFlexGridCellTemplateLink._invalidateGrid(this.parent.control);
    }

    public _destroy() {
        var parentControl = this.parent && this.parent.control,
            cts: string = this.scope['cellType'];
        super._destroy();
        if (cts) {
            parentControl[WjFlexGridCellTemplate._getTemplContextProp(CellTemplateType[cts])] = undefined;
            WjFlexGridCellTemplateLink._invalidateGrid(parentControl);
        }
    }

    private static _invalidateGrid(parentControl: wijmo.Control) {
        var grid = parentControl;
        if (grid) {
            if (grid instanceof wijmo.grid.Column) {
                grid = (<wijmo.grid.Column><any>grid).grid;
            }
            if (grid) {
                grid.invalidate();
            }
        }
    }


}


//#endregion "Grid directives classes"

    }
    


    module wijmo.angular {
    

    }
    

    module wijmo.angular {
    


var wjNg: any = window['angular'];




const wijmoGridDetailName = 'wj.grid.detail';


// do not use moduleName here, it's removed from the global module version
var wijmoGridDetail = _registerNgModule(wijmoGridDetailName);

if (softRefGridDetail()) {
    wijmoGridDetail.directive('wjFlexGridDetail', ['$compile', function ($compile) {
        return new WjFlexGridDetail($compile);
    }]);
}

/**
 * AngularJS directive for {@link FlexGrid} {@link DetailRow} templates.
 *
 * The <b>wj-flex-grid-detail</b> directive must be contained in a 
 * <b>wj-flex-grid</b> directive.
 *
 * The <b>wj-flex-grid-detail</b> directive represents a {@link FlexGridDetailProvider}
 * object that maintains detail rows visibility, with detail rows content defined as
 * an arbitrary HTML fragment within the directive tag. The fragment may contain 
 * AngularJS bindings and directives. 
 * In addition to any properties available in a controller, the local <b>$row</b> and 
 * <b>$item</b> template variables can be used in AngularJS bindings that refer to 
 * the detail row's parent {@link Row} and <b>Row.dataItem</b> objects. For example:
 * 
 * <pre>&lt;p&gt;Here is a detail row with a nested FlexGrid:&lt;/p&gt;
 * &nbsp;
 * &lt;wj-flex-grid 
 *   items-source="categories"&gt;
 *   &lt;wj-flex-grid-column header="Name" binding="CategoryName"&gt;&lt;/wj-flex-grid-column&gt;
 *   &lt;wj-flex-grid-column header="Description" binding="Description" width="*"&gt;&lt;/wj-flex-grid-column&gt;
 *   &lt;wj-flex-grid-detail max-height="250" detail-visibility-mode="detailMode"&gt;
 *     &lt;wj-flex-grid 
 *       items-source="getProducts($item.CategoryID)"
 *       headers-visibility="Column"&gt;
 *     &lt;/wj-flex-grid&gt;
 *   &lt;/wj-flex-grid-detail&gt;
 * &lt;/wj-flex-grid&gt;</pre>
 *
 * A reference to a <b>FlexGridDetailProvider</b> object represented by the 
 * <b>wj-flex-grid-detail</b> directive can be retrieved in a usual way by binding
 * to the directive's <b>control</b> property. This makes all the API provided by 
 * <b>FlexGridDetailProvider</b> available for usage in the template, giving you total 
 * control over the user experience. The following example adds a custom show/hide toggle 
 * to the Name column cells, and a Hide Detail button to the detail row. These elements call 
 * the <b>FlexGridDetailProvider</b>, <b>hideDetail</b> and <b>showDetail</b> methods in 
 * their <b>ng-click</b> bindings to implement the custom show/hide logic:
 * 
 * <pre>&lt;p&gt;Here is a FlexGrid with custom show/hide detail elements:&lt;/p&gt;
 * &nbsp;
 * &lt;wj-flex-grid 
 *   items-source="categories"
 *   headers-visibility="Column"
 *   selection-mode="Row"&gt;
 *   &lt;wj-flex-grid-column header="Name" binding="CategoryName" is-read-only="true" width="200"&gt;
 *     &lt;img ng-show="dp.isDetailVisible($row)" ng-click="dp.hideDetail($row)" src="resources/hide.png" /&gt;
 *     &lt;img ng-hide="dp.isDetailVisible($row)" ng-click="dp.showDetail($row, true)" src="resources/show.png" /&gt;
 *     {&#8203;{$item.CategoryName}}
 *   &lt;/wj-flex-grid-column&gt;
 *   &lt;wj-flex-grid-column header="Description" binding="Description" width="2*"&gt;&lt;/wj-flex-grid-column&gt;
 *   &lt;wj-flex-grid-detail control="dp" detail-visibility-mode="Code"&gt;
 *     &lt;div style="padding:12px;background-color:#cee6f7"&gt;
 *       ID: &lt;b&gt;{&#8203;{$item.CategoryID}}&lt;/b&gt;&lt;br /&gt;
 *       Name: &lt;b&gt;{&#8203;{$item.CategoryName}}&lt;/b&gt;&lt;br /&gt;
 *       Description: &lt;b&gt;{&#8203;{$item.Description}}&lt;/b&gt;&lt;br /&gt;
 *       &lt;button class="btn btn-default" ng-click="dp.hideDetail($row)"&gt;Hide Detail&lt;/button&gt;
 *     &lt;/div&gt;
 *   &lt;/wj-flex-grid-detail&gt;
 * &lt;/wj-flex-grid&gt;</pre>
 * 
 * The <b>wj-flex-grid-detail</b> directive supports the following attributes:
 *
 * <dl class="dl-horizontal">
 *   <dt>control</dt>                <dd><code>=</code> A reference to the {@link FlexGridDetailProvider} object 
 *                                   created by this directive.</dd>
 *   <dt>detail-visibility-mode</dt> <dd><code>@</code>A {@link DetailVisibilityMode} value that determines when 
 *                                   to display the row details.</dd>
 *   <dt>max-height</dt>             <dd><code>@</code>The maximum height of the detail rows, in pixels.</dd>
 *   <dt>row-has-detail</dt>         <dd><code>=</code>The callback function that determines whether a row 
 *                                       has details.</dd>
 * </dl>
 *
 */
export class WjFlexGridDetail extends WjDirective {

    static _detailTemplateProp = '$__wjDetailTemplate';
    static _detailScopeProp = '$_detailScope';

    _$compile: any/*ng.ICompileService*/;

    constructor($compile: any/*ng.ICompileService*/) {
        super();
        this._$compile = $compile;
        this.require = '^wjFlexGrid';

        // The same approach like in WjFlexGridColumn
        this['terminal'] = true;
        if (WjDirective._dynaTemplates) {
            this.transclude = false;
            this['priority'] = 100;
            this.template = function (tElement, tAttrs) {
                tAttrs[WjFlexGridDetail._detailTemplateProp] = tElement[0].innerHTML;
                return '<div />';
            }
        } else {
            this.transclude = true;
            this.template = '<div ng-transclude/>';
        }
    }

    get _controlConstructor() {
        return wijmo.grid.detail.FlexGridDetailProvider;
    }

    _createLink(): WjLink {
        return new WjFlexGridDetailLink();
    }
}

class WjFlexGridDetailLink extends WjLink {

    itemTemplate: string;

    private _tmplLink;

    public _initParent(): void {
        super._initParent();

        // get column template (HTML content)
        var self = this,
            dynaTempl = this.tAttrs[WjFlexGridDetail._detailTemplateProp],
            dp = <wijmo.grid.detail.FlexGridDetailProvider>this.control;
        this.itemTemplate = this._getCellTemplate(dynaTempl != null ? dynaTempl :
            WjDirective._removeTransclude(this.tElement[0].innerHTML));
        var tpl = this._getCellTemplate(this.itemTemplate);
        this._tmplLink = (<WjFlexGridDetail>this.directive)._$compile('<div>' + tpl + '</div>');

        // show detail when asked to
        dp.createDetailCell = function (row, col) {
            // create detail row scope and link it
            var cellScope = self._getCellScope(self.scope.$parent, row, col),
                clonedElement = self._tmplLink(cellScope, function (clonedEl, scope) { })[0];
            clonedElement[WjDirective._elemScopeProp] = cellScope;
            // add the linked tree to the DOM tree, in order to get correct height in FlexGridDetailProvider's formatItem
            dp.grid.hostElement.appendChild(clonedElement);

            // apply the cell scope
            if (cellScope.$root && !cellScope.$root.$$phase) {
                cellScope.$apply();
            }

            // remove cell element from the DOM tree and return it to caller
            clonedElement.parentElement.removeChild(clonedElement);
            return clonedElement;
        }

        // dispose detail scope when asked to
        dp.disposeDetailCell = function (row: wijmo.grid.detail.DetailRow) {
            if (row.detail) {
                // can't use scope() with disabled debugging
                //window['angular'].element(row.detail).scope().$destroy();
                let scope = row.detail[WjDirective._elemScopeProp];
                if (scope) {
                    scope.$destroy();
                }
            }
        }

        if (this.parent._isInitialized && this.control) {
            this.control.invalidate();
        }
    }

    public _destroy() {
        var ownerControl = this.parent && this.parent.control,
            dp = <wijmo.grid.detail.FlexGridDetailProvider>this.control;
        dp.createDetailCell = null;
        dp.disposeDetailCell = null;
        super._destroy();
        this._tmplLink = null;
        if (ownerControl) {
            ownerControl.invalidate();
        }
    }

    // helper functions
    private _getCellScope(parentScope, row, col) {
        var ret = parentScope.$new();
        ret.$row = row;
        ret.$col = col;
        ret.$item = row.dataItem;
        return ret;
    }
    private _getCellTemplate(tpl) {
        if (tpl) {
            tpl = tpl.replace(/ng\-style/g, 'style');
            tpl = tpl.replace(/ class\=\"ng\-scope\"( \"ng\-binding\")?/g, '');
            tpl = tpl.replace(/<span>\s*<\/span>/g, '');
        }
        return tpl;
    }
}



    }
    


    module wijmo.angular {
    

    }
    

    module wijmo.angular {
    


var wjNg: any = window['angular'];




const wijmoGridFilterName = 'wj.grid.filter';


// do not use moduleName here, it's removed from the global module version
var wijmoGridFilter = _registerNgModule(wijmoGridFilterName);

if (softRefGridFilter()) {
    wijmoGridFilter.directive('wjFlexGridFilter', [function () {
        return new WjFlexGridFilter();
    }]);
}

/**
 * AngularJS directive for the {@link FlexGridFilter} object.
 *
 * The <b>wj-flex-grid-filter</b> directive must be contained in a {@link wijmo.angular.grid.WjFlexGrid} directive. For example:
 *
 * <pre>&lt;p&gt;Here is a FlexGrid control with column filters:&lt;/p&gt;
 * &lt;wj-flex-grid items-source="data"&gt;
 *   &lt;wj-flex-grid-filter filter-columns="['country', 'expenses']"&gt;&lt;/wj-flex-grid-filter&gt;
 * &nbsp;
 *   &lt;wj-flex-grid-column 
 *     header="Country" 
 *     binding="country"&gt;
 *   &lt;/wj-flex-grid-column&gt;
 *   &lt;wj-flex-grid-column 
 *     header="Sales" 
 *     binding="sales"&gt;
 *   &lt;/wj-flex-grid-column&gt;
 *   &lt;wj-flex-grid-column 
 *     header="Expenses" 
 *     binding="expenses"&gt;
 *   &lt;/wj-flex-grid-column&gt;
 *   &lt;wj-flex-grid-column 
 *     header="Downloads" 
 *     binding="downloads"&gt;
 *   &lt;/wj-flex-grid-column&gt;
 *  &lt;/wj-flex-grid&gt;</pre>
 *
 * The <b>wj-flex-grid-filter</b> directive supports the following attributes:
 *
 * <dl class="dl-horizontal">
 *   <dt>filter-columns</dt>    <dd><code>=</code> An array containing the names or bindings of the columns
 *                              to filter.</dd>
 *   <dt>show-filter-icons</dt> <dd><code>@</code>  The value indicating whether filter editing buttons 
 *                              appear in the grid's column headers.</dd>
 *   <dt>filter-changing</dt>   <dd><code>&</code> Handler for the {@link FlexGridFilter.filterChanging} event.</dd>
 *   <dt>filter-changed</dt>    <dd><code>&</code> Handler for the {@link FlexGridFilter.filterChanged} event.</dd>
 *   <dt>filter-applied</dt>    <dd><code>&</code> Handler for the {@link FlexGridFilter.filterApplied} event.</dd>
 * </dl>
 */
export class WjFlexGridFilter extends WjDirective {

    // Initializes a new instance of a WjGridColumn
    constructor() {
        super();

        this.require = '^wjFlexGrid';
        //this.transclude = true;
        this.template = '<div />';
    }

    get _controlConstructor() {
        return wijmo.grid.filter.FlexGridFilter;
    }

}


    }
    


    module wijmo.angular {
    

    }
    

    module wijmo.angular {
    


var wjNg: any = window['angular'];




const wijmoGridGroupName = 'wj.grid.grouppanel';


// do not use moduleName here, it's removed from the global module version
var wijmoGridGroup = _registerNgModule(wijmoGridGroupName);

if (softRefGridGrouppanel()) {
    wijmoGridGroup.directive('wjGroupPanel', [function () {
        return new WjGroupPanel();
    }]);
}


/**
 * AngularJS directive for the {@link GroupPanel} control.
 *
 * The <b>wj-group-panel</b> directive connects to the <b>FlexGrid</b> control via the <b>grid</b> property. 
 * For example:
 *
 * <pre>&lt;p&gt;Here is a FlexGrid control with GroupPanel:&lt;/p&gt;
 * &nbsp;
 * &lt;wj-group-panel grid="flex" placeholder="Drag columns here to create groups."&gt;&lt;/wj-group-panel&gt;
 * &nbsp;
 * &lt;wj-flex-grid control="flex" items-source="data"&gt;
 *   &lt;wj-flex-grid-column 
 *     header="Country" 
 *     binding="country"&gt;
 *   &lt;/wj-flex-grid-column&gt;
 *   &lt;wj-flex-grid-column 
 *     header="Sales" 
 *     binding="sales"&gt;
 *   &lt;/wj-flex-grid-column&gt;
 *   &lt;wj-flex-grid-column 
 *     header="Expenses" 
 *     binding="expenses"&gt;
 *   &lt;/wj-flex-grid-column&gt;
 *   &lt;wj-flex-grid-column 
 *     header="Downloads" 
 *     binding="downloads"&gt;
 *   &lt;/wj-flex-grid-column&gt;
 * &lt;/wj-flex-grid&gt;</pre>
 *
 * The <b>wj-group-panel</b> directive supports the following attributes:
 *
 * <dl class="dl-horizontal">
 *   <dt>grid</dt>                      <dd><code>@</code>The <b>FlexGrid</b> that is connected to this <b>GroupPanel</b>.</dd>
 *   <dt>hide-grouped-columns</dt>      <dd><code>@</code>A value indicating whether the panel hides grouped columns 
 *                                      in the owner grid.</dd>
 *   <dt>max-groups</dt>                <dd><code>@</code>The maximum number of groups allowed.</dd>
 *   <dt>placeholder</dt>               <dd><code>@</code>A string to display in the control when it 
 *                                      contains no groups.</dd>
 *   <dt>got-focus</dt>                 <dd><code>&</code> Handler for the {@link GroupPanel.gotFocus} event.</dd>
 *   <dt>lost-focus</dt>                <dd><code>&</code> Handler for the {@link GroupPanel.lostFocus} event.</dd>
 * </dl>
 *
 */
export class WjGroupPanel extends WjDirective {

    get _controlConstructor() {
        return wijmo.grid.grouppanel.GroupPanel;
    }

}


    }
    


    module wijmo.angular {
    

    }
    

    module wijmo.angular {
    


var wjNg: any = window['angular'];





const wijmoGridMultirowName = 'wj.grid.multirow';


// do not use moduleName here, it's removed from the global module version
var wijmoGridMultirow = _registerNgModule(wijmoGridMultirowName);

if (softRefGridMultirow()) {
    wijmoGridMultirow.directive('wjMultiRow', ['$compile', '$interpolate', function ($compile, $interpolate) {
        return new WjMultiRow($compile, $interpolate);
    }]);
}

/**
 * AngularJS directive for the {@link MultiRow} control.
 *
 * Use the <b>wj-multi-row</b> directive to add <b>MultiRow</b> controls to your AngularJS applications.
 * Note that directive and parameter names must be formatted as lower-case with dashes 
 * instead of camel-case.
 * 
 * The <b>wj-multi-row</b> directive extends {@link wijmo.angular.grid.WjFlexGrid} with the following attributes:
 * 
 * <dl class="dl-horizontal">
 *   <dt>control</dt>                    <dd><code>=</code> A reference to the {@link MultiRow} control created by this directive.</dd>
 *   <dt>layout-definition</dt>          <dd><code>@</code> A value defines the layout of the rows used to display each data item.</dd>
 *   <dt>collapsed-headers</dt>          <dd><code>@</code> Gets or sets a value that determines whether column headers should be
 *                                       collapsed and displayed as a single row displaying the group headers.</dd>
 *   <dt>center-headers-vertically</dt>  <dd><code>@</code> Gets or sets a value that determines whether the content of cells
 *                                       that span multiple rows should be vertically centered.</dd>
 *   <dt>show-header-collapse-button</dt><dd><code>@</code> Gets or sets a value that determines whether the grid should
 *                                       display a button in the column header panel to allow users to collapse and expand the column headers.</dd>
 * </dl>
 */
export class WjMultiRow extends WjFlexGrid {
    constructor($compile: any/*ng.ICompileService*/, $interpolate: any/*ng.IInterpolateService*/) {
        super($compile, $interpolate);
    }

    // Gets the Wijmo MultiRow control constructor
    get _controlConstructor() {
        return wijmo.grid.multirow.MultiRow;
    }
}

    }
    


    module wijmo.angular {
    

    }
    

    module wijmo.angular {
    


var wjNg: any = window['angular'];





const wijmoGridSheetName = 'wj.grid.sheet';


// do not use moduleName here, it's removed from the global module version
var wijmoGridSheet = _registerNgModule(wijmoGridSheetName);

if (softRefGridSheet()) {
    wijmoGridSheet.directive('wjFlexSheet', ['$compile', '$interpolate', function ($compile, $interpolate) {
        return new WjFlexSheet($compile, $interpolate);
    }]);

    wijmoGridSheet.directive('wjSheet', [function () {
        return new WjSheet();
    }]);
}


/**
 * AngularJS directive for the {@link FlexSheet} control.
 *
 * Use the <b>wj-flex-sheet</b> directive to add <b>FlexSheet</b> controls to your AngularJS applications. 
 * Note that directive and parameter names must be formatted as lower-case with dashes 
 * instead of camel-case. For example:
 * 
 * <pre>&lt;p&gt;Here is a FlexSheet control with one bound and two unbound sheets:&lt;/p&gt;
 * &lt;wj-flex-sheet&gt;
 *    &lt;wj-sheet name="Country" items-source="ctx.data"&gt;&lt;/wj-sheet&gt;
 *    &lt;wj-sheet name="Report" row-count="25" column-count="13"&gt;&lt;/wj-sheet&gt;
 *    &lt;wj-sheet name="Formulas" row-count="310" column-count="10"&gt;&lt;/wj-sheet&gt;
 * &lt;/wj-flex-sheet&gt;</pre>
 *
 * The <b>wj-flex-sheet</b> directive extends {@link wijmo.angular.grid.WjFlexGrid} with the following attributes:
 * 
 * <dl class="dl-horizontal">
 *   <dt>control</dt>                   <dd><code>=</code> A reference to the {@link FlexSheet} control created by this directive.</dd>
 *   <dt>is-tab-holder-visible</dt>     <dd><code>@</code> A value indicating whether the sheet tabs holder is visible. </dd>
 *   <dt>selected-sheet-index</dt>      <dd><code>=</code> Gets or sets the index of the current sheet in the {@link FlexSheet}. </dd>
 *   <dt>dragging-row-column</dt>       <dd><code>&</code> Handler for the {@link FlexSheet.draggingRowColumn} event.</dd>
 *   <dt>dropping-row-column</dt>       <dd><code>&</code> Handler for the {@link FlexSheet.droppingRowColumn} event.</dd>
 *   <dt>selected-sheet-changed</dt>    <dd><code>&</code> Handler for the {@link FlexSheet.selectedSheetChanged} event.</dd>
 * </dl>
 *
 * The <b>wj-flex-sheet</b> directive may contain {@link wijmo.angular.grid.sheet.WjSheet} child directives.
 */
class WjFlexSheet extends WjFlexGrid {
    constructor($compile: any/*ng.ICompileService*/, $interpolate: any/*ng.IInterpolateService*/) {
        super($compile, $interpolate);
    }

    // Gets the Wijmo FlexSheet control constructor
    get _controlConstructor() {
        return wijmo.grid.sheet.FlexSheet;
    }
}

/**
 * AngularJS directive for the {@link Sheet} object.
 *
 * The <b>wj-sheet</b> directive must be contained in a {@link wijmo.angular.grid.sheet.WjFlexSheet} directive.
 * It supports the following attributes:
 *
 * <dl class="dl-horizontal">
 *   <dt>name</dt>               <dd><code>@</code> The name of the sheet. 
 *   <dt>row-count</dt>          <dd><code>@</code> The initial number of rows in the unbound sheet.
 *                               Changes done to this attribute have no effect after the {@link Sheet} was initialized by AngularJS.
 *   <dt>column-count</dt>       <dd><code>@</code> The initial number of columns in the unbound sheet.
 *                               Changes done to this attribute have no effect after the {@link Sheet} was initialized by AngularJS.
 *   <dt>items-source</dt>       <dd><code>=</code> The data source for the data bound sheet.
 *                               Changes done to this attribute have no effect after the {@link Sheet} was initialized by AngularJS.
 *   <dt>visible</dt>            <dd><code>@</code> A value indicating whether the sheet is visible.
 *   <dt>name-changed</dt>       <dd><code>&</code> Handler for the {@link Sheet.nameChanged} event.</dd>
 * </dl>
 */
class WjSheet extends WjDirective {
    constructor() {
        super();
        this.require = '^wjFlexSheet';
    }

    get _controlConstructor() {
        return wijmo.grid.sheet.Sheet;
    }

    _initControl(element: any): any {
        return super._initControl(undefined);
    }
}


    }
    


    module wijmo.angular {
    

    }
    

    module wijmo.angular {
    


var wjNg: any = window['angular'];





const wijmoOlapName = 'wj.olap';


// do not use moduleName here, it's removed from the global module version
var wijmoOlap = _registerNgModule(wijmoOlapName);
//var wijmoOlap = window['angular'].module('wj.olap', ['wj.grid', 'wj.chart']);


// register only if module is loaded
if (softRefOlap() && softRefOlap().PivotGrid) {

    wijmoOlap.directive('wjPivotGrid', ['$compile', '$interpolate', function ($compile, $interpolate) {
        return new WjPivotGrid($compile, $interpolate);
    }]);

    wijmoOlap.directive('wjPivotChart', [function () {
        return new WjPivotChart();
    }]);

    wijmoOlap.directive('wjPivotPanel', [function () {
        return new WjPivotPanel();
    }]);

    wijmoOlap.directive('wjSlicer', [function () {
        return new WjSlicer();
    }]);

    //wijmoOlap.directive('wjPivotField', [function () {
    //    return new WjPivotField();
    //}]);
}

/**
 * AngularJS directive for the {@link PivotGrid} control.
 *
 * Use the <b>wj-pivot-grid</b> and <b>wj-pivot-panel</b> directives
 * to add pivot tables to your AngularJS applications.
 *
 * Directive and parameter names must be formatted as lower-case with dashes 
 * instead of camel-case. For example:
 * 
 * <pre>&lt;wj-pivot-panel
 *     control="thePanel"
 *     items-source="rawData"&gt;
 * &lt;/wj-pivot-panel&gt;
 * &lt;wj-pivot-grid
 *     items-source="thePanel"
 *     show-detail-on-double-click="false"
 *     custom-context-menu="true"&gt;
 * &lt;/wj-pivot-grid&gt;</pre>
 *
 * The <b>wj-pivot-grid</b> directive extends the <b>wj-flex-grid</b> directive 
 * and adds support for the following attributes:
 * 
 * <dl class="dl-horizontal">
 *   <dt>items-source</dt>                  <dd>Gets or sets the {@link PivotPanel} that defines the view
 *                                              displayed by this {@link PivotGrid}.</dd>
 *   <dt>show-detail-on-double-click</dt>   <dd>Gets or sets whether the grid should show a popup containing the 
 *                                              detail records when the user double-clicks a cell.</dd>
 *   <dt>custom-context-menu</dt>           <dd>Gets or sets whether the grid should provide a custom context menu
 *                                              with commands for changing field settings and showing detail records.</dd>
 *   <dt>collapsible-subtotals</dt>         <dd>Gets or sets whether the grid should allow users to collapse and 
 *                                              expand subtotal groups of rows and columns.</dd>
 *   <dt>center-headers-vertically</dt>     <dd>Gets or sets whether the content of header cells should be vertically centered.</dd>
 * </dl>
 */
export class WjPivotGrid extends WjFlexGrid {
    constructor($compile: any/*ng.ICompileService*/, $interpolate: any/*ng.IInterpolateService*/) {
        super($compile, $interpolate);
    }

    get _controlConstructor() {
        return wijmo.olap.PivotGrid;
    }
}

/**
 * AngularJS directive for the {@link PivotChart} control.
 *
 * Use the <b>wj-pivot-chart</b> and <b>wj-pivot-panel</b> directives
 * to add pivot charts to your AngularJS applications.
 *
 * Directive and parameter names must be formatted as lower-case with dashes 
 * instead of camel-case. For example:
 * 
 * <pre>&lt;wj-pivot-panel
 *     control="thePanel"
 *     items-source="rawData"&gt;
 * &lt;/wj-pivot-panel&gt;
 * &lt;wj-pivot-chart
 *     items-source="thePanel"
 *     chart-type="Bar"
 *     max-series="10"
 *     max-points="100"&gt;
 * &lt;/wj-pivot-chart&gt;</pre>
 *
 * The <b>wj-pivot-chart</b> directive supports the following attributes:
 * 
 * <dl class="dl-horizontal">
 *   <dt>items-source</dt>                  <dd>Gets or sets the {@link PivotPanel} that defines the view
 *                                              displayed by this {@link PivotChart}.</dd>
 *   <dt>chart-type</dt>                    <dd>Gets or sets a {@link PivotChartType} value that defines
 *                                              the type of chart to display.</dd>
 *   <dt>show-hierarchical-axes</dt>        <dd>Gets or sets whether the chart should group axis annotations for grouped data.</dd>
 *   <dt>stacking</dt>                      <dd>Gets or sets a {@link Stacking} value that determines whether and how the series 
 *                                              objects are stacked.</dd>
 *   <dt>show-totals</dt>                   <dd>Gets or sets a whether the chart should include only totals.</dd>
 *   <dt>max-series</dt>                    <dd>Gets or sets the maximum number of data series to be shown in the chart.</dd>
 *   <dt>max-points</dt>                    <dd>Gets or sets the maximum number of points to be shown in each series.</dd>
 * </dl>
 */
export class WjPivotChart extends WjDirective {
    get _controlConstructor() {
        return wijmo.olap.PivotChart;
    }
}

/**
 * AngularJS directive for the {@link PivotPanel} control.
 *
 * Use the <b>wj-pivot-panel</b> directive as a data source for
 * <b>wj-pivot-grid</b> and <b>wj-pivot-chart</b> directives
 * to add pivot tables and charts to your AngularJS applications.
 *
 * Directive and parameter names must be formatted as lower-case with dashes 
 * instead of camel-case. For example:
 * 
 * <pre>&lt;wj-pivot-panel
 *     control="thePanel"
 *     items-source="rawData"&gt;
 * &lt;/wj-pivot-panel&gt;
 * &lt;wj-pivot-grid
 *     items-source="thePanel"
 *     show-detail-on-double-click="false"
 *     custom-context-menu="true"&gt;
 * &lt;/wj-pivot-grid&gt;</pre>
 *
 * The <b>wj-pivot-panel</b> directive supports the following attributes:
 * 
 * <dl class="dl-horizontal">
 *   <dt>items-source</dt>                  <dd>Gets or sets the raw data used to generate pivot views.</dd>
 *   <dt>auto-generate-fields</dt>          <dd>Gets or sets whether the panel should populate its fields 
 *                                              collection automatically based on the {@link PivotPanel.itemsSource}.</dd>
 *   <dt>view-definition</dt>               <dd>Gets or sets the current pivot view definition as a JSON string.</dd>
 *   <dt>engine</dt>                        <dd>Gets a reference to the {@link PivotEngine} that summarizes the data.</dd>
 * </dl>
 */
export class WjPivotPanel extends WjDirective {
    constructor() {
        super();
        this.transclude = true;
        this.template = '<div ng-transclude />';
    }

    get _controlConstructor() {
        return wijmo.olap.PivotPanel;
    }
}


/**
 * AngularJS directive for the {@link Slicer} control.
 *
 * Use the <b>wj-slicer</b> directive provides a quick way to edit filters
 * applied to {@link PivotField} objects.
 *
 * Directive and parameter names must be formatted as lower-case with dashes 
 * instead of camel-case. For example:
 * 
 * <pre>&lt;wj-slicer
 *     field="theField"
 *     header="theHeader"
 *     show-header="true"&gt;
 * &lt;/wj-slicer&gt;</pre>
 *
 * The <b>wj-slicer</b> directive supports the following attributes:
 * 
 * <dl class="dl-horizontal">
 *   <dt>field</dt>           <dd>Gets or sets the PivotField being filtered by the Slicer.</dd>
 *   <dt>header</dt>          <dd>Gets or sets the header string shown at the top of the {@link Slicer}.</dd>
 *   <dt>showHeader</dt>      <dd>Gets or sets a value indicating whether the control displays the
 *                                header area with the header string and multi-select/clear buttons.</dd>
 *   <dt>showCheckboxes</dt>  <dd>Gets or sets a value indicating whether the control displays
 *                                checkboxes next to each item.</dd>
 *   <dt>multiSelect</dt>     <dd>Gets or sets a value that determines whether users should be allowed to
 *                                select multiple values from the list.</dd>
 * </dl>
 */
export class WjSlicer extends WjDirective {
    get _controlConstructor() {
        return wijmo.olap.Slicer;
    }
}

//export class WjPivotField extends WjDirective {
//    constructor() {
//        super();
//        this.require = '^wjPivotPanel';
//        this.template = '<div />';
//    }

//    get _controlConstructor() {
//        return wijmo.olap.PivotField;
//    }

//    _initControl(element: any): any {
//        // 'element' is a parent PivotPanel here
//        return new wijmo.olap.PivotField(<wijmo.olap.PivotEngine>(<wijmo.olap.PivotPanel>element).engine, '');
//    }

//}


    }
    


    module wijmo.angular {
    

    }
    

    module wijmo.angular {
    


var wjNg: any = window['angular'];




const wijmoViewerName = 'wj.viewer';


// do not use moduleName here, it's removed from the global module version
var wijmoOlap = _registerNgModule(wijmoViewerName);
var wijmoViewer = window['angular'].module('wj.viewer', []);

// register only if module is loaded
if (softRefViewer() && softRefViewer().ReportViewer) {

    wijmoViewer.directive('wjReportViewer', [function () {
        return new WjReportViewer();
    }]);
}
if (wijmo.viewer && wijmo.viewer.PdfViewer) {

    wijmoViewer.directive('wjPdfViewer', [function () {
        return new WjPdfViewer();
    }]);
}

//#endregion "ReportViewer directives definitions"

//#region "ReportViewer directives classes"

// Viewer control directive
// Provides base setup for all directives related to controls derived from ViewerBase
// Abstract class, not for use in markup
class WjViewerBase extends WjDirective {

    // Creates a new instance of a WjViewerBase
    constructor() {
        super();
        this.template = '<div ng-transclude />';
        this.transclude = true;
    }

    get _controlConstructor() {
        return wijmo.viewer.ViewerBase;
    }
}

/**
 * AngularJS directive for the {@link ReportViewer} control.
 *
 * Use the <b>wj-report-viewer</b> directive to add report viewer to your AngularJS applications.
 * Note that directive and parameter names must be formatted in lower-case with dashes 
 * instead of camel-case. For example:
 *
 * <pre>&lt;wj-report-viewer paginated="true"
 *   service-url="ctx.serviceUrl"
 *   file-path="ctx.path"
 *   report-name="ctx.reportName"&gt;
 * &lt;/wj-report-viewer;</pre>
 *
 * The <b>wj-report-viewer</b> directive supports the following attributes:
 * 
 * <dl class="dl-horizontal">
 *   <dt>service-url</dt>  <dd><code>@</code>A value indicating the address of C1 Web API service. </dd>
 *   <dt>file-path</dt>  <dd><code>@</code> A value indicating full path to the document on the server.</dd>
 *   <dt>report-name</dt>   <dd><code>@</code> For FlexReport, sets it with the
 *                          report name defined in the FlexReport definition file.
 *                          For SSRS report, please leave it as empty string. </dd>
 *   <dt>control</dt>       <dd><code>=</code> A reference to the {@link ReportViewer}
 *                          control created by this directive. </dd>
 *   <dt>full-screen</dt>   <dd><code>@</code> A value indicating whether viewer is under full screen mode. </dd>
 *   <dt>zoom-factor</dt>   <dd><code>@</code> A value indicating the current zoom factor to
 *                           show the document pages </dd>
 *   <dt>mouse-mode</dt>  <dd><code>@</code> A value indicating the mouse behavior.</dd>
 *   <dt>initialized</dt>   <dd><code>&</code> This event occurs after the binding has finished
 *                          initializing the control with attribute values.</dd>
 *   <dt>is-initialized</dt> <dd><code>=</code> A value indicating whether the binding has finished
 *                           initializing the control with attribute values. </dd>
 *   <dt>view-mode</dt>   <dd><code>@</code> A value indicating how to show the document pages. </dd>
 *   <dt>paginated</dt>    <dd><code>@</code> A value indicating whether the content should
 *                          be represented as set of fixed sized pages.</dd>
 *   <dt>parameters</dt>    <dd><code>@</code> A dictionary of {name: value} pairs that describe the
 *                           parameters used to run the report.</dd>
 *   <dt>request-headers</dt> <dd><code>@</code> An object containing request headers to be used when sending
 *                           or requesting data.</dd>
 *   <dt>page-index-changed</dt>     <dd><code>&</code> The {@link ReportViewer.pageIndexChanged} event handler.</dd>
 *   <dt>view-mode-changed</dt>    <dd><code>&</code> The {@link ReportViewer.viewModeChanged} event handler.</dd>
 *   <dt>mouse-mode-changed</dt>    <dd><code>&</code> The {@link ReportViewer.mouseModeChanged} event handler.</dd>
 *   <dt>full-screen-changed</dt>    <dd><code>&</code> The {@link ReportViewer.fullScreenChanged} event handler.</dd>
 *   <dt>zoom-factor-changed</dt>    <dd><code>&</code> The {@link ReportViewer.zoomFactorChanged} event handler.</dd>
 *   <dt>query-loading-data</dt>    <dd><code>&</code> The {@link ReportViewer.queryLoadingData} event handler.</dd>
 *   <dt>before-send-request</dt>    <dd><code>&</code> The {@link ReportViewer.beforeSendRequest} event handler.</dd>
 * </dl>
 */
class WjReportViewer extends WjViewerBase {

    // Initializes a new instance of a WjReportViewer
    constructor() {
        super();
    }

    // gets the Wijmo ReportViewer control constructor
    get _controlConstructor() {
        return wijmo.viewer.ReportViewer;
    }
}

/**
 * AngularJS directive for the {@link PdfViewer} control.
 *
 * Use the <b>wj-pdf-viewer</b> directive to add pdf viewer to your AngularJS applications. 
 * Note that directive and parameter names must be formatted as lower-case with dashes 
 * instead of camel-case. For example:
 *
 * <pre>&lt;wj-pdf-viewer  paginated="false"
 *   service-url="ctx.serviceUrl"
 *   file-path="ctx.path"
 *   report-name="ctx.reportName"&gt;
 * &lt;/wj-pdf-viewer;</pre>
 *
 * The <b>wj-pdf-viewer</b> directive supports the following attributes:
 * 
 * <dl class="dl-horizontal">
 *   <dt>service-url</dt>  <dd><code>@</code>A value indicating the address of C1 Web API service. </dd>
 *   <dt>file-path</dt>  <dd><code>@</code> A value indicating full path to the document on the server.</dd>
 *   <dt>control</dt>       <dd><code>=</code> A reference to the {@link PdfViewer}
 *                          control created by this directive. </dd>
 *   <dt>full-screen</dt>   <dd><code>@</code> A value indicating whether viewer is under full screen mode. </dd>
 *   <dt>zoom-factor</dt>   <dd><code>@</code> A value indicating the current zoom factor to
 *                           show the document pages </dd>
 *   <dt>mouse-mode</dt>  <dd><code>@</code>  A value indicating the mouse behavior.</dd>
 *   <dt>initialized</dt>   <dd><code>&</code> This event occurs after the binding has finished
 *                          initializing the control with attribute values.</dd>
 *   <dt>is-initialized</dt> <dd><code>=</code> A value indicating whether the binding has finished
 *                           initializing the control with attribute values. </dd>
 *   <dt>view-mode</dt>   <dd><code>@</code> A value indicating how to show the document pages. </dd>
 *   <dt>request-headers</dt> <dd><code>@</code> An object containing request headers to be used when sending
 *                           or requesting data.</dd>
 *   <dt>page-index-changed</dt>     <dd><code>&</code> The {@link PdfViewer.pageIndexChanged} event handler.</dd>
 *   <dt>view-mode-changed</dt>    <dd><code>&</code> The {@link PdfViewer.viewModeChanged} event handler.</dd>
 *   <dt>mouse-mode-changed</dt>    <dd><code>&</code> The {@link PdfViewer.mouseModeChanged} event handler.</dd>
 *   <dt>full-screen-changed</dt>    <dd><code>&</code> The {@link PdfViewer.fullScreenChanged} event handler.</dd>
 *   <dt>zoom-factor-changed</dt>    <dd><code>&</code> The {@link PdfViewer.zoomFactorChanged} event handler.</dd>
 *   <dt>query-loading-data</dt>    <dd><code>&</code> The {@link PdfViewer.queryLoadingData} event handler.</dd>
 *   <dt>before-send-request</dt>    <dd><code>&</code> The {@link PdfViewer.beforeSendRequest} event handler.</dd>
 * </dl>
 */
class WjPdfViewer extends WjViewerBase {

    // Initializes a new instance of a WjPdfViewer
    constructor() {
        super();
    }

    // gets the Wijmo PdfViewer control constructor
    get _controlConstructor() {
        return wijmo.viewer.PdfViewer;
    }
}
//#endregion "Viewer directives classes"
 
    }
    


    module wijmo.angular {
    

    }
    

window['angular'].module('wj', wijmo.angular.getNgModules());