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


    module wijmo.knockout {
    







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
    


    module wijmo.knockout {
    


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
    


    module wijmo.knockout {
    // Entry file. All real code files should be re-exported from here.


wijmo._registerModule('wijmo.meta', wijmo.knockout);



    }
    

    module wijmo.knockout {
    


export class MetaFactory extends ControlMetaFactory {
    // Override to return wijmo.knockout.PropDesc
    public static CreateProp(propertyName: string, propertyType: PropertyType,
        changeEvent?: string, enumType?,
        isNativeControlProperty?: boolean, priority?: number): PropDesc {

        return new PropDesc(propertyName, propertyType, changeEvent, enumType, isNativeControlProperty, priority);
    }

    // Override to return wijmo.knockout.EventDesc
    public static CreateEvent(eventName: string, isPropChanged?: boolean): EventDesc {
        return new EventDesc(eventName, isPropChanged);
    }

    // Override to return wijmo.knockout.ComplexPropDesc
    public static CreateComplexProp(propertyName: string, isArray: boolean, ownsObject?: boolean): ComplexPropDesc {
        return new ComplexPropDesc(propertyName, isArray, ownsObject);
    }

    // Typecasted override.
    public static findProp(propName: string, props: PropDesc[]): PropDesc {
        return <PropDesc>ControlMetaFactory.findProp(propName, props);
    }

    // Typecasted override.
    public static findEvent(eventName: string, events: EventDesc[]): EventDesc {
        return <EventDesc>ControlMetaFactory.findEvent(eventName, events);
    }

    // Typecasted override.
    public static findComplexProp(propName: string, props: ComplexPropDesc[]): ComplexPropDesc {
        return <ComplexPropDesc>ControlMetaFactory.findComplexProp(propName, props);
    }

}

// Defines a delegate performing a custom assignment logic of a control property with a source value.
// TBD: the plan is to move this platform agnostic definition to the shared metadata.
export interface IUpdateControlHandler {
    // The link parameter references a 'link' object (WjLink in Angular, WjContext in Knockout).
    (link: any, propDesc: PropDesc, control: any, unconvertedValue: any, convertedValue: any): boolean;
}

export class PropDesc extends PropDescBase {
    // A callback allowing to perform a custom update of the control with the new source value.
    // Should return true if update is handled and standard assignment logic should not be applied; otherwise, should return false.
    updateControl: IUpdateControlHandler;
}

// Describes a scope event
export class EventDesc extends EventDescBase {
}

// Describe property info for nested directives.
export class ComplexPropDesc extends ComplexPropDescBase {
}

 
    }
    


    module wijmo.knockout {
    



var wjKo: any = window['ko'];






// Represents a base class for Wijmo custom bindings. Technically corresponds to an object assigning to ko.bindingHandlers
// in order to register a custom binding. Represents a Wijmo control or a child object like FlexGrid Column.
// This is a singleton class. For each tag that uses the custom binding it creates a separate WjContext class instance
// that services lifetime of the control created for the tag.
export class WjBinding /*implements KnockoutBindingHandler*/ {

    // Defines html element property name used to store WjContext object associated with the element.
    static _wjContextProp = '__wjKoContext';
    // The name of the nested binding attribute defining a parent property name to assign to.
    static _parPropAttr = 'wjProperty';
    // The name of the attribute providing the reference to the control.
    static _controlPropAttr = 'control';
    // Name of the attribute that provides the 'initialized' state value.
    static _initPropAttr = 'isInitialized';
    // Name of the attribute representing the 'initialized' event.
    static _initEventAttr = 'initialized';

    // Stores the binding metadata.
    _metaData: MetaDataBase;
    // #region Native API
    //options: any;
    init = function (element: any, valueAccessor: () => any, allBindings: any/*KnockoutAllBindingsAccessor*/, viewModel: any, bindingContext: any/*KnockoutBindingContext*/): any {
        this.ensureMetaData();
        //if (!this._metaData) {
        //    this._metaData = MetaFactory.getMetaData(this._getMetaDataId());
        //    this._initialize();
        //    this._metaData.prepare();
        //}
        return (<WjBinding>this)._initImpl(element, valueAccessor, allBindings, viewModel, bindingContext);
    }.bind(this);

    update = function (element: any, valueAccessor: () => any, allBindings: any/*KnockoutAllBindingsAccessor*/, viewModel: any, bindingContext: any/*KnockoutBindingContext*/): void {
        //console.log('#' + this['__DebugID'] + ' WjBinding.update');
        (<WjBinding>this)._updateImpl(element, valueAccessor, allBindings, viewModel, bindingContext);
    }.bind(this);
    // #endregion Native API

    // Call this method to ensure that metadata is loaded.
    // DO NOT OVERRIDE this method; instead, override the _initialize method to customize metedata.
    ensureMetaData() {
        if (!this._metaData) {
            this._metaData = MetaFactory.getMetaData(this._getMetaDataId());
            this._initialize();
            this._metaData.prepare();
        }
    }

    // Override this method to initialize the binding settings. Metadata is already loaded when this method is invoked.
    _initialize() {
    }

    _getControlConstructor(): any {
        return null;
    }

    // Gets the metadata ID, see the wijmo.meta.getMetaData method description for details.
    _getMetaDataId(): any {
        return this._getControlConstructor();
    }
    _createControl(element: any): any {
        var ctor = this._getControlConstructor();
        return new ctor(element);
    }

    _createWijmoContext(): WjContext {
        return new WjContext(this);
    }

    // Indicates whether this binding can operate as a child binding.
    _isChild(): boolean {
        return this._isParentInitializer() || this._isParentReferencer();
    }

    // Indicates whether this binding operates as a child binding that initializes a property of its parent.
    _isParentInitializer(): boolean {
        return this._metaData.parentProperty != undefined;
    }

    // Indicates whether this binding operates as a child binding that references a parent in its property or
    // a constructor.
    _isParentReferencer(): boolean {
        return this._metaData.parentReferenceProperty != undefined;
    }

    private _initImpl(element: any, valueAccessor: () => any, allBindings: any/*KnockoutAllBindingsAccessor*/,
        viewModel: any, bindingContext: any/*KnockoutBindingContext*/): any {
        var wjContext = this._createWijmoContext();
        element[WjBinding._wjContextProp] = wjContext;
        wjContext.element = element;
        if (this._isChild()) {
            wjContext.parentWjContext = element.parentElement[WjBinding._wjContextProp];
        }
        wjContext.valueAccessor = valueAccessor;
        wjContext.allBindings = allBindings;
        wjContext.viewModel = viewModel;
        wjContext.bindingContext = bindingContext;
        return wjContext.init(element, valueAccessor, allBindings, viewModel, bindingContext);
    }

    private _updateImpl = function (element: any, valueAccessor: () => any, allBindings: any/*KnockoutAllBindingsAccessor*/, viewModel: any,
        bindingContext: any/*KnockoutBindingContext*/): void {
        (<WjContext>(element[WjBinding._wjContextProp])).update(element, valueAccessor, allBindings, viewModel, bindingContext);
    }

} 

// Represents a context of WjBinding for a specific tag instance (similar to WjLink in Angular).
export class WjContext {
    element: any;
    valueAccessor: any;
    allBindings: any;
    viewModel: any;
    bindingContext: any;
    control: any; 
    wjBinding: WjBinding;
    parentWjContext: WjContext;

    private _parentPropDesc: ComplexPropDesc;
    private _isInitialized: boolean = false;
    private static _debugId = 0;

    constructor(wjBinding: WjBinding) {
        this.wjBinding = wjBinding;
    }

    init(element: any, valueAccessor: () => any, allBindings: any/*KnockoutAllBindingsAccessor*/, viewModel: any, bindingContext: any/*KnockoutBindingContext*/): any {
        var lastAccessor = valueAccessor(),
            props = this.wjBinding._metaData.props,
            events = this.wjBinding._metaData.events;

        if (this._isChild()) {
            var propObs = lastAccessor[WjBinding._parPropAttr],
                meta = this.wjBinding._metaData,
                parPropName = propObs && wjKo.unwrap(propObs) || meta.parentProperty;
            this._parentPropDesc = MetaFactory.findComplexProp(parPropName, this.parentWjContext.wjBinding._metaData.complexProps)
                || new ComplexPropDesc(parPropName, meta.isParentPropertyArray, meta.ownsObject);
        }
        this._initControl();
        this._safeUpdateSrcAttr(WjBinding._controlPropAttr, this.control);
        //Debug stuff
        //this.control.__DebugID = ++WjContext._debugId;
        //this['__DebugID'] = WjContext._debugId;

        // Initialize children right after control was created but before its properties was assigned with defined bindings.
        // This will allow to correctly apply properties like value or selectedIndex to controls like Menu whose child bindings
        // create an items source, so the mentioned properties will be assigned after collection has created.
        wjKo.applyBindingsToDescendants(bindingContext, element);

        this._childrenInitialized();


        for (var eIdx in events) {
            this._addEventHandler(events[eIdx]);
        }

        this._updateControl(valueAccessor /* , this.control, props */ );
        // Re-evaluate 'control' binding 
        // in order to simplify bindings to things like control.subProperty (e.g. flexGrid.collectionView).
        this._safeNotifySrcAttr(WjBinding._controlPropAttr);
        this._updateSource();
        this._isInitialized = true;
        this._safeUpdateSrcAttr(WjBinding._initPropAttr, true);
        var evObs = lastAccessor[WjBinding._initEventAttr];
        if (evObs) {
            wjKo.unwrap(evObs)(this.bindingContext['$data'], this.control, undefined);
        }

        return { controlsDescendantBindings: true };
    }

    update(element: any, valueAccessor: () => any, allBindings: any/*KnockoutAllBindingsAccessor*/, viewModel: any, bindingContext: any/*KnockoutBindingContext*/): void {
        this.valueAccessor = valueAccessor;
        this._updateControl(valueAccessor);
    }

    _createControl(): any {
        return this.wjBinding._createControl(this._parentInCtor() ? this.parentWjContext.control : this.element);
    }

    // Initialize the 'control' property, by creating a new or using the parent's object in case of child binding not owning
    // the object.
    // Override this method to perform custom initialization before or after control creation. The 'control' property is
    // undefined before this method call and defined on exit from this method.
    _initControl() {
        if (this._isChild()) {
            this.element.style.display = 'none';
            var parProp = this._getParentProp(),
                parCtrl = this.parentWjContext.control;
            if (this._useParentObj()) {
                this.control = parCtrl[parProp];
            }
            else {
                var ctrl = this.control = this._createControl();
                if (this._isParentInitializer()) {
                    if (this._isParentArray()) {
                        (<any[]>parCtrl[parProp]).push(ctrl);
                    }
                    else {
                        parCtrl[parProp] = ctrl;
                    }
                }
                if (this._isParentReferencer() && !this._parentInCtor()) {
                    ctrl[this._getParentReferenceProperty()] = parCtrl;
                }
            }
        }
        else
            this.control = this._createControl();
    }

    _childrenInitialized() {
    }

    private _addEventHandler(eventDesc: EventDesc) {
        this.control[eventDesc.eventName].addHandler(
            (s, e) => {
                if (this._isInitialized) {
                    this._updateSource();
                }
                var evObs = this.valueAccessor()[eventDesc.eventName];
                if (evObs) {
                    wjKo.unwrap(evObs)(this.bindingContext['$data'], s, e);
                }
            }, this);
    }

    private static _isUpdatingSource = false;
    private static _pendingSourceUpdates: WjContext[] = [];
    _updateSource() {
        WjContext._isUpdatingSource = true;
        try {
            var props = this.wjBinding._metaData.props;
            for (var idx in props) {
                var propDesc = props[idx],
                    propName = propDesc.propertyName;
                if (propDesc.shouldUpdateSource && propDesc.isNativeControlProperty) {
                    this._safeUpdateSrcAttr(propName, this.control[propName]);
                }
            }
        }
        finally {
            WjContext._isUpdatingSource = false;
            while (WjContext._pendingSourceUpdates.length > 0) {
                var wjCont = WjContext._pendingSourceUpdates.shift();
                wjCont._updateControl();
            }
        }
    }

    private _isUpdatingControl = false;
    private _isSourceDirty = false;
    private _oldSourceValues = {};
    private _updateControl(valueAccessor = this.valueAccessor) {
        //console.log('#' + this['__DebugID'] + '_updateControl');
        var valSet = valueAccessor(),
            props = <PropDesc[]>this.wjBinding._metaData.props;
        if (WjContext._isUpdatingSource) {
            if (WjContext._pendingSourceUpdates.indexOf(this) < 0) {
                WjContext._pendingSourceUpdates.push(this);
            }

            // IMPORTANT: We need to read all bound observable; otherwise, the update will never be called anymore !!!
            for (var i in props) {
                wjKo.unwrap(valSet[props[i].propertyName]);
            }
            return;
        }
        try {
            var valArr = [],
                propArr: PropDesc[] = [];
            // Collect properties/values changed since the last update.
            for (var i in props) {
                var prop = props[i],
                    propName = prop.propertyName,
                    valObs = valSet[propName];
                if (valObs !== undefined) {
                    var val = wjKo.unwrap(valObs);
                    if (val !== this._oldSourceValues[propName] ||
                            (prop.changeEvent && val !== this.control[propName])) {
                        this._oldSourceValues[propName] = val;
                        valArr.push(val);
                        propArr.push(prop);
                    }
                }
            }
            for (var i in valArr) {
                var prop = propArr[i],
                    val = wjKo.unwrap(valSet[prop.propertyName]),
                    propName = prop.propertyName;
                if (val !== undefined || this._isInitialized) {
                    var castedVal = this._castValueToType(val, prop);
                    if (!(prop.updateControl && prop.updateControl(this, prop, this.control, val, castedVal)) &&
                        prop.isNativeControlProperty) {
                        if (this.control[propName] != castedVal) {
                            this.control[propName] = castedVal;
                        }
                    }
                }
            }
        }
        finally {
            //this._isUpdatingControl = false;
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

    // Parsing DateTime values from string
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

    // Update source attribute if possible (if it's defined and is a writable observable or a non-observable)
    _safeUpdateSrcAttr(attrName: string, value: any) {
        var ctx = this.valueAccessor();
        var attrObs = ctx[attrName];
        if ((<any>wjKo).isWritableObservable(attrObs)) {
            var val = wjKo.unwrap(attrObs);
            if (value != val) {
                attrObs(value);
            }
        }
    }
    _safeNotifySrcAttr(attrName: string) {
        var ctx = this.valueAccessor();
        var attrObs = ctx[attrName];
        if ((<any>wjKo).isWritableObservable(attrObs) && attrObs.valueHasMutated) {
            attrObs.valueHasMutated();
        }
    }

    //Determines whether this is a child link.
    private _isChild(): boolean {
        return this.wjBinding._isChild();
    }
    // Indicates whether this link operates as a child link that initializes a property of its parent.
    private _isParentInitializer(): boolean {
        return this.wjBinding._isParentInitializer();
    }

    // Indicates whether this link operates as a child link that references a parent in its property or
    // a constructor.
    private _isParentReferencer(): boolean {
        return this.wjBinding._isParentReferencer();
    }

    //For the child directives returns parent's property name that it services. Property name defined via
    //the wjProperty attribute of directive tag has priority over the directive._property definition.
    //IMPORTANT: functionality is based on _parentPropDesc
    private _getParentProp(): string {
        return this._isParentInitializer() ? this._parentPropDesc.propertyName : undefined;
    }
    // For a child directive, the name of the property of the directive's underlying object that receives the reference
    // to the parent, or an empty string that indicates that the reference to the parent should be passed as the 
    // underlying object's constructor parameter.
    private _getParentReferenceProperty(): string {
        return this.wjBinding._metaData.parentReferenceProperty;
    }

    // Determines whether the child link uses an object created by the parent property, instead of creating it by
    // itself, and thus object's initialization should be delayed until parent link's control is created.
    //IMPORTANT: functionality is based on _parentPropDesc
    private _useParentObj(): boolean {
        //return this._isChild() && !this._parentPropDesc.isArray && !this._parentPropDesc.ownsObject;
        return !this._isParentReferencer() &&
            this._isParentInitializer() && !this._parentPropDesc.isArray && !this._parentPropDesc.ownsObject;
    }

    // For the child link, determines whether the servicing parent property is an array.
    //IMPORTANT: functionality is based on _parentPropDesc
    private _isParentArray() {
        return this._parentPropDesc.isArray;
    }

    // For the child referencer directive, indicates whether the parent should be passed as a parameter the object
    // constructor.
    private _parentInCtor(): boolean {
        return this._isParentReferencer() && this._getParentReferenceProperty() == '';
    }

}

export class WjTagsPreprocessor {
    private static _getSpecialProps() {
        var ret = {},
            wjBind = WjBinding;
        ret[wjBind._controlPropAttr] = true;
        ret[wjBind._parPropAttr] = true;
        return ret;
    }
    private static _specialProps = WjTagsPreprocessor._getSpecialProps();

    private static _dataBindAttr = 'data-bind';
    private static _wjTagPrefix = 'wj-';

    private _foreignProc;

    register(): void {
        this._foreignProc = wjKo.bindingProvider.instance['preprocessNode'];
        wjKo.bindingProvider.instance['preprocessNode'] = this.preprocessNode.bind(this); 
    }

    preprocessNode(node): any {
        var dataBindName = WjTagsPreprocessor._dataBindAttr;
        if (!(node.nodeType == 1 && this._isWjTag(node.tagName))) {
            return this._delegate(node);
        }
        var camelTag = MetaFactory.toCamelCase(node.tagName),
            wjBinding = <WjBinding>wjKo.bindingHandlers[camelTag];
        if (!wjBinding) {
            return this._delegate(node);
        }
        wjBinding.ensureMetaData();
        var wjBindDef = '',
            attribs = node.attributes,
            retEl = document.createElement("div"),
            dataBindAttr;
        for (var i = 0; i < attribs.length; i++) {
            var attr = attribs[i];
            if (attr.name.toLowerCase() == dataBindName) {
                dataBindAttr = attr;
                continue;
            }
            var camelAttr = MetaFactory.toCamelCase(attr.name);
            if (this._isWjProp(camelAttr, wjBinding._metaData)) {
                if (wjBindDef) {
                    wjBindDef += ',';
                }
                wjBindDef += camelAttr + ':' + attr.value;
            }
            else {
                retEl.setAttribute(attr.name, attr.value);
            }
        }

        wjBindDef = camelTag + ':{' + wjBindDef + '}';
        if (dataBindAttr && dataBindAttr.value && dataBindAttr.value.trim()) {
            wjBindDef += ',' + dataBindAttr.value;
        }

        retEl.setAttribute(dataBindName, wjBindDef);

        while (node.firstChild) {
            retEl.appendChild(node.firstChild);
        }
        node.parentNode.replaceChild(retEl, node);

        return [retEl];
    }

    private _delegate(node) {
        return this._foreignProc ? this._foreignProc(node) : undefined;
    }

    private _isWjTag(name) {
        var wjPfx = WjTagsPreprocessor._wjTagPrefix;
        return name && name.length > wjPfx.length && name.substr(0, wjPfx.length).toLowerCase() === wjPfx;
    }

    private _isWjProp(name, metaData) {
        return WjTagsPreprocessor._specialProps[name] || MetaFactory.findProp(name, metaData.props) ||
            MetaFactory.findEvent(name, metaData.events);
    }

}

if (!window['wijmo']['disableKnockoutTags']) {
    new WjTagsPreprocessor().register();
}





    }
    


    module wijmo.knockout {
    

// Note: we export soft references because other modules should
// use them from here, to prevent duplicates in the global module.
//export * from './_soft-references';

    }
    

    module wijmo.knockout {
    



var wjKo: any = window['ko'];






// DropDown custom binding.
// Abstract class, not for use in markup
export class WjDropDownBinding extends WjBinding {
    _getControlConstructor(): any {
        return wijmo.input.DropDown;
    }
}

/**
 * KnockoutJS binding for the {@link ComboBox} control.
 *
 * Use the {@link wjComboBox} binding to add {@link ComboBox} controls to your 
 * KnockoutJS applications. For example:
 * 
 * <pre>&lt;p&gt;Here is a ComboBox control:&lt;/p&gt;
 * &lt;div data-bind="wjComboBox: {
 *   itemsSource: countries,
 *   text: theCountry,
 *   isEditable: false,
 *   placeholder: 'country' }"&gt;
 * &lt;/div&gt;</pre>
 *
 * The <b>wjComboBox</b> binding supports all read-write properties and events of 
 * the {@link ComboBox} control. The following properties provide two-way binding mode:
 * <ul>
 * 	<li><b>isDroppedDown</b></li>
 * 	<li><b>text</b></li>
 * 	<li><b>selectedIndex</b></li>
 * 	<li><b>selectedItem</b></li>
 * 	<li><b>selectedValue</b></li>
 * </ul>
 */
export class wjComboBox extends WjDropDownBinding {
    _getControlConstructor(): any {
        return wijmo.input.ComboBox;
    }
}

/**
 * KnockoutJS binding for the {@link AutoComplete} control.
 *
 * Use the {@link wjAutoComplete} binding to add {@link AutoComplete} controls to your 
 * KnockoutJS applications. For example:
 * 
 * <pre>&lt;p&gt;Here is an AutoComplete control:&lt;/p&gt;
 * &lt;div data-bind="wjAutoComplete: {
 *   itemsSource: countries,
 *   text: theCountry,
 *   isEditable: false,
 *   placeholder: 'country' }"&gt;
 * &lt;/div&gt;</pre>
 *
 * The <b>wjAutoComplete</b> binding supports all read-write properties and events of 
 * the {@link AutoComplete} control. The following properties provide two-way binding mode:
 * <ul>
 * 	<li><b>isDroppedDown</b></li>
 * 	<li><b>text</b></li>
 * 	<li><b>selectedIndex</b></li>
 * 	<li><b>selectedItem</b></li>
 * 	<li><b>selectedValue</b></li>
 * </ul>
 */
export class wjAutoComplete extends wjComboBox {
    _getControlConstructor(): any {
        return wijmo.input.AutoComplete;
    }
}

/**
 * KnockoutJS binding for the {@link Calendar} control.
 *
 * Use the {@link wjCalendar} binding to add {@link Calendar} controls to your 
 * KnockoutJS applications. For example:
 * 
 * <pre>&lt;p&gt;Here is a Calendar control:&lt;/p&gt;
 * &lt;div 
 *   data-bind="wjCalendar: { value: theDate }"&gt;
 * &lt;/div&gt;</pre>
 *
 * The <b>wjCalendar</b> binding supports all read-write properties and events of 
 * the {@link Calendar} control. The following properties provide two-way binding mode:
 * <ul>
 * 	<li><b>value</b></li>
 * 	<li><b>displayMonth</b></li>
 * </ul>
 */
export class wjCalendar extends WjBinding {
    _getControlConstructor(): any {
        return wijmo.input.Calendar;
    }
}

/**
 * KnockoutJS binding for the {@link ColorPicker} control.
 *
 * Use the {@link wjColorPicker} binding to add {@link ColorPicker} controls to your 
 * KnockoutJS applications. For example:
 * 
 * <pre>&lt;p&gt;Here is a ColorPicker control:&lt;/p&gt;
 * &lt;div 
 *   data-bind="wjColorPicker: { value: theColor }"&gt;
 * &lt;/div&gt;</pre>
 *
 * The <b>wjColorPicker</b> binding supports all read-write properties and events of 
 * the {@link ColorPicker} control. The following properties provide two-way binding mode:
 * <ul>
 * 	<li><b>value</b></li>
 * </ul>
 */
export class wjColorPicker extends WjBinding {
    _getControlConstructor(): any {
        return wijmo.input.ColorPicker;
    }
}

/**
 * KnockoutJS binding for the {@link ListBox} control.
 *
 * Use the {@link wjListBox} binding to add {@link ListBox} controls to your 
 * KnockoutJS applications. For example:
 * 
 * <pre>&lt;p&gt;Here is a ListBox control:&lt;/p&gt;
 * &lt;div data-bind="wjListBox: {
 *   itemsSource: countries,
 *   selectedItem: theCountry }"&gt;
 * &lt;/div&gt;</pre>
 *
 * The <b>wjListBox</b> binding supports all read-write properties and events of 
 * the {@link ListBox} control. The following properties provide two-way binding mode:
 * <ul>
 * 	<li><b>selectedIndex</b></li>
 * 	<li><b>selectedItem</b></li>
 * 	<li><b>selectedValue</b></li>
 * </ul>
 */
export class wjListBox extends WjBinding {
    _getControlConstructor(): any {
        return wijmo.input.ListBox;
    }
}

/**
 * KnockoutJS binding for the {@link Menu} control.
 *
 * Use the {@link wjMenu} binding to add {@link Menu} controls to your 
 * KnockoutJS applications. For example:
 * 
 * <pre>&lt;p&gt;Here is a Menu control used as a value picker:&lt;/p&gt;
 * &lt;div data-bind="wjMenu: { value: tax, header: 'Tax' }"&gt;
 *     &lt;span data-bind="wjMenuItem: { value: 0 }"&gt;Exempt&lt;/span&gt;
 *     &lt;span data-bind="wjMenuSeparator: {}"&gt;&lt;/span&gt;
 *     &lt;span data-bind="wjMenuItem: { value: .05 }"&gt;5%&lt;/span&gt;
 *     &lt;span data-bind="wjMenuItem: { value: .1 }"&gt;10%&lt;/span&gt;
 *     &lt;span data-bind="wjMenuItem: { value: .15 }"&gt;15%&lt;/span&gt;
 * &lt;/div&gt;</pre>
 * 
 * The <b>wjMenu</b> binding may contain the following child bindings: {@link wjMenuItem}, {@link wjMenuSeparator}.
 *
 * The <b>wjMenu</b> binding supports all read-write properties and events of 
 * the {@link Menu} control. The following properties provide two-way binding mode:
 * <ul>
 * 	<li><b>isDroppedDown</b></li>
 * 	<li><b>text</b></li>
 * 	<li><b>selectedIndex</b></li>
 * 	<li><b>selectedItem</b></li>
 * 	<li><b>selectedValue</b></li>
 *  <li><b>value</b></li>
 * </ul>
 */
export class wjMenu extends wjComboBox {
    _getControlConstructor(): any {
        return wijmo.input.Menu;
    }

    _createWijmoContext(): WjContext {
        return new WjMenuContext(this);
    }

    _initialize() {
        super._initialize();
        var valueDesc = MetaFactory.findProp('value', <PropDesc[]>this._metaData.props);
        valueDesc.updateControl = this._updateControlValue;
    }

    private _updateControlValue(link: any, propDesc: PropDesc, control: any, unconvertedValue: any, convertedValue: any): boolean {
        if (convertedValue != null) {
            control.selectedValue = convertedValue;
            (<WjMenuContext>link)._updateHeader();
        }

        return true;
    }

}

export class WjMenuContext extends WjContext {
    _initControl() {
        super._initControl();
        var menuCtrl = <wijmo.input.Menu>this.control;
        menuCtrl.displayMemberPath = 'header';
        menuCtrl.commandPath = 'cmd';
        menuCtrl.commandParameterPath = 'cmdParam';
        menuCtrl.selectedValuePath = 'value';
        menuCtrl.itemsSource = new wijmo.collections.ObservableArray();

        // update 'value' and header when an item is clicked
        menuCtrl.itemClicked.addHandler(() => {
            this._safeUpdateSrcAttr('value', menuCtrl.selectedValue);
            this._updateHeader();
        });
    }

    _childrenInitialized() {
        super._childrenInitialized();
        this.control.selectedIndex = 0;
        this._updateHeader();
    }

    // update header to show the currently selected value
    _updateHeader() {
        var control = <wijmo.input.Menu>this.control,
            valSet = this.valueAccessor(),
            newHeader = wjKo.unwrap(valSet['header']);
        //control.header = scope.header;
        if (wjKo.unwrap(valSet['value']) !== undefined && control.selectedItem && control.displayMemberPath) {
            var currentValue = control.selectedItem[control.displayMemberPath];
            if (currentValue != null) {
                newHeader += ': <b>' + currentValue + '</b>';
            }
        }
        control.header = newHeader;
    }
}

/**
 * KnockoutJS binding for menu items.
 *
 * Use the {@link wjMenuItem} binding to add menu items to a {@link Menu} control. 
 * The {@link wjMenuItem} binding must be contained in a {@link wjMenu} binding.
 * For example:
 * 
 * <pre>&lt;p&gt;Here is a Menu control with four menu items:&lt;/p&gt;
 * &lt;div data-bind="wjMenu: { value: tax, header: 'Tax' }"&gt;
 *     &lt;span data-bind="wjMenuItem: { value: 0 }"&gt;Exempt&lt;/span&gt;
 *     &lt;span data-bind="wjMenuItem: { value: .05 }"&gt;5%&lt;/span&gt;
 *     &lt;span data-bind="wjMenuItem: { value: .1 }"&gt;10%&lt;/span&gt;
 *     &lt;span data-bind="wjMenuItem: { value: .15 }"&gt;15%&lt;/span&gt;
 * &lt;/div&gt;</pre>
 *
 * The <b>wjMenuItem</b> binding supports the following attributes: 
 *
 * <dl class="dl-horizontal">
 *   <dt>cmd</dt>       <dd>Function to execute in the controller when the item is clicked.</dd>
 *   <dt>cmdParam</dt>  <dd>Parameter passed to the <b>cmd</b> function when the item is clicked.</dd>
 *   <dt>value</dt>     <dd>Value selected when the item is clicked (use either this or <b>cmd</b>).</dd>
 * </dl class="dl-horizontal">
 */
export class wjMenuItem extends WjBinding {
    _getMetaDataId(): any {
        return 'MenuItem';
    }

    _createWijmoContext(): WjContext {
        return new WjMenuItemContext(this);
    }

    _initialize() {
        super._initialize();
        var meta = this._metaData;
        meta.parentProperty = 'itemsSource';
        meta.isParentPropertyArray = true;
    }

}

export class WjMenuItemContext extends WjContext {
    _createControl(): any {
        return { header: this.element.innerHTML, cmd: null, cmdParam: null, value: null };
    }
}


/**
 * KnockoutJS binding for menu separators.
 *
 * The the {@link wjMenuSeparator} adds a non-selectable separator to a {@link Menu} control, and has no attributes.
 * It must be contained in a {@link wjMenu} binding. For example:
 * 
 * <pre>&lt;p&gt;Here is a Menu control with four menu items and one separator:&lt;/p&gt;
 * &lt;div data-bind="wjMenu: { value: tax, header: 'Tax' }"&gt;
 *     &lt;span data-bind="wjMenuItem: { value: 0 }"&gt;Exempt&lt;/span&gt;
 *     &lt;span data-bind="wjMenuSeparator: {}"&gt;&lt;/span&gt;
 *     &lt;span data-bind="wjMenuItem: { value: .05 }"&gt;5%&lt;/span&gt;
 *     &lt;span data-bind="wjMenuItem: { value: .1 }"&gt;10%&lt;/span&gt;
 *     &lt;span data-bind="wjMenuItem: { value: .15 }"&gt;15%&lt;/span&gt;
 * &lt;/div&gt;</pre>
 */
export class wjMenuSeparator extends WjBinding {
    _getMetaDataId(): any {
        return 'MenuSeparator';
    }

    _initialize() {
        super._initialize();
        var meta = this._metaData;
        meta.parentProperty = 'itemsSource';
        meta.isParentPropertyArray = true;
    }

    _createControl(element: any): any {
        // no self-closing tags: TFS 348690
        return { header: '<div class="wj-state-disabled" style="width:100%;height:1px;background-color:lightgray"></div>' };
    }
}

/**
 * KnockoutJS binding for context menus.
 *
 * Use the {@link wjContextMenu} binding to add context menus to elements
 * on the page. The {@link wjContextMenu} binding is based on the  {@link wjMenu};
 * it displays a popup menu when the user performs a context menu
 * request on an element (usually a right-click).
 *
 * The wjContextMenu binding is specified as a parameter added to the
 * element that the context menu applies to. The parameter value is a 
 * CSS selector for the element that contains the menu. For example:
 *
 * <pre>&lt;!-- paragraph with a context menu --&gt;
 *&lt;p data-bind="wjContextMenu: { id: '#idMenu'}" &gt;
    *  This paragraph has a context menu.&lt;/p&gt;
    *
    *&lt;!-- define the context menu (hidden and with an id) --&gt;
    * &lt;div id="contextmenu" data-bind="wjMenu: { header: 'File', itemClicked: menuItemClicked}"&gt;
    *     &lt;span data-bind="wjMenuItem: {}"&gt;New&lt;/span&gt;
    *     &lt;span data-bind="wjMenuItem: {}"&gt;open an existing file or folder&lt;/span&gt;
    *     &lt;span data-bind="wjMenuItem: {}"&gt;save the current file&lt;/span&gt;
    *     &lt;span data-bind="wjMenuSeparator: {}"&gt;&lt;/span&gt;
    *     &lt;span data-bind="wjMenuItem: {}"&gt;exit the application&lt;/span&gt;
    * &lt;/div&gt;</pre>
    */
export class wjContextMenu extends WjBinding {

    _getMetaDataId(): any {
        return 'ContextMenu';
    }
    _createControl(element: any): any {
        return null;
    }
    _createWijmoContext(): WjContext {
        return new WjContextMenuContext(this);
    }
}

export class WjContextMenuContext extends WjContext {

    _initControl() {
        super._initControl();
        var valSet = this.valueAccessor();
        // get context menu and drop-down list
        var host = wijmo.getElement(valSet['id']);

        // show the drop-down list in response to the contextmenu command
        this.element.addEventListener('contextmenu', function (e) {
            var menu = <wijmo.input.Menu>wijmo.Control.getControl(host),
                dropDown = menu.dropDown;
            if (menu && dropDown && !wijmo.closest(e.target, '[disabled]')) {
                e.preventDefault();
                menu.owner = this.element;
                menu.selectedIndex = -1;
                if (menu.onIsDroppedDownChanging(new wijmo.CancelEventArgs())) {
                    wijmo.showPopup(dropDown, e);
                    menu.onIsDroppedDownChanged();
                    dropDown.focus();
                }
            }
        });
    }
}

/**
 * KnockoutJS binding for the {@link InputDate} control.
 *
 * Use the {@link wjInputDate} binding to add {@link InputDate} controls to your 
 * KnockoutJS applications. For example:
 * 
 * <pre>&lt;p&gt;Here is an InputDate control:&lt;/p&gt;
 * &lt;div data-bind="wjInputDate: {
 *   value: theDate,
 *   format: 'M/d/yyyy' }"&gt;
 * &lt;/div&gt;</pre>
 *
 * The <b>wjInputDate</b> binding supports all read-write properties and events of 
 * the {@link InputDate} control. The following properties provide two-way binding mode:
 * <ul>
 * 	<li><b>isDroppedDown</b></li>
 * 	<li><b>text</b></li>
 * 	<li><b>value</b></li>
 * </ul>
 */
export class wjInputDate extends WjDropDownBinding {
    _getControlConstructor(): any {
        return wijmo.input.InputDate;
    }
}

/**
 * KnockoutJS binding for the {@link InputDateTime} control.
 *
 * Use the {@link wjInputDateTime} binding to add {@link InputDateTime} controls to your 
 * KnockoutJS applications. 
 * 
 * The <b>wjInputDateTime</b> binding supports all read-write properties and events of 
 * the {@link InputDateTime} control. 
 */
export class wjInputDateTime extends WjBinding {

    _getControlConstructor(): any {
        return wijmo.input.InputDateTime;
    }

}

/**
 * KnockoutJS binding for the {@link InputNumber} control.
 *
 * Use the {@link wjInputNumber} binding to add {@link InputNumber} controls to your 
 * KnockoutJS applications. For example:
 * 
 * <pre>&lt;p&gt;Here is an InputNumber control:&lt;/p&gt;
 * &lt;div data-bind="wjInputNumber: {
 *   value: theNumber,
 *   min: 0,
 *   max: 10,
 *   format: 'n0',
 *   placeholder: 'number between zero and ten' }"&gt;
 * &lt;/div&gt;</pre>
 *
 * The <b>wjInputNumber</b> binding supports all read-write properties and events of 
 * the {@link InputNumber} control. The following properties provide two-way binding mode:
 * <ul>
 * 	<li><b>value</b></li>
 * 	<li><b>text</b></li>
 * </ul>
 */
export class wjInputNumber extends WjBinding {
    _getControlConstructor(): any {
        return wijmo.input.InputNumber;
    }
}

/**
 * KnockoutJS binding for the {@link InputMask} control.
 *
 * Use the {@link wjInputMask} binding to add {@link InputMask} controls to your 
 * KnockoutJS applications. For example:
 * 
 * <pre>&lt;p&gt;Here is an InputMask control:&lt;/p&gt;
 * &lt;div data-bind="wjInputMask: {
 *   mask: '99/99/99',
 *   promptChar: '*' }"&gt;
 * &lt;/div&gt;</pre>
 *
 * The <b>wjInputMask</b> binding supports all read-write properties and events of 
 * the {@link InputMask} control. The <b>value</b> property provides two-way binding mode.
 */
export class wjInputMask extends WjBinding {
    _getControlConstructor(): any {
        return wijmo.input.InputMask;
    }
}

/**
 * KnockoutJS binding for the {@link InputTime} control.
 *
 * Use the {@link wjInputTime} binding to add {@link InputTime} controls to your 
 * KnockoutJS applications. For example:
 * 
 * <pre>&lt;p&gt;Here is an InputTime control:&lt;/p&gt;
 * &lt;div data-bind="wjInputTime: {
 *   min: new Date(2014, 8, 1, 9, 0),
 *   max: new Date(2014, 8, 1, 17, 0),
 *   step: 15,
 *   format: 'h:mm tt',
 *   value: theDate }"&gt;
 * &lt;/div&gt;</pre>
 *
 * The <b>wjInputTime</b> binding supports all read-write properties and events of 
 * the {@link InputTime} control. The following properties provide two-way binding mode:
 * <ul>
 * 	<li><b>isDroppedDown</b></li>
 * 	<li><b>text</b></li>
 * 	<li><b>selectedIndex</b></li>
 * 	<li><b>selectedItem</b></li>
 * 	<li><b>selectedValue</b></li>
 *  <li><b>value</b></li>
 * </ul>
 */
export class wjInputTime extends wjComboBox {
    _getControlConstructor(): any {
        return wijmo.input.InputTime;
    }
}

/**
 * KnockoutJS binding for the {@link InputColor} control.
 *
 * Use the {@link wjInputColor} binding to add {@link InputColor} controls to your 
 * KnockoutJS applications. For example:
 * 
 * <pre>&lt;p&gt;Here is a InputColor control:&lt;/p&gt;
 * &lt;div 
 *   data-bind="wjInputColor: { value: theColor }"&gt;
 * &lt;/div&gt;</pre>
 *
 * The <b>wjInputColor</b> binding supports all read-write properties and events of 
 * the {@link InputColor} control. The following properties provide two-way binding mode:
 * <ul>
 * 	<li><b>isDroppedDown</b></li>
 * 	<li><b>text</b></li>
 * 	<li><b>value</b></li>
 * </ul>
 */
export class wjInputColor extends WjDropDownBinding {
    _getControlConstructor(): any {
        return wijmo.input.InputColor;
    }
}

// Abstract
export class WjCollectionViewBaseBinding extends WjBinding {
    _createControl(element: any): any {
        return null;
    }

    _createWijmoContext(): WjContext {
        return new WjCollectionViewContext(this);
    }

    // Returns CV template 
    _getTemplate() {
        return '';
    }
}

export class WjCollectionViewContext extends WjContext {
    private _localVM: any;
    // WARNING: Never assign a null value to _localVM.cv, because bindings to subproperties (cv.prop) will raise an exception.
    // Instead, assign this dummy _emptyCV.
    private _emptyCV = new wijmo.collections.CollectionView([]);

    init(element: any, valueAccessor: () => any, allBindings: any/*KnockoutAllBindingsAccessor*/, viewModel: any, bindingContext: any/*KnockoutBindingContext*/): any {
        element.innerHTML = (<WjCollectionViewBaseBinding>this.wjBinding)._getTemplate();
        var cv = wjKo.unwrap(valueAccessor().cv) || this._emptyCV;
        this._subscribeToCV(cv);
        this._localVM = {
            cv: wjKo.observable(cv)
        };
        var innerBindingContext = bindingContext.createChildContext(this._localVM);
        wjKo.applyBindingsToDescendants(innerBindingContext, element);

        return { controlsDescendantBindings: true };
    }

    update(element: any, valueAccessor: () => any, allBindings: any/*KnockoutAllBindingsAccessor*/, viewModel: any, bindingContext: any/*KnockoutBindingContext*/): void {
        var newCV = wjKo.unwrap(valueAccessor().cv) || this._emptyCV,
            oldCV = wjKo.unwrap(this._localVM.cv);
        if (newCV !== oldCV) {
            this._unsubscribeFromCV(oldCV);
            this._subscribeToCV(newCV);
            this._localVM.cv(newCV);
        }
    }

    private _subscribeToCV(cv: wijmo.collections.CollectionView) {
        if (cv) {
            cv.collectionChanged.addHandler(this._forceBindingsUpdate, this);
            cv.currentChanged.addHandler(this._forceBindingsUpdate, this);
            cv.pageChanged.addHandler(this._forceBindingsUpdate, this);
        }
    }

    private _unsubscribeFromCV(cv: wijmo.collections.CollectionView) {
        if (cv) {
            cv.collectionChanged.removeHandler(this._forceBindingsUpdate, this);
            cv.currentChanged.removeHandler(this._forceBindingsUpdate, this);
            cv.pageChanged.removeHandler(this._forceBindingsUpdate, this);
        }
    }

    private _forceBindingsUpdate(s, e) {
        this._localVM.cv.valueHasMutated();
    }
}

/**
 * KnockoutJS binding for an {@link ICollectionView} pager element.
 *
 * Use the {@link wjCollectionViewPager} directive to add an element that allows users to
 * navigate through the pages in a paged {@link ICollectionView}. For example:
 * 
 * <pre>Here is a CollectionViewPager:&lt;/p&gt;
 * &lt;div 
 *   data-bind="wjCollectionViewPager: { cv: myCollectionView }"&gt;
 * &lt;/div&gt;</pre>
 *
 * The {@link wjCollectionViewPager} directive has a single attribute:
 * 
 * <dl class="dl-horizontal">
 *   <dt>cv</dt>  <dd>Reference to the paged {@link ICollectionView} object to navigate.</dd>
 * </dl>
 */
export class wjCollectionViewPager extends WjCollectionViewBaseBinding {
    _getMetaDataId(): any {
        return 'CollectionViewPager';
    }

    _getTemplate() {
        return '<div class="wj-control wj-content wj-pager">' +
            '    <div class="wj-input-group">' +
            '        <span class="wj-input-group-btn" >' +
            '            <button class="wj-btn wj-btn-default" type="button"' +
            '               data-bind="click: function () { cv().moveToFirstPage() },' +
            '               disable: cv().pageIndex <= 0">' +
            '                <span class="wj-glyph-left" style="margin-right: -4px;"></span>' +
            '                <span class="wj-glyph-left"></span>' +
            '            </button>' +
            '        </span>' +
            '        <span class="wj-input-group-btn" >' +
            '           <button class="wj-btn wj-btn-default" type="button"' +
            '               data-bind="click: function () { cv().moveToPreviousPage() },' +
            '               disable: cv().pageIndex <= 0">' +
            '                <span class="wj-glyph-left"></span>' +
            '            </button>' +
            '        </span>' +
            '        <input type="text" class="wj-form-control" data-bind="' +
            '            value: cv().pageIndex + 1 + \' / \' + cv().pageCount' +
            '        " disabled />' +
            '        <span class="wj-input-group-btn" >' +
            '            <button class="wj-btn wj-btn-default" type="button"' +
            '               data-bind="click: function () { cv().moveToNextPage() },' +
            '               disable: cv().pageIndex >= cv().pageCount - 1">' +
            '                <span class="wj-glyph-right"></span>' +
            '            </button>' +
            '        </span>' +
            '        <span class="wj-input-group-btn" >' +
            '            <button class="wj-btn wj-btn-default" type="button"' +
            '               data-bind="click: function () { cv().moveToLastPage() },' +
            '               disable: cv().pageIndex >= cv().pageCount - 1">' +
            '                <span class="wj-glyph-right"></span>' +
            '                <span class="wj-glyph-right" style="margin-left: -4px;"></span>' +
            '            </button>' +
            '        </span>' +
            '    </div>' +
            '</div>';
    }
}

/**
 * KnockoutJS binding for an {@link ICollectionView} navigator element.
 *
 * Use the {@link wjCollectionViewNavigator} directive to add an element that allows users to
 * navigate through the items in an {@link ICollectionView}. For example:
 * 
 * <pre>Here is a CollectionViewNavigator:&lt;/p&gt;
 * &lt;div 
 *   data-bind="wjCollectionViewNavigator: { cv: myCollectionView }"&gt;
 * &lt;/div&gt;</pre>
 *
 * The {@link wjCollectionViewNavigator} directive has a single attribute:
 * 
 * <dl class="dl-horizontal">
 *   <dt>cv</dt>  <dd>Reference to the {@link ICollectionView} object to navigate.</dd>
 * </dl>
 */
export class wjCollectionViewNavigator extends WjCollectionViewBaseBinding {
    _getMetaDataId(): any {
        return 'CollectionViewNavigator';
    }

    _getTemplate() {
        return '<div class="wj-control wj-content wj-pager">' +
            '    <div class="wj-input-group">' +
            '        <span class="wj-input-group-btn" >' +
            '            <button class="wj-btn wj-btn-default" type="button"' +
            '               data-bind="click: function () { cv().moveCurrentToFirst() },' +
            '               disable: cv().currentPosition <= 0">' +
            '                <span class="wj-glyph-left" style="margin-right: -4px;"></span>' +
            '                <span class="wj-glyph-left"></span>' +
            '            </button>' +
            '        </span>' +
            '        <span class="wj-input-group-btn" >' +
            '           <button class="wj-btn wj-btn-default" type="button"' +
            '               data-bind="click: function () { cv().moveCurrentToPrevious() },' +
            '               disable: cv().currentPosition <= 0">' +
            '                <span class="wj-glyph-left"></span>' +
            '            </button>' +
            '        </span>' +
            '        <input type="text" class="wj-form-control" data-bind="' +
            '            value: cv().currentPosition + 1 + \' / \' + cv().itemCount' +
            '        " disabled />' +
            '        <span class="wj-input-group-btn" >' +
            '            <button class="wj-btn wj-btn-default" type="button"' +
            '               data-bind="click: function () { cv().moveCurrentToNext() },' +
            '               disable: cv().currentPosition >= cv().itemCount - 1">' +
            '                <span class="wj-glyph-right"></span>' +
            '            </button>' +
            '        </span>' +
            '        <span class="wj-input-group-btn" >' +
            '            <button class="wj-btn wj-btn-default" type="button"' +
            '               data-bind="click: function () { cv().moveCurrentToLast() },' +
            '               disable: cv().currentPosition >= cv().itemCount - 1">' +
            '                <span class="wj-glyph-right"></span>' +
            '                <span class="wj-glyph-right" style="margin-left: -4px;"></span>' +
            '            </button>' +
            '        </span>' +
            '    </div>' +
            '</div>';

    }
}

/**
 * KnockoutJS binding for the {@link MultiSelect} control.
 *
 * Use the {@link wjMultiSelect} binding to add {@link MultiSelect} controls to your
 * KnockoutJS applications. For example:
 * 
 * <pre>&lt;p&gt;Here is a MultiSelect control:&lt;/p&gt;
 * &lt;div data-bind="MultiSelect: {
 *   itemsSource: countries,
 *   isEditable: false,
 *   headerFormat: '{count} countries selected' }"&gt;
 * &lt;/div&gt;</pre>
 *
 * The <b>wjMultiSelect</b> binding supports all read-write properties and events of
 * the {@link MultiSelect} control. The following properties provide two-way binding mode:
 * <ul>
 * 	<li><b>isDroppedDown</b></li>
 * 	<li><b>text</b></li>
 * 	<li><b>selectedIndex</b></li>
 * 	<li><b>selectedItem</b></li>
 * 	<li><b>selectedValue</b></li>
 * </ul>
 */
export class wjMultiSelect extends wjComboBox {
    _getControlConstructor(): any {
        return wijmo.input.MultiSelect;
    }
}

/**
 * KnockoutJS binding for the {@link MultiAutoComplete} control.
 *
 * Use the {@link wjMultiAutoComplete} binding to add {@link MultiAutoComplete} controls to your
 * KnockoutJS applications. For example:
 * 
 * <pre>&lt;p&gt;Here is a MultiAutoComplete control:&lt;/p&gt;
 * &lt;div data-bind="MultiAutoComplete: {
 *   itemsSource: countries,
 *   maxSelectedItems: 4,}"&gt;
 * &lt;/div&gt;</pre>
 *
 * The <b>wjMultiAutoComplete</b> binding supports all read-write properties and events of
 * the {@link MultiAutoComplete} control.
 */
export class wjMultiAutoComplete extends wjAutoComplete {
    _getControlConstructor(): any {
        return wijmo.input.MultiAutoComplete;
    }
}

/**
 * KnockoutJS binding for the {@link Popup} control.
 *
 * Use the {@link wjPopup} binding to add {@link Popup} controls to your
 * KnockoutJS applications. For example:
 *
 * <pre>&lt;p&gt;Here is a Popup control triggered by a button:&lt;/p&gt;
 * &lt;button id="btn2" type="button"&gt;
 *     Click to show Popup
 * &lt;/button&gt;
 *  &lt;div class="popover" data-bind="wjPopup: {
 *       control: popup,
 *       owner: '#btn2',
 *       showTrigger: 'Click',
 *       hideTrigger: 'Click'}"
 *  &gt;
 *	&lt;h3&gt;
    *		 Salutation
    *	&lt;/h3&gt;
    *	 &lt;div class="popover-content"&gt;
    *	 	    Hello {&#8203;{firstName}} {&#8203;{lastName}}
    *	 &lt;/div&gt;
    * &lt;/div&gt;</pre>
    */
export class wjPopup extends WjBinding {
    _getControlConstructor(): any {
        return wijmo.input.Popup;
    }

    _createWijmoContext(): WjContext {
        return new WjPopupContext(this);
    }

    _initialize() {
        super._initialize();
        var ownerDesc = MetaFactory.findProp('owner', <PropDesc[]>this._metaData.props);
        ownerDesc.updateControl = function (link, propDesc, control, unconvertedValue, convertedValue): boolean {
            control.owner = convertedValue;
            (<WjPopupContext>link)._updateModal(convertedValue);
            return true;
        };
    }
}

export class WjPopupContext extends WjContext {

    _initControl() {
        super._initControl();
        // if the popup will be removed from DOM on hide, the bindings will stop to update
        (<wijmo.input.Popup>this.control).removeOnHide = false;
    }

    _updateModal(convertedValue: any) {
        var valSet = this.valueAccessor(),
            popup = <wijmo.input.Popup>this.control,
            modal = wjKo.unwrap(valSet['modal']);
        if (modal == null) {
            // not specified, make it modal if it has no owner 
            popup['modal'] = convertedValue ? false : true;
        }
    }
}


// Register bindings
(<any>(wjKo.bindingHandlers)).wjComboBox = new wjComboBox();
(<any>(wjKo.bindingHandlers)).wjAutoComplete = new wjAutoComplete();
(<any>(wjKo.bindingHandlers)).wjCalendar = new wjCalendar();
(<any>(wjKo.bindingHandlers)).wjColorPicker = new wjColorPicker();
(<any>(wjKo.bindingHandlers)).wjListBox = new wjListBox();
(<any>(wjKo.bindingHandlers)).wjMenu = new wjMenu();
(<any>(wjKo.bindingHandlers)).wjMenuItem = new wjMenuItem();
(<any>(wjKo.bindingHandlers)).wjMenuSeparator = new wjMenuSeparator();
(<any>(wjKo.bindingHandlers)).wjContextMenu = new wjContextMenu();
(<any>(wjKo.bindingHandlers)).wjInputDate = new wjInputDate();
(<any>(wjKo.bindingHandlers)).wjInputDateTime = new wjInputDateTime();
(<any>(wjKo.bindingHandlers)).wjInputNumber = new wjInputNumber();
(<any>(wjKo.bindingHandlers)).wjInputMask = new wjInputMask();
(<any>(wjKo.bindingHandlers)).wjInputTime = new wjInputTime();
(<any>(wjKo.bindingHandlers)).wjInputColor = new wjInputColor();
(<any>(wjKo.bindingHandlers)).wjCollectionViewNavigator = new wjCollectionViewNavigator();
(<any>(wjKo.bindingHandlers)).wjCollectionViewPager = new wjCollectionViewPager();
(<any>(wjKo.bindingHandlers)).wjMultiSelect = new wjMultiSelect();
(<any>(wjKo.bindingHandlers)).wjMultiAutoComplete = new wjMultiAutoComplete();
(<any>(wjKo.bindingHandlers)).wjPopup = new wjPopup();


    }
    


    module wijmo.knockout {
    

    }
    

    module wijmo.knockout {
    



var wjKo: any = window['ko'];





/**
     * KnockoutJS binding for the {@link TreeView} object.
     * Use the {@link wjTreeView} binding to add {@link TreeView} controls to your
     * KnockoutJS applications. For example:
     *  &lt;div data-bind="wjTreeView:
     *      {
     *          itemsSource: data
     *          displayMemberPath:'header'
     *          childItemsPath:'items'
     *      }"&gt;
     *  &lt;/div&gt;
     *                                    
     * The <b>wjTreeView</b> binding supports all read-write properties and events of
     * the {@link TreeView} class.
     *
     */
export class wjTreeView extends WjBinding {
    _getControlConstructor(): any {
        return wijmo.nav.TreeView;
    }
}

(<any>(wjKo.bindingHandlers)).wjTreeView = new wjTreeView();

    }
    


    module wijmo.knockout {
    

    }
    

    module wijmo.knockout {
    



var wjKo: any = window['ko'];





// Base abstract class for specific Chart type bindings
export class WjFlexChartBaseBinding extends WjBinding {
    _getControlConstructor(): any {
        return wijmo.chart.FlexChartBase;
    }

    _initialize() {
        super._initialize();
        var tooltipDesc = MetaFactory.findProp('tooltipContent', <PropDesc[]>this._metaData.props);
        tooltipDesc.updateControl = function (link, propDesc, control, unconvertedValue, convertedValue): boolean {
            if (convertedValue != null) {
                (<wijmo.chart.FlexChart>control).tooltip.content = convertedValue;
            }
            return true;
        };
    }
}

/**
 * KnockoutJS binding for the {@link FlexChart} control.
 *
 * Use the {@link wjFlexChart} binding to add {@link FlexChart} controls to your 
 * KnockoutJS applications. For example:
 * 
 * <pre>&lt;p&gt;Here is a FlexChart control:&lt;/p&gt;
 * &lt;div data-bind="wjFlexChart: { itemsSource: data }"&gt;
 *     &lt;div data-bind="wjFlexChartLegend : { 
 *         position: 'Top' }"&gt;
 *     &lt;/div&gt;
 *     &lt;div data-bind="wjFlexChartAxis: { 
 *         wjProperty: 'axisX', 
 *         title: chartProps.titleX }"&gt;
 *     &lt;/div&gt;
 *     &lt;div data-bind="wjFlexChartAxis: { 
 *         wjProperty: 'axisY', 
 *         majorUnit: 5000 }"&gt;
 *     &lt;/div&gt;
 *     &lt;div data-bind="wjFlexChartSeries: { 
 *         name: 'Sales', 
 *         binding: 'sales' }"&gt;
 *     &lt;/div&gt;
 *     &lt;div data-bind="wjFlexChartSeries: { 
 *         name: 'Expenses', 
 *         binding: 'expenses' }"&gt;
 *     &lt;/div&gt;
 *     &lt;div data-bind="wjFlexChartSeries: { 
 *         name: 'Downloads', 
 *         binding: 'downloads', 
 *         chartType: 'LineSymbols' }"&gt;
 *     &lt;/div&gt;
 * &lt;/div&gt;</pre>
 * 
 * The <b>wjFlexChart</b> binding may contain the following child bindings: 
 * {@link wjFlexChartAxis}, {@link wjFlexChartSeries}, {@link wjFlexChartLegend}.
 *
 * The <b>wjFlexChart</b> binding supports all read-write properties and events of 
 * the {@link FlexChart} control, and the additional <b>tooltipContent</b> property
 * that assigns a value to the <b>FlexChart.tooltip.content</b> property.
 * The <b>selection</b> property provides two-way binding mode.
 */
export class wjFlexChart extends WjFlexChartBaseBinding {
    _getControlConstructor(): any {
        return wijmo.chart.FlexChart;
    }

    _initialize() {
        super._initialize();

        var lblContentDesc = MetaFactory.findProp('labelContent', <PropDesc[]>this._metaData.props);
        lblContentDesc.updateControl = function (link, propDesc, control, unconvertedValue, convertedValue): boolean {
            if (convertedValue != null) {
                (<wijmo.chart.FlexChart>control).dataLabel.content = convertedValue;
            }
            return true;
        };
    }
}

/**
 * KnockoutJS binding for the {@link FlexPie} control.
 *
 * Use the {@link wjFlexPie} binding to add {@link FlexPie} controls to your 
 * KnockoutJS applications. For example:
 * 
 * <pre>&lt;p&gt;Here is a FlexPie control:&lt;/p&gt;
 * &lt;div data-bind="wjFlexPie: {
 *         itemsSource: data,
 *         binding: 'value',
 *         bindingName: 'name',
 *         header: 'Fruit By Value' }"&gt;
 *     &lt;div data-bind="wjFlexChartLegend : { position: 'Top' }"&gt;&lt;/div&gt;
 * &lt;/div&gt;</pre>
 * 
 * The <b>wjFlexPie</b> binding may contain the {@link wjFlexChartLegend} child binding. 
 *
 * The <b>wjFlexPie</b> binding supports all read-write properties and events of 
 * the {@link FlexPie} control.
 */
export class wjFlexPie extends WjFlexChartBaseBinding {
    _getControlConstructor(): any {
        return wijmo.chart.FlexPie;
    }

    _initialize() {
        super._initialize();

        var lblContentDesc = MetaFactory.findProp('labelContent', <PropDesc[]>this._metaData.props);
        lblContentDesc.updateControl = function (link, propDesc, control, unconvertedValue, convertedValue): boolean {
            if (convertedValue != null) {
                (<wijmo.chart.FlexPie>control).dataLabel.content = convertedValue;
            }
            return true;
        };
    }
}

/**
 * KnockoutJS binding for the {@link FlexChart} {@link Axis} object.
 *
 * The {@link wjFlexChartAxis} binding must be contained in a {@link wjFlexChart} binding. Use the <b>wjProperty</b>
 * attribute to specify the property (<b>axisX</b> or <b>axisY</b>) to initialize with this binding.
 * 
 * The <b>wjFlexChartAxis</b> binding supports all read-write properties and events of 
 * the {@link Axis} class.
 */
export class wjFlexChartAxis extends WjBinding {
    _getControlConstructor(): any {
        return wijmo.chart.Axis;
    }
}

/**
 * KnockoutJS binding for the Charts' {@link Legend} object.
 *
 * The {@link wjFlexChartLegend} binding must be contained in one the following bindings:
 *  {@link wjFlexChart}, {@link wjFlexPie}. 
 * 
 * The <b>wjFlexChartLegend</b> binding supports all read-write properties and events of 
 * the {@link Legend} class.
 */
export class wjFlexChartLegend extends WjBinding {
    _getControlConstructor(): any {
        return wijmo.chart.Legend;
    }
}

export class WjSeriesBase extends WjBinding {
    _getControlConstructor(): any {
        return wijmo.chart.SeriesBase;
    }

    _createControl(element: any): any {
        return super._createControl(null);
    }
}

/**
 * KnockoutJS binding for the {@link FlexChart} {@link Series} object.
 *
 * The {@link wjFlexChartSeries} binding must be contained in a {@link wjFlexChart} binding. 
 * 
 * The <b>wjFlexChartSeries</b> binding supports all read-write properties and events of 
 * the {@link Series} class. The <b>visibility</b> property provides two-way binding mode.
 */
export class wjFlexChartSeries extends WjSeriesBase {
    _getControlConstructor(): any {
        return wijmo.chart.Series;
    }

    _createWijmoContext(): WjContext {
        return new WjFlexChartSeriesContext(this);
    }
}

export class WjFlexChartSeriesContext extends WjContext {
    _initControl() {
        super._initControl();
        //Update bindings to the visibility property on parent Chart seriesVisibilityChanged event.
        var parentCtrl = this.parentWjContext.control;
        if (parentCtrl instanceof wijmo.chart.FlexChart) {
            (<wijmo.chart.FlexChart>parentCtrl).seriesVisibilityChanged.addHandler((s, e) => {
                this._updateSource();
            });
        }
    }
}

/**
 * KnockoutJS binding for the {@link LineMarker} control.
 *
 * Use the {@link wjFlexChartLineMarker} binding to add {@link LineMarker} controls to your
 * KnockoutJS applications. For example:
 * 
 * <pre>&lt;p&gt;Here is a LineMarker:&lt;/p&gt;
 * &lt;div data-bind="wjFlexChart: { itemsSource: data, bindingX: 'country' }"&gt;
 *     &lt;div data-bind="wjFlexChartAxis: { wjProperty: 'axisX', title: 'country' }"&gt;&lt;/div&gt;
 *     &lt;div data-bind="wjFlexChartSeries: { name: 'Sales', binding: 'sales' }"&gt;&lt;/div&gt;
 *     &lt;div data-bind="wjFlexChartSeries: { name: 'Expenses', binding: 'expenses' }"&gt;&lt;/div&gt;
 *     &lt;div data-bind="wjFlexChartSeries: { name: 'Downloads', binding: 'downloads' }"&gt;&lt;/div&gt;
 *     &lt;div data-bind="wjFlexChartLineMarker: { interaction: 'Move', lines: 'Both' }"&gt;&lt;/div&gt;
 * &lt;/div&gt;</pre>
 * 
 *
 * The <b>wjFlexChartLineMarker</b> binding supports all read-write properties and events of
 * the {@link LineMarker} class.
 */
export class wjFlexChartLineMarker extends WjBinding {
    _getControlConstructor(): any {
        return wijmo.chart.LineMarker;
    }
}

/**
 * KnockoutJS binding for the {@link PlotArea} object.
 *
 * Use the {@link wjFlexChartPlotArea} binding to add {@link PlotArea} object to your
 * KnockoutJS applications. For example:
 * 
 * <pre>&lt;p&gt;Here is a PlotArea:&lt;/p&gt;
 * &lt;div data-bind="wjFlexChart: { itemsSource: data, bindingX: 'country' }"&gt;
 *     &lt;div data-bind="wjFlexChartAxis: { wjProperty: 'axisX', title: 'country' }"&gt;&lt;/div&gt;
 *     &lt;div data-bind="wjFlexChartSeries: { name: 'Sales', binding: 'sales' }"&gt;&lt;/div&gt;
 *     &lt;div data-bind="wjFlexChartPlotArea: { row:0, name:'plot1', style:{ fill: 'rgba(136,189,230,0.2)'} }  "&gt;&lt;/div&gt;
 * &lt;/div&gt;</pre>
 *
 * The <b>wjFlexChartPlotArea</b> binding supports all read-write properties and events of
 * the {@link PlotArea} class.
 */
export class wjFlexChartPlotArea extends WjBinding {
    _getControlConstructor(): any {
        return wijmo.chart.PlotArea;
    }
}

/**
 * KnockoutJS binding for the {@link DataPoint} object.

    * The <b>wjFlexChartDataPoint</b> must be contained in a
    * {@link wjFlexChartAnnotation}. The property of the parent object
    * where <b>wjFlexChartDataPoint</b> should assign a value is specified in the
    * <b>wjProperty</b> attribute.
    *
    * Use the {@link wjFlexChartDataPoint} binding to add {@link DataPoint} object to your
    * KnockoutJS applications. For example:
    * 
    * <pre>&lt;p&gt;Here is a DataPoint:&lt;/p&gt;
    *   &lt;div data-bind="wjFlexChartDataPoint: { wjProperty: 'point', x: 0.9, y:0.4}" &gt;&lt;/div&gt;
    *  </pre>
    *
    * The <b>wjFlexChartDataPoint</b> binding supports all read-write properties and events of
    * the {@link DataPoint} class.
    */
export class wjFlexChartDataPoint extends WjBinding {
    _getControlConstructor(): any {
        return wijmo.chart.DataPoint;
    }
}

 

// Register bindings
(<any>(wjKo.bindingHandlers)).wjFlexChart = new wjFlexChart();
(<any>(wjKo.bindingHandlers)).wjFlexPie = new wjFlexPie();
(<any>(wjKo.bindingHandlers)).wjFlexChartAxis = new wjFlexChartAxis();
(<any>(wjKo.bindingHandlers)).wjFlexChartLegend = new wjFlexChartLegend();
(<any>(wjKo.bindingHandlers)).wjFlexChartSeries = new wjFlexChartSeries();
(<any>(wjKo.bindingHandlers)).wjFlexChartLineMarker = new wjFlexChartLineMarker();
(<any>(wjKo.bindingHandlers)).wjFlexChartPlotArea = new wjFlexChartPlotArea();
(<any>(wjKo.bindingHandlers)).wjFlexChartDataPoint = new wjFlexChartDataPoint();

    }
    


    module wijmo.knockout {
    

    }
    

    module wijmo.knockout {
    



var wjKo: any = window['ko'];







export class WjTrendLineBase extends WjSeriesBase {
    _getControlConstructor(): any {
        return wijmo.chart.analytics.TrendLineBase;
    }
}

/**
 * KnockoutJS binding for the {@link TrendLine} object.
 *
 * Use the {@link wjFlexChartTrendLine} binding to add {@link TrendLine} object to your
 * KnockoutJS applications. For example:
 * 
 * <pre>&lt;p&gt;Here is a TrendLine:&lt;/p&gt;
 * &lt;div data-bind="wjFlexChart: { itemsSource: data, bindingX: 'country',chartType:'Column' }"&gt;
 *     &lt;div data-bind="wjFlexChartAxis: { wjProperty: 'axisX', title: 'country' }"&gt;&lt;/div&gt;
 *     &lt;div data-bind="wjFlexChartSeries: { name: 'Sales', binding: 'sales' }"&gt;&lt;/div&gt;
 *     &lt;div data-bind="wjFlexChartAnimation: { animationMode: 'Series',easing:'Swing',duration:2000 }  "&gt;&lt;/div&gt;
 * &lt;/div&gt;</pre>
 *
 * The <b>wjFlexChartTrendLine</b> binding supports all read-write properties and events of
 * the {@link TrendLine} class.
 */
export class wjFlexChartTrendLine extends WjTrendLineBase {
    _getControlConstructor(): any {
        return wijmo.chart.analytics.TrendLine;
    }
}

/**
 * KnockoutJS binding for the {@link MovingAverage} object.
 *
 * Use the {@link wjFlexChartMovingAverage} binding to add {@link MovingAverage} object to your
 * KnockoutJS applications. For example:
 * 
 * <pre>&lt;p&gt;Here is a MovingAverage:&lt;/p&gt;
 * &lt;div data-bind="wjFlexChart: { itemsSource: trendItemsSource, bindingX: 'x' }"&gt;
 *     &lt;div data-bind="wjFlexChartAxis: { wjProperty: 'axisX', title: 'country' }"&gt;&lt;/div&gt;
 *     &lt;div data-bind="wjFlexChartSeries: { chartType: 'Scatter', name: 'Base Data', binding: 'y' }"&gt;&lt;/div&gt;
 *     &lt;div data-bind="wjFlexChartMovingAverage: { binding: 'y', bindingX: 'x', period:2 }  "&gt;&lt;/div&gt;
 * &lt;/div&gt;</pre>
 *
 * The <b>wjFlexChartMovingAverage</b> binding supports all read-write properties and events of
 * the {@link MovingAverage} class.
 */
export class wjFlexChartMovingAverage extends WjTrendLineBase {
    _getControlConstructor(): any {
        return wijmo.chart.analytics.MovingAverage;
    }
}

/**
 * KnockoutJS binding for the {@link YFunctionSeries} object.
 *
 * Use the {@link wjFlexChartYFunctionSeries} binding to add {@link YFunctionSeries} object to your
 * KnockoutJS applications. For example:
 * 
 * <pre>&lt;p&gt;Here is a YFunctionSeries:&lt;/p&gt;
 * &lt;div data-bind="wjFlexChart: { itemsSource: trendItemsSource, bindingX: 'x' }"&gt;
 *     &lt;div data-bind="wjFlexChartYFunctionSeries: {  min: 10, max: -10, sampleCount:100,func:func }"&gt;&lt;/div&gt;
 * &lt;/div&gt;</pre>
 *
 * The <b>wjFlexChartYFunctionSeries</b> binding supports all read-write properties and events of
 * the {@link YFunctionSeries} class.
 */
export class wjFlexChartYFunctionSeries extends WjTrendLineBase {
    _getControlConstructor(): any {
        return wijmo.chart.analytics.YFunctionSeries;
    }
}

/**
 * KnockoutJS binding for the {@link ParametricFunctionSeries} object.
 *
 * Use the {@link wjFlexChartParametricFunctionSeries} binding to add {@link ParametricFunctionSeries} object to your
 * KnockoutJS applications. For example:
 * 
 * <pre>&lt;p&gt;Here is a ParametricFunctionSeries:&lt;/p&gt;
 * &lt;div data-bind="wjFlexChart: { itemsSource: trendItemsSource, bindingX: 'x' }"&gt;
 *     &lt;div data-bind="wjFlexChartSeries: { name: 'Sales', binding: 'sales' }"&gt;&lt;/div&gt;
 *     &lt;div data-bind="wjFlexChartParametricFunctionSeries: {  sampleCount:1000, max: max,xFunc:xFunc,yFunc:yFunc  }"&gt;&lt;/div&gt;
 * &lt;/div&gt;</pre>
 *
 * The <b>wjFlexChartParametricFunctionSeries</b> binding supports all read-write properties and events of
 * the {@link ParametricFunctionSeries} class.
 */
export class wjFlexChartParametricFunctionSeries extends WjTrendLineBase {
    _getControlConstructor(): any {
        return wijmo.chart.analytics.ParametricFunctionSeries;
    }

    _initialize() {
        super._initialize();
        var funcDesc = MetaFactory.findProp('func', <PropDesc[]>this._metaData.props);
        funcDesc.updateControl = function (link, propDesc, control, unconvertedValue, convertedValue): boolean {
            if (convertedValue != null) {
                (<wijmo.chart.analytics.ParametricFunctionSeries>control).xFunc = convertedValue;
            }
            return true;
        };
    }
}

/**
 * KnockoutJS binding for the {@link Waterfall} object.
 *
 * Use the {@link wjFlexChartWaterfall} binding to add {@link Waterfall} object to your
 * KnockoutJS applications. For example:
 * 
 * <pre>&lt;p&gt;Here is a Waterfall:&lt;/p&gt;
 * &lt;div data-bind="wjFlexChart: { itemsSource: trendItemsSource,  binding:'value',bindingX: 'name' }"&gt;
 *     &lt;div data-bind="wjFlexChartWaterfall: {  relativeData:true, connectorLines: true, start:1000,showIntermediateTotal: true,
 *                       intermediateTotalPositions: [3, 6, 9, 12], intermediateTotalLabels: ['Q1', 'Q2', 'Q3', 'Q4'],name:'Increase,Decrease,Total'}"&gt;&lt;/div&gt;
 * &lt;/div&gt;</pre>
 *
 * The <b>wjFlexChartWaterfall</b> binding supports all read-write properties and events of
 * the {@link Waterfall} class.
 */
export class wjFlexChartWaterfall extends WjSeriesBase {
    _getControlConstructor(): any {
        return wijmo.chart.analytics.Waterfall;
    }
}


(<any>(wjKo.bindingHandlers)).wjFlexChartTrendLine = new wjFlexChartTrendLine();
(<any>(wjKo.bindingHandlers)).wjFlexChartMovingAverage = new wjFlexChartMovingAverage();
(<any>(wjKo.bindingHandlers)).wjFlexChartYFunctionSeries = new wjFlexChartYFunctionSeries();
(<any>(wjKo.bindingHandlers)).wjFlexChartParametricFunctionSeries = new wjFlexChartParametricFunctionSeries();
(<any>(wjKo.bindingHandlers)).wjFlexChartWaterfall = new wjFlexChartWaterfall();

    }
    


    module wijmo.knockout {
    

    }
    

    module wijmo.knockout {
    



var wjKo: any = window['ko'];






/**
 * KnockoutJS binding for the {@link ChartAnimation} object.
 *
 * Use the {@link wjFlexChartAnimation} binding to add {@link ChartAnimation} object to your
 * KnockoutJS applications. For example:
 * 
 * <pre>&lt;p&gt;Here is a ChartAnimation:&lt;/p&gt;
 * &lt;div data-bind="wjFlexChart: { itemsSource: data, bindingX: 'country',chartType:'Column' }"&gt;
 *     &lt;div data-bind="wjFlexChartAxis: { wjProperty: 'axisX', title: 'country' }"&gt;&lt;/div&gt;
 *     &lt;div data-bind="wjFlexChartSeries: { name: 'Sales', binding: 'sales' }"&gt;&lt;/div&gt;
 *     &lt;div data-bind="wjFlexChartAnimation: { animationMode: 'Series',easing:'Swing',duration:2000 }  "&gt;&lt;/div&gt;
 * &lt;/div&gt;</pre>
 *
 * The <b>wjFlexChartAnimation</b> binding supports all read-write properties and events of
 * the {@link ChartAnimation} class.
 */
export class wjFlexChartAnimation extends WjBinding {
    _getControlConstructor(): any {
        return wijmo.chart.animation.ChartAnimation;
    }
}


(<any>(wjKo.bindingHandlers)).wjFlexChartAnimation = new wjFlexChartAnimation();

    }
    


    module wijmo.knockout {
    

    }
    

    module wijmo.knockout {
    



var wjKo: any = window['ko'];






/**
 * KnockoutJS binding for the {@link AnnotationLayer} object.
 *
 * Use the {@link wjFlexChartAnnotationLayer} binding to add {@link AnnotationLayer} object to your
 * KnockoutJS applications. For example:
 * 
 * <pre>&lt;p&gt;Here is a AnnotationLayer:&lt;/p&gt;
 *&lt;div data-bind="wjFinancialChart: { itemsSource: fData, bindingX: 'date', chartType:'Candlestick' }"&gt;
    *    &lt;div data-bind="wjFinancialChartSeries: { bindingX: 'date', binding: 'high,low,open,close' }"&gt;&lt;/div&gt;
    *    &lt;div data-bind="wjFlexChartAnnotationLayer: {}"&gt;
    *        &lt;div data-bind="wjFlexChartAnnotation: { type: 'Rectangle', content: 'E',height:20, width:20,attachment:'DataIndex',pointIndex: 10}"&gt;&lt;/div&gt;
    *        &lt;div data-bind="wjFlexChartAnnotation: { type: 'Ellipse', content: 'E',height:20, width:20,attachment:'DataIndex',pointIndex: 30}"&gt;&lt;/div&gt;
    *    &lt;/div&gt;
    &lt;/div&gt;</pre>
    *
    * The <b>wjFlexChartAnnotationLayer</b> binding supports all read-write properties and events of
    * the {@link AnnotationLayer} class.
    */
   export class wjFlexChartAnnotationLayer extends WjBinding {
    _getControlConstructor(): any {
        return wijmo.chart.annotation.AnnotationLayer;
    }
}

/**
 * KnockoutJS binding for annotations.
 *
 * The <b>wjFlexChartAnnotation</b> must be contained in a
 * {@link wjFlexChartAnnotationLayer} binding.For example:
 * <pre>&lt;p&gt;Here is a AnnotationLayer:&lt;/p&gt;
 *&lt;div data-bind="wjFinancialChart: { itemsSource: fData, bindingX: 'date', chartType:'Candlestick' }"&gt;
    *    &lt;div data-bind="wjFinancialChartSeries: { bindingX: 'date', binding: 'high,low,open,close' }"&gt;&lt;/div&gt;
    *    &lt;div data-bind="wjFlexChartAnnotationLayer: {}"&gt;
    *        &lt;div data-bind="wjFlexChartAnnotation: { type: 'Rectangle', content: 'E',height:20, width:20,attachment:'DataIndex',pointIndex: 10}"&gt;&lt;/div&gt;
    *        &lt;div data-bind="wjFlexChartAnnotation: { type: 'Ellipse', content: 'E',height:20, width:20,attachment:'DataIndex',pointIndex: 30}"&gt;&lt;/div&gt;
    *    &lt;/div&gt;
    &lt;/div&gt;</pre>
    *
    * The <b>wjFlexChartAnnotation</b> is used to represent all types of
    * possible annotation shapes like <b>Circle</b>, <b>Rectangle</b>, <b>Polygon</b>
    * and so on. The type of annotation shape is specified
    * in the <b>type</b> attribute.
    */
export class wjFlexChartAnnotation extends WjBinding {

    _context;

    _createControl(element: any): any {
        return this._context._createAnnotation();
    }

    _getMetaDataId(): any {
        return 'FlexChartAnnotation';
    }

    _createWijmoContext(): WjContext {
        this._context = new wjFlexChartAnnotationContext(this);
        return this._context;
    }
}

export class wjFlexChartAnnotationContext extends WjContext {

    _createAnnotation() {
        var valSet = this.valueAccessor(),
            type = wjKo.unwrap(valSet['type']);
        return new wijmo.chart.annotation[type]();
    }
}


(<any>(wjKo.bindingHandlers)).wjFlexChartAnnotationLayer = new wjFlexChartAnnotationLayer();
(<any>(wjKo.bindingHandlers)).wjFlexChartAnnotation = new wjFlexChartAnnotation();

    }
    


    module wijmo.knockout {
    

    }
    

    module wijmo.knockout {
    



var wjKo: any = window['ko'];






/**
 * KnockoutJS binding for the {@link FinancialChart} control.
 *
 * Use the {@link wjFinancialChart} binding to add {@link FinancialChart} controls to your
 * KnockoutJS applications. For example:
 * 
 * <pre>&lt;p&gt;Here is a FinancialChart control:&lt;/p&gt;
 * &lt;div data-bind="wjFinancialChart: { itemsSource: data, chartType: 'Candlestick' }"&gt;
 *     &lt;div data-bind="wjFlexChartLegend : { 
 *         position: 'Top' }"&gt;
 *     &lt;/div&gt;
 *     &lt;div data-bind="wjFinancialChartSeries: {
 *          name: 'close', 
 *         binding: 'high,low,open,close' }"&gt;
 *     &lt;/div&gt;
 *     &lt;/div&gt;
 * &lt;/div&gt;</pre>
 * 
 * The <b>wjFinancialChart</b> binding may contain the following child bindings:
 * {@link wjFlexChartAxis}, {@link wjFinancialChartSeries}, {@link wjFlexChartLegend}.
 *
 * The <b>wjFinancialChart</b> binding supports all read-write properties and events of
 * the {@link FinancialChart} control, and the additional <b>tooltipContent</b> property
 * that assigns a value to the <b>FinancialChart.tooltip.content</b> property.
 * The <b>selection</b> property provides two-way binding mode.
 */
export class wjFinancialChart extends WjFlexChartBaseBinding {
    _getControlConstructor(): any {
        return wijmo.chart.finance.FinancialChart;
    }

    _initialize() {
        super._initialize();

        var lblContentDesc = MetaFactory.findProp('labelContent', <PropDesc[]>this._metaData.props);
        lblContentDesc.updateControl = function (link, propDesc, control, unconvertedValue, convertedValue): boolean {
            if (convertedValue != null) {
                (<wijmo.chart.finance.FinancialChart>control).dataLabel.content = convertedValue;
            }
            return true;
        };
    }
}

/**
 * KnockoutJS binding for the {@link FinancialChart} {@link FinancialSeries} object.
 *
 * The {@link WjFinancialChartSeries} binding must be contained in a {@link wjFinancialChart} binding.
 * 
 * The <b>WjFinancialChartSeries</b> binding supports all read-write properties and events of
 * the {@link FinancialSeries} class. The <b>visibility</b> property provides two-way binding mode.
 */
export class wjFinancialChartSeries extends WjBinding {
    _getControlConstructor(): any {
        return wijmo.chart.finance.FinancialSeries;
    }

    _createWijmoContext(): WjContext {
        return new WjFinancialChartSeriesContext(this);
    }
}

export class WjFinancialChartSeriesContext extends WjContext {
    _initControl() {
        super._initControl();
        //Update bindings to the visibility property on parent Chart seriesVisibilityChanged event.
        var parentCtrl = this.parentWjContext.control;
        if (parentCtrl instanceof wijmo.chart.finance.FinancialChart) {
            (<wijmo.chart.finance.FinancialChart>parentCtrl).seriesVisibilityChanged.addHandler((s, e) => {
                this._updateSource();
            });
        }
    }
}

(<any>(wjKo.bindingHandlers)).wjFinancialChart = new wjFinancialChart();
(<any>(wjKo.bindingHandlers)).wjFinancialChartSeries = new wjFinancialChartSeries();

    }
    


    module wijmo.knockout {
    

    }
    

    module wijmo.knockout {
    



var wjKo: any = window['ko'];






/**
 * KnockoutJS binding for the {@link Fibonacci} object.
 *
 * Use the {@link wjFlexChartFibonacci} binding to add {@link Fibonacci} object to your
 * KnockoutJS applications. For example:
 * 
 * <pre>&lt;p&gt;Here is a Fibonacci:&lt;/p&gt;
 *    &lt;div data-bind="wjFinancialChart: { itemsSource: fData, bindingX: 'date', chartType:'Candlestick' }"&gt;
 *         &lt;div data-bind="wjFinancialChartSeries: { bindingX: 'date', binding: 'high,low,open,close' }"&gt;&lt;/div&gt;
 *         &lt;div data-bind="wjFlexChartFibonacci: { binding:'close', symbolSize:1, labelPosition: 'Left',  uptrend: true}"&gt;&lt;/div&gt;
 *   &lt;/div&gt;</pre>
 *
 * The <b>wjFlexChartFibonacci</b> binding supports all read-write properties and events of
 * the {@link Fibonacci} class.
 */
export class wjFlexChartFibonacci extends WjSeriesBase {
    _getControlConstructor(): any {
        return wijmo.chart.finance.analytics.Fibonacci;
    }

    _createControl(element: any): any {
        return new wijmo.chart.finance.analytics.Fibonacci();
    }
}

/**
 * KnockoutJS binding for the {@link FibonacciArcs} object.
 *
 * Use the {@link wjFlexChartFibonacciArcs} binding to add {@link FibonacciArcs} object to your
 * KnockoutJS applications. For example:
 * 
 * <pre>&lt;p&gt;Here is a FibonacciArcs:&lt;/p&gt;
 *    &lt;div data-bind="wjFinancialChart: { itemsSource: fData, bindingX: 'date', chartType:'Candlestick' }"&gt;
 *         &lt;div data-bind="wjFinancialChartSeries: { bindingX: 'date', binding: 'high,low,open,close' }"&gt;&lt;/div&gt;
 *         &lt;div data-bind="wjFlexChartFibonacciArcs: { binding:'close', start:start, end: end,  labelPosition: 'Top'}"&gt;&lt;/div&gt;
 *   &lt;/div&gt;</pre>
 *
 * The <b>wjFlexChartFibonacciArcs</b> binding supports all read-write properties and events of
 * the {@link FibonacciArcs} class.
 */
export class wjFlexChartFibonacciArcs extends WjSeriesBase {
    _getControlConstructor(): any {
        return wijmo.chart.finance.analytics.FibonacciArcs;
    }
    _createControl(element: any): any {
        return new wijmo.chart.finance.analytics.FibonacciArcs();
    }
}

/**
 * KnockoutJS binding for the {@link FibonacciFans} object.
 *
 * Use the {@link wjFlexChartFibonacciFans} binding to add {@link FibonacciFans} object to your
 * KnockoutJS applications. For example:
 * 
 * <pre>&lt;p&gt;Here is a FibonacciFans:&lt;/p&gt;
 *    &lt;div data-bind="wjFinancialChart: { itemsSource: fData, bindingX: 'date', chartType:'Candlestick' }"&gt;
 *         &lt;div data-bind="wjFinancialChartSeries: { bindingX: 'date', binding: 'high,low,open,close' }"&gt;&lt;/div&gt;
 *         &lt;div data-bind="wjFlexChartFibonacciFans: { binding:'close', start:start, end: end,  labelPosition: 'Top'}"&gt;&lt;/div&gt;
 *   &lt;/div&gt;</pre>
 *
 * The <b>wjFlexChartFibonacciFans</b> binding supports all read-write properties and events of
 * the {@link FibonacciFans} class.
 */
export class wjFlexChartFibonacciFans extends WjSeriesBase {
    _getControlConstructor(): any {
        return wijmo.chart.finance.analytics.FibonacciFans;
    }
    _createControl(element: any): any {
        return new wijmo.chart.finance.analytics.FibonacciFans();
    }
}

    /**
 * KnockoutJS binding for the {@link FibonacciTimeZones} object.
 *
 * Use the {@link wjFlexChartFibonacciTimeZones} binding to add {@link FibonacciTimeZones} object to your
 * KnockoutJS applications. For example:
 * 
 * <pre>&lt;p&gt;Here is a FibonacciTimeZones:&lt;/p&gt;
 *    &lt;div data-bind="wjFinancialChart: { itemsSource: fData, bindingX: 'date', chartType:'Candlestick' }"&gt;
 *         &lt;div data-bind="wjFinancialChartSeries: { bindingX: 'date', binding: 'high,low,open,close' }"&gt;&lt;/div&gt;
 *         &lt;div data-bind="wjFlexChartFibonacciTimeZones: { binding:'close', startX:zStart, endX: zEnd,  labelPosition: 'Right'}"&gt;&lt;/div&gt;
 *   &lt;/div&gt;</pre>
 *
 * The <b>wjFlexChartFibonacciTimeZones</b> binding supports all read-write properties and events of
 * the {@link FibonacciTimeZones} class.
 */
export class wjFlexChartFibonacciTimeZones extends WjSeriesBase {
    _getControlConstructor(): any {
        return wijmo.chart.finance.analytics.FibonacciTimeZones;
    }
    _createControl(element: any): any {
        return new wijmo.chart.finance.analytics.FibonacciTimeZones();
    }
}


// abstract for FinancialChart's overlays and indicators
export class WjBaseOverlayIndicator extends WjSeriesBase {

        _getControlConstructor(): any {
        return wijmo.chart.finance.analytics.OverlayIndicatorBase;
    }
}

// abstract for FinancialChart's overlays and indicators
export class WjBaseSingleOverlayIndicator extends WjBaseOverlayIndicator {

    _getControlConstructor(): any {
        return wijmo.chart.finance.analytics.SingleOverlayIndicatorBase;
    }
}

    /**
 * KnockoutJS binding for the {@link ATR} object.
 *
 * Use the {@link wjFlexChartAtr} binding to add {@link ATR} object to your
 * KnockoutJS applications. For example:
 * 
 * <pre>&lt;p&gt;Here is a ATR:&lt;/p&gt;
 *    &lt;div data-bind="wjFinancialChart: { itemsSource: fData, bindingX: 'date'}"&gt;
 *         &lt;div data-bind="wjFlexChartAtr: { binding: 'high,low,open,close',period:'14' }"&gt;&lt;/div&gt;
 *   &lt;/div&gt;</pre>
 *
 * The <b>wjFlexChartAtr</b> binding supports all read-write properties and events of
 * the {@link ATR} class.
 */
export class wjFlexChartAtr extends WjBaseSingleOverlayIndicator {
    _getControlConstructor(): any {
        return wijmo.chart.finance.analytics.ATR;
    }
}

/**
 * KnockoutJS binding for the {@link CCI} object.
 *
 * Use the {@link wjFlexChartCci} binding to add {@link CCI} object to your
 * KnockoutJS applications. For example:
 * 
 * <pre>&lt;p&gt;Here is a CCI:&lt;/p&gt;
 *    &lt;div data-bind="wjFinancialChart: { itemsSource: fData, bindingX: 'date'}"&gt;
 *         &lt;div data-bind="wjFlexChartCci: { binding: 'high,low,open,close',period:20 }"&gt;&lt;/div&gt;
 *   &lt;/div&gt;</pre>
 *
 * The <b>wjFlexChartCci</b> binding supports all read-write properties and events of
 * the {@link CCI} class.
 */
export class wjFlexChartCci extends WjBaseSingleOverlayIndicator {
    _getControlConstructor(): any {
        return wijmo.chart.finance.analytics.CCI;
    }
}

/**
 * KnockoutJS binding for the {@link RSI} object.
 *
 * Use the {@link wjFlexChartRsi} binding to add {@link RSI} object to your
 * KnockoutJS applications. For example:
 * 
 * <pre>&lt;p&gt;Here is a RSI:&lt;/p&gt;
 *    &lt;div data-bind="wjFinancialChart: { itemsSource: fData, bindingX: 'date', chartType:'Candlestick' }"&gt;
 *         &lt;div data-bind="wjFlexChartRsi: { binding: 'high,low,open,close',period:20 }"&gt;&lt;/div&gt;
 *   &lt;/div&gt;</pre>
 *
 * The <b>wjFlexChartRsi</b> binding supports all read-write properties and events of
 * the {@link RSI} class.
 */
export class wjFlexChartRsi extends WjBaseSingleOverlayIndicator {
    _getControlConstructor(): any {
        return wijmo.chart.finance.analytics.RSI;
    }
}

/**
 * KnockoutJS binding for the {@link WilliamsR} object.
 *
 * Use the {@link wjFlexChartWilliamsR} binding to add {@link WilliamsR} object to your
 * KnockoutJS applications. For example:
 * 
 * <pre>&lt;p&gt;Here is a WilliamsR:&lt;/p&gt;
 *    &lt;div data-bind="wjFinancialChart: { itemsSource: fData, bindingX: 'date'}"&gt;
 *         &lt;div data-bind="wjFlexChartWilliamsR: { binding: 'high,low,open,close',period:20 }"&gt;&lt;/div&gt;
 *   &lt;/div&gt;</pre>
 *
 * The <b>wjFlexChartWilliamsR</b> binding supports all read-write properties and events of
 * the {@link WilliamsR} class.
 */
export class wjFlexChartWilliamsR extends WjBaseSingleOverlayIndicator {
    _getControlConstructor(): any {
        return wijmo.chart.finance.analytics.WilliamsR;
    }
}

export class WjFlexChartMacdBase extends WjBaseOverlayIndicator {
    _getControlConstructor(): any {
        return wijmo.chart.finance.analytics.MacdBase;
    }
}

/**
 * KnockoutJS binding for the {@link Macd} object.
 *
 * Use the {@link wjFlexChartMacd} binding to add {@link Macd} object to your
 * KnockoutJS applications. For example:
 * 
 * <pre>&lt;p&gt;Here is a Macd:&lt;/p&gt;
 *    &lt;div data-bind="wjFinancialChart: { itemsSource: fData, bindingX: 'date'}"&gt;
 *         &lt;div data-bind="wjFlexChartMacd: { binding: 'close',fastPeriod:12, slowPeriod: 26,smoothingPeriod: 9 }" &gt;&lt;/div&gt;
 *   &lt;/div&gt;</pre>
 *
 * The <b>wjFlexChartMacd</b> binding supports all read-write properties and events of
 * the {@link Macd} class.
 */
export class wjFlexChartMacd extends WjFlexChartMacdBase {
    _getControlConstructor(): any {
        return wijmo.chart.finance.analytics.Macd;
    }
}

/**
 * KnockoutJS binding for the {@link MacdHistogram} object.
 *
 * Use the {@link wjFlexChartMacdHistogram} binding to add {@link MacdHistogram} object to your
 * KnockoutJS applications. For example:
 * 
 * <pre>&lt;p&gt;Here is a MacdHistogram:&lt;/p&gt;
 *    &lt;div data-bind="wjFinancialChart: { itemsSource: fData, bindingX: 'date'}"&gt;
 *         &lt;div data-bind="WjFlexChartMacdHistogram: { binding: 'close',fastPeriod:12, slowPeriod: 26,smoothingPeriod: 9 }" &gt;&lt;/div&gt;
 *   &lt;/div&gt;</pre>
 *
 * The <b>wjFlexChartMacdHistogram</b> binding supports all read-write properties and events of
 * the {@link MacdHistogram} class.
 */
export class wjFlexChartMacdHistogram extends WjFlexChartMacdBase {
    _getControlConstructor(): any {
        return wijmo.chart.finance.analytics.MacdHistogram;
    }
}

/**
 * KnockoutJS binding for the {@link Stochastic} object.
 *
 * Use the {@link wjFlexChartStochastic} binding to add {@link Stochastic} object to your
 * KnockoutJS applications. For example:
 * 
 * <pre>&lt;p&gt;Here is a Stochastic:&lt;/p&gt;
 *    &lt;div data-bind="wjFinancialChart: { itemsSource: fData, bindingX: 'date'}"&gt;
 *         &lt;div data-bind="wjFlexChartStochastic: { binding: 'high,low,open,close',kPeriod:14,dPeriod:3,smoothingPeriod: 1 }" &gt;&lt;/div&gt;
 *   &lt;/div&gt;</pre>
 *
 * The <b>wjFlexChartStochastic</b> binding supports all read-write properties and events of
 * the {@link Stochastic} class.
 */
export class wjFlexChartStochastic extends WjBaseOverlayIndicator {
    _getControlConstructor(): any {
        return wijmo.chart.finance.analytics.Stochastic;
    }
}

/**
 * KnockoutJS binding for the {@link BollingerBands} object.
 *
 * Use the {@link wjFlexChartBollingerBands} binding to add {@link BollingerBands} object to your
 * KnockoutJS applications. For example:
 * 
 * <pre>&lt;p&gt;Here is a BollingerBands:&lt;/p&gt;
 *    &lt;div data-bind="wjFinancialChart: { itemsSource: fData, bindingX: 'date'}"&gt;
 *         &lt;div data-bind="wjFlexChartStochastic: { binding: 'high,low,open,close',kPeriod:14,dPeriod:3,smoothingPeriod: 1 }" &gt;&lt;/div&gt;
 *   &lt;/div&gt;</pre>
 *
 * The <b>wjFlexChartBollingerBands</b> binding supports all read-write properties and events of
 * the {@link BollingerBands} class.
 */
export class wjFlexChartBollingerBands extends WjBaseOverlayIndicator {
    _getControlConstructor(): any {
        return wijmo.chart.finance.analytics.BollingerBands;
    }
}


/**
 * KnockoutJS binding for the {@link Envelopes} object.
 *
 * Use the {@link wjFlexChartEnvelopes} binding to add {@link Envelopes} object to your
 * KnockoutJS applications. For example:
 * 
 * <pre>&lt;p&gt;Here is a Envelopes:&lt;/p&gt;
 *    &lt;div data-bind="wjFinancialChart: { itemsSource: fData, bindingX: 'date'}"&gt;
 *         &lt;div data-bind="wjFlexChartEnvelopes: { binding:'close', type:'Simple', size: 0.03, period:20}" &gt;&lt;/div&gt;
 *   &lt;/div&gt;</pre>
 *
 * The <b>wjFlexChartEnvelopes</b> binding supports all read-write properties and events of
 * the {@link Envelopes} class.
 */
export class wjFlexChartEnvelopes extends WjBaseOverlayIndicator {
    _getControlConstructor(): any {
        return wijmo.chart.finance.analytics.Envelopes;
    }
}


(<any>(wjKo.bindingHandlers)).wjFlexChartFibonacci = new wjFlexChartFibonacci();
(<any>(wjKo.bindingHandlers)).wjFlexChartFibonacciArcs = new wjFlexChartFibonacciArcs();
(<any>(wjKo.bindingHandlers)).wjFlexChartFibonacciFans = new wjFlexChartFibonacciFans();
(<any>(wjKo.bindingHandlers)).wjFlexChartFibonacciTimeZones = new wjFlexChartFibonacciTimeZones();
(<any>(wjKo.bindingHandlers)).wjFlexChartAtr = new wjFlexChartAtr();
(<any>(wjKo.bindingHandlers)).wjFlexChartCci = new wjFlexChartCci();
(<any>(wjKo.bindingHandlers)).wjFlexChartRsi = new wjFlexChartRsi();
(<any>(wjKo.bindingHandlers)).wjFlexChartWilliamsR = new wjFlexChartWilliamsR();
(<any>(wjKo.bindingHandlers)).wjFlexChartMacd = new wjFlexChartMacd();
(<any>(wjKo.bindingHandlers)).wjFlexChartMacdHistogram = new wjFlexChartMacdHistogram();
(<any>(wjKo.bindingHandlers)).wjFlexChartStochastic = new wjFlexChartStochastic();
(<any>(wjKo.bindingHandlers)).wjFlexChartBollingerBands = new wjFlexChartBollingerBands();
(<any>(wjKo.bindingHandlers)).wjFlexChartEnvelopes = new wjFlexChartEnvelopes();

    }
    


    module wijmo.knockout {
    

    }
    

    module wijmo.knockout {
    



var wjKo: any = window['ko'];






/**
 * KnockoutJS binding for the {@link RangeSelector} control.
 *
 * Use the {@link wjFlexChartRangeSelector} binding to add {@link RangeSelector} controls to your
 * KnockoutJS applications. For example:
 * 
 * <pre>&lt;p&gt;Here is a RangeSelector control:&lt;/p&gt;
 * &lt;div data-bind="wjFlexChart: { itemsSource: data, bindingX: 'country' }"&gt;
 *     &lt;div data-bind="wjFlexChartAxis: { wjProperty: 'axisX', title: 'country' }"&gt;&lt;/div&gt;
 *     &lt;div data-bind="wjFlexChartSeries: { name: 'Sales', binding: 'sales' }"&gt;&lt;/div&gt;
 *     &lt;div data-bind="wjFlexChartSeries: { name: 'Expenses', binding: 'expenses' }"&gt;&lt;/div&gt;
 *     &lt;div data-bind="wjFlexChartSeries: { name: 'Downloads', binding: 'downloads' }"&gt;&lt;/div&gt;
 *     &lt;div data-bind="wjFlexChartRangeSelector: { seamless: 'true',rangeChanged: rangeChanged }"&gt;&lt;/div&gt;
 * &lt;/div&gt;</pre>
 *
 * The <b>wjFlexChartRangeSelector</b> binding supports all read-write properties and events of
 * the {@link RangeSelector} class.
 */
export class wjFlexChartRangeSelector extends WjBinding {
    _getControlConstructor(): any {
        return wijmo.chart.interaction.RangeSelector;
    }
}

/**
 * KnockoutJS binding for the {@link ChartGestures} object.
 *
 * Use the {@link wjFlexChartGestures} binding to add {@link ChartGestures} controls to your
 * KnockoutJS applications. For example:
 * 
 * <pre>&lt;p&gt;Here is a ChartGestures:&lt;/p&gt;
 * &lt;div data-bind="wjFlexChart: { itemsSource: data, bindingX: 'country' }"&gt;
 *     &lt;div data-bind="wjFlexChartAxis: { wjProperty: 'axisX', title: 'country' }"&gt;&lt;/div&gt;
 *     &lt;div data-bind="wjFlexChartSeries: { name: 'Sales', binding: 'sales' }"&gt;&lt;/div&gt;
 *     &lt;div data-bind="wjFlexChartGestures: { scaleX:0.5, posX:0.1 } "&gt;&lt;/div&gt;
 * &lt;/div&gt;</pre>
 *
 * The <b>wjFlexChartGestures</b> binding supports all read-write properties and events of
 * the {@link ChartGestures} class.
 */
export class wjFlexChartGestures extends WjBinding {
    _getControlConstructor(): any {
        return wijmo.chart.interaction.ChartGestures;
    }
}


(<any>(wjKo.bindingHandlers)).wjFlexChartRangeSelector = new wjFlexChartRangeSelector();
(<any>(wjKo.bindingHandlers)).wjFlexChartGestures = new wjFlexChartGestures();

    }
    


    module wijmo.knockout {
    

    }
    

    module wijmo.knockout {
    



var wjKo: any = window['ko'];





/**
 * KnockoutJS binding for the {@link FlexGrid} control.
 *
 * Use the {@link wjFlexGrid} binding to add {@link FlexGrid} controls to your 
 * KnockoutJS applications. For example:
 * 
 * <pre>&lt;p&gt;Here is a FlexGrid control:&lt;/p&gt;
 * &lt;div data-bind="wjFlexGrid: { itemsSource: data }"&gt;
 *     &lt;div data-bind="wjFlexGridColumn: { 
 *         header: 'Country', 
 *         binding: 'country', 
 *         width: '*' }"&gt;
 *     &lt;/div&gt;
 *     &lt;div data-bind="wjFlexGridColumn: { 
 *         header: 'Date', 
 *         binding: 'date' }"&gt;
 *     &lt;/div&gt;
 *     &lt;div data-bind="wjFlexGridColumn: { 
 *         header: 'Revenue', 
 *         binding: 'amount', 
 *         format: 'n0' }"&gt;
 *     &lt;/div&gt;
 *     &lt;div data-bind="wjFlexGridColumn: { 
 *         header: 'Active', 
 *         binding: 'active' }"&gt;
 *     &lt;/div&gt;
 * &lt;/div&gt;</pre>
 * 
 * The <b>wjFlexGrid</b> binding may contain {@link wjFlexGridColumn} child bindings.
 *
 * The <b>wjFlexGrid</b> binding supports all read-write properties and events of 
 * the {@link FlexGrid} control, except for the <b>scrollPosition</b>, 
 * <b>selection</b> and <b>columnLayout</b> properties.
 */
export class wjFlexGrid extends WjBinding {
    static _columnTemplateProp = '_wjkoColumnTemplate';
    static _cellClonedTemplateProp = '__wjkoClonedTempl';
    static _cellVMProp = '__wjkoCellVM';
    static _templColIdx = '_wjkoTemplColIdx';
    static _columnStyleBinding = 'wjStyle';
    static _columnStyleProp = '__wjkoStyle';

    _getControlConstructor(): any {
        return wijmo.grid.FlexGrid;
    }

    _createWijmoContext(): WjContext {
        return new WjFlexGridContext(this);
    }

    _initialize() {
        super._initialize();
        var formatterDesc = MetaFactory.findProp('itemFormatter', <PropDesc[]>this._metaData.props);
        formatterDesc.updateControl = this._formatterPropHandler;
    }

    private _formatterPropHandler(link: any, propDesc: PropDesc, control: any, unconvertedValue: any, convertedValue: any): boolean {
        if (unconvertedValue !== link._userFormatter) {
            link._userFormatter = unconvertedValue;
            control.invalidate();
        }
        return true;
    }
}

export class WjFlexGridContext extends WjContext {
    _wrapperFormatter = this._itemFormatter.bind(this);
    _userFormatter: Function;

    _initControl() {
        super._initControl();
        (<wijmo.grid.FlexGrid>this.control).itemFormatter = this._wrapperFormatter;
    }

    private _itemFormatter(panel, r, c, cell) {
        var column = panel.columns[c],
            cellTemplate = column[wjFlexGrid._columnTemplateProp],
            cellStyle = column[wjFlexGrid._columnStyleProp];
        if ((cellTemplate || cellStyle) && panel.cellType == wijmo.grid.CellType.Cell) {
            // do not format in edit mode
            var editRange: wijmo.grid.CellRange = panel.grid.editRange;
            if (editRange && editRange.row === r && editRange.col === c) {
                return;
            }
            // no templates in GroupRows
            if (panel.rows[r] instanceof wijmo.grid.GroupRow) {
                return;
            }

            var cellVM = cell[wjFlexGrid._cellVMProp],
                clonedTempl = cell[wjFlexGrid._cellClonedTemplateProp],
                item = panel.rows[r].dataItem;
            if (cellVM && cell[wjFlexGrid._templColIdx] != c) {
                cell[wjFlexGrid._cellVMProp] = cell[wjFlexGrid._cellClonedTemplateProp] =
                    cell[wjFlexGrid._templColIdx] = cellVM = clonedTempl = null;
                wjKo.cleanNode(cell);
            }
            if (!cellVM) {
                cellVM = {
                    $row: wjKo.observable(r),
                    $col: wjKo.observable(c),
                    $item: wjKo.observable(item)
                };
                var cellContext = this.bindingContext.extend(cellVM);
                if (cellTemplate) {
                    cell.innerHTML = '<div>' + cellTemplate + '</div>';
                    var childEl = cell.childNodes[0];
                    cell[wjFlexGrid._cellClonedTemplateProp] = childEl;
                }
                else {
                    cell.setAttribute('data-bind', 'style:' + cellStyle);
                }
                cell[wjFlexGrid._cellVMProp] = cellVM;
                cell[wjFlexGrid._templColIdx] = c;
                wjKo.applyBindings(cellContext, cell);
            }
            else {
                if (clonedTempl) {
                    cell.innerHTML = '';
                    cell.appendChild(clonedTempl);
                }
                cellVM.$row(r);
                cellVM.$col(c);
                if (cellVM.$item() != item) {
                    cellVM.$item(item);
                }
                else {
                    cellVM.$item.valueHasMutated();
                }
            }
            //Enlarge rows height if cell doesn't fit in the current row height.
            var cellHeight = cell.scrollHeight;
            if (panel.rows[r].renderHeight < cellHeight) {
                panel.rows.defaultSize = cellHeight;
            }

        }
        else if (this._userFormatter) {
            this._userFormatter(panel, r, c, cell);
        } 
    }
}

/**
 * KnockoutJS binding for the {@link FlexGrid} {@link Column} object.
 *
 * The {@link wjFlexGridColumn} binding must be contained in a {@link wjFlexGrid} binding. For example:
 * 
 * <pre>&lt;p&gt;Here is a FlexGrid control:&lt;/p&gt;
 * &lt;div data-bind="wjFlexGrid: { itemsSource: data }"&gt;
 *     &lt;div data-bind="wjFlexGridColumn: { 
 *         header: 'Country', 
 *         binding: 'country', 
 *         width: '*' }"&gt;
 *     &lt;/div&gt;
 *     &lt;div data-bind="wjFlexGridColumn: { 
 *         header: 'Date', 
 *         binding: 'date' }"&gt;
 *     &lt;/div&gt;
 *     &lt;div data-bind="wjFlexGridColumn: { 
 *         header: 'Revenue', 
 *         binding: 'amount', 
 *         format: 'n0' }"&gt;
 *     &lt;/div&gt;
 *     &lt;div data-bind="wjFlexGridColumn: { 
 *         header: 'Active', 
 *         binding: 'active' }"&gt;
 *     &lt;/div&gt;
 * &lt;/div&gt;</pre>
 *
 * The <b>wjFlexGridColumn</b> binding supports all read-write properties and events of 
 * the {@link Column} class. The <b>isSelected</b> property provides two-way binding mode.
 *
 * In addition to regular attributes that match properties in the <b>Column</b> class,  
 * an element with the {@link wjFlexGridColumn} binding may contain a {@link wjStyle} binding that
 * provides conditional formatting and an HTML fragment that is used as a cell template. Grid 
 * rows automatically stretch vertically to fit custom cell contents.
 *
 * Both the <b>wjStyle</b> binding and the HTML fragment can use the <b>$item</b> observable variable in 
 * KnockoutJS bindings to refer to the item that is bound to the current row. Also available are the 
 * <b>$row</b> and <b>$col</b> observable variables containing cell row and column indexes. For example:
 *
 * <pre>&lt;div data-bind="wjFlexGridColumn: { 
 *         header: 'Symbol', 
 *         binding: 'symbol', 
 *         readOnly: true, 
 *         width: '*' }"&gt;
 *   &lt;a data-bind="attr: { 
 *         href: 'https://finance.yahoo.com/q?s=' + $item().symbol() }, 
 *         text: $item().symbol"&gt;
 *   &lt;/a&gt;
 * &lt;/div&gt;
 * &lt;div data-bind="wjFlexGridColumn: { 
 *      header: 'Change',
 *         binding: 'changePercent',
 *         format: 'p2',
 *         width: '*'
 *         },
 *         wjStyle: { 
 *         color: getAmountColor($item().change) }"&gt;
 * &lt;/div&gt;</pre>
 *
 * These bindings create two columns. 
 * The first has a template that produces a hyperlink based on the bound item's "symbol" property. 
 * The second has a conditional style that renders values with a color determined by a function
 * implemented in the controller.
 */
export class wjFlexGridColumn extends WjBinding {

    _getControlConstructor(): any {
        return wijmo.grid.Column;
    }

    _createControl(element: any): any {
        return new wijmo.grid.Column();
    }

    _createWijmoContext(): WjContext {
        return new WjFlexGridColumnContext(this);
    }

}
// FlexGrid Column context, contains specific code to add column to the parent grid.
export class WjFlexGridColumnContext extends WjContext {
    _initControl() {
        var gridContext = this.parentWjContext;
        if (gridContext) {
            var grid: wijmo.grid.FlexGrid = <wijmo.grid.FlexGrid>gridContext.control;
            // Turn off autoGenerateColumns and clear the columns collection before initializing this column.
            if (grid.autoGenerateColumns) {
                grid.autoGenerateColumns = false;
                grid.columns.clear();
            }
        }
        super._initControl();
        // Store child content in the Column and clear it.
        var template = this.element.innerHTML.trim();
        this.control[wjFlexGrid._columnTemplateProp] = template;
        var wjStyleBind = this.allBindings.get(wjFlexGrid._columnStyleBinding);
        if (wjStyleBind) {
            this.control[wjFlexGrid._columnStyleProp] = wjStyleBind.trim();
        }
        if (template || wjStyleBind) {
            (<wijmo.grid.Column>this.control)._setFlag(wijmo.grid.RowColFlags.HasTemplate, true);
        }
        this.element.innerHTML = '';
    }
}

/**
 * KnockoutJS binding for conditional formatting of {@link FlexGrid} {@link Column} cells.
 *
 * Use the {@link wjStyle} binding together with the {@link wjFlexGridColumn} binding to provide
 * conditional formatting to column cells. 
 * For example:
 * 
 * <pre>&lt;div data-bind="wjFlexGridColumn: { 
 *         header: 'Change',
 *         binding: 'changePercent',
 *         format: 'p2',
 *         width: '*'
 *         },
 *         wjStyle: { color: getAmountColor($item().change) }"&gt;&lt;/div&gt;</pre>
 *
 *
 * The <b>wjStyle</b> uses the same syntax as the native KnockoutJS 
 * <a href="https://knockoutjs.com/documentation/style-binding.html" target="_blank">style</a> binding.
 * In addition to the view model properties, the following observable variables are available in binding
 * expressions:
 *
 * <dl class="dl-horizontal">
 *   <dt>$item</dt>  <dd>References the item that is bound to the current row.</dd>
 *   <dt>$row</dt>  <dd>The row index.</dd>
 *   <dt>$col</dt>  <dd>The column index.</dd>
 * </dl>
 */
export class wjStyle {

    preprocess = function (value: string, name: string, addBinding: (name: string, value: string) => string) {
        return wjStyle.quoteString(value);
    }

    init = function () {
    }

    static quoteString(s: string): string {
        if (s == null) {
            return s;
        }
        return "'" + s.replace(/'/g, "\\'") + "'";
    }

    static unquoteString(s: string): string {
        if (!s || s.length < 2) {
            return s;
        }
        if (s.charAt(0) === "'") {
            s = s.substr(1, s.length - 1);
        }
        return s.replace(/\\\'/g, "'");
    }

}



// Register bindings
(<any>(wjKo.bindingHandlers))[wjFlexGrid._columnStyleBinding] = new wjStyle();
(<any>(wjKo.bindingHandlers)).wjFlexGrid = new wjFlexGrid();
(<any>(wjKo.bindingHandlers)).wjFlexGridColumn = new wjFlexGridColumn();

    }
    


    module wijmo.knockout {
    

    }
    

    module wijmo.knockout {
    



var wjKo: any = window['ko'];





/**
 * KnockoutJS binding for the {@link FlexGrid} {@link FlexGridFilter} object.
 *
 * The {@link wjFlexGridFilter} binding must be contained in a {@link wjFlexGrid} binding. For example:
 * 
 * <pre>&lt;p&gt;Here is a FlexGrid control with column filters:&lt;/p&gt;
 * &lt;div data-bind="wjFlexGrid: { itemsSource: data }"&gt;
 *     &lt;div data-bind="wjFlexGridFilter: { filterColumns: ['country', 'amount']  }"&gt;&lt;/div&gt;
 * &nbsp;
 *     &lt;div data-bind="wjFlexGridColumn: { 
 *         header: 'Country', 
 *         binding: 'country', 
 *         width: '*' }"&gt;
 *     &lt;/div&gt;
 *     &lt;div data-bind="wjFlexGridColumn: { 
 *         header: 'Date', 
 *         binding: 'date' }"&gt;
 *     &lt;/div&gt;
 *     &lt;div data-bind="wjFlexGridColumn: { 
 *         header: 'Revenue', 
 *         binding: 'amount', 
 *         format: 'n0' }"&gt;
 *     &lt;/div&gt;
 *     &lt;div data-bind="wjFlexGridColumn: { 
 *         header: 'Active', 
 *         binding: 'active' }"&gt;
 *     &lt;/div&gt;
 * &lt;/div&gt;</pre>
 *
 * The <b>wjFlexGridFilter</b> binding supports all read-write properties and events of 
 * the {@link FlexGridFilter} class. 
 *
 */
export class wjFlexGridFilter extends WjBinding {

    _getControlConstructor(): any {
        return wijmo.grid.filter.FlexGridFilter;
    }

}


(<any>(wjKo.bindingHandlers)).wjFlexGridFilter = new wjFlexGridFilter();

    }
    


    module wijmo.knockout {
    

    }
    

    module wijmo.knockout {
    



var wjKo: any = window['ko'];





/**
 * KnockoutJS binding for the {@link FlexGrid} {@link GroupPanel} control.
 *
 * The <b>wjGroupPanel</b> binding should be connected to the <b>FlexGrid</b> control using the <b>grid</b> property. 
 * For example:
 * 
 * <pre>&lt;p&gt;Here is a FlexGrid control with GroupPanel:&lt;/p&gt;
 * &nbsp;
 * &lt;div data-bind="wjGroupPanel: { grid: flex(), placeholder: 'Drag columns here to create groups.' }"&gt;&lt;/div&gt;
 * &nbsp;
 * &lt;div data-bind="wjFlexGrid: { control: flex, itemsSource: data }"&gt;
 *     &lt;div data-bind="wjFlexGridColumn: { 
 *         header: 'Country', 
 *         binding: 'country', 
 *         width: '*' }"&gt;
 *     &lt;/div&gt;
 *     &lt;div data-bind="wjFlexGridColumn: { 
 *         header: 'Date', 
 *         binding: 'date' }"&gt;
 *     &lt;/div&gt;
 *     &lt;div data-bind="wjFlexGridColumn: { 
 *         header: 'Revenue', 
 *         binding: 'amount', 
 *         format: 'n0' }"&gt;
 *     &lt;/div&gt;
 *     &lt;div data-bind="wjFlexGridColumn: { 
 *         header: 'Active', 
 *         binding: 'active' }"&gt;
 *     &lt;/div&gt;
 * &lt;/div&gt;</pre>
 *
 * The <b>wjGroupPanel</b> binding supports all read-write properties and events of 
 * the {@link GroupPanel} class. 
 *
 */
export class wjGroupPanel extends WjBinding {

    _getControlConstructor(): any {
        return wijmo.grid.grouppanel.GroupPanel;
    }

}


(<any>(wjKo.bindingHandlers)).wjGroupPanel = new wjGroupPanel();

    }
    


    module wijmo.knockout {
    

    }
    

    module wijmo.knockout {
    



var wjKo: any = window['ko'];





/**
 * KnockoutJS binding for the {@link MultiRow} object.
 * Use the {@link wjMultiRow} binding to add {@link MultiRow} controls to your
 * KnockoutJS applications. For example:
 *  &lt;div data-bind="wjMultiRow:
 *      {
 *          itemsSource: orders,
 *          layoutDefinition: ldThreeLines
 *      }"&gt;
 *  &lt;/div&gt;
 *                                    
 * The <b>wjMultiRow</b> binding supports all read-write properties and events of
 * the {@link MultiRow} class.
 *
 */
export class wjMultiRow extends wjFlexGrid {
    _getControlConstructor(): any {
        return wijmo.grid.multirow.MultiRow;
    }
}


(<any>(wjKo.bindingHandlers)).wjMultiRow = new wjMultiRow();
    }
    


    module wijmo.knockout {
    

    }
    

    module wijmo.knockout {
    



var wjKo: any = window['ko'];






/**
 * KnockoutJS binding for the {@link FlexSheet} control.
 *
 * Use the {@link wjFlexSheet} binding to add {@link FlexSheet} controls to your 
 * KnockoutJS applications. 
 * 
 * The <b>wjFlexSheet</b> binding may contain {@link wjSheet} child bindings.
 *
 * The <b>wjFlexSheet</b> binding supports all read-write properties and events of 
 * the {@link FlexSheet} control. 
 */
export class wjFlexSheet extends wjFlexGrid {

    _getControlConstructor(): any {
        return wijmo.grid.sheet.FlexSheet;
    }

}

/**
 * KnockoutJS binding for the {@link FlexSheet} {@link Sheet} object.
 *
 * The {@link wjSheet} binding must be contained in a {@link wjFlexSheet} binding. 
 * 
 * The <b>wjSheet</b> binding supports all read-write properties and events of 
 * the {@link Sheet} class. 
 *
 */
export class wjSheet extends WjBinding {
    _getControlConstructor(): any {
        return wijmo.grid.sheet.Sheet;
    }

    _createWijmoContext(): WjContext {
        return new WjSheetContext(this);
    }

}

export class WjSheetContext extends WjContext {
    _initControl() {
        super._initControl();
        var valSet = this.valueAccessor(),
            flexSheet = <wijmo.grid.sheet.FlexSheet>this.parentWjContext.control,
            itemsSource = wjKo.unwrap(valSet['itemsSource']),
            sheetName = wjKo.unwrap(valSet['name']);

        if (itemsSource) {
            return flexSheet.addBoundSheet(sheetName, itemsSource);
        } else {
            return flexSheet.addUnboundSheet(sheetName, +wjKo.unwrap(valSet['rowCount']), +wjKo.unwrap(valSet['columnCount']));
        }
    }
}


(<any>(wjKo.bindingHandlers)).wjFlexSheet = new wjFlexSheet();
(<any>(wjKo.bindingHandlers)).wjSheet = new wjSheet();

    }
    


    module wijmo.knockout {
    

    }
    

    module wijmo.knockout {
    



var wjKo: any = window['ko'];






/**
 * KnockoutJS binding for the {@link Tooltip} class.
 *
 * Use the {@link wjTooltip} binding to add tooltips to elements on the page. 
 * The {@link wjTooltip} supports HTML content, smart positioning, and touch.
 *
 * The {@link wjTooltip} binding is specified on an 
 * element that the tooltip applies to. The value is the tooltip
 * text or the id of an element that contains the text. For example:
 *
 * <pre>&lt;p data-bind="wjTooltip: '#fineprint'" &gt;
 *     Regular paragraph content...&lt;/p&gt;
 * ...
 * &lt;div id="fineprint" style="display:none" &gt;
 *   &lt;h3&gt;Important Note&lt;/h3&gt;
 *   &lt;p&gt;
 *     Data for the current quarter is estimated by pro-rating etc...&lt;/p&gt;
 * &lt;/div&gt;</pre>
 */
export class wjTooltip extends WjBinding {
    _getControlConstructor(): any {
        return wijmo.Tooltip;
    }

    _createControl(element: any): any {
        return super._createControl(null);
    }

    _createWijmoContext(): WjContext {
        return new WjTooltipContext(this);
    }

}

export class WjTooltipContext extends WjContext {
    update(element: any, valueAccessor: () => any, allBindings: any/*KnockoutAllBindingsAccessor*/, 
            viewModel: any, bindingContext: any/*KnockoutBindingContext*/): void {
        super.update(element, valueAccessor, allBindings, viewModel, bindingContext);
        this._updateTooltip();
    }

    private _updateTooltip() {
        (<wijmo.Tooltip><any>this.control).setTooltip(this.element, wjKo.unwrap(this.valueAccessor()));
    }
}
 

(<any>(wjKo.bindingHandlers)).wjTooltip = new wjTooltip();

    }
    


    module wijmo.knockout {
    

    }
    

    module wijmo.knockout {
    



var wjKo: any = window['ko'];





// Gauge control binding
// Provides base setup for all bindings related to controls derived from Gauge
// Abstract class, not for use in markup
export class WjGaugeBinding extends WjBinding {
    _getControlConstructor(): any {
        return wijmo.gauge.Gauge;
    }
}

/**
 * KnockoutJS binding for the {@link LinearGauge} control.
 *
 * Use the {@link wjLinearGauge} binding to add {@link LinearGauge} controls to your 
 * KnockoutJS applications. For example:
 * 
 * <pre>&lt;p&gt;Here is a LinearGauge control:&lt;/p&gt;
 * &lt;div data-bind="wjLinearGauge: {
 *         value: props.value,
 *         min: props.min,
 *         max: props.max,
 *         format: props.format,
 *         showRanges: props.showRanges }"
 *         &lt;class="linear-gauge"&gt;
 *     &lt;div data-bind="wjRange: { 
 *             wjProperty: 'pointer', 
 *             thickness: props.ranges.pointerThickness }"&gt;
 *     &lt;/div&gt;
 *     &lt;div data-bind="wjRange: { 
 *             min: props.ranges.lower.min, 
 *             max: props.ranges.lower.max, 
 *             color: props.ranges.lower.color }"&gt;
 *     &lt;/div&gt;
 *     &lt;div data-bind="wjRange: { 
 *             min: props.ranges.middle.min, 
 *             max: props.ranges.middle.max, 
 *             color: props.ranges.middle.color }"&gt;
 *     &lt;/div&gt;
 *     &lt;div data-bind="wjRange: { 
 *             min: props.ranges.upper.min, 
 *             max: props.ranges.upper.max, 
 *             color: props.ranges.upper.color }"&gt;
 *     &lt;/div&gt;
 * &lt;/div&gt;</pre>
 * 
 * The <b>wjLinearGauge</b> binding may contain the {@link wjRange} child binding. 
 *
 * The <b>wjLinearGauge</b> binding supports all read-write properties and events of 
 * the {@link LinearGauge} control. The <b>value</b> property provides two-way binding mode.
 */
export class wjLinearGauge extends WjGaugeBinding {
    _getControlConstructor(): any {
        return wijmo.gauge.LinearGauge;
    }
}

/**
 * KnockoutJS binding for the {@link BulletGraph} control.
 *
 * Use the {@link wjBulletGraph} binding to add {@link BulletGraph} controls to your 
 * KnockoutJS applications. For example:
 * 
 * <pre>&lt;p&gt;Here is a BulletGraph control:&lt;/p&gt;
 * &lt;div data-bind="wjBulletGraph: {
 *         value: props.value,
 *         min: props.min,
 *         max: props.max,
 *         format: props.format,
 *         good: props.ranges.middle.max,
 *         bad: props.ranges.middle.min,
 *         target: props.ranges.target,
 *         showRanges: props.showRanges }"
 *         class="linear-gauge"&gt;
 *     &lt;div data-bind="wjRange: { 
 *             wjProperty: 'pointer', 
 *             thickness: props.ranges.pointerThickness }"&gt;
 *     &lt;/div&gt;
 * &lt;/div&gt;</pre>
 * 
 * The <b>wjBulletGraph</b> binding may contain the {@link wjRange} child binding. 
 *
 * The <b>wjBulletGraph</b> binding supports all read-write properties and events of 
 * the {@link BulletGraph} control. The <b>value</b> property provides two-way binding mode.
 */
export class wjBulletGraph extends wjLinearGauge {
    _getControlConstructor(): any {
        return wijmo.gauge.BulletGraph;
    }
}

/**
 * KnockoutJS binding for the {@link RadialGauge} control.
 *
 * Use the {@link wjRadialGauge} binding to add {@link RadialGauge} controls to your 
 * KnockoutJS applications. For example:
 * 
 * <pre>&lt;p&gt;Here is a RadialGauge control:&lt;/p&gt;
 * &lt;div data-bind="wjRadialGauge: {
 *         value: props.value,
 *         min: props.min,
 *         max: props.max,
 *         format: props.format,
 *         showRanges: props.showRanges }"
 *         class="radial-gauge"&gt;
 *     &lt;div data-bind="wjRange: { 
 *             wjProperty: 'pointer', 
 *             thickness: props.ranges.pointerThickness }"&gt;
 *     &lt;/div&gt;
 *     &lt;div data-bind="wjRange: { 
 *             min: props.ranges.lower.min, 
 *             max: props.ranges.lower.max, 
 *             color: props.ranges.lower.color }"&gt;
 *     &lt;/div&gt;
 *     &lt;div data-bind="wjRange: { 
 *             min: props.ranges.middle.min, 
 *             max: props.ranges.middle.max, 
 *             color: props.ranges.middle.color }"&gt;
 *     &lt;/div&gt;
 *     &lt;div data-bind="wjRange: { 
 *             min: props.ranges.upper.min, 
 *             max: props.ranges.upper.max, 
 *             color: props.ranges.upper.color }"&gt;
 *     &lt;/div&gt;
 * &lt;/div&gt;</pre>
 * 
 * The <b>wjRadialGauge</b> binding may contain the {@link wjRange} child binding. 
 *
 * The <b>wjRadialGauge</b> binding supports all read-write properties and events of 
 * the {@link RadialGauge} control. The <b>value</b> property provides two-way binding mode.
 */
export class wjRadialGauge extends WjGaugeBinding {
    _getControlConstructor(): any {
        return wijmo.gauge.RadialGauge;
    }
}

/**
 * KnockoutJS binding for the Gauge's {@link Range} object.
 *
 * The {@link wjRange} binding must be contained in one of the following bindings:
 * <ul>
 *     <li>{@link wjLinearGauge}</li> 
 *     <li>{@link wjRadialGauge}</li>
 *     <li>{@link wjBulletGraph}</li>
 * </ul> 
 * By default, this binding adds a <b>Range</b> object to the <b>ranges</b> 
 * collection of the Chart control. The <b>wjProperty</b> attribute allows 
 * you to specify another Chart property, for example the <b>pointer</b> 
 * property, to initialize with the binding.
 * 
 * The <b>wjRange</b> binding supports all read-write properties and events of 
 * the {@link Range} class.
 */
export class wjRange extends WjBinding {
    _getControlConstructor(): any {
        return wijmo.gauge.Range;
    }

    _createControl(element: any): any {
        return new wijmo.gauge.Range();
    }
}



// Register bindings
(<any>(wjKo.bindingHandlers)).wjLinearGauge = new wjLinearGauge();
(<any>(wjKo.bindingHandlers)).wjBulletGraph = new wjBulletGraph();
(<any>(wjKo.bindingHandlers)).wjRadialGauge = new wjRadialGauge();
(<any>(wjKo.bindingHandlers)).wjRange = new wjRange();

    }
    


    module wijmo.knockout {
    

    }
    

    module wijmo.knockout {
    



var wjKo: any = window['ko'];






/**
 * KnockoutJS binding for the {@link PivotGrid} object.
 * Use the {@link wjPivotGrid} binding to add {@link PivotGrid} controls to your
 * KnockoutJS applications. For example:
 *  &lt;div data-bind="wjPivotGrid:
 *      {
 *          itemsSource: thePanel
 *      }"&gt;
 *  &lt;/div&gt;
 *                                    
 * The <b>wjPivotGrid</b> binding supports all read-write properties and events of
 * the {@link PivotGrid} class.
 *
 */
export class wjPivotGrid extends wjFlexGrid {
    _getControlConstructor(): any {
        return wijmo.olap.PivotGrid;
    }
}

/**
 * KnockoutJS binding for the {@link PivotChart} object.
 * Use the {@link wjPivotChart} binding to add {@link PivotChart} controls to your
 * KnockoutJS applications. For example:
 *  &lt;div data-bind="wjPivotChart:
 *      {
 *          itemsSource: thePanel
 *      }"&gt;
 *  &lt;/div&gt;
 *                                    
 * The <b>wjPivotChart</b> binding supports all read-write properties and events of
 * the {@link PivotChart} class.
 *
 */
export class wjPivotChart extends WjBinding {
    _getControlConstructor(): any {
        return wijmo.olap.PivotChart;
    }
}

/**
 * KnockoutJS binding for the {@link PivotPanel} object.
 * Use the {@link wjPivotPanel} binding to add {@link PivotPanel} controls to your
 * KnockoutJS applications. For example:
 *  &lt;div data-bind="wjPivotPanel:
 *      {
 *           itemsSource: rawData,
 *           control: thePanel,
 *           initialized: init
 *      }"&gt;
 *  &lt;/div&gt;
 *                                    
 * The <b>wjPivotPanel</b> binding supports all read-write properties and events of
 * the {@link PivotPanel} class.
 *
 */
export class wjPivotPanel extends WjBinding {
    _getControlConstructor(): any {
        return wijmo.olap.PivotPanel;
    }
}

/**
 * KnockoutJS binding for the {@link Slicer} object.
 * Use the {@link wjSlicer} binding to add {@link Slicer} controls to your
 * KnockoutJS applications. For example:
 *  &lt;div data-bind="wjSlicer:
 *      {
 *           field: theField,
 *           showHeader: true
 *      }"&gt;
 *  &lt;/div&gt;
 *                                    
 * The <b>wjSlicer</b> binding supports all read-write properties and events of
 * the {@link Slicer} class.
 *
 */
export class wjSlicer extends WjBinding {
    _getControlConstructor(): any {
        return wijmo.olap.Slicer;
    }
}
 

(<any>(wjKo.bindingHandlers)).wjPivotGrid = new wjPivotGrid();
(<any>(wjKo.bindingHandlers)).wjPivotChart = new wjPivotChart();
(<any>(wjKo.bindingHandlers)).wjPivotPanel = new wjPivotPanel();
(<any>(wjKo.bindingHandlers)).wjSlicer = new wjSlicer();
    }
    


    module wijmo.knockout {
    

    }
    