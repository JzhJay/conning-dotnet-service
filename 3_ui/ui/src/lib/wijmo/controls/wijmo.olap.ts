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


    module wijmo.olap {
    'use strict';

/**
 * Generates MDX queries for the {@link _SqlServerConnection} class.
 */
export class _TextBuilder {
    private _text: string;

    /**
     * Initializes a new instance of the {@link _TextBuilder} class.
     */
    constructor() {
        this._text = "";
    }

    /**
     * Returns the text length.
     */
    get length(): number {
        return this._text.length;
    }

    /**
     * Returns the text.
     */
    toString(): string {
        return this._text;
    }

    /**
     * Appends a concatenation of strings.
     * 
     * @param ...items Array of strings to be appended.
     */
    append(...items: string[]) {
        this._text = this._text.concat(...items);
    }

    /**
     * Appends a separator followed by a concatenation of strings.
     * 
     * @param separator Separator string.
     * @param ...parts Array of strings to be appended.
     */
    joinToList(separator: string, ...parts: string[]) {
        let tmp = parts.join();
        if (this.length > 0 && tmp.length > 0) {
            this._text = this._text.concat(separator, ...parts);
        } else if (tmp.length > 0) {
            this._text = tmp;
        }
    }

    /**
     * Appends a comma separator followed by an individual string.
     * 
     * @param item String to be appended.
     */
    joinItemToList(item: string) {
        this.joinToList(",", item);
    }

    /**
     * Wraps a non-empty string with the specified prefix and suffix.
     * 
     * @param prefix Prefix string.
     * @param suffix Suffix string.
     */
    wrap(prefix: string, suffix: string) {
        if (this.length > 0) {
            this._text = prefix.concat(this._text, suffix);
        }
    }

    /**
     * Wraps a non-empty string with the specified prefix and suffix.
     * 
     * @param prefix Prefix string.
     * @param text Text to be wrapped.
     * @param suffix Suffix string.
     */
    static wrap(prefix: string, text: string, suffix: string) {
        if (text.length > 0) {
            return prefix.concat(text, suffix);
        } else {
            return "";
        }
    }
}
    }
    


    module wijmo.olap {
    

'use strict';

/**
 * Accumulates observations and returns aggregate statistics.
 */
export class _Tally {
    _cntAll = 0;
    _cnt = 0;
    _cntn = 0;
    _sum = 0;
    _sum2 = 0;
    _min = null;
    _max = null;
    _first = null;
    _last = null;

    /**
     * Adds a value to the tally.
     *
     * @param value Value to be added to the tally.
     * @param weight Weight to be attributed to the value.
     */
    add(value: any, weight?: number) {
        if (value instanceof _Tally) {

            // add a tally
            this._sum += value._sum;
            this._sum2 += value._sum2;
            this._max = this._max && value._max ? Math.max(this._max, value._max) : (this._max || value._max);
            this._min = this._min && value._min ? Math.min(this._min, value._min) : (this._min || value._min);
            this._cnt += value._cnt;
            this._cntn += value._cntn;
            this._cntAll += value._cntAll;

        } else {
            this._cntAll++; // count all, even nulls
            if (value != null) {

                // add a value
                this._cnt++;
                if (wijmo.isBoolean(value)) { // Booleans aggregate like 1/0
                    value = value ? 1 : 0;
                }
                if (this._min == null || value < this._min) {
                    this._min = value;
                }
                if (this._max == null || value > this._max) {
                    this._max = value;
                }
                if (this._first == null) {
                    this._first = value;
                }
                this._last = value;
                if (wijmo.isNumber(value) && !isNaN(value)) {
                    if (wijmo.isNumber(weight)) {
                        value *= weight;
                    }
                    this._cntn++;
                    this._sum += value;
                    this._sum2 += value * value;
                }
            }
        }
    }
    /**
     * Gets an aggregate statistic from the tally.
     *
     * @param aggregate Type of aggregate statistic to get.
     */
    getAggregate(aggregate: wijmo.Aggregate): number {

        // for compatibility with Excel PivotTables
        if (this._cnt == 0) {
            return null;
        }

        let avg = this._cntn == 0 ? 0 : this._sum / this._cntn;
        let ae = wijmo.Aggregate;
        switch (aggregate) {
            case ae.None:
                return null;
            case ae.CntAll:
                return this._cntAll;
            case ae.Avg:
                return avg;
            case ae.Cnt:
                return this._cnt;
            case ae.Max:
                return this._max;
            case ae.Min:
                return this._min;
            case ae.Rng:
                return this._max - this._min;
            case ae.Sum:
                return this._sum;
            case ae.VarPop:
                return this._cntn <= 1 ? 0 : this._sum2 / this._cntn - avg * avg;
            case ae.StdPop:
                return this._cntn <= 1 ? 0 : Math.sqrt(this._sum2 / this._cntn - avg * avg);
            case ae.Var:
                return this._cntn <= 1 ? 0 : (this._sum2 / this._cntn - avg * avg) * this._cntn / (this._cntn - 1);
            case ae.Std:
                return this._cntn <= 1 ? 0 : Math.sqrt((this._sum2 / this._cntn - avg * avg) * this._cntn / (this._cntn - 1));
            case ae.First:
                return this._first;
            case ae.Last:
                return this._last;
        }

        // should never get here...
        throw 'Invalid aggregate type.';
    }
}
    }
    


    module wijmo.olap {
    




'use strict';

/**
 * Represents a combination of {@link PivotField} objects and their values.
 *
 * Each row and column on the output view is defined by a unique {@link PivotKey}.
 * The values in the output cells represent an aggregation of the value field 
 * for all items that match the row and column keys.
 *
 * For example, if a column key is set to 'Country:UK;Customer:Joe' and 
 * the row key is set to 'Category:Desserts;Product:Pie', then the corresponding 
 * cell contains the aggregate for all items with the following properties:
 *
 * <pre>{ Country: 'UK', Customer: 'Joe', Category: 'Desserts', Product: 'Pie' };</pre>
 */
export class _PivotKey {
    private _fields: PivotFieldCollection;
    private _fieldCount: number;
    private _valueFields: PivotFieldCollection;
    private _valueFieldIndex: number;
    private _item: any;
    private _key: string;
    private _vals: any[];
    private _names: string[];

    // name of the output field that contains the row's pivot key
    static _ROW_KEY_NAME = '$rowKey';

    /**
     * Initializes a new instance of the {@link PivotKey} class.
     *
     * @param fields {@link PivotFieldCollection} that owns this key.
     * @param fieldCount Number of fields to take into account for this key.
     * @param valueFields {@link PivotFieldCollection} that contains the values for this key.
     * @param valueFieldIndex Index of the value to take into account for this key.
     * @param item First data item represented by this key.
     */
    constructor(fields: PivotFieldCollection, fieldCount: number, valueFields: PivotFieldCollection, valueFieldIndex: number, item: any) {
        this._fields = fields;
        this._fieldCount = fieldCount;
        this._valueFields = valueFields;
        this._valueFieldIndex = valueFieldIndex;
        this._item = item;
    }

    /**
     * Gets the {@link PivotFieldCollection} that owns this key.
     */
    get fields(): PivotFieldCollection {
        return this._fields;
    }
    /**
     * Gets the {@link PivotFieldCollection} that contains the values for this key.
     */
    get valueFields(): PivotFieldCollection {
        return this._valueFields;
    }
    /**
     * Gets the {@link PivotField} that contains the main value for this key.
     */
    get valueField(): PivotField {
        return this._valueFields[this._valueFieldIndex];
    }
    /**
     * Gets an array with the values used to create this key.
     */
    get values(): any[] {
        if (this._vals == null) {
            this._vals = new Array(this._fieldCount);
            for (let i = 0; i < this._fieldCount; i++) {
                let fld = this._fields[i] as PivotField;
                this._vals[i] = fld._getValue(this._item, false);
            }
        }
        return this._vals;
    }
    /**
     * Gets an array with the names of the fields in this key.
     */
    get fieldNames(): string[] {
        if (!this._names) {
            this._names = [];
            for (let i = 0; i < this.fields.length; i++) {
                let pf = this._fields[i];
                this._names.push(pf._getName());
            }
        }
        return this._names;
    }
    /**
     * Gets the type of aggregate represented by this key.
     */
    get aggregate(): wijmo.Aggregate {
        let vf = this._valueFields,
            idx = this._valueFieldIndex;
        wijmo.assert(vf && idx > -1 && idx < vf.length, 'aggregate not available for this key');
        return (vf[idx] as PivotField).aggregate;
    }
    /**
     * Gets the value for this key at a given index.
     *
     * @param index Index of the field to be retrieved.
     * @param formatted Whether to return a formatted string or the raw value.
     */
    getValue(index: number, formatted: boolean) {
        if (this.values.length == 0) {
            return wijmo.culture.olap.PivotEngine.grandTotal;
        }
        if (index > this.values.length - 1) {
            return wijmo.culture.olap.PivotEngine.subTotal;
        }
        let val = this.values[index];
        if (formatted && !wijmo.isString(val)) {
            let fld = this.fields[index],
                fmt = fld ? fld.format : ''; // TFS 258996
            val = wijmo.Globalize.format(this.values[index], fmt);
        }
        return val;
    }
    /**
     * Gets the subtotal level that this key represents.
     *
     * The value -1 indicates the key does not represent a subtotal.
     * Zero indicates a grand total.
     * Values greater than zero indicate the subtotal level.
     */
    get level(): number {
        return this._fieldCount == this._fields.length
            ? -1 // not a subtotal
            : this._fieldCount;
    }
    /**
     * Comparer function used to sort arrays of {@link _PivotKey} objects.
     *
     * @param key {@link _PivotKey} to compare to this one.
     */
    compareTo(key: _PivotKey): number {
        let cmp = 0;
        if (key != null && key._fields == this._fields) {

            // compare values
            let vals = this.values,
                kvals = key.values,
                count = Math.min(vals.length, kvals.length);
            for (let i = 0; i < count; i++) {

                // get types and value to compare
                let type = vals[i] != null ? wijmo.getType(vals[i]) : null,
                    ic1 = vals[i],
                    ic2 = kvals[i];

                // let the field compare the values
                let fld = this._fields[i] as PivotField;
                if (fld.sortComparer) {
                    cmp = fld.sortComparer(ic1, ic2);
                    if (wijmo.isNumber(cmp)) {
                        if (cmp != 0) {
                            return fld.descending ? -cmp : cmp;
                        }
                        continue;
                    }
                }

                // Dates are hard because the format used may affect the sort order:
                // for example, 'MMMM' shows only months, so the year should not be 
                // taken into account when sorting.
                if (type == wijmo.DataType.Date) {
                    let fmt = fld.format;
                    if (fmt && fmt != 'd' && fmt != 'D') {
                        let s1 = fld._getValue(this._item, true),
                            s2 = fld._getValue(key._item, true),
                            d1 = wijmo.Globalize.parseDate(s1, fmt),
                            d2 = wijmo.Globalize.parseDate(s2, fmt);
                        if (d1 && d2) { // parsed OK, compare parsed dates
                            ic1 = d1;
                            ic2 = d2;
                        } else { // parsing failed, compare as strings (e.g. "ddd")
                            ic1 = s1;
                            ic2 = s2;
                        }
                    }
                }

                // different values? we're done! (careful when comparing dates: TFS 190950)
                let equal = (ic1 == ic2) || wijmo.DateTime.equals(ic1, ic2);
                if (!equal) {
                    if (ic1 == null) return +1; // can't compare nulls to non-nulls
                    if (ic2 == null) return -1; // show nulls at the bottom
                    cmp = ic1 < ic2 ? -1 : +1;
                    return fld.descending ? -cmp : cmp;
                }
            }

            // compare value fields by index
            // for example, if this view has two value fields "Sales" and "Downloads",
            // then order the value fields by their position in the Values list.
            if (vals.length == kvals.length) {
                cmp = this._valueFieldIndex - key._valueFieldIndex;
                if (cmp != 0) {
                    return cmp;
                }
            }

            // all values match, compare key length 
            // (so subtotals come at the bottom)
            cmp = kvals.length - vals.length;
            if (cmp != 0) {
                return cmp * (this.fields.engine.totalsBeforeData ? -1 : +1);
            }
        }

        // keys are the same
        return 0;
    }
    /**
     * Gets a value that determines whether a given data object matches
     * this {@link _PivotKey}.
     * 
     * The match is determined by comparing the formatted values for each
     * {@link PivotField} in the key to the formatted values in the given item. 
     * Therefore, matches may occur even if the raw values are different.
     *
     * @param item Item to check for a match.
     */
    matchesItem(item: any): boolean {
        for (let i = 0; i < this._vals.length; i++) {
            let s1 = this.getValue(i, true),
                s2 = this._fields[i]._getValue(item, true);
            if (s1 != s2) {
                return false;
            }
        }
        return true;
    }

    // overridden to return a unique string for the key
    toString(uniqueId?: number): string {
        if (!this._key || uniqueId) {
            let key = '';

            // save pivot fields
            for (let i = 0; i < this._fieldCount; i++) {
                let pf = this._fields[i];
                key += pf._getName() + ':' + pf._getValue(this._item, true) + ';';
            }

            // save value field
            if (this._valueFields) {
                let vf = this._valueFields[this._valueFieldIndex];
                key += vf._getName() + ':0;';
            } else {
                key += '{total}';
            }

            // save the key
            if (uniqueId) {
                return key + uniqueId.toString();
            } else {
                this._key = key;
            }
        }
        return this._key;
    }
}
    }
    


    module wijmo.olap {
    



'use strict';

const _NOT_EDITABLE = 'This collection is not editable.';

/**
 * Extends the {@link CollectionView} class to preserve the position of subtotal rows
 * when sorting.
 */
export class PivotCollectionView extends wijmo.collections.CollectionView {
    private _ng: PivotEngine;

    /**
     * Initializes a new instance of the {@link PivotCollectionView} class.
     * 
     * @param engine {@link PivotEngine} that owns this collection.
     */
    constructor(engine: PivotEngine) {
        super();
        this.canAddNew = this.canRemove = false;
        this._ng = wijmo.asType(engine, PivotEngine, false);
    }

    //** object model

    /**
     * Gets a reference to the {@link PivotEngine} that owns this view.
     */
    get engine(): PivotEngine {
        return this._ng;
    }

    // ** overrides

    // this collection is not supposed to be edited! (TFS 496696 and many others)
    implementsInterface(interfaceName: string): boolean {
        return interfaceName == 'IEditableCollectionView'
            ? false
            : super.implementsInterface(interfaceName);
    }
    editItem(item: any) {
        wijmo.assert(false, _NOT_EDITABLE);
    }
    addNew() {
        wijmo.assert(false, _NOT_EDITABLE);
    }
    
    // perform sort keeping groups together
    _performSort(items: any[]) {

        //// debugging
        //let copy = items.slice();

        let ng = this._ng;
        if (ng.sortableGroups && ng._getShowRowTotals() == ShowTotals.Subtotals) {
            let start = 0,
                end = items.length - 1;
            if (this._getItemLevel(items[start]) == 0) start++;
            if (this._getItemLevel(items[end]) == 0) end--;
            this._sortGroups(items, 1, start, end);
        } else {
            this._sortData(items);
        }

        //// checking
        //assert(items.length == copy.length, 'length should be the same');
        //for (let i = 0; i < items.length; i++) {
        //    assert(items.indexOf(copy[i]) > -1, 'missing item');
        //    assert(copy.indexOf(items[i]) > -1, 'extra item');
        //}
    }

    // show rows only if there are value or row fields
    _performFilter(items: any[]): any[] {

        // no value/row fields? no items
        if (this._ng) {
            if (this._ng.valueFields.length == 0 && this._ng.rowFields.length == 0) {
                return [];
            }
        }

        // default handling
        return this.canFilter && this._filter
            ? items.filter(this._filter, this)
            : items;
    }

    // ** implementation

    // gets the range of items in a group
    _getGroupRange(items: any[], item: any) {
        let ng = this._ng,
            start = items.indexOf(item),
            end = start,
            level = this._getItemLevel(items[start]);
        if (ng.totalsBeforeData) {
            for (end = start; end < items.length - 1; end++) {
                let lvl = this._getItemLevel(items[end + 1]);
                if (lvl > -1 && lvl <= level) {
                    break;
                }
            }
        } else {
            for (start = end; start; start--) {
                let lvl = this._getItemLevel(items[start - 1]);
                if (lvl > -1 && lvl <= level) {
                    break;
                }
            }
        }
        return [start, end];
    }

    // sorts the groups in an array segment
    _sortGroups(items: any[], level: number, start: number, end: number) {

        // look for groups within the range
        let groups = [];
        for (let i = start; i <= end; i++) {
            if (this._getItemLevel(items[i]) == level) {
                groups.push(items[i]);
            }
        }

        // no groups? regular data sort
        if (!groups.length) {
            this._sortData(items);
            return;
        }

        // sort group rows by total
        super._performSort(groups);

        // build array with sorted groups
        let arr = [];
        for (let i = 0; i < groups.length; i++) {

            // copy group to output
            var rng = this._getGroupRange(items, groups[i]),
                len = arr.length;
            for (let j = rng[0]; j <= rng[1]; j++) {
                arr.push(items[j]);
            }

            // sort subgroups
            if (level < this._ng.rowFields.length - 1) {
                this._sortGroups(arr, level + 1, start + len, arr.length - 1);
            } else {
                this._sortSegment(arr, start + len, arr.length - 1);
            }
        }

        // copy sorted result back into original array
        for (let i = 0; i < arr.length; i++) {
            items[start + i] = arr[i];
        }
    }

    // sorts the data in an array segment (no groups)
    _sortSegment(items: any[], start: number, end: number) {
        let arr = items.slice(start, end);
        super._performSort(arr);
        for (let i = 0; i < arr.length; i++) {
            items[start + i] = arr[i];
        }
    }

    // sorts the data items between subtotals (old approach)
    _sortData(items: any[]) {
        for (let start = 0; start < items.length; start++) {

            // skip totals
            if (this._getItemLevel(items[start]) > -1) {
                continue;
            }

            // find last item that is not a total
            let end = start;
            for (; end < items.length - 1; end++) {
                if (this._getItemLevel(items[end + 1]) > -1) {
                    break;
                }
            }

            // sort items between start and end
            if (end > start) {
                let arr = items.slice(start, end + 1);
                super._performSort(arr);
                for (let i = 0; i < arr.length; i++) {
                    items[start + i] = arr[i];
                }
            }

            // move on to next item
            start = end;
        }
    }

    // gets the outline level for a data item
    _getItemLevel(item: any) {
        let key = item[_PivotKey._ROW_KEY_NAME];
        return key.level;
    }
}
    }
    


    module wijmo.olap {
    




'use strict';

/**
 * Represents a property of the items in the wijmo.olap data source.
 */
export class PivotField {
    private _ng: PivotEngine;
    /*private*/ _header: string;
    /*private*/ _binding: wijmo.Binding;
    /*private*/ _autoGenerated: boolean;
    /*private*/ _subFields: PivotField[];
    private _aggregate: wijmo.Aggregate;
    private _showAs: ShowAs;
    private _weightField: PivotField;
    private _format: string;
    private _width: number;
    private _wordWrap: boolean;
    private _align: string;
    private _dataType: wijmo.DataType;
    private _filter: PivotFilter;
    private _srtCmp: Function;
    private _descending: boolean;
    private _isContentHtml: boolean;
    private _visible: boolean;
    private _parent: PivotField;
    private _getValueFn: Function;
    private _getAggValueFn: Function; // TFS 456915

    // serializable properties
    static _props = [
        'dataType',
        'format',
        'width',
        'wordWrap',
        'aggregate',
        'showAs',
        'descending',
        'isContentHtml',
        'visible'
    ];

    /**
     * Initializes a new instance of the {@link PivotField} class.
     *
     * @param engine {@link PivotEngine} that owns this field.
     * @param binding Property that this field is bound to.
     * @param header Header shown to identify this field (defaults to the binding).
     * @param options JavaScript object containing initialization data for the field.
     */
    constructor(engine: PivotEngine, binding: string, header?: string, options?: any) {
        this._ng = engine;
        this._binding = new wijmo.Binding(binding);
        this._header = header ? header : wijmo.toHeaderCase(binding);
        this._showAs = ShowAs.NoCalculation;
        this._isContentHtml = false;
        this._visible = true;
        this._format = '';
        this._filter = new PivotFilter(this);
        wijmo.copy(this, options);

        // update dataType and aggregate props if they are not assigned explicitly
        if (this._dataType == null) {
            this._updateDataType();
        }
        if (this._aggregate == null) {
            this._aggregate = (this.dataType == wijmo.DataType.Number) // as in engine._createField (TFS 466847)
                ? wijmo.Aggregate.Sum // this works for numbers
                : wijmo.Aggregate.Cnt; // this works for all data types
        }
    }

    // ** object model

    /**
     * Gets or sets the name of the property the field is bound to.
     */
    get binding(): string {
        return this._binding ? this._binding.path : null;
    }
    set binding(value: string) {
        if (value != this.binding) {
            let oldValue = this.binding,
                path = wijmo.asString(value);
            this._binding = path ? new wijmo.Binding(path) : null;
            this._updateDataType();
            let e = new wijmo.PropertyChangedEventArgs('binding', oldValue, value);
            this.onPropertyChanged(e);
        }
    }
    /**
     * Gets or sets a function to be used for retrieving the field value
     * for a given data item.
     * 
     * This property is set to null by default, causing the engine to
     * use the field's {@link binding} property to retrieve the value.
     * 
     * If specified, the function should take a single parameter that
     * represents the data item being evaluated and should return
     * the calculated value for the item.
     * 
     * Notice the difference between the {@link getValue} property
     * (a function that takes a raw data item and returns a raw value), and
     * the {@link getAggregateValue} (a function that takes a summary object
     * and returns an aggregate value):
     * 
     * ```typescript
     * fields: [
     *     {
     *         header: 'Conversion (per summary row)',
     *         dataType: 'Number',
     *         format: 'p0',
     * 
     *         // getAggregateValue computes an aggregate from a summary row (Downloads, Sales)
     *         getAggregateValue: row => row.Downloads ? row.Sales / row.Downloads : 0
     *     },
     *     {
     *         header: 'Conversion (per raw data item)',
     *         dataType: 'Number',
     *         aggregate: 'Avg',
     *         format: 'p0',
     * 
     *         // getValue computes a raw value from a data item (downloads, sales)
     *         getValue: item => item.downloads ? item.sales / item.downloads : 0
     * },
     * ```
     * 
     * {@sample OLAP/PivotPanel/Fields/Customize/FieldSettingsDialog/Calculated Example}
     */
    get getValue(): Function {
        return this._getValueFn;
    }
    set getValue(value: Function) {
        this._getValueFn = wijmo.asFunction(value, true);
    }
    /**
     * Gets or sets a function to be used for retrieving the field's
     * **aggregate** value for a given summary object.
     * 
     * The default value for this property is **null**, causing the engine to
     * use the field's {@link aggregate} and {@link showAs} properties to 
     * calculate the aggregate.
     * 
     * If specified, the function should take a single parameter that
     * represents the summary object generated by the engine and should return
     * the aggregate value for the item.
     * 
     * Notice the difference between the {@link getValue} property
     * (a function that takes a raw data item and returns a raw value), and
     * the {@link getAggregateValue} (a function that takes a summary object
     * and returns an aggregate value):
     * 
     * ```typescript
     * fields: [
     *     {
     *         header: 'Conversion (per summary row)',
     *         dataType: 'Number',
     *         format: 'p0',
     * 
     *         // getAggregateValue computes an aggregate from a summary row (Downloads, Sales)
     *         // **NOTE**: for this formula to work, the "Downloads" and "Sales" fields must be 
     *         // present in the PivotEngine's valueFields array.
     *         getAggregateValue: row => row.Downloads ? row.Sales / row.Downloads : 0
     *     },
     *     {
     *         header: 'Conversion (per raw data item)',
     *         dataType: 'Number',
     *         aggregate: 'Avg',
     *         format: 'p0',
     * 
     *         // getValue computes a raw value from a data item (downloads, sales)
     *         getValue: item => item.downloads ? item.sales / item.downloads : 0
     * },
     * ```
     * 
     * {@sample OLAP/PivotPanel/Fields/Customize/FieldSettingsDialog/Calculated Example}
     */
    get getAggregateValue(): Function {
        return this._getAggValueFn;
    }
    set getAggregateValue(value: Function) {
        this._getAggValueFn = wijmo.asFunction(value, true);
    }
    /**
     * Gets or sets a string used to represent this field in the user 
     * interface.
     * 
     * The default value for this property is a capitalized version of the
     * {@link binding} value.
     */
    get header(): string {
        return this._header;
    }
    set header(value: string) {
        value = wijmo.asString(value, false);
        let fld = this._ng.fields.getField(value);
        if (!value || (fld && fld != this)) {
            wijmo.assert(false, 'field headers must be unique and non-empty.');
        } else {
            this._setProp('_header', wijmo.asString(value));
        }
    }
    /**
     * Gets a reference to the {@link PivotFilter} used to filter values for this field.
     *
     * For measure fields in cube data sources, the filter is applied to aggregated
     * cell values. For measure fields in non-cube data sources, the filter is
     * applied to the raw data.
     */
    get filter(): PivotFilter {
        return this._filter;
    }
    /**
     * Gets or sets how the field should be summarized.
     * 
     * The default value for this property is **Aggregate.Sum**
     * for numeric fields, and **Aggregate.Count** for other
     * field types.
     */
    get aggregate(): wijmo.Aggregate {
        return this._aggregate;
    }
    set aggregate(value: wijmo.Aggregate) {
        this._setProp('_aggregate', wijmo.asEnum(value, wijmo.Aggregate));
    }
    /**
     * Gets or sets a value that specifies how to display the aggregate
     * value.
     * 
     * Options for this property are defined by the {@link ShowAs} enumeration
     * and include differences between the value and the one in the previous
     * row or column, percentages over the row, column, or grand total, and
     * running totals.
     * 
     * This property is similar to the
     * <a href="https://support.microsoft.com/en-us/office/show-different-calculations-in-pivottable-value-fields-014d2777-baaf-480b-a32b-98431f48bfec" target="_blank">Show Values As</a>
     * feature in Excel.
     * 
     * The default value for this property is **ShowAs.NoCalculation**.
     */
    get showAs(): ShowAs {
        return this._showAs;
    }
    set showAs(value: ShowAs) {
        this._setProp('_showAs', wijmo.asEnum(value, ShowAs));
    }
    /**
     * Gets or sets the {@link PivotField} used as a weight for calculating
     * aggregates on this field.
     *
     * If this property is set to null, all values are assumed to have weight one.
     *
     * This property allows you to calculate weighted averages and totals. 
     * For example, if the data contains a 'Quantity' field and a 'Price' field,
     * you could use the 'Price' field as a value field and the 'Quantity' field as
     * a weight. The output would contain a weighted average of the data.
     */
    get weightField(): PivotField {
        return this._weightField;
    }
    set weightField(value: PivotField) {
        this._setProp('_weightField', wijmo.asType(value, PivotField, true));
    }
    /**
     * Gets or sets the data type of the field.
     */
    get dataType(): wijmo.DataType {
        return this._dataType;
    }
    set dataType(value: wijmo.DataType) {
        this._setProp('_dataType', wijmo.asEnum(value, wijmo.DataType));
    }
    /**
     * Gets a value that indicates whether the field is a measure or
     * a dimension.
     *
     * Measures are also known as 'facts'. They are typically numeric 
     * values that can be aggregated into summary statistics that convey 
     * information about the field.
     *
     * Dimensions are typically strings, dates, or boolean values that 
     * can be used to divide measures into categories.
     */
    get isMeasure(): boolean {
        return this._dataType == wijmo.DataType.Number;
    }
    /**
     * Gets this field's child fields.
     */
    get subFields(): PivotField[] {
        return this._subFields;
    }
    /**
     * Gets or sets the format to use when displaying field values.
     * 
     * The default value for this property is 
     * **"d"** for date fields, **"n0"** for numeric fields, 
     * and the empty string for other field types.
     */
    get format(): string {
        return this._format;
    }
    set format(value: string) {
        this._setProp('_format', wijmo.asString(value));
    }
    /**
     * Gets or sets the horizontal alignment of this field's cells.
     *
     * The default value for this property is null, which causes the grid to select
     * the alignment automatically based on the fields's {@link dataType} (numbers are
     * right-aligned, Boolean values are centered, and other types are left-aligned).
     *
     * If you want to override the default alignment, set this property
     * to 'left', 'right', 'center', or 'justify'.
     */
    get align(): string {
        return this._align;
    }
    set align(value: string) {
        this._setProp('_align', wijmo.asString(value));
    }
    /**
     * Gets or sets the preferred width to be used for showing this 
     * field in user interface controls such as the {@link PivotGrid}.
     */
    get width(): number {
        return this._width;
    }
    set width(value: number) {
        this._setProp('_width', wijmo.asNumber(value, true, true));
    }
    /**
     * Gets or sets a value that indicates whether the content of this
     * field should be allowed to wrap within cells.
     * 
     * The default value for this property is **false**.
     */
    get wordWrap(): boolean {
        return this._wordWrap;
    }
    set wordWrap(value: boolean) {
        this._setProp('_wordWrap', wijmo.asBoolean(value));
    }
    /**
     * Gets or sets a value that determines whether keys should be sorted 
     * in descending order for this field.
     *
     * The default value for this property is **false**.
     */
    get descending(): boolean {
        return this._descending ? true : false;
    }
    set descending(value: boolean) {
        this._setProp('_descending', wijmo.asBoolean(value));
    }
    /**
     * Gets or sets a value indicating whether items in this field 
     * contain HTML content rather than plain text.
     *
     * The default value for this property is **false**.
     */
    get isContentHtml(): boolean {
        return this._isContentHtml;
    }
    set isContentHtml(value: boolean) {
        this._setProp('_isContentHtml', wijmo.asBoolean(value));
    }
    /**
     * Gets or sets a value indicating whether this field should be
     * displayed in instances of the {@link PivotPanel} control.
     *
     * The default value for this property is **true**.
     *
     * Setting this property to false hides the field any {@link PivotPanel}
     * controls, preventing users from adding, removing, or changing the
     * the field position in the engine's view definition.
     */
    get visible(): boolean {
        return this._visible;
    }
    set visible(value: boolean) {
        this._setProp('_visible', wijmo.asBoolean(value));
    }
    /**
     * Gets or sets a function used to compare values when sorting.
     *
     * If provided, the sort comparer function should take as parameters
     * two values of any type, and should return -1, 0, or +1 to indicate
     * whether the first value is smaller than, equal to, or greater than
     * the second. If the sort comparer returns null, the standard built-in
     * comparer is used.
     *
     * This {@link sortComparer} property allows you to use custom comparison
     * algorithms that in some cases result in sorting sequences that are
     * more consistent with user's expectations than plain string comparisons.
     *
     * The example below shows a typical use for the {@link sortComparer} property:
     * <pre>// define list of products
     * app.products = 'Wijmo,Aoba,Olap,Xuni'.split(',');
     *
     * // sort products by position in the 'app.products' array
     * ng.viewDefinitionChanged.addHandler(function () {
     *   var fld = ng.fields.getField('Product');
     *   if (fld) {
     *     fld.sortComparer = function (val1, val2) {
     *       return app.products.indexOf(val1) - app.products.indexOf(val2);
     *     }
     *   }
     * });</pre>
     */
    get sortComparer(): Function {
        return this._srtCmp;
    }
    set sortComparer(value: Function) {
        if (value != this.sortComparer) {
            this._srtCmp = wijmo.asFunction(value);
        }
    }
    /**
     * Gets a reference to the {@link PivotEngine} that owns this {@link PivotField}.
     */
    get engine(): PivotEngine {
        return this._ng;
    }
    /**
     * Gets the {@link ICollectionView} bound to this field.
     */
    get collectionView(): wijmo.collections.ICollectionView {
        return this.engine ? this.engine.collectionView : null;
    }
    /**
     * Gets or sets a value that determines whether this field is
     * currently being used in the view.
     *
     * Setting this property to true causes the field to be added to the
     * view's {@link PivotEngine.rowFields} or {@link PivotEngine.valueFields}, 
     * depending on the field's data type.
     */
    get isActive(): boolean {
        return this._getIsActive();
    }
    set isActive(value: boolean) {
        this._setIsActive(value);
    }
    /**
     * Gets this field's parent field.
     *
     * When you drag the same field into the Values list multiple
     * times, copies of the field are created so you can use the
     * same binding with different parameters. The copies keep a
     * reference to their parent fields.
     */
    get parentField(): PivotField {
        return this._parent;
    }
    /**
     * Gets the key for this {@link PivotField}.
     *
     * For regular fields, the key is the field's {@link header};
     * for {@link CubePivotField} instances, the key is the
     * field's {@link binding}.
     */
    get key(): string {
        return this.header;
    }

    // ** events

    /**
     * Occurs when the value of a property in this {@link Range} changes.
     */
    readonly propertyChanged = new wijmo.Event<PivotField, wijmo.PropertyChangedEventArgs>();
    /**
     * Raises the {@link propertyChanged} event.
     *
     * @param e {@link PropertyChangedEventArgs} that contains the property
     * name, old, and new values.
     */
    onPropertyChanged(e: wijmo.PropertyChangedEventArgs) {
        this.propertyChanged.raise(this, e);
        this._ng._fieldPropertyChanged(this, e);
    }

    // ** implementation

    // update data type after initialization
    _updateDataType() {
        if (!this._dataType && this._ng && this._binding) {
            let cv = this._ng.collectionView;
            if (cv && cv.items.length) {
                let item = cv.items[0];
                this._dataType = wijmo.getType(this._binding.getValue(item));
            }
        }
    }

    // extend _copy to handle subFields and filters
    _copy(key: string, value: any): boolean {
        if (key == 'subFields') {
            if (!this._subFields) {
                this._subFields = [];
            } else {
                this._subFields.splice(0, this._subFields.length);
            }
            if (value && value.length) {
                value.forEach((subField: PivotField) => {
                    let fld = this.engine._createField(subField, this._autoGenerated);
                    this._subFields.push(fld);
                });
            }
            return true;
        }
        if (key == 'filter') { // TFS 455787
            this._setFilterProxy(value);
            return true;
        }
        return false;
    }

    // persist field filters
    _getFilterProxy(): any {
        let flt = this.filter;

        // condition filter (without inactive conditions)
        if (flt.conditionFilter.isActive) {
            let cf = flt.conditionFilter,
                proxy = {
                    //filterType: 'condition',
                    condition1: { operator: cf.condition1.operator, value: cf.condition1.value },
                    and: cf.and,
                    condition2: { operator: cf.condition2.operator, value: cf.condition2.value }
                };
            if (!cf.condition1.isActive) {
                delete proxy.condition1;
            }
            if (!cf.condition2.isActive) {
                delete proxy.condition2;
            }
            return proxy;
        }

        // value filter
        if (flt.valueFilter.isActive) {
            let vf = flt.valueFilter;
            return {
                //filterType: 'value',
                filterText: vf.filterText,
                showValues: vf.showValues
            }
        }

        // no filter!
        wijmo.assert(false, 'inactive filters shouldn\'t be persisted.');
        return null;
    }
    _setFilterProxy(proxy: any) {
        let flt = this.filter,
            cf = flt.conditionFilter,
            vf = flt.valueFilter;
        
        // clear original filter
        flt.clear();

        // honor deprecated explicit filters (TFS 455787)
        if (proxy.conditionFilter) {
            proxy = proxy.conditionFilter;
        } else if (proxy.valueFilter) {
            proxy = proxy.valueFilter;
        }

        // apply proxy condition filter
        if (proxy.condition1) { 
            let pc1 = proxy.condition1;
            let val = wijmo.changeType(pc1.value, this.dataType); //, this.format); // C1WEB-22625
            cf.condition1.value = val ? val : pc1.value;
            cf.condition1.operator = pc1.operator;
            let pc2 = proxy.condition2;
            if (pc2) {
                let val = wijmo.changeType(pc2.value, this.dataType); //, this.format); // C1WEB-22625
                cf.condition2.value = val ? val : pc2.value;
                cf.condition2.operator = pc2.operator;
            }
            if (wijmo.isBoolean(proxy.and)) {
                cf.and = proxy.and;
            }
        }
        
        // apply proxy value filter
        if (proxy.showValues) {
            vf.filterText = proxy.filterText;
            vf.showValues = proxy.showValues;
        }
    }

    // checks whether the field is currently in any view lists
    _getIsActive(): boolean {
        if (this._ng && !this._hasSubFields()) { // fields with child fields cannot be active
            let lists = this._ng._viewLists;
            for (let i = 0; i < lists.length; i++) {
                if (lists[i].indexOf(this) > -1) { // TFS 214723
                    return true;
                }
            }
        }
        return false;
    }

    // adds or removes the field to a view list
    _setIsActive(value: boolean) {
        if (this._ng && !this._hasSubFields()) { // fields with child fields cannot be active
            let isActive = this.isActive;
            value = wijmo.asBoolean(value);
            if (value != isActive) {

                // add measures to value fields list, others to row fields list
                if (value) {
                    if (this.isMeasure) {
                        this._ng.valueFields.push(this);
                    } else {
                        this._ng.rowFields.push(this);
                    }
                } else {

                    // remove from view lists
                    let lists = this._ng._viewLists;
                    for (let i = 0; i < lists.length; i++) {
                        let list = lists[i];
                        for (let f = 0; f < list.length; f++) {
                            let fld = list[f] as PivotField;
                            if (fld == this || fld.parentField == this) {
                                list.removeAt(f);
                                f--;
                            }
                        }
                    }

                    // remove any copies from main list
                    let list = this._ng.fields;
                    for (let f = list.length - 1; f >= 0; f--) {
                        let fld = list[f] as PivotField;
                        if (fld.parentField == this) {
                            list.removeAt(f);
                            f--;
                        }
                    }
                }
            }
        }
    }

    // check whether this field has subfields
    _hasSubFields(): boolean {
        return this._subFields != null && this._subFields.length > 0;
    }

    // creates a clone with the same binding/properties and a unique header
    _clone(): PivotField {

        // create clone
        let clone = new PivotField(this._ng, this.binding);
        this._ng._copyProps(clone, this, PivotField._props);
        clone._autoGenerated = true;
        clone._parent = this;

        // give it a unique header
        let hdr = this.header.replace(/\d+$/, '');
        for (let i = 2; ; i++) {
            let hdrn = hdr + i.toString();
            if (this._ng.fields.getField(hdrn) == null) {
                clone._header = hdrn;
                break;
            }
        }

        // done
        return clone;
    }

    // sets property value and notifies about the change
    _setProp(name: string, value: any, member?: string) {
        let oldValue = this[name];
        if (value != oldValue) {
            this[name] = value;
            let e = new wijmo.PropertyChangedEventArgs(name.substr(1), oldValue, value);
            this.onPropertyChanged(e);
        }
    }

    // get field name (used for display)
    _getName(): string {
        return this.header || this.binding;
    }

    // get field value
    _getValue(item: any, formatted: boolean): any {
        let bnd = this._binding,
            value: any = null;
        if (item) {
            if (wijmo.isFunction(this._getValueFn)) {
                value = this._getValueFn.call(this, item); // custom function
            } else if (this._ng.isServer) {
                value = item[this.key]; // server value
            } else {
                value = bnd._key ? item[bnd._key] : bnd.getValue(item); // binding
            }
        }
        return !formatted || typeof (value) == 'string'
            ? value // raw value
            : wijmo.Globalize.format(value, this._format); // formatted value
    }

    // get field weight
    _getWeight(item: any): number {
        let value = this._weightField
            ? this._weightField._getValue(item, false)
            : null;
        return wijmo.isNumber(value) ? value : null;
    }
}

/**
 * Extends the {@link PivotField} class to represent a field in a server-based
 * cube data source.
 */
export class CubePivotField extends PivotField {
    private _dimensionType: DimensionType;

    /**
     * Initializes a new instance of the {@link CubePivotField} class.
     *
     * @param engine {@link PivotEngine} that owns this field.
     * @param binding Property that this field is bound to.
     * @param header Header shown to identify this field (defaults to the binding).
     * @param options JavaScript object containing initialization data for the field.
     */
    constructor(engine: PivotEngine, binding: string, header?: string, options?: any) {
        super(engine, binding, header, options);
        wijmo.assert(this.dimensionType != null, 'CubePivotField objects must specify the field\'s dimensionType');
    }

    /**
     * Gets or sets a string used to represent this field in the user interface.
     */
    get header(): string {
        return this._header;
    }
    set header(value: string) {
        this._setProp('_header', wijmo.asString(value));
    }
    /**
     * Gets or sets the dimension type of the field.
     */
    get dimensionType(): DimensionType {
        return this._dimensionType;
    }
    set dimensionType(value: DimensionType) {
        this._setProp('_dimensionType', wijmo.asEnum(value, DimensionType, false));
    }
    /**
     * Overridden to account for the dimension type.
     */
    get isMeasure(): boolean {
        switch (this._dimensionType) {
            case 1: // Measure
            case 2: // Kpi
            case 8: // Currency
                return true;
        }
        return false;
    }
    /**
     * Gets the key for this {@link CubePivotField}.
     *
     * For this type of field, the key is the field's {@link binding}.
     */
    get key(): string {
        return this.binding;
    }

    // ** implementation

    // cube fields cannot be cloned
    _clone(): PivotField {
        throw 'CubePivotField objects cannot be cloned';
    }
}

/**
 * Defines the dimension type of a {@link CubePivotField}.
 */
export enum DimensionType {
    /** Fields that contain categories used to summarize data. */
    Dimension,
    /** Fields that contain quantitative, numerical information. */
    Measure,
    /** Calculations associated with a measure group used to evaluate business performance. */
    Kpi,
    /** Multidimensional Expression (MDX) that returns a set of dimension members. */
    NameSet,
    /** Provide supplementary information about dimension members. */
    Attribute,
    /** Used to categorize measures and improve the user browsing experience. */
    Folder,
    /** Metadata that define relationships between two or more columns in a table. */
    Hierarchy,
    /** Dimension with time-based levels of granularity for analysis and reporting. */
    Date,
    /** Dimension whose attributes represent a list of currencies for financial reporting purposes. */
    Currency
}

    }
    


    module wijmo.olap {
    




'use strict';

/**
 * The {@link Slicer} control provides a quick way to edit filters
 * applied to {@link PivotField} objects.
 *
 * It provides buttons the user can click to filter data based on
 * values and indicates the current filtering state, which makes 
 * it easy to understand what is shown in filtered {@link PivotGrid}
 * and {@link PivotChart} controls.
 *
 * For example, when the user selects 'Smith' in a 'Salespersons'
 * field, only data that includes 'Smith' in that field will be
 * included in the output summary.
 * 
 * {@link Slicer} controls are based on value filters.
 * To use them with server-based pivot engines, you must set the 
 * {@link uniqueValues} property of the fields you want to filter on.
 * For example:
 * 
 * ```typescript
 * // set Country field's unique values so we can use a slicer
 * // this is necessary only when using server-based pivot engines
 * var fld = ngCube.fields.getField('Country');
 * fld.filter.valueFilter.uniqueValues = 'Japan,Portugal,Russia,UK,US'.split(',');
 * 
 * // show slicer
 * var slicer = new wijmo.olap.Slicer('#slicer', {
 *   field: fld,
 *   multiSelect: true
 * });
 * ```
 * 
 * <a href="https://jsfiddle.net/Wijmo5/gh14feox/" target="_blank">Example</a>
 */
export class Slicer extends wijmo.Control {

    // control elements
    _root: HTMLDivElement;
    _divHdr: HTMLDivElement;
    _divHdrText: HTMLDivElement;
    _btnMSel: HTMLButtonElement;
    _btnClear: HTMLButtonElement;
    _divListBox: HTMLDivElement;

    // property storage
    _fld: PivotField;
    _edt: wijmo.grid.filter.ValueFilterEditor;
    _lbx: wijmo.input.ListBox;
    _hdr: string = null;
    _mSel = false;

    // work variables
    _updatingFilter = false;
    _propChanged = false;
    _originalFilterType: wijmo.grid.filter.FilterType;
    _uniqueValues: any[];
    _fldPropChangeBnd = this._fldPropChange.bind(this);

    /**
     * Gets or sets the template used to instantiate {@link Slicer} controls.
     */
    static controlTemplate =
        '<div wj-part="root">' +
            '<div wj-part="div-hdr" class="wj-header">' +
                '<div wj-part="div-hdr-text"></div>' +
                '<button wj-part="btn-msel" class="wj-btn btn-msel" tabindex="-1">' +
                    '<span class="wj-glyph">&#8801;</span>' +
                '</button>' +
                '<button wj-part="btn-clear" class="wj-btn btn-clear" tabindex="-1">' +
                    '<span class="wj-glyph">&times;</span>' +
                '</button>' +
            '</div>' +
        '</div>';

    /**
     * Initializes a new instance of the {@link Slicer} class.
     *
     * @param element The DOM element that hosts the control, or a CSS selector for the host element (e.g. '#theCtrl').
     * @param options The JavaScript object containing initialization data for the control.
     */
    constructor(element: any, options?: any) {
        super(element, null, wijmo.isIE() && !wijmo.isEdge());

        // instantiate and apply template
        let tpl = this.getTemplate();
        this.applyTemplate('wj-slicer wj-nocheck wj-control wj-content', tpl, {
            _root: 'root',
            _divHdr: 'div-hdr',
            _divHdrText: 'div-hdr-text',
            _btnMSel: 'btn-msel',
            _btnClear: 'btn-clear'
        });

        // globalization
        let ci = wijmo.culture.olap.Slicer,
            tt = new wijmo.Tooltip();
        wijmo.setAttribute(this._btnMSel, 'aria-label', ci.multiSelect);
        wijmo.setAttribute(this._btnClear, 'aria-label', ci.clearFilter);
        tt.setTooltip(this._btnMSel, ci.multiSelect)
        tt.setTooltip(this._btnClear, ci.clearFilter)

        // handle the clear button
        this.addEventListener(this._btnClear, 'click', (e) => {
            this._clear();
        });

        // handle the multi-select button
        this.addEventListener(this._btnMSel, 'click', (e) => {
            this.multiSelect = !this.multiSelect;
        });

        // apply options
        this.initialize(options);
    }

    /**
     * Gets or sets the {@link PivotField} being filtered by this {@link Slicer}.
     *
     * If the {@link PivotField} is not included in the current view definition,
     * the {@link Slicer} will automatically add the field to the engine's 
     * {@link PivotEngine.filterFields} collection.
     *
     * If you want to remove the field from any {@link PivotPanel} controls so
     * users cannot remove the field from the view definition, set the
     * fields {@link PivotField.visible} property to false. The field will 
     * remain active, but will not be shown in any {@link PivotPanel} controls.
     */
    get field(): PivotField {
        return this._fld;
    }
    set field(value: PivotField) {
        if (value != this._fld) {

            // dispose of old ListBox
            if (this._divListBox) {
                wijmo.removeChild(this._divListBox);
                this._divListBox = null;
                this._lbx.dispose();
                this._lbx = null;
            }

            // dispose of old editor
            if (this._edt) {
                this._clear();
                this._edt.dispose();
            }

            // dispose of old field
            let fld = this._fld;
            if (fld) {
                fld.filter.filterType = this._originalFilterType;
                fld.filter.valueFilter.uniqueValues = this._uniqueValues;
                fld.propertyChanged.removeHandler(this._fldPropChangeBnd);
            }

            // update the field
            fld = this._fld = wijmo.asType(value, PivotField, true);
            if (fld) {

                // update filter type
                this._originalFilterType = fld.filter.filterType;
                fld.filter.filterType = wijmo.grid.filter.FilterType.Value;

                // update unique values
                let ng = fld.engine;
                this._uniqueValues = fld.filter.valueFilter.uniqueValues;
                if (ng.isServer && !this._uniqueValues) {
                    let arr = ng._getUniqueValues(fld);
                    fld.filter.valueFilter.uniqueValues = arr;
                }
                fld.propertyChanged.addHandler(this._fldPropChangeBnd);

                // make sure the field is active
                if (!fld.isActive) {
                    fld.engine.filterFields.push(fld);
                }

                // create the new value filter editor
                let div = document.createElement('div');
                this._edt = new wijmo.grid.filter.ValueFilterEditor(div, fld.filter.valueFilter);
            }

            // create the ListBox used to show the filter values
            if (this._edt) {
                this._divListBox = this._edt.hostElement.querySelector('.wj-listbox') as HTMLDivElement;
                this._root.appendChild(this._divListBox);
                this._lbx = wijmo.Control.getControl(this._divListBox) as wijmo.input.ListBox;
                this._lbx.checkedItemsChanged.addHandler((s, e) => {

                    // honor multi-select setting: TFS 419926, 422508
                    if (!this._propChanged) {
                        let selectedItem = this._lbx.selectedItem;
                        if (!this.multiSelect && selectedItem) {
                            this._mSel = true; // avoid infinite loop
                            this._lbx.checkedItems = [selectedItem];
                            this._mSel = false;
                        }
                    }

                    // update the filter
                    if (this._edt && fld) {
                        this._updateFilter();
                        fld.engine.invalidate();
                    }
                });
            }

            // done
            this._updateHeader();
            if (wijmo.isIE() && !wijmo.isEdge()) {
                this.refresh();
            }
        }
    }
    /**
     * Gets or sets the header string shown at the top of the {@link Slicer}.
     * 
     * The default value for this property is **null**, which causes the
     * {@link Slicer} to display the {@link field} header at the top of the
     * {@link Slicer}.
     */
    get header(): string | null {
        return this._hdr;
    }
    set header(value: string | null) {
        if (value != this._hdr) {
            this._hdr = wijmo.asString(value);
            this._updateHeader();
        }
    }
    /**
     * Gets or sets a value indicating whether the control displays the 
     * header area with the header string and multi-select/clear buttons.
     *
     * The default value for this property is **true**.
     */
    get showHeader(): boolean {
        return this._divHdr.style.display != 'none';
    }
    set showHeader(value: boolean) {
        this._divHdr.style.display = wijmo.asBoolean(value) ? '' : 'none';
    }
    /**
     * Gets or sets a value indicating whether the control displays 
     * checkboxes next to each item.
     *
     * The default value for this property is **false**.
     */
    get showCheckboxes(): boolean {
        return !wijmo.hasClass(this.hostElement, 'wj-nocheck');
    }
    set showCheckboxes(value: boolean) {
        wijmo.toggleClass(this.hostElement, 'wj-nocheck', !wijmo.asBoolean(value));
    }
    /**
     * Gets or sets a value that determines whether users should be allowed to
     * select multiple values from the list.
     * 
     * The default value for this property is **false**.
     */
    get multiSelect(): boolean {
        return this._mSel;
    }
    set multiSelect(value: boolean) {
        this._mSel = wijmo.asBoolean(value);
        wijmo.toggleClass(this._btnMSel, 'wj-state-active', this._mSel);
    }

    // ** overrides

    // because IE doesn't support flexbox very well...
    refresh(fullUpdate = true) {
        if (wijmo.isIE() && !wijmo.isEdge() && this.hostElement) {
            setTimeout(() => { // TFS 417142
                wijmo.setCss(this._lbx.hostElement, {
                    height: this.hostElement.clientHeight - this._divHdr.offsetHeight
                });
            });
        }
        super.refresh(fullUpdate);
    }

    // ** implementation

    // handle field property changes
    _fldPropChange(s: PivotField, e: wijmo.PropertyChangedEventArgs) {
        this._propChanged = true;
        switch (e.propertyName) {
            case 'header':
                this._updateHeader();
                break;
            case 'format':
            case 'binding':
                s.filter.clear();
                this._edt.updateEditor();
                break;
            case 'filter':
                if (!this._updatingFilter) {
                    this._edt.updateEditor();
                }
                break;
        }
        this._propChanged = false;
    }

    // update the header text based on the header property and on the field
    _updateHeader() {
        let hdr = this._hdr;
        if (!hdr && this._fld != null) {
            hdr = this._fld.header;
        }
        this._divHdrText.textContent = hdr;
    }

    // clear the filter and update the view
    _clear() {
        if (this._edt) {
            this._edt.clearEditor(false); // TFS 368709
            this._updateFilter();
            this._fld.engine.invalidate();
        }
    }

    // update the filter and remember it's the Slicer updating it
    _updateFilter() {
        this._updatingFilter = true;
        this._edt.updateFilter();
        this._updatingFilter = false;
    }
}
    }
    


    module wijmo.olap {
    






'use strict';

/**
 * Context Menu for {@link PivotGrid} controls. 
 */
export class _GridContextMenu extends wijmo.input.Menu {
    private _targetField: PivotField;
    private _htDown: wijmo.grid.HitTestInfo;

    /**
     * Initializes a new instance of the {@link _GridContextMenu} class.
     */
    constructor() {

        // initialize the menu
        super(document.createElement('div'), {
            header: 'PivotGrid Context Menu',
            displayMemberPath: 'text',
            commandParameterPath: 'parm',
            command: {
                executeCommand: (parm: string) => {
                    this._execute(parm);
                },
                canExecuteCommand: (parm: string) => {
                    return this._canExecute(parm);
                }
            }
        });

        // finish initializing (after call to super)
        this.itemsSource = this._getMenuItems();

        // add a class to allow CSS customization
        wijmo.addClass(this.dropDown, 'context-menu wj-olap-context-menu');
    }

    // refresh menu items in case culture changed
    refresh(fullUpdate = true) {
        this.itemsSource = this._getMenuItems();
        super.refresh(fullUpdate);
    }

    /**
     * Attaches this context menu to a {@link PivotGrid} control.
     *
     * @param grid {@link PivotGrid} to attach this menu to.
     */
    attach(grid: PivotGrid) {
        wijmo.assert(grid instanceof PivotGrid, 'Expecting a PivotGrid control...');
        let owner = grid.hostElement;
        owner.addEventListener('contextmenu', (e) => {
            if (grid.customContextMenu) {

                // prevent default context menu
                e.preventDefault();

                // select the item that was clicked
                this.owner = owner;
                if (this._selectField(e)) {

                    // show the context menu
                    let dropDown = this.dropDown;
                    this.selectedIndex = -1;
                    if (this.onIsDroppedDownChanging(new wijmo.CancelEventArgs())) {
                        wijmo.showPopup(dropDown, e);
                        this.onIsDroppedDownChanged();
                        dropDown.focus();
                    }
                }
            }
        });
    }

    // ** implementation

    // select the item that was clicked before showing the context menu
    _selectField(e: MouseEvent): boolean {

        // assume we have no target field
        this._targetField = null;
        this._htDown = null;

        // find target field based on hit-testing
        let g = wijmo.Control.getControl(this.owner) as PivotGrid,
            ng = g.engine,
            valFields = ng.valueFields,
            colFields = ng.columnFields,
            ht = g.hitTest(e),
            ct = wijmo.grid.CellType;
        switch (ht.cellType) {
            case ct.Cell:
                g.select(ht.range);
                this._targetField = valFields[ht.col % valFields.length];
                this._htDown = ht;
                break;
            case ct.ColumnHeader:
                this._targetField = ht.row < colFields.length
                    ? colFields[ht.row]
                    : valFields[ht.col % valFields.length];
                break;
            case ct.RowHeader:
                this._targetField = g._colRowFields.get(ht.getColumn());
                break;
            case ct.TopLeft:
                if (ht.row == ht.panel.rows.length - 1) {
                    this._targetField = g._colRowFields.get(ht.getColumn());
                }
                break;
        }

        // show the menu if we have a field
        return this._targetField != null;
    }

    // get the items used to populate the menu
    _getMenuItems(): any[] {

        // get items
        let items: any = [
            { text: '<div class="menu-icon menu-icon-remove">&#10006;</div>Remove Field', parm: 'remove' },
            { text: '<div class="menu-icon">&#9965;</div>Field Settings...', parm: 'edit' },
            { text: '<div class="wj-separator"></div>' },
            { text: '<div class="menu-icon">&#8981;</div>Show Detail...', parm: 'detail' }
        ];

        // localize items
        for (let i = 0; i < items.length; i++) {
            let item = items[i];
            if (item.parm) {
                let text = wijmo.culture.olap._ListContextMenu[item.parm];
                wijmo.assert(text, 'missing localized text for item ' + item.parm);
                item.text = item.text.replace(/([^>]+$)/, text);
            }
        }

        // return localized items
        return items;
    }

    // execute the menu commands
    _execute(parm: string) {
        let fld = this._targetField,
            g = wijmo.Control.getControl(this.owner) as PivotGrid,
            ng = g ? g.engine : null,
            ht = this._htDown;
        switch (parm) {
            case 'remove':
                ng.removeField(fld);
                break;
            case 'edit':
                ng.editField(fld);
                break;
            case 'detail':
                g.showDetail(ht.row, ht.col);
                break;
        }
    }
    _canExecute(parm: string): boolean {
        let fld = this._targetField,
            g = wijmo.Control.getControl(this.owner) as PivotGrid,
            ng = g ? g.engine : null,
            ht = this._htDown;

        // all commands need a field and and engine (TFS 466719)
        if (fld == null || ng == null) {
            return false;
        }

        // check whether the command can be executed in the current context
        switch (parm) {
            case 'remove':
                return true;
            case 'edit':
                return ng.allowFieldEditing;
            case 'detail':
                return ht != null && !(fld instanceof CubePivotField) && ng.valueFields.length > 0;
        }

        // all else is OK
        return true;
    }
}
    }
    


    module wijmo.olap {
    




'use strict';

/**
 * Represents a collection of {@link PivotField} objects.
 */
export class PivotFieldCollection extends wijmo.collections.ObservableArray<PivotField> {
    private _ng: PivotEngine;
    private _maxItems: number;

    /**
     * Initializes a new instance of the {@link PivotFieldCollection} class.
     *
     * @param engine {@link PivotEngine} that owns this {@link PivotFieldCollection}.
     */
    constructor(engine: PivotEngine) {
        super();
        this._ng = engine;
    }

    //** object model

    /**
     * Gets or sets the maximum number of fields allowed in this collection.
     *
     * This property is set to null by default, which means any number of items is allowed.
     */
    get maxItems(): number {
        return this._maxItems;
    }
    set maxItems(value: number) {
        this._maxItems = wijmo.asInt(value, true, true);
    }
    /**
     * Gets a reference to the {@link PivotEngine} that owns this {@link PivotFieldCollection}.
     */
    get engine(): PivotEngine {
        return this._ng;
    }
    /**
     * Gets a field by key.
     *
     * @param key {@link PivotField.key} to look for.
     */
    getField(key: string): PivotField {
        return this._getField(this, key);
    }
    _getField(fields: any, key: string): PivotField {
        for (let i = 0; i < fields.length; i++) {

            // looking in main fields
            let field = fields[i];
            if (field.key == key) {
                return field;
            }

            // and in subfields if present
            if (field._hasSubFields()) {
                field = this._getField(field.subFields, key);
                if (field) {
                    return field;
                }
            }
        }

        // not found
        return null;
    }
    /**
     * Overridden to allow pushing fields by header.
     *
     * @param ...item One or more {@link PivotField} objects to add to the array.
     * @return The new length of the array.
     */
    push(...item: any[]): number {
        let ng = this._ng;

        // loop through items adding them one by one
        for (let i = 0; item && i < item.length; i++) {
            let fld = item[i];

            // add fields by binding
            if (wijmo.isString(fld)) {
                fld = this == ng.fields
                    ? new PivotField(ng, fld)
                    : ng.fields.getField(fld);
            }

            // should be a field now...
            wijmo.assert(fld instanceof PivotField, 'This collection must contain PivotField objects only.');

            // field keys must be unique
            // REVIEW: cube fields with children have no key...
            if (fld.key && this.getField(fld.key)) {
                wijmo.assert(false, 'PivotField keys must be unique.');
                return -1;
            }

            // honor maxItems
            if (this._maxItems != null && this.length >= this._maxItems) {
                break;
            }

            // add to collection
            super.push(fld);
        }

        // done
        return this.length;
    }
}

    }
    


    module wijmo.olap {
    


'use strict';

/**
 * Represents a tree of {@link _PivotField} objects.
 *
 * This class is used only for optimization. It reduces the number of
 * {@link _PivotKey} objects that have to be created while aggregating the
 * data.
 *
 * The optimization cuts the time required to summarize the data
 * to about half.
 */
export class _PivotNode {
    _key: _PivotKey;
    _nodes: any;
    _tree: _PivotNode;
    _parent: _PivotNode;

    /**
     * Initializes a new instance of the {@link PivotNode} class.
     *
     * @param fields {@link PivotFieldCollection} that owns this node.
     * @param fieldCount Number of fields to take into account for this node.
     * @param valueFields {@link PivotFieldCollection} that contains the values for this node.
     * @param valueFieldIndex Index of the value to take into account for this node.
     * @param item First data item represented by this node.
     * @param parent Parent {@link _PivotField}.
     */
    constructor(fields: PivotFieldCollection, fieldCount: number, valueFields: PivotFieldCollection, valueFieldIndex: number, item: any, parent?: _PivotNode) {
        this._key = new _PivotKey(fields, fieldCount, valueFields, valueFieldIndex, item);
        this._nodes = {};
        this._parent = parent;
    }
    /**
     * Gets a child node from a parent node.
     *
     * @param fields {@link PivotFieldCollection} that owns this node.
     * @param fieldCount Number of fields to take into account for this node.
     * @param valueFields {@link PivotFieldCollection} that contains the values for this node.
     * @param valueFieldIndex Index of the value to take into account for this node.
     * @param item First data item represented by this node.
     */
    getNode(fields: PivotFieldCollection, fieldCount: number, valueFields: PivotFieldCollection, valueFieldIndex: number, item: any): _PivotNode {
        let nd = this;
        for (let i = 0; i < fieldCount; i++) {
            let key = fields[i]._getValue(item, true),
                child = nd._nodes[key];
            if (!child) {
                child = new _PivotNode(fields, i + 1, valueFields, valueFieldIndex, item, nd);
                nd._nodes[key] = child;
            }
            nd = child;
        }
        if (valueFields && valueFieldIndex > -1) {
            let key = valueFields[valueFieldIndex].header,
                child = nd._nodes[key];
            if (!child) {
                child = new _PivotNode(fields, fieldCount, valueFields, valueFieldIndex, item, nd);
                nd._nodes[key] = child;
            }
            nd = child;
        }
        return nd;
    }
    /**
     * Gets the {@link _PivotKey} represented by this {@link _PivotNode}.
     */
    get key(): _PivotKey {
        return this._key;
    }
    /**
     * Gets the parent node of this node.
     */
    get parent(): _PivotNode {
        return this._parent;
    }
    /**
     * Gets the child items of this node.
     */
    get tree(): _PivotNode {
        if (!this._tree) {
            this._tree = new _PivotNode(null, 0, null, -1, null);
        }
        return this._tree;
    }
}
    }
    


    module wijmo.olap {
    







'use strict';

/**
 * Represents a connection to a Pivot service.
 */
export class _ServerConnection {
    protected _ng: PivotEngine;         // engine that owns this connection
    protected _token: string;           // server token for the current analysis
    private _start: number;             // start time for the current analysis
    private _progress: number;          // current progress
    private _request: XMLHttpRequest;   // current http request
    private _toGetStatus: any;          // timeout object for getting the analysis status

    static _TIMEOUT = 1000 * 60;        // quit after 60 seconds (server hung?)
    static _POLL_INTERVAL = 500;        // poll state every 500ms
    static _MAXDETAIL = 1000;           // show up to 1k detail records

    /**
     * Initializes a new instance of the {@link _ServerConnection} class.
     *
     * @param engine {@link PivotEngine} that owns this field.
     * @param url Url used to communicate with the server.
     */
    constructor(engine: PivotEngine, url: string) {
        this._ng = wijmo.asType(engine, PivotEngine);
        wijmo.assert(this._isValidUrl(url), 'Invalid service Url: ' + url + ')')
    }

    /**
     * Gets a list of fields available on the server.
     */
    getFields(): PivotField[] {
        let result = null;
        wijmo.httpRequest(this._getUrl('Fields'), {
            async: false,
            success: (xhr: XMLHttpRequest) => {
                result = JSON.parse(xhr.responseText);
                if (!wijmo.isArray(result)) {
                    console.error('Failed to get fields from server: ' + xhr.responseText);
                }
            },
            error: (xhr: XMLHttpRequest) => {
                this._handleError('Getting Fields', xhr);
            }
        });
        return result;
    }
    /**
     * Gets an array with unique values for a given field.
     * 
     * @param field The field for which to retrieve unique values.
     */
    getUniqueValues(field: PivotField): any[] {
        let result = null; // get unique values for a given field
        wijmo.httpRequest(this._getUrl('UniqueValues', null, field.header), {
            method: 'POST',
            async: false,
            data: {
                view: this._ng.viewDefinition
            },
            success: (xhr: XMLHttpRequest) => {
                result = JSON.parse(xhr.responseText);
                if (!wijmo.isArray(result)) {
                    console.error('Failed to get unique field values from server: ' + xhr.responseText);
                }
            },
            error: (xhr: XMLHttpRequest) => {
                this._handleError('Getting Unique Field Values', xhr);
            }
        });
        return result;
    }
    /**
     * Gets the output view for the current view definition.
     *
     * @param callBack function invoked to handle the results.
     */
    getOutputView(callBack: Function) {
        this.clearPendingRequests();
        this._sendHttpRequest('Analyses', {
            method: 'POST',
            data: {
                view: this._ng.viewDefinition
            },
            success: (xhr: XMLHttpRequest) => {
                let result = JSON.parse(xhr.responseText) as _IAnalysis;
                this._token = result.token;
                this._start = Date.now();
                this._handleResult(result.status, callBack);
            },
            error: (xhr: XMLHttpRequest) => {
                this._handleError('Analyses', xhr);
            }
        });
    }
    /**
     * Gets an array containing the data items that were used to calculate
     * an aggregated cell.
     *
     * @param rowKey Identifies the row that contains the aggregated cell.
     * @param colKey Identifies the column that contains the aggregated cell.
     */
    getDetail(rowKey, colKey): any[] {
        let arr: any,
            keys = [],
            count = this._ng.rowFields.length,
            valueCount = rowKey ? rowKey.values.length : 0;

        // prepare the keys for rowFields.
        for (let i = 0; i < count; i++) {
            if (i < valueCount) {
                keys.push(_ServerConnection._getRequestedValue(rowKey.values[i]));
            } else {
                keys.push(null);
            }
        }

        // prepare the keys for columnFields.
        count = this._ng.columnFields.length;
        valueCount = colKey ? colKey.values.length : 0;
        for (let i = 0; i < count; i++) {
            if (i < valueCount) {
                keys.push(_ServerConnection._getRequestedValue(colKey.values[i]));
            } else {
                keys.push(null);
            }
        }

        // get details from server
        arr = new wijmo.collections.ObservableArray();
        this._loadArray('Detail', arr, {
            method: 'POST',
            view: this._ng.viewDefinition,
            keys: keys,
            max: this._ng.serverMaxDetail
        });

        // return ObservableArray (will be filled when the request returns)
        return arr;
    }
    /**
     * Returns a sorted array of PivotKey ids (if sortOnServer is true, the assumption is
     * that subtotal keys are returned by the server as if totalsBeforeData is also true).
     */
     getSortedKeys(obj: any, isRow?: boolean): string[] {
        let keys = Object.keys(obj);
        if (!this._ng.sortOnServer) {
            keys.sort((id1, id2) => {
                return this._ng._keys[id1].compareTo(this._ng._keys[id2]);
            });
        } else if (keys.length > 1) {
            let hierarchy = {}, result = [], sorted = [];
            keys.forEach(key => {
                this._insertKey(hierarchy, key, isRow);
            });
            this._reorderKeys(hierarchy, null, null, result, isRow);
            if (!isRow && this._ng.valueFields.length > 1) {
                let skip = result.length / this._ng.valueFields.length;
                let count = result.length / skip;
                for (let i = 0; i < skip; i++) {
                    for (let j = 0; j < count; j++) {
                        sorted.push(result[i + (j * skip)]);
                    }
                }
                return sorted;
            }
            return result;
        }
        return keys;
    }    
    // convert the value to a requested one.
    private static _getRequestedValue(value: any) {
        // as the client always has the time zone format for a date value 
        // and the server doesn't consider the time zone,
        // we need to remove the time zone information before sending it to the server.
        if (wijmo.isDate(value)) {
            let date = value as Date;
            return new Date(Date.UTC(date.getFullYear(), date.getMonth(),
                date.getDate(), date.getHours(), date.getMinutes(),
                date.getSeconds(), date.getMilliseconds()));
        }
        return value;
    }
    /**
     * Cancels any pending requests.
     */
    clearPendingRequests() {
        this._clearRequest();
        this._clearTimeout();
        this._clearToken(); // must be last to avoid aborting the clear command
    }
    /**
     * Creates fake tallies based on aggregated data returned from the server
     *
     * @param aggregatedData Array containing the data aggregates returned
     * by the server.
     */
    updateTallies(aggregatedData: any[]) {
        let ng = this._ng,
            rfCount = ng.rowFields.length,
            cfCount = ng.columnFields.length,
            vfCount = ng.valueFields.length,
            rowNodes = new _PivotNode(ng.rowFields, 0, null, -1, null);

        aggregatedData.forEach((item, index, arr) => {
            let count = this._getAggregatedFieldCount(item, ng.rowFields),
                nd = rowNodes.getNode(ng.rowFields, rfCount - count, null, -1, item),
                rowKey = nd.key,
                rowKeyId = rowKey.toString(null),
                rowTallies = ng._tallies[rowKeyId];
            if (!rowTallies) {
                ng._keys[rowKeyId] = rowKey;
                ng._tallies[rowKeyId] = rowTallies = {};
            }
            count = this._getAggregatedFieldCount(item, ng.columnFields);
            for (let k = 0; k < vfCount; k++) {
                let colNodes = nd.tree.getNode(ng.columnFields, cfCount - count, ng.valueFields, k, item),
                    colKey = colNodes.key,
                    colKeyId = colKey.toString(),
                    vf = ng.valueFields[k];

                // because the response data is already aggregated,
                // the tally must be unique, and the cell values
                // must be retrieved from the header rather than 
                // from the binding.
                let tally = rowTallies[colKeyId] as _ServerTally;
                if (!tally) {
                    ng._keys[colKeyId] = colKey;
                    tally = rowTallies[colKeyId] = new _ServerTally();
                    tally.add(this._getFieldValue(vf, item, false));
                }
            }
        });
    }

    // get value based on header rather than value
    private _getFieldValue(vf: PivotField, item: any, formatted?: boolean): any {
        let value = item[vf.key];
        return !formatted || typeof (value) == 'string' // optimization
            ? value
            : wijmo.Globalize.format(value, vf.format);
    }

    // ** implementation
    
    // gets the length of a PivotKey
    _getKeyLength(key: string, isRow: boolean) {
        return key.split(";").length - (isRow ? 1 : 2);
    }
    
    // insert PivotKey into the object hierarchy
    private _insertKey(root: any, key: string, isRow: boolean) {
        let parts = key.split(";");
        if (!isRow) {
            parts.pop();
        }
        if (parts.length == 1) {
            root[parts.pop()] = {};
        } else {
            let last = parts.pop();
            let level = root[last];
            if (!level) {
                root[last] = level = {};
            }
            while (parts.length > 0) {
                let first = parts.shift();
                if (!level[first]) {
                    level[first] = {};
                }
                level = level[first];
            }
        }
    }

    // construct composite key name
    private _joinKeys(key: string, prefix: string, suffix: string) : string {
        if (prefix && suffix) {
            return [prefix, key, suffix].join(";");
        } else if (suffix) {
            return [key, suffix].join(";");
        } else {
            return key;
        }
    }

    // reorder PivotKeys based on value of totalsBeforeData
    private _reorderKeys(root: any, prefix: string, suffix: string, keys: string[], isRow: boolean) {
        Object.keys(root).forEach(key => {
            let total = this._joinKeys(key, prefix, suffix);
            let subs = isRow ? this._ng.showRowTotals : this._ng.showColumnTotals;
            let length = Object.keys(root[key]).length;
            let include = (!prefix && !suffix && subs !== ShowTotals.None) || (!prefix && !length) || prefix || subs === ShowTotals.Subtotals;
            if (!isRow) {
                total = total + ";";
            }
            if (this._ng.totalsBeforeData && include) {
                keys.push(total);
            }
            if (!suffix) {
                this._reorderKeys(root[key], null, key, keys, isRow);
            } else if (!prefix) {
                this._reorderKeys(root[key], key, suffix, keys, isRow);
            } else {
                this._reorderKeys(root[key], [prefix, key].join(";"), suffix, keys, isRow);
            }
            if (!this._ng.totalsBeforeData && include) {
                keys.push(total);
            }
        });
    }

    // gets the parent of a PivotKey
    private _getParentKey(key: string, isRow: boolean) {
        let parts = key.split(";");
        if (isRow) {
            parts.splice(parts.length - 2, 1);
        } else {
            parts.splice(0, parts.length - 2);
        }
        return parts.join(";");
    }

    // count null properties in an item (to determine subtotal level)
    private _getAggregatedFieldCount(item: any, fields: PivotFieldCollection): number {
        let fieldCount = fields.length,
            count = 0;
        for (let i = 0; i < fieldCount; i++) {
            let field = fields[i] as PivotField;
            if (this._getFieldValue(field, item, false) == null) {
                count++;
            }
        }
        return count;
    }

    // load an array in chunks
    _loadArray(command: string, arr: any, data?: any) {

        // load the first 100 items by default
        if (!data) {
            data = {};
        }
        if (data.skip == null) {
            data.skip = 0;
        }
        if (data.top == null) {
            data.top = 100;
        }
        let max = wijmo.isNumber(data.max) ? data.max : 1000000;

        // make the request
        this._request = wijmo.httpRequest(this._getUrl(command), {
            data: data,
            method: data.method || 'GET',
            success: (xhr: XMLHttpRequest) => {
                let result = JSON.parse(xhr.responseText);

                // add results to the array
                arr.deferUpdate(() => {
                    result.value.forEach(item => {
                        arr.push(item);
                    });
                });

                // continue loading
                if (result.value.length == data.top && arr.length < max) {
                    data.skip += data.top;
                    this._loadArray(command, arr, data);
                }
            },
            error: (xhr: XMLHttpRequest) => {
                this._handleError(command, xhr);
            }
        });
    }

    // gets a URL with a FlexPivotEngine command request
    private _getUrl(command: string, token = this._token, fieldName?: string): string {
        let url = this._ng.itemsSource.toString(),
            pos = url.lastIndexOf('/'),
            urlStart = url.substr(0, pos);
        command = command.toLowerCase();
        switch (command) {
            case 'rawdata':
            case 'detail':
                return url;
            case 'fields':
            case 'analyses':
                return url + '/' + command;
            case 'clear':
                return url + '/analyses/' + token + '/';
            case 'result':
            case 'status':
                return url + '/analyses/' + token + '/' + command;
            case 'uniquevalues':
                return url + '/fields/' + fieldName + '/' + command;
        }
        wijmo.assert(false, 'Unrecognized command');
    }

    // tests whether a string looks like a valid itemsSource url
    private _isValidUrl(url: string): boolean {
        let a = document.createElement('a');
        a.href = wijmo.asString(url);
        a.href = a.href; // resolve protocol if using partial URLs in IE11
        return a.protocol && a.hostname && a.pathname && // need these
            url[url.length - 1] != '/'; // should end with table name
    }

    // handle result of analysis status
    private _handleResult(result: _IStatus, callBack) {
        switch (result.executingStatus.toLowerCase()) {

            // executing? wait and try again
            case 'executing':
            case 'notset':

                // enforce timeout
                if (Date.now() - this._start > this._ng.serverTimeout) {
                    this._handleError('Analyses', {
                        status: 500,
                        statusText: 'Analysis timed out',
                    } as XMLHttpRequest);
                    return;
                }

                // progress report
                this._progress = result.progress;
                this._ng.onUpdatingView(new ProgressEventArgs(this._progress));

                // repeat...
                this._clearTimeout();
                this._toGetStatus = setTimeout(() => {
                    this._waitUntilComplete(callBack);
                }, this._ng.serverPollInterval);
                break;

            // completed? get the data
            case 'completed':
                this._progress = 100;
                this._ng.onUpdatingView(new ProgressEventArgs(this._progress));
                this._getResults(callBack);
                break;

            // exception? get the exception from Result command
            case 'exception':
                this._getResults(callBack);
                break;

            // anything else is an error...
            default:
                this._handleError('Analyses', {
                    status: 500,
                    statusText: 'Unexpected result...',
                } as XMLHttpRequest);
                break;
        }
    }

    // keep calling the server until the current task is complete,
    // then invoke the given callBack
    private _waitUntilComplete(callBack) {
        this._sendHttpRequest('Status', {
            success: (xhr: XMLHttpRequest) => {
                let result = JSON.parse(xhr.responseText) as _IStatus;
                this._handleResult(result, callBack);
            },
            error: (xhr: XMLHttpRequest) => {
                this._handleError('Status', xhr);
            }
        });
    }

    // get results when server is ready
    private _getResults(callBack) {
        this._sendHttpRequest('Result', {
            success: (xhr: XMLHttpRequest) => {

                // once the aggregated result is returned,
                // the analysis is removed as it is useless.
                this._clearToken();

                let result = JSON.parse(xhr.responseText);
                wijmo.assert(wijmo.isArray(result), 'Result array Expected.')

                // parse date/time strings returned from the service
                let dateFields = [];
                this._ng._viewLists.forEach(item => {
                    dateFields = dateFields.concat(item.filter(field => {
                        return field.dataType == wijmo.DataType.Date;
                    }));
                });
                if (dateFields.length > 0) {
                    result.forEach(dataItem => {
                        dateFields.forEach(dateField => {
                            let bnd = dateField._binding,
                                value = bnd.getValue(dataItem);
                            if (wijmo.isString(value)) {
                                bnd.setValue(dataItem, new Date(value));
                            }
                        });
                    });
                }

                // go handle the results
                wijmo.asFunction(callBack)(result);
            },
            error: (xhr: XMLHttpRequest) => {
                this._handleError('Result', xhr);
            }
        });
    }

    // raise error event and throw if not handled
    protected _handleError(msg: string, xhr: XMLHttpRequest) {
        this.clearPendingRequests();
        msg = '** HttpRequest error on command "' + msg + '"';
        if (this._ng.onError(new wijmo.RequestErrorEventArgs(xhr, msg))) {
            this._throwResponseError(msg, xhr);
        }
    }

    // make httpRequest and save the request object so we can cancel it
    protected _sendHttpRequest(command: string, settings?: any) {
        let url = this._getUrl(command);
        this._request = wijmo.httpRequest(url, settings);
    }

    // throw the error information if it is not processed.
    private _throwResponseError(msg: string, xhr: XMLHttpRequest) {
        msg = msg + '\r\n' +
            xhr.status + '\r\n';

        let errText = xhr.responseText || '';
        if (xhr.status == 500) {

            // show the meaningful exception message
            if (xhr.responseText) {
                let oRes = JSON.parse(xhr.responseText);
                errText = oRes['ExceptionMessage'];
            }
        }

        // if no responseText, use statusText instead.
        msg += errText || xhr.statusText;
        throw msg;
    }

    // clear the analysis token
    private _clearToken() {
        if (this._token) {
            this._clearRequest();
            this._clearTimeout();
            this._sendHttpRequest('Clear', {
                method: 'DELETE'
            });
            this._token = null;
        }
    }

    // abort and clear the http request
    private _clearRequest() {
        if (this._request && this._request.readyState != 4) {
            this._request.abort();
            this._request = null;
        }
    }

    // clear the timer object
    private _clearTimeout() {
        if (this._toGetStatus) {
            clearTimeout(this._toGetStatus);
            this._toGetStatus = null;
        }
    }
}

// fake tally to report server aggregates
class _ServerTally extends _Tally {
    private _aggregatedValue: any;

    add(value: any, weight?: number) {
        wijmo.assert(this._cnt == 0, 'Server tallies have a single value.');
        this._aggregatedValue = value;
    }
    getAggregate(aggregate: wijmo.Aggregate) {
        return this._aggregatedValue; // server tallies have a single value
    }
}

// interface for 'Analyses' command response objects
interface _IAnalysis {
    token: string;
    status: _IStatus;
    result?: any[];
}

// interface for 'Status' commands response objects
interface _IStatus {
    executingStatus?: string;
    progress?: number;
}
    }
    


    module wijmo.olap {
    














'use strict';

// globalization
wijmo._addCultureInfo('olap', {
    PivotEngine: {
        grandTotal: 'Grand Total',
        subTotal: 'Subtotal'
    },
    PivotPanel: {
        fields: 'Choose fields to add to report:',
        drag: 'Drag fields between areas below:',
        filters: 'Filters',
        cols: 'Columns',
        rows: 'Rows',
        vals: 'Values',
        defer: 'Defer Updates',
        update: 'Update'
    },
    PivotFieldEditor: {
        dialogHeader: 'Field settings:',
        header: 'Header:',
        summary: 'Summary:',
        showAs: 'Show As:',
        weighBy: 'Weigh by:',
        sort: 'Sort:',
        filter: 'Filter:',
        format: 'Format:',
        sample: 'Sample:',
        edit: 'Edit...',
        clear: 'Clear',
        ok: 'OK',
        cancel: 'Cancel',
        none: '(none)',
        sorts: {
            asc: 'Ascending',
            desc: 'Descending'
        },
        aggs: {
            sum: 'Sum',
            cnt: 'Count',
            avg: 'Average',
            max: 'Max',
            min: 'Min',
            rng: 'Range',
            std: 'StdDev',
            var: 'Var',
            stdp: 'StdDevPop',
            varp: 'VarPop',
            first: 'First',
            last: 'Last'
        },
        calcs: {
            noCalc: 'No calculation',
            dRow: 'Difference from previous row',
            dRowPct: '% Difference from previous row',
            dCol: 'Difference from previous column',
            dColPct: '% Difference from previous column',
            dPctGrand: '% of grand total',
            dPctRow: '% of row total',
            dPrevRow: '% of value in the previous row',
            dPctCol: '% of column total',
            dPrevCol: '% of value in the previous column',
            dRunTot: 'Running total',
            dRunTotPct: '% running total'
        },
        formats: {
            n0: 'Integer (n0)',
            n2: 'Float (n2)',
            c: 'Currency (c)',
            p0: 'Percentage (p0)',
            p2: 'Percentage (p2)',
            n2c: 'Thousands (n2,)',
            n2cc: 'Millions (n2,,)',
            n2ccc: 'Billions (n2,,,)',
            d: 'Date (d)',
            MMMMddyyyy: 'Month Day Year (MMMM dd, yyyy)',
            dMyy: 'Day Month Year (d/M/yy)',
            ddMyy: 'Day Month Year (dd/M/yy)',
            dMyyyy: 'Day Month Year (dd/M/yyyy)', // key != fmt
            MMMyyyy: 'Month Year (MMM yyyy)',
            MMMMyyyy: 'Month Year (MMMM yyyy)',
            yyyy: 'Year (yyyy)',
            yyyyQq: 'Year Quarter (yyyy "Q"q)',
            FYEEEEQU: 'Fiscal Year Quarter ("FY"EEEE "Q"U)'
        }
    },
    _ListContextMenu: {
        up: 'Move Up',
        down: 'Move Down',
        first: 'Move to Beginning',
        last: 'Move to End',
        filter: 'Move to Report Filter',
        rows: 'Move to Row Labels',
        cols: 'Move to Column Labels',
        vals: 'Move to Values',
        remove: 'Remove Field',
        edit: 'Field Settings...',
        detail: 'Show Detail...'
    },
    DetailDialog: {
        header: 'Detail View:',
        ok: 'OK',
        items: '{cnt:n0} items',
        item: '{cnt} item',
        row: 'Row',
        col: 'Column'
    },
    PivotChart: {
        by: 'by',
        and: 'and'
    },
    Slicer: {
        multiSelect: 'Multi-Select',
        clearFilter: 'Clear Filter'
    }
});

/**
 * Specifies constants that define whether to include totals in the output table.
 */
export enum ShowTotals {
    /**
     * Do not show any totals.
     */
    None,
    /**
     * Show grand totals.
     */
    GrandTotals,
    /**
     * Show subtotals and grand totals.
     */
    Subtotals
}
/**
 * Specifies constants that define calculations to be applied to cells in the output view.
 */
export enum ShowAs {
    /**
     * Show plain aggregated values.
     */
    NoCalculation,
    /**
     * Show differences between each item and the item in the previous row.
     */
    DiffRow,
    /**
     * Show differences between each item and the item in the previous row as a percentage.
     */
    DiffRowPct,
    /**
     * Show differences between each item and the item in the previous column.
     */
    DiffCol,
    /**
     * Show differences between each item and the item in the previous column as a percentage.
     */
    DiffColPct,
    /**
     * Show values as a percentage of the grand totals for the field.
     */
    PctGrand,
    /**
     * Show values as a percentage of the row totals for the field.
     */
    PctRow,
    /**
     * Show values as a percentage of the column totals for the field.
     */
    PctCol,
    /**
     * Show values as running totals.
     */
    RunTot,
    /**
     * Show values as percentage running totals.
     */
    RunTotPct,
    /**
     * Show values for each item as a percentage of the value in the previous row.
     */
    PctPrevRow,
    /**
     * Show values for each item as a percentage of the value in the previous column.
     */
    PctPrevCol
}

/**
 * Provides a user interface for interactively transforming regular data tables into Olap
 * pivot tables.
 *
 * Tabulates data in the {@link itemsSource} collection according to lists of fields and 
 * creates the {@link pivotView} collection containing the aggregated data.
 *
 * Pivot tables group data into one or more dimensions. The dimensions are represented
 * by rows and columns on a grid, and the data is stored in the grid cells.
 */
export class PivotEngine {

    // property storage
    private _items: any; // any[] or ICollectionView
    private _cv: wijmo.collections.ICollectionView;
    private _autoGenFields = true;
    private _allowFieldEditing = true;
    private _showRowTotals = ShowTotals.GrandTotals;
    private _showColTotals = ShowTotals.GrandTotals;
    private _totalsBefore = false;
    private _sortableGroups = true;
    private _showZeros = false;
    private _updating = 0;
    private _toInv;
    private _colBindings: string[];
    private _pivotView: wijmo.collections.ICollectionView;
    private _defaultFilterType: wijmo.grid.filter.FilterType;
    private _xValueSearch = true;
    private _async = true;
    private _batchStart: number;
    private _toUpdateTallies: any;
    private _activeFilterFields: PivotField[];
    private _sortOnServer = false;
    private _viewDefinitionChanged: boolean;
    private _cntTotal = 0;
    private _cntFiltered = 0;
    /*private*/ _tallies: any;
    /*private*/ _keys: any;

    // pivot field collections
    private _fields: PivotFieldCollection;
    private _rowFields: PivotFieldCollection;
    private _columnFields: PivotFieldCollection;
    private _valueFields: PivotFieldCollection;
    private _filterFields: PivotFieldCollection;
    /*private*/ _viewLists: PivotFieldCollection[];

    // server stuff
    private _server: _ServerConnection;
    private _serverParms = {
        timeout: _ServerConnection._TIMEOUT,
        pollInterval: _ServerConnection._POLL_INTERVAL,
        maxDetail: _ServerConnection._MAXDETAIL,
    };

    // batch size/delay for async processing
    static _BATCH_SIZE = 10000;
    static _BATCH_TIMEOUT = 0;
    static _BATCH_DELAY = 100;

    // serializable properties
    static _props = [
        'showZeros',
        'showRowTotals',
        'showColumnTotals',
        'totalsBeforeData',
        'sortableGroups',
        'defaultFilterType'
    ];

    /**
     * Initializes a new instance of the {@link PivotEngine} class.
     *
     * @param options JavaScript object containing initialization data for the field.
     */
    constructor(options?: any) {

        // create output view
        this._pivotView = new PivotCollectionView(this);

        // create main field list
        this._fields = new PivotFieldCollection(this);

        // create pivot field lists
        this._rowFields = new PivotFieldCollection(this);
        this._columnFields = new PivotFieldCollection(this);
        this._valueFields = new PivotFieldCollection(this);
        this._filterFields = new PivotFieldCollection(this);

        // create array of pivot field lists
        this._viewLists = [
            this._rowFields, this._columnFields, this._valueFields, this._filterFields
        ];

        // listen to changes in the field lists
        let handler = this._fieldListChanged.bind(this);
        this._fields.collectionChanged.addHandler(handler);
        this._viewLists.forEach((list: PivotFieldCollection) => {
            list.collectionChanged.addHandler(handler);
        });

        // let the component choose the filter type automatically
        this._defaultFilterType = null;

        // apply initialization options
        wijmo.copy(this, options);
    }

    // ** object model

    /**
     * Gets or sets the array or {@link ICollectionView} that contains the
     * raw data to be analyzed, an object describing an SSAS cube service, 
     * or a string containing the URL for a ComponentOne DataEngine 
     * service.
     *
     * The first option (using an array or {@link ICollectionView}) is the 
     * simplest, but it limits the amount of raw data you can handle.
     * Loading the raw data into an array can take a long time if the 
     * data set contains more than about 50,000 items or so.
     * 
     * To use this option, simply set the {@link itemsSource} property to
     * any JavaScript array containing the raw data to be analyzed.
     * For example:
     * 
     * ```typescript
     * import { PivotEngine } from '@grapecity/wijmo.olap';
     * let ng = PivotEngine({
     *     itemsSource = getDataArray(1000);
     * });
     * ```
     *
     * The second option (direct connection to OLAP SSAS cubes) allows 
     * the {@link PivotEngine} to connect directly to OLAP cubes provided 
     * by SSAS servers. This option removes the size limitations mentioned
     * above and allows you to analyze data sets with millions or billions
     * of records.
     * 
     * To use this option, set the {@link itemsSource} property to an object 
     * that specifies how the component should access the service. For example:
     * 
     * ```typescript
     * import { PivotEngine } from '@grapecity/wijmo.olap';
     * let ng = PivotEngine({
     *     itemsSource: {
     *         url: 'http://ssrs.componentone.com/OLAP/msmdpump.dll',
     *         cube: 'Adventure Works',
     *         catalog: 'AdventureWorksDW2012Multidimensional'
     *     }
     * });
     * ```
     * 
     * The **catalog** property is optional, but **url** and **cube** are required.
     * 
     * The preceding example works with SSAS servers that allow anonymous
     * access. For servers that require Basic Authentication, you should
     * also include the appropriate **user** and **password** members
     * as part of the {@link itemsSource} object.
     * 
     * When connecting directly to OLAP SSAS cubes, users will not be able
     * to filter fields by value. They will still be able to filter by
     * condition.
     * 
     * The third option, ComponentOne data engine services, allows you to
     * analyze large datasets on a server without downloading the raw data
     * to the client. You can use our high-performance FlexPivot services
     * or interface with Microsoft's SQL Server Analysis Services
     * OLAP Cubes.
     *
     * To use ComponentOne data engine services, set the {@link itemsSource} 
     * property to a string containing the URL of the data service. 
     * For example:
     * 
     * ```typescript
     * import { PivotEngine } from '@grapecity/wijmo.olap';
     * let ng = new wijmo.olap.PivotEngine({
     *     itemsSource: 'http://demos.componentone.com/ASPNET/c1webapi/4.5.20193.222/api/dataengine/cube'
     * });
     * ```
     * 
     * The {@link PivotEngine} sends view definitions to the server,
     * where summaries are calculated and returned to the client.
     * 
     * When connecting ComponentOne DataEngine data sources, users 
     * will not be able to filter fields by value. They will still 
     * be able to filter by condition.
     *
     * For more information about the ComponentOne DataEngine
     * services please refer to the
     * <a href="http://helpcentral.componentone.com/nethelp/C1WebAPI/APIDataEngine.html" target="_blank">online documentation</a>.
     * 
     * Our <a href="https://demos.wijmo.com/5/SampleExplorer/SampleExplorer/Sample/OlapServerIntro" target="_blank">OlapServerIntro</a>
     * sample shows all options working with a single {@link PivotEngine}.
     */
    get itemsSource(): any {
        return this._items;
    }
    set itemsSource(value: any) {
        if (this._items != value) {

            // unbind current collection view
            if (this._cv) {
                this._cv.collectionChanged.removeHandler(this._cvCollectionChanged, this);
                this._cv = null;
            }

            // dispose of server
            if (this._server) {
                this._server.clearPendingRequests();
                this._server = null;
            }

            // save new data source and collection view (or server url)
            this._items = value;
            if (wijmo.isString(value)) {
                this._server = new _ServerConnection(this, value);
            } else if (wijmo.isObject(value) && !wijmo.tryCast(value, 'ICollectionView')) {
                this._server = new _SqlServerConnection(this, value);
            } else {
                this._cv = wijmo.asCollectionView(value);
            }

            // bind new collection view
            if (this._cv != null) {
                this._cv.collectionChanged.addHandler(this._cvCollectionChanged, this);
            }

            // auto-generate fields and refresh
            this.deferUpdate(() => {
                if (this.autoGenerateFields) {
                    this._generateFields();
                }
                this._updateFieldTypes();
            });

            // raise itemsSourceChanged
            this.onItemsSourceChanged();
        }
    }
    /**
     * Gets a value that determines whether the engine is bound to a server
     * {@link itemsSource} or is using local data.
     */
    get isServer(): boolean {
        return this._server != null;
    }
    /**
     * Gets the {@link ICollectionView} that contains the raw data.
     */
    get collectionView(): wijmo.collections.ICollectionView {
        return this._cv;
    }
    /**
     * Gets the {@link ICollectionView} containing the output pivot view.
     */
    get pivotView(): wijmo.collections.ICollectionView {
        return this._pivotView;
    }
    /**
     * Gets or sets a value that determines whether the output {@link pivotView}
     * should include rows containing subtotals or grand totals.
     * 
     * The default value for this property is **ShowTotals.GrandTotals**.
     */
    get showRowTotals(): ShowTotals {
        return this._showRowTotals;
    }
    set showRowTotals(value: ShowTotals) {
        value = wijmo.asEnum(value, ShowTotals);
        if (value != this.showRowTotals) {
            this._showRowTotals = value;
            this.onViewDefinitionChanged();
            this.invalidate();
        }
    }
    /**
     * Gets or sets a value that determines whether the output {@link pivotView}
     * should include columns containing subtotals or grand totals.
     * 
     * The default value for this property is **ShowTotals.GrandTotals**.
     */
    get showColumnTotals(): ShowTotals {
        return this._showColTotals;
    }
    set showColumnTotals(value: ShowTotals) {
        value = wijmo.asEnum(value, ShowTotals);
        if (value != this.showColumnTotals) {
            this._showColTotals = value;
            this.onViewDefinitionChanged();
            this.invalidate();
        }
    }
    /**
     * Gets or sets a value that determines whether row and column totals
     * should be displayed before or after regular data rows and columns.
     *
     * If this value is set to true, total rows appear above data rows
     * and total columns appear on the left of regular data columns.
     * 
     * The default value for this property is **false**.
     */
    get totalsBeforeData(): boolean {
        return this._totalsBefore;
    }
    set totalsBeforeData(value: boolean) {
        if (value != this._totalsBefore) {
            this._totalsBefore = wijmo.asBoolean(value);
            this.onViewDefinitionChanged();
            this._updatePivotView();
        }
    }
    /**
     * Gets or sets a value that determines whether the engine should
     * sort groups when sorting the value fields (measures) or whether
     * it should keep the group order and the data only within each
     * group.
     *
     * The default value for this property is **true**.
     */
    get sortableGroups(): boolean {
        return this._sortableGroups;
    }
    set sortableGroups(value: boolean) {
        if (value != this._sortableGroups) {
            this._sortableGroups = wijmo.asBoolean(value);
            this.onViewDefinitionChanged();
        }
    }
    /**
     * Gets or sets a value that indicates whether the summary data received
     * from the server is already sorted.
     * 
     * If this property is set to true, the {@link PivotEngine} will not sort 
     * the data it receives from the server.
     * 
     * This property should be used only in conjunction with custom servers 
     * that return the aggregated data properly sorted, typically using 
     * custom logic not available in the standard {@link PivotEngine}.
     *
     * The default value for this property is **false**.
     */
    get sortOnServer(): boolean {
        return this._sortOnServer;
    }
    set sortOnServer(value: boolean) {
        this._sortOnServer = wijmo.asBoolean(value);
    }
    /**
     * Gets or sets a value that determines whether the Olap output table
     * should use zeros to indicate missing values.
     *
     * The default value for this property is **false**.
     */
    get showZeros(): boolean {
        return this._showZeros;
    }
    set showZeros(value: boolean) {
        if (value != this._showZeros) {
            this._showZeros = wijmo.asBoolean(value);
            this.onViewDefinitionChanged();
            this._updatePivotView();
        }
    }
    /**
     * Gets or sets the default filter type (by value or by condition).
     *
     * The default value for this property is **null**, which causes
     * the engine to use **FilterType.Both** on the client or
     * **FilterType.Condition** on the server.
     */
    get defaultFilterType(): wijmo.grid.filter.FilterType {

        // honor explicitly set defaultFilterType
        if (this._defaultFilterType != null) {
            return this._defaultFilterType;
        }

        // REVIEW
        // limitation: FlexPivotEngine supports only Condition filters
        return this._server ? wijmo.grid.filter.FilterType.Condition : wijmo.grid.filter.FilterType.Both;
    }
    set defaultFilterType(value: wijmo.grid.filter.FilterType) {
        this._defaultFilterType = wijmo.asEnum(value, wijmo.grid.filter.FilterType, true);
    }
    /**
     * Gets or sets a value that determines whether the filter should
     * include only values selected by the 
     * {@link wijmo.grid.filter.ValueFilter.filterText} property.
     *
     * The default value for this property is **true**, which matches
     * Excel's behavior.
     *
     * Set it to **false** to disable this behavior, so searching only 
     * affects which items are displayed on the list and not which items 
     * are included in the filter.
     */
    get exclusiveValueSearch(): boolean {
        return this._xValueSearch;
    }
    set exclusiveValueSearch(value: boolean) {
        this._xValueSearch = wijmo.asBoolean(value);
    }
    /**
     * Gets or sets a value that determines whether the engine should generate fields 
     * automatically based on the {@link itemsSource}.
     *
     * If you set this property to true, the engine will generate fields for each
     * property of the items in the {@link itemsSource}. The {@link PivotField.binding} 
     * property of the auto-generated fields is set to the property name, and their 
     * {@link PivotField.header} property is set to a string obtained by capitalizing
     * the first letter of the binding and adding spaces before each capital letter.
     * 
     * For example, a 'customerName' property will cause the engine create a field 
     * with {@link PivotField.binding} set to 'customerName' and {@link PivotField.header} 
     * set to 'Customer Name'.
     *
     * When adding fields to one of the view lists using strings, you must specify 
     * the {@link PivotField.header}, not the {@link PivotField.binding} (unlike bindings, 
     * field headers must be unique).
     * 
     * The default value for this property is **true**.
     */
    get autoGenerateFields(): boolean {
        return this._autoGenFields;
    }
    set autoGenerateFields(value: boolean) {
        this._autoGenFields = wijmo.asBoolean(value);
    }
    /**
     * Gets or sets a value that determines whether users should be allowed to edit
     * the properties of the {@link PivotField} objects owned by this {@link PivotEngine}.
     * 
     * If you set this property to false, the context menus shown by controls
     * such as the **PivotGrid** and **PivotPanel** will not include an
     * option for changing the field settings.
     * 
     * The default value for this property is **true**.
     */
    get allowFieldEditing(): boolean {
        return this._allowFieldEditing;
    }
    set allowFieldEditing(value: boolean) {
        this._allowFieldEditing = wijmo.asBoolean(value);
    }
    /**
     * Gets the list of {@link PivotField} objects exposed by the data source.
     *
     * This list is created automatically whenever the {@link itemsSource} property is set.
     *
     * Pivot views are defined by copying fields from this list to the lists that define 
     * the view: {@link valueFields}, {@link rowFields}, {@link columnFields}, and {@link filterFields}.
     *
     * For example, the code below assigns a data source to the {@link PivotEngine} and 
     * then defines a view by adding fields to the {@link rowFields}, {@link columnFields}, and 
     * {@link valueFields} lists.
     *
     * ```typescript
     * import { PivotEngine } from '@grapecity/wijmo.olap';

     * // create pivot engine
     * let pe = new PivotEngine();
     *
     * // set data source (populates fields list)
     * pe.itemsSource = this.getRawData();
     *
     * // prevent updates while building Olap view
     * pe.beginUpdate();
     *
     * // show countries in rows
     * pe.rowFields.push('Country');
     *
     * // show categories and products in columns
     * pe.columnFields.push('Category');
     * pe.columnFields.push('Product');
     *
     * // show total sales in cells
     * pe.valueFields.push('Sales');
     *
     * // done defining the view
     * pe.endUpdate();
     * ```
     */
    get fields(): PivotFieldCollection {
        return this._fields;
    }
    /**
     * Gets the list of {@link PivotField} objects that define the fields shown as
     * rows in the output table.
     */
    get rowFields(): PivotFieldCollection {
        return this._rowFields;
    }
    /**
     * Gets the list of {@link PivotField} objects that define the fields shown as
     * columns in the output table.
     */
    get columnFields(): PivotFieldCollection {
        return this._columnFields;
    }
    /**
     * Gets the list of {@link PivotField} objects that define the fields 
     * used as filters.
     * 
     * Fields on this list do not appear in the output table, 
     * but are still used for filtering the input data.
     */
    get filterFields(): PivotFieldCollection {
        return this._filterFields;
    }
    /**
     * Gets the list of {@link PivotField} objects that define the fields 
     * summarized in the output table.
     */
    get valueFields(): PivotFieldCollection {
        return this._valueFields;
    }
    /**
     * Gets or sets the current pivot view definition as a JSON string.
     *
     * This property is typically used to persist the current view as 
     * an application setting.
     *
     * For example, the code below implements two functions that save
     * and load view definitions using local storage:
     *
     * ```typescript
     * // save/load views
     * function saveView() {
     *   localStorage.viewDefinition = pivotEngine.viewDefinition;
     * }
     * function loadView() {
     *   pivotEngine.viewDefinition = localStorage.viewDefinition;
     * }
     * ```
     */
    get viewDefinition(): string {

        // save options and view
        let viewDef = {
            showZeros: this.showZeros,
            showColumnTotals: this.showColumnTotals,
            showRowTotals: this.showRowTotals,
            defaultFilterType: this.defaultFilterType,
            totalsBeforeData: this.totalsBeforeData,
            sortableGroups: this.sortableGroups,
            fields: [],
            rowFields: this._getFieldCollectionProxy(this.rowFields),
            columnFields: this._getFieldCollectionProxy(this.columnFields),
            filterFields: this._getFieldCollectionProxy(this.filterFields),
            valueFields: this._getFieldCollectionProxy(this.valueFields)
        };

        // save field definitions
        this.fields.forEach((fld: PivotField) => {
            let fldDef = this._getFieldDefinition(fld);
            viewDef.fields.push(fldDef);
        });

        // done
        return JSON.stringify(viewDef);
    }
    set viewDefinition(value: string) {
        let viewDef = JSON.parse(value);
        if (viewDef) {
            this.deferUpdate(() => {

                // load options
                this._copyProps(this, viewDef, PivotEngine._props);

                // load fields
                this.fields.clear();
                viewDef.fields.forEach(fldDef => {
                    let fld = this._getFieldFromDefinition(fldDef);
                    this.fields.push(fld);
                });

                // load field weights
                viewDef.fields.forEach((fldDef, index) => {
                    if (wijmo.isString(fldDef.weightField)) {
                        this.fields[index].weightField = this.fields.getField(fldDef.weightField);
                    }
                });

                // load view fields
                this._setFieldCollectionProxy(this.rowFields, viewDef.rowFields);
                this._setFieldCollectionProxy(this.columnFields, viewDef.columnFields);
                this._setFieldCollectionProxy(this.filterFields, viewDef.filterFields);
                this._setFieldCollectionProxy(this.valueFields, viewDef.valueFields);
            });
            //this.onViewDefinitionChanged(); // already done by endUpdate: TFS 439515
        }
    }
    /**
     * Gets a value that determines whether a pivot view is currently defined.
     *
     * A pivot view is defined if any of the {@link valueFields}, {@link rowFields},
     * or {@link columnFields} lists are not empty.
     */
    get isViewDefined(): boolean {
        let vf = this._valueFields.length,
            rf = this._rowFields.length,
            cf = this._columnFields.length;
        return this._server
            ? vf > 0 && (rf > 0 || cf > 0)
            : vf > 0 || rf > 0 || cf > 0;
    }
    /**
     * Suspends the refresh processes until next call to the {@link endUpdate}.
     */
    beginUpdate() {
        this.cancelPendingUpdates();
        this._updating++;
        if (this._updating === 1) {
            this._onIsUpdatingChanged();
        }
    }
    /**
     * Resumes refresh processes suspended by calls to {@link beginUpdate}.
     */
    endUpdate() {
        this._updating--;
        if (this._updating <= 0) {
            if (this._viewDefinitionChanged) { // TFS 441269
                this._viewDefinitionChanged = false;
                this.onViewDefinitionChanged();
            }
            this._onIsUpdatingChanged();
            this.refresh();
        }
    }
    /**
     * Gets a value that indicates whether the engine is currently being updated.
     */
    get isUpdating(): boolean {
        return this._updating > 0;
    }
    /**
     * Executes a function within a {@link beginUpdate}/{@link endUpdate} block.
     *
     * The control will not be updated until the function has been executed.
     * This method ensures {@link endUpdate} is called even if the function throws
     * an exception.
     *
     * @param fn Function to be executed. 
     */
    deferUpdate(fn: Function) {
        try {
            this.beginUpdate();
            fn();
        } finally {
            this.endUpdate();
        }
    }
    /**
     * Summarizes the data and updates the output {@link pivotView}.
     *
     * @param force Refresh even while updating (see {@link beginUpdate}).
     */
    refresh(force = false) {
        this._updateView(force);
    }
    /**
     * Invalidates the view causing an asynchronous refresh.
     */
    invalidate() {
        if (this._toInv) {
            this._toInv = clearTimeout(this._toInv);
        }
        if (!this.isUpdating) {
            this._toInv = setTimeout(() => {
                this.refresh();
            }, wijmo.Control._REFRESH_INTERVAL);
        }
    }
    /** 
     * Gets or sets a value that determines whether view updates 
     * should be generated asynchronously.
     * 
     * This property is set to true by default, so summaries over 
     * large data sets are performed asynchronously to prevent 
     * stopping the UI thread.
     *
     * The default value for this property is **true**.
     */
    get async(): boolean {
        return this._async;
    }
    set async(value: boolean) {
        if (value != this._async) {
            this.cancelPendingUpdates();
            this._async = wijmo.asBoolean(value);
        }
    }
    /**
     * Gets or sets the maximum amount of time, in milliseconds, that
     * the engine should wait for the results to come back from the
     * server.
     *
     * The default value for this property is **60,000** milliseconds, 
     * or one minute. If you expect server operations  to take longer 
     * than that, set the property to a higher value.
     */
    get serverTimeout(): number {
        return this._serverParms.timeout;
    }
    set serverTimeout(value: number) {
        this._serverParms.timeout = wijmo.asNumber(value, false, true);
    }
    /**
     * Gets or sets the amount of time, in milliseconds, that the
     * engine should wait before polling the server for progress
     * status while retrieving results.
     *
     * The default value for this property is **500** milliseconds, 
     * which causes the engine to poll the server for a status update 
     * every half second.
     */
    get serverPollInterval(): number {
        return this._serverParms.pollInterval;
    }
    set serverPollInterval(value: number) {
        this._serverParms.pollInterval = wijmo.asNumber(value, false, true);
    }
    /**
     * Gets or sets the maximum number of records the {@link getDetail}
     * method should retrieve from the server.
     *
     * The default value for this property is **1,000**, which 
     * is a reasonable amount of detail in many scenarios. 
     * If you want to allow more detail records to be retrieved, 
     * increase the value of this property.
     */
    get serverMaxDetail(): number {
        return this._serverParms.maxDetail;
    }
    set serverMaxDetail(value: number) {
        this._serverParms.maxDetail = wijmo.asNumber(value, false, true);
    }
    /**
     * Cancels any pending asynchronous view updates.
     */
    cancelPendingUpdates() {
        if (this._toUpdateTallies) {
            clearTimeout(this._toUpdateTallies);
            this._toUpdateTallies = null;
        }
    }
    /**
     * Gets an array containing the records summarized by a property in the
     * {@link pivotView} list.
     *
     * If the engine is connected to a PivotEngine server, the value returned
     * is an {@link ObservableArray} that is populated asynchronously.
     *
     * @param item Data item in the {@link pivotView} list.
     * @param binding Name of the property being summarized.
     */
    getDetail(item: any, binding: string): any[] {
        let rowKey = item ? item[_PivotKey._ROW_KEY_NAME] as _PivotKey : null,
            colKey = this._getKey(binding);

        // get detail items on server
        if (this._server) {
            return this._server.getDetail(rowKey, colKey);
        }

        // get detail items on client
        let items = this.collectionView.items,
            arr = [];
        items.forEach(item => {
            if (this._applyFilter(item) &&
                (rowKey == null || rowKey.matchesItem(item)) &&
                (colKey == null || colKey.matchesItem(item))) {
                arr.push(item);
            }
        });
        return arr;
    }
    /**
     * Gets an {@link collections.ICollectionView} containing the records summarized
     * by a property in the {@link pivotView} list.
     *
     * @param item Data item in the {@link pivotView} list.
     * @param binding Name of the property being summarized.
     */
    getDetailView(item: any, binding: string): wijmo.collections.ICollectionView {
        let arr = this.getDetail(item, binding);
        return new wijmo.collections.CollectionView(arr);
    }
    /**
     * Gets an object with information about a property in the {@link pivotView} list.
     *
     * The object returned has two properties, 'rowKey' and 'colKey'. Each of
     * these contains two arrays, 'fields' and 'values'. Together, this information
     * uniquely identifies a value summarized by the {@link PivotEngine}.
     *
     * For example, calling {@link getKeys} against a pivot view with two row fields
     * 'Product' and 'Country', and a single column field 'Active' would return an
     * object such as this one:
     *
     * ```
     * {
     *     rowKey: {
     *         fields: [ 'Product', 'Country'],
     *         values: [ 'Aoba', 'Japan' ]
     *     },
     *     colKey: {
     *         fields: [ 'Active' ],
     *         values: [ true ]
     *     }
     * }
     * ```
     *
     * The object identifies the subset of data used to obtain one summary value.
     * In this case, this value represents all data items for product 'Aoba' sold
     * in Japan with Active state set to true.
     *
     * @param item Data item in the {@link pivotView} list.
     * @param binding Name of the property being summarized.
     */
    getKeys(item: any, binding: string): any {
        let rk = item ? item[_PivotKey._ROW_KEY_NAME] as _PivotKey : null,
            ck = this._getKey(binding);
        return {
            rowKey: {
                fields: rk ? rk.fieldNames : [],
                values: rk ? rk.values : []
            },
            colKey: {
                fields: ck ? ck.fieldNames : [],
                values: ck ? ck.values : []
            }
        }
    }
    /**
     * Shows a settings dialog where users can edit a field's settings.
     *
     * @param field {@link PivotField} to be edited.
     */
    editField(field: PivotField) {
        if (this.allowFieldEditing) {
            let edt = new PivotFieldEditor(document.createElement('div'), {
                field: field
            });
            let dlg = new wijmo.input.Popup(document.createElement('div'), {
                content: edt.hostElement
            });
            dlg.show(true);
        }
    }
    /**
     * Removes a field from the current view.
     *
     * @param field {@link PivotField} to be removed.
     */
    removeField(field: PivotField) {
        for (let i = 0; i < this._viewLists.length; i++) {
            let list = this._viewLists[i],
                index = list.indexOf(field);
            if (index > -1) {
                list.removeAt(index);
                return;
            }
        }
    }

    /**
     * Occurs after the value of the {@link itemsSource} property changes.
     */
    readonly itemsSourceChanged = new wijmo.Event<PivotEngine, wijmo.EventArgs>();
    /**
     * Raises the {@link itemsSourceChanged} event.
     */
    onItemsSourceChanged(e?: wijmo.EventArgs) {
        this.itemsSourceChanged.raise(this, e);
    }
    /**
     * Occurs after the view definition changes.
     */
    readonly viewDefinitionChanged = new wijmo.Event<PivotEngine, wijmo.EventArgs>();
    /**
     * Raises the {@link viewDefinitionChanged} event.
     */
    onViewDefinitionChanged(e?: wijmo.EventArgs) {
        if (this._updating <= 0) { // TFS 439515
            this.viewDefinitionChanged.raise(this, e);
            this._viewDefinitionChanged = false;
        } else {
            this._viewDefinitionChanged = true;
        }
    }
    /**
     * Occurs when the engine starts updating the {@link pivotView} list.
     */
    readonly updatingView = new wijmo.Event<PivotEngine, ProgressEventArgs>();
    /**
     * Raises the {@link updatingView} event.
     * 
     * @param e {@link ProgressEventArgs} that provides the event data.
     */
    onUpdatingView(e: ProgressEventArgs) {
        this.updatingView.raise(this, e);
    }
    /**
     * Occurs after the engine has finished updating the {@link pivotView} list.
     */
    readonly updatedView = new wijmo.Event<PivotEngine, wijmo.EventArgs>();
    /**
     * Raises the {@link updatedView} event.
     */
    onUpdatedView(e?: wijmo.EventArgs) {
        this.updatedView.raise(this, e);
    }
    /**
     * Occurs when there is an error getting data from the server.
     */
    readonly error = new wijmo.Event<PivotEngine, wijmo.RequestErrorEventArgs>();
    /**
     * Raises the {@link error} event.
     *
     * @param e {@link RequestErrorEventArgs} that contains information about the error.
     */
    onError(e: wijmo.RequestErrorEventArgs): boolean {
        this.error.raise(this, e);
        return !e.cancel;
    }

    readonly _isUpdatingChanged = new wijmo.Event<PivotEngine, wijmo.EventArgs>();
    _onIsUpdatingChanged(e?: wijmo.EventArgs) {
        this._isUpdatingChanged.raise(this, e);
    }

    // ** implementation

    // method used in JSON-style initialization
    _copy(key: string, value: any): boolean {
        let arr: any[];
        switch (key) {
            case 'fields':
                this.fields.clear();
                this._viewLists.forEach((list: PivotFieldCollection) => {
                    list.clear();
                });
                arr = wijmo.asArray(value);
                arr.forEach(fldDef => {
                    let fld = this._createField(fldDef, false);
                    this.fields.push(fld);
                });
                this._updateFieldTypes(); // TFS 304424
                return true;
            case 'rowFields':
            case 'columnFields':
            case 'valueFields':
            case 'filterFields':
                this[key].clear();

                // handle objects with maxItems/items
                if (!wijmo.isArray(value)) {
                    this[key].maxItems = value.maxItems;
                    value = value.items;
                }

                // handle regular arrays
                arr = wijmo.asArray(value);
                arr.forEach(fldDef => {
                    let fld = this.fields.getField(fldDef);
                    this[key].push(fld);
                })
                return true;
        }
        return false;
    }

    // get a pivot key object from its string representation
    _getKey(keyString: string): _PivotKey {
        return this._keys[keyString] as _PivotKey;
    }

    // gets a row key based on its index or data item (TFS 385259)
    _getRowKey(row: any): _PivotKey {
        let item = row;
        if (wijmo.isNumber(row)) {
            let view = this._pivotView,
                arr = view.items.length ? view.items : view.sourceCollection; // TFS 457252
            item = arr[row];
        }
        return item ? item[_PivotKey._ROW_KEY_NAME] : null;
    }

    // get the subtotal level of a row based on its index
    _getRowLevel(row: any): number {
        let key = this._getRowKey(row);
        return key ? key.level : -1;
    }

    // gets a column key based on its key, binding, or index
    _getColKey(key: any): _PivotKey {
        if (wijmo.isNumber(key)) { // convert column index into key string
            key = this._colBindings[key];
        }
        if (wijmo.isString(key)) {// convert string key in to actual key
            return this._getKey(key);
        }
        wijmo.assert(key == null || key instanceof _PivotKey, 'invalid parameter in call to _getColLevel');
        return key;
    }

    // get the subtotal level of a column based on its key, binding, or column index
    _getColLevel(key: any): number {
        key = this._getColKey(key);
        return key ? key.level : -1;
    }

    // apply filter to a given object
    private _applyFilter(item: any) {

        // scan all fields that have active filters
        let fields = this._activeFilterFields;
        for (let i = 0; i < fields.length; i++) {
            let f = (fields[i] as PivotField).filter;
            if (!f.apply(item)) {
                return false;
            }
        }

        // value passed all filters
        return true;
    }

    // refresh _tallies object used to build the output pivotView
    private _updateView(force = false) {
        if (!this.isUpdating || force) { // TFS 275158, 414365

            // benchmark
            //console.time('view update');

            // clear any on-going updates
            this.cancelPendingUpdates();

            // count items and filtered items
            this._cntTotal = this._cntFiltered = 0;

            // clear tallies and active filter fields
            this._tallies = {};
            this._keys = {};
            this._activeFilterFields = [];

            // update view from server
            if (this._server) {
                if (this.isViewDefined) {
                    this._server.getOutputView((result) => {
                        if (this.isViewDefined) { // the view might be gone by now: TFS 250028
                            this._server.updateTallies(result);
                            this._updatePivotView(force);
                        }
                    });
                    return;
                }
            }

            // keep track of active filter fields (optimization)
            let lists = this._viewLists;
            lists.forEach(list => {
                list.forEach(fld => {
                    if (fld.filter.isActive) {
                        this._activeFilterFields.push(fld);
                    }
                });
            });

            // tally all objects in data source
            if (this.isViewDefined && wijmo.hasItems(this._cv)) {
                this._batchStart = Date.now();
                this._updateTallies(this._cv.items, 0, force); // TFS 415147
            } else {
                this._updatePivotView(force);
            }
        }
    }

    // async tally update
    private _updateTallies(arr: any[], startIndex: number, force = false) {
        let arrLen = arr.length,
            rowNodes = new _PivotNode(this._rowFields, 0, null, -1, null);

        // if we have column but no value fields,
        // add a dummy value field to get a view with the column values
        let valFields = this.valueFields;
        if (valFields.length == 0 && this.columnFields.length > 0) {
            valFields = new PivotFieldCollection(this);
            valFields.push(new PivotField(this, '', '', {
                // use Sum instead of Cnt
                // to show 0 instead of 1(backward compatibility: TFS 469833)
                aggregate: wijmo.Aggregate.Sum
            }));
        }

        // set loop start and step variables to control key size and subtotal creation
        let st = ShowTotals,
            rkLen = this._rowFields.length,
            srTot = this._getShowRowTotals(),
            rkStart = srTot == st.None ? rkLen : 0,
            rkStep = srTot == st.GrandTotals ? Math.max(1, rkLen) : 1,
            ckLen = this._columnFields.length,
            scTot = this._getShowColTotals(),
            ckStart = scTot == st.None ? ckLen : 0,
            ckStep = scTot == st.GrandTotals ? Math.max(1, ckLen) : 1,
            vfLen = valFields.length;

        // scan through the items
        for (let index = startIndex; index < arrLen; index++) {

            // let go of the thread for a while
            if (this._async &&
                index - startIndex >= PivotEngine._BATCH_SIZE &&
                Date.now() - this._batchStart > PivotEngine._BATCH_DELAY) {
                this._toUpdateTallies = setTimeout(() => {
                    this.onUpdatingView(new ProgressEventArgs(Math.round(index / arr.length * 100)));
                    this._batchStart = Date.now();
                    this._updateTallies(arr, index, force); // TFS 415147
                }, PivotEngine._BATCH_TIMEOUT);
                return;
            }

            // count elements
            this._cntTotal++;

            // apply filter
            let item = arr[index];
            if (!this._activeFilterFields.length || this._applyFilter(item)) {

                // count filtered items from raw data source
                this._cntFiltered++;

                // get/create row tallies
                for (let i = rkStart; i <= rkLen; i += rkStep) {

                    // get/create row tally
                    let nd = rowNodes.getNode(this._rowFields, i, null, -1, item),
                        rowKey = nd.key,
                        //rowKey = new _PivotKey(this._rowFields, i, null, -1, item),
                        rowKeyId = rowKey.toString(),
                        rowTallies = this._tallies[rowKeyId];
                    if (!rowTallies) {
                        this._keys[rowKeyId] = rowKey;
                        this._tallies[rowKeyId] = rowTallies = {};
                    }

                    // get/create column tallies for this row
                    for (let j = ckStart; j <= ckLen; j += ckStep) {
                        for (let k = 0; k < vfLen; k++) {

                            // get/create tally
                            let colNodes = nd.tree.getNode(this._columnFields, j, valFields, k, item),
                                colKey = colNodes.key,
                                //colKey = new _PivotKey(this._columnFields, j, this._valueFields, k, item),
                                colKeyId = colKey.toString(),
                                tally = rowTallies[colKeyId];
                            if (!tally) {
                                this._keys[colKeyId] = colKey;
                                tally = rowTallies[colKeyId] = new _Tally();
                            }

                            // get value
                            let vf = valFields[k],
                                value = vf._getValue(item, false),
                                weight = vf.weightField ? vf._getWeight(item) : null;

                            // update tally
                            tally.add(value, weight);
                        }
                    }
                }
            }
        }

        // done with tallies, update view
        this._toUpdateTallies = null;
        this._updatePivotView(force); // TFS 415147
    }

    // refresh the output pivotView from the tallies
    private _updatePivotView(force = false) {
        if (!this.isUpdating || force) { // TFS 275158, 414365
            let view = this._pivotView as wijmo.collections.CollectionView;
            view.deferUpdate(() => {

                // start updating the view
                this.onUpdatingView(new ProgressEventArgs(100));

                // cancel any pending (invalid) edit/addNew operations (TFS 466905)
                view.cancelEdit();
                view.cancelNew();

                // clear table and sort
                let arr = view.sourceCollection;
                arr.length = 0;

                // get row keys
                let rowKeys = {};
                for (let rk in this._tallies) {
                    rowKeys[rk] = true;
                }

                // get column keys
                let colKeys = {};
                for (let rk in this._tallies) {
                    let row = this._tallies[rk];
                    for (let ck in row) {
                        colKeys[ck] = true;
                    }
                }

                // sort keys
                let sortedRowKeys = [], sortedColKeys = [];
                if (this._server) {
                    sortedRowKeys = this._server.getSortedKeys(rowKeys, true),
                    sortedColKeys = this._server.getSortedKeys(colKeys, false);
                } else {
                    sortedRowKeys = this._getSortedKeys(rowKeys);
                    sortedColKeys = this._getSortedKeys(colKeys);
                }

                // build output items
                for (let r = 0; r < sortedRowKeys.length; r++) {
                    let rowKey = sortedRowKeys[r],
                        row = this._tallies[rowKey],
                        item = {};
                    item[_PivotKey._ROW_KEY_NAME] = this._getKey(rowKey);
                    for (let c = 0; c < sortedColKeys.length; c++) {

                        // get the value
                        let colKey = sortedColKeys[c],
                            tally = row[colKey] as _Tally,
                            pk = this._getKey(colKey),
                            value = tally ? tally.getAggregate(pk.aggregate) : null;

                        // use zeros to indicate missing values (TFS 399859)
                        if (value == null && this._showZeros) {
                            value = 0;
                        }

                        // store the value
                        item[colKey] = value;
                    }
                    arr.push(item);
                }

                // save column keys so we can access them by index
                this._colBindings = sortedColKeys;

                // honor 'showAs' settings
                this._updateFieldValues(arr);

                // remove any sorts
                view.sortDescriptions.clear();

                // force CollectionView refresh (TFS 404441)
                view.refresh();
            });
            
            // done updating the view
            this.onUpdatedView();

            // benchmark
            //console.timeEnd('view update');
        }
    }

     // return a sorted array of PivotKey ids
     private _getSortedKeys(obj: any): string[] {
        let keys = Object.keys(obj);
        keys.sort((id1, id2) => {
            return this._keys[id1].compareTo(this._keys[id2]);
        });
        return keys;
    }

    // update field values to honor showAs property
    private _updateFieldValues(arr: any[]) {
        let vfl = this.valueFields.length;

        // honor getAggregateValue
        for (let vf = 0; vf < vfl; vf++) {
            let fld = this.valueFields[vf];

            // honor custom aggregate function
            if (wijmo.isFunction(fld.getAggregateValue)) {
                for (let col = vf; col < this._colBindings.length; col += vfl) {
                    for (let row = 0; row < arr.length; row++) {
                        let item = arr[row],
                            binding = this._colBindings[col],
                            aggItem = this._getAggregateObject(item, binding);
                        item[binding] = fld.getAggregateValue.call(this, aggItem); // custom function
                    }
                }
            }
        }

        // honor showAs property
        for (let vf = 0; vf < vfl; vf++) {
            let fld = this.valueFields[vf];
            switch (fld.showAs) {

                // running totals
                case ShowAs.RunTot:
                case ShowAs.RunTotPct:
                    for (let col = vf; col < this._colBindings.length; col += vfl) {

                        // calculate running totals
                        for (let row = 0; row < arr.length; row++) {
                            let item = arr[row],
                                binding = this._colBindings[col];
                            item[binding] = this._getRunningTotal(arr, row, col);
                        }

                        // convert running totals to percentages
                        if (fld.showAs == ShowAs.RunTotPct) {
                            for (let row = 0; row < arr.length; row++) {
                                let item = arr[row],
                                    binding = this._colBindings[col],
                                    val = item[binding];
                                if (wijmo.isNumber(val)) {
                                    let max = this._getLastValueInRowGroup(arr, row, col);
                                    if (max != 0) {
                                        item[binding] = val / max;
                                    }
                                }
                            }
                        }
                    }
                    break;

                // percentages
                case ShowAs.PctGrand:
                case ShowAs.PctCol:

                    // calculate grand total
                    let total = 0;
                    if (fld.showAs == ShowAs.PctGrand) {
                        for (let col = vf; col < this._colBindings.length; col += vfl) {
                            if (this._getColLevel(col) == -1) {
                                total += this._getColTotal(arr, col);
                            }
                        }
                    }

                    // convert columns to percentages
                    for (let col = vf; col < this._colBindings.length; col += vfl) {

                        // calculate column total
                        if (fld.showAs == ShowAs.PctCol) {
                            total = this._getColTotal(arr, col);
                        }

                        // convert column values to percentages
                        let binding = this._colBindings[col];
                        arr.forEach(item => {
                            let value = item[binding];
                            if (wijmo.isNumber(value)) {
                                item[binding] = total != 0 ? value / total : null;
                            }
                        });
                    }
                    break;

                case ShowAs.PctRow:
                    for (let row = 0; row < arr.length; row++) {

                        // calculate total for this row
                        let item = arr[row],
                            total = 0;
                        for (let col = vf; col < this._colBindings.length; col += vfl) {
                            if (this._getColLevel(col) == -1) {
                                let binding = this._colBindings[col],
                                    value = item[binding];
                                if (wijmo.isNumber(value)) {
                                    total += value;
                                }
                            }
                        }

                        // convert row values to percentages
                        for (let col = vf; col < this._colBindings.length; col += vfl) {
                            let binding = this._colBindings[col],
                                value = item[binding];
                            if (wijmo.isNumber(value)) {
                                item[binding] = total != 0 ? value / total : null;
                            }
                        }
                    }
                    break;

                // row differences
                case ShowAs.DiffRow:
                case ShowAs.DiffRowPct:
                case ShowAs.PctPrevRow:
                    for (let col = vf; col < this._colBindings.length; col += vfl) {
                        for (let row = arr.length - 1; row >= 0; row--) {
                            let item = arr[row],
                                binding = this._colBindings[col];
                            item[binding] = this._getRowDifference(arr, row, col, fld.showAs);
                        }
                    }
                    break;

                // column differences
                case ShowAs.DiffCol:
                case ShowAs.DiffColPct:
                case ShowAs.PctPrevCol:
                    for (let row = 0; row < arr.length; row++) {
                        for (let col = this._colBindings.length - vfl + vf; col >= 0; col -= vfl) {
                            let item = arr[row],
                                binding = this._colBindings[col];
                            item[binding] = this._getColDifference(arr, row, col, fld.showAs);
                        }
                    }
                    break;
            }
        }
    }

    // get object to use as a context for the field's getAggregateValue function
    _getAggregateObject(item: any, binding: string): any {
        let obj: any = {},
            rx = /(.+:.+;)*((.+):.+;)/, // one or more field names and values
            mThis = binding.match(rx);

        // copy matching row values into aggregate object
        for (let k in item) {
            let mOther = k.match(rx);
            if (mOther && mOther[1] == mThis[1]) { // match prefix
                obj[mOther[3]] = item[k]; // save name
            }
        }

        // done
        return obj;
    }

    // gets a total for all non-group values in a column
    private _getColTotal(arr: any[], col: number): number {
        let binding = this._colBindings[col],
            total = 0;
        arr.forEach(item => {
            if (this._getRowLevel(item) == -1) { // TFS 385259
                let val = item[binding];
                if (wijmo.isNumber(val)) {
                    total += val;
                }
            }
        });
        return total;
    }

    // gets the a running total for an item by adding its value to the value in the previous row
    private _getRunningTotal(arr: any[], row: number, col: number): number {

        // grand total? no running total (as in Excel).
        let level = this._getRowLevel(arr[row]); // TFS 457252
        if (level == 0) {
            return null;
        }

        // get binding and cell value
        let binding = this._colBindings[col],
            runTot = arr[row][binding],
            srTot = this._getShowRowTotals();

        // get previous item at the same level
        let grpFld = this.rowFields.length - 2;
        for (let p = row - 1; p >= 0; p--) {
            let plevel = this._getRowLevel(arr[p]); // TFS 457252
            if (plevel == level) {

                // honor groups even without subtotals 
                if (grpFld > -1 && level < 0 && srTot != ShowTotals.Subtotals) {
                    let k = arr[row].$rowKey,
                        kp = arr[p].$rowKey;
                    if (k.values[grpFld] != kp.values[grpFld]) {
                        return null;
                    }
                }

                // compute running total
                let pval = arr[p][binding];
                runTot += pval;
                break;
            }

            // not found...
            if (plevel > level) break;
        }

        // return running total (percentages to be calculated later)
        return runTot;
    }

    // gets the last value in a row group (used to calculate running total percentages)
    private _getLastValueInRowGroup(arr: any[], row: number, col: number): number {

        // get binding and cell value
        let binding = this._colBindings[col],
            lastVal = arr[row][binding];

        // get next item at the same level
        let level = this._getRowLevel(arr[row]), // TFS 457252
            grpFld = this.rowFields.length - 2,
            srTot = this._getShowRowTotals();
        for (let p = row + 1; p < arr.length; p++) {
            let plevel = this._getRowLevel(arr[p]); // TFS 457252
            if (plevel == level) {

                // honor groups even without subtotals 
                if (grpFld > -1 && level < 0 && srTot != ShowTotals.Subtotals) {
                    let k = arr[row].$rowKey,
                        kp = arr[p].$rowKey;
                    if (k.values[grpFld] != kp.values[grpFld]) {
                        return lastVal;
                    }
                }

                // compute running total
                lastVal = arr[p][binding];
            }

            // not found...
            if (plevel > level) break;
        }

        // return running total (percentages to be calculated later)
        return lastVal;
    }

    // gets the difference between an item and the item in the previous row
    private _getRowDifference(arr: any[], row: number, col: number, showAs: ShowAs): number {

        // grand total? no previous item, no diff.
        let level = this._getRowLevel(arr[row]); // TFS 457252
        if (level == 0) {
            return null;
        }

        // get previous item at the same level
        let binding = this._colBindings[col],
            val = arr[row][binding],
            grpFld = this.rowFields.length - 2,
            srTot = this._getShowRowTotals();
        for (let p = row - 1; p >= 0; p--) {
            let plevel = this._getRowLevel(arr[p]); // TFS 457252
            if (plevel == level) {

                // honor groups even without subtotals 
                if (grpFld > -1 && level < 0 && srTot != ShowTotals.Subtotals) {
                    let k = arr[row].$rowKey,
                        kp = arr[p].$rowKey;
                    if (k.values[grpFld] != kp.values[grpFld]) {
                        return null;
                    }
                }

                // compute difference
                let pval = arr[p][binding];
                switch (showAs) {
                    case ShowAs.DiffRow:
                        val = val - pval;
                        break;
                    case ShowAs.DiffRowPct:
                        val = (val - pval) / pval;
                        break;
                    case ShowAs.PctPrevRow:
                        val = val / pval;
                        break;
                }

                // done
                return val;
            }

            // not found...
            if (plevel > level) break;
        }

        // no previous item...
        return showAs == ShowAs.PctPrevRow
            ? 1 // first item is 100%, like Excel
            : null;
    }

    // gets the difference between an item and the item in the previous column
    private _getColDifference(arr: any[], row: number, col: number, showAs: ShowAs): number {

        // grand total? no previous item, no diff.
        let level = this._getColLevel(col);
        if (level == 0) {
            return null;
        }

        // get previous item at the same level
        let item = arr[row],
            val = item[this._colBindings[col]],
            vfl = this.valueFields.length,
            grpFld = this.columnFields.length - 2,
            scTot = this._getShowColTotals();
        for (let p = col - vfl; p >= 0; p -= vfl) {
            let plevel = this._getColLevel(p);
            if (plevel == level) {

                // honor groups even without subtotals
                if (grpFld > -1 && level < 0 && scTot != ShowTotals.Subtotals) {
                    let k = this._getKey(this._colBindings[col]),
                        kp = this._getKey(this._colBindings[p]);
                    if (k.values[grpFld] != kp.values[grpFld]) {
                        return null;
                    }
                }

                // compute difference
                let pval = item[this._colBindings[p]];
                switch (showAs) {
                    case ShowAs.DiffCol:
                        val = val - pval;
                        break;
                    case ShowAs.DiffColPct:
                        val = (val - pval) / pval;
                        break;
                    case ShowAs.PctPrevCol:
                        val = val / pval;
                        break;
                }

                // done
                return val;
            }

            // not found...
            if (plevel > level) break;
        }

        // no previous item...
        return showAs == ShowAs.PctPrevCol
            ? 1 // first item is 100%, like Excel
            : null;
    }

    // do not show totals if there are no value fields
    _getShowRowTotals(): ShowTotals {
        return this._valueFields.length
            ? this._showRowTotals
            : ShowTotals.None;
    }
    _getShowColTotals(): ShowTotals {
        return this._valueFields.length
            ? this._showColTotals
            : ShowTotals.None;
    }

    // get the list of unique values for a field
    _getUniqueValues(fld: PivotField) {
        return this._server
            ? this._server.getUniqueValues(fld)
            : null;
    }

    // generate fields for the current itemsSource
    private _generateFields() {

        // empty view lists
        this._viewLists.forEach(list => {
            list.clear();
        });

        // remove old auto-generated fields
        for (let i = 0; i < this.fields.length; i++) {
            let fld = this.fields[i];
            if (fld._autoGenerated) {
                this.fields.removeAt(i);
                i--;
            }
        }

        // get field list from server
        if (this._server) {
            let fields = this._server.getFields();
            fields.forEach(fldDef => {
                let fld = this._createField(fldDef, true);
                if (!this.fields.getField(fld.header)) {
                    this.fields.push(fld);
                }
            });
            return;
        }

        // get first item to infer data types
        let cv = this.collectionView,
            arr = cv ? cv.items : null; // using items to support calculated fields

        // auto-generate new fields
        // (skipping unwanted types: array and object)
        if (arr && arr.length && this.autoGenerateFields) {
            wijmo.getTypes(arr).forEach(item => {
                let fld = this._createField({
                    binding: item.binding,
                    header: wijmo.toHeaderCase(item.binding),
                    dataType: item.dataType
                }, true);
                if (!this.fields.getField(fld.header)) {
                    this.fields.push(fld);
                }
            });
        }
    }

    // update missing field types
    _updateFieldTypes() {
        let cv = this.collectionView,
            arr = cv ? cv.sourceCollection : null;
        if (arr && arr.length) {
            this.fields.forEach((fld: PivotField) => {
                this._updateFieldType(fld, arr);
            });
        }
    }
    _updateFieldType(fld: PivotField, arr: any[]) {

        // handle cube fields
        if (fld._hasSubFields()) {
            fld.subFields.forEach((subField: PivotField) => {
                this._updateFieldType(subField, arr);
            });
            return;
        }

        // set field data type based on the data value
        if (fld.dataType == null && fld.binding) {
            for (let index = 0; index < arr.length && index < 1000; index++) {
                let value = fld._binding.getValue(arr[index]);
                if (value != null) {
                    fld.dataType = wijmo.isPrimitive(value) ? wijmo.getType(value) : null;
                    break;
                }
            }
        }

        // adjust format and aggregate based on data type (TFS 382512)
        if (fld.dataType != null) {
            if (!fld.format) {
                fld.format = fld.dataType == wijmo.DataType.Date ? 'd' : 'n0';
            }
            if (fld.aggregate == wijmo.Aggregate.Sum && fld.dataType != wijmo.DataType.Number) {
                fld.aggregate = wijmo.Aggregate.Cnt;
            }
        }
    }

    // create a regular of cube field
    _createField(options: any, autoGenerated: boolean): PivotField {

        // create cube or regular field
        let fld: PivotField;
        if (wijmo.isString(options)) {
            fld = new PivotField(this, options);
        } else if (options) {
            if (options.key) { // remove key (it is readonly)
                delete options.key;
            }
            fld = options.dimensionType != null
                ? new CubePivotField(this, options.binding, options.header, options)
                : new PivotField(this, options.binding, options.header, options);
            if (options.dataType != null) { // TFS 299031
                fld.dataType = options.dataType;
            }
        }

        // remember if this field was auto generated
        fld._autoGenerated = autoGenerated;

        // set defaults if auto-generating
        if (autoGenerated || wijmo.isString(options)) {
            fld.format = fld.dataType == wijmo.DataType.Date
                ? 'd'
                : 'n0';
            fld.aggregate = fld.dataType == wijmo.DataType.Number
                ? wijmo.Aggregate.Sum
                : wijmo.Aggregate.Cnt;
        }

        // apply options after initialization (TFS 293397)
        if (options && !wijmo.isString(options)) {
            wijmo.copy(fld, options);
        }

        // sanity: cube fields should have a key and EITHER have bindings OR subfields
        //if (fld instanceof CubePivotField) {
        //    let hasBinding = fld.binding != null && fld.binding.length > 0;
        //    if (fld.subFields != null && fld.subFields.length > 0) {
        //        assert(!hasBinding, 'Parent cube fields not have bindings.')
        //    } else {
        //        assert(hasBinding, 'Leaf cube fields should have bindings.')
        //    }
        //}

        // all done
        return fld;
    }

    // handle changes to data source
    private _cvCollectionChanged(sender, e: wijmo.collections.NotifyCollectionChangedEventArgs) {
        this.invalidate();
    }

    // handle changes to field lists
    private _fieldListChanged(s: any, e: wijmo.collections.NotifyCollectionChangedEventArgs) {
        if (e.action == wijmo.collections.NotifyCollectionChangedAction.Add) {
            let arr = s as PivotFieldCollection;

            // rule 1: prevent duplicate items within a list
            for (let i = 0; i < arr.length - 1; i++) {
                if (arr[i].key) { // REVIEW: cube fields with children have no key...
                    for (let j = i + 1; j < arr.length; j++) {
                        if (arr[i].key == arr[j].key) {
                            arr.removeAt(j);
                            j--;
                        }
                    }
                }
            }

            // rule 2: if a field was added to one of the view lists, 
            // make sure it is also on the main list
            // and that it only appears once in the view lists
            if (arr != this._fields) {
                if (!this._fields.getField(e.item.key)) {
                    arr.removeAt(e.index); // not on the main list, remove from view list
                } else { // remove duplicates
                    for (let i = 0; i < this._viewLists.length; i++) {
                        if (this._viewLists[i] != arr) {
                            let list = this._viewLists[i];
                            let index = list.indexOf(e.item);
                            if (index > -1) {
                                list.removeAt(index);
                            }
                        }
                    }
                }
            }

            // rule 3: honor maxItems
            if (wijmo.isNumber(arr.maxItems) && arr.maxItems > -1) {
                while (arr.length > arr.maxItems) {
                    let index = arr.length - 1;
                    if (arr[index] == e.item && index > 0) {
                        index--;
                    }
                    arr.removeAt(index);
                }
            }
        }

        // notify and be done
        this.onViewDefinitionChanged();
        this.invalidate();
    }

    // handle changes to field properties
    /*private*/ _fieldPropertyChanged(field: PivotField, e: wijmo.PropertyChangedEventArgs) {

        // raise viewDefinitionChanged
        this.onViewDefinitionChanged();

        // if the field is not active, we're done
        if (!field.isActive) {
            return;
        }

        // take action depending on the property that changed
        let prop = e.propertyName;

        // changing the visible property of a field does not require any updates
        if (prop == 'visible') {
            return;
        }

        // changing width, wordWrap or isContentHtml only requires a view refresh
        // (no need to update or re-summarize)
        if (prop == 'width' || prop == 'wordWrap' || prop == 'isContentHtml') {
            this._pivotView.refresh();
            return;
        }

        // changing the format of a value field only requires a view refresh 
        // (no need to update or re-summarize)
        if (prop == 'format' && this.valueFields.indexOf(field) > -1) {
            this._pivotView.refresh();
            return;
        }

        // changing the showAs property requires view update
        // (no need to re-summarize)
        if (prop == 'showAs') {
            if (this.valueFields.indexOf(field) > -1 && !this.isUpdating) {
                this._updatePivotView();
            }
            return;
        }

        // changing the descending property requires view update 
        // (no need to re-summarize)
        if (prop == 'descending') {
            this._updatePivotView();
            return;
        }

        // changing the aggregate property requires re-generation
        // on the server, view update on the client
        if (prop == 'aggregate') {
            if (this.valueFields.indexOf(field) > -1 && !this.isUpdating) {
                if (this._server) {
                    this._updateView(); // update the summaries
                } else {
                    this._updatePivotView(); // update the view
                }
            }
            return;
        }

        // refresh the whole view (summarize and regenerate)
        this.invalidate();
    }

        // copy properties from a source object to a destination object
        /*private*/ _copyProps(dst: any, src: any, props: string[]) {
        for (let i = 0; i < props.length; i++) {
            let prop = props[i];
            if (src[prop] != null) {
                dst[prop] = src[prop];
            }
        }
    }

    // gets a copy of a field for inclusion in a viewDefinition string
    private _getFieldFromDefinition(fldDef: any): PivotField {

        // remove filter proxy from definition (TFS 293422)
        let filterProxy = fldDef.filter;
        if (fldDef.filter) {
            delete fldDef.filter;
        }

        // create field and filter
        let fld = this._createField(fldDef, true); // TFS 293397, 294121
        if (filterProxy) {
            fld._setFilterProxy(filterProxy);
            fldDef.filter = filterProxy;
        }

        // field is ready
        return fld;
    }

    // gets a field definition including any sub-fields
    private _getFieldDefinition(fld: PivotField) {
        let fldDef: any = {
            binding: fld.binding,
            header: fld.header,
            dataType: fld.dataType,
            aggregate: fld.aggregate,
            showAs: fld.showAs,
            descending: fld.descending,
            format: fld.format,
            align: fld.align,
            wordWrap: fld.wordWrap,
            width: fld.width,
            isContentHtml: fld.isContentHtml
        };
        if (fld.weightField) {
            fldDef.weightField = fld.weightField._getName();
        }
        if (fld.key) {
            fldDef.key = fld.key;
        }
        if (fld.filter.isActive) {
            fldDef.filter = fld._getFilterProxy();
        }
        if (fld._hasSubFields()) {
            fldDef.subFields = [];
            fld.subFields.forEach((subField: PivotField) => {
                fldDef.subFields.push(this._getFieldDefinition(subField));
            });
        }
        if (fld instanceof CubePivotField) {
            fldDef.dimensionType = (fld as CubePivotField).dimensionType;
        }
        return fldDef;
    }

    // persist view field collections
    private _getFieldCollectionProxy(arr: PivotFieldCollection) {
        let proxy: any = {
            items: []
        };
        if (wijmo.isNumber(arr.maxItems) && arr.maxItems > -1) {
            proxy.maxItems = arr.maxItems;
        }
        for (let i = 0; i < arr.length; i++) {
            let fld = arr[i] as PivotField;
            proxy.items.push(fld.key);
        }
        return proxy;
    }
    private _setFieldCollectionProxy(arr: PivotFieldCollection, proxy: any) {
        arr.clear();
        arr.maxItems = wijmo.isNumber(proxy.maxItems) ? proxy.maxItems : null;
        for (let i = 0; i < proxy.items.length; i++) {
            arr.push(proxy.items[i]);
        }
    }
}

/**
 * Provides arguments for progress events.
 */
export class ProgressEventArgs extends wijmo.EventArgs {
    _progress: number;

    /**
     * Initializes a new instance of the {@link ProgressEventArgs} class.
     *  
     * @param progress Number between 0 and 100 that represents the progress.
     */
    constructor(progress: number) {
        super();
        this._progress = wijmo.asNumber(progress);
    }

    /**
     * Gets the current progress as a number between 0 and 100.
     */
    get progress(): number {
        return this._progress;
    }
}

    }
    


    module wijmo.olap {
    






'use strict';

/**
 * Context Menu for {@link ListBox} controls containing {@link PivotField} objects. 
 */
export class _ListContextMenu extends wijmo.input.Menu {
    _full: boolean;

    /**
     * Initializes a new instance of the {@link _ListContextMenu} class.
     * 
     * @param full Whether to include all commands or only the ones that apply to the main field list.
     */
    constructor(full: boolean) {

        // initialize the menu
        super(document.createElement('div'), {
            header: 'Field Context Menu',
            displayMemberPath: 'text',
            commandParameterPath: 'parm',
            command: {
                executeCommand: (parm: string) => {
                    this._execute(parm);
                },
                canExecuteCommand: (parm: string) => {
                    return this._canExecute(parm);
                }
            }
        });

        // finish initializing (after call to super)
        this._full = full;
        this.itemsSource = this._getMenuItems(full)

        // add a class to allow CSS customization
        wijmo.addClass(this.dropDown, 'context-menu wj-olap-context-menu');
    }

    // refresh menu items in case culture changed
    refresh(fullUpdate = true) {
        this.itemsSource = this._getMenuItems(this._full);
        super.refresh(fullUpdate);
    }

    /**
     * Attaches this context menu to a {@link FlexGrid} control.
     *
     * @param grid {@link FlexGrid} control to attach this menu to.
     */
    attach(grid: wijmo.grid.FlexGrid) {
        wijmo.assert(grid instanceof wijmo.grid.FlexGrid, 'Expecting a FlexGrid control...');
        let owner = grid.hostElement;
        owner.addEventListener('contextmenu', (e) => {

            // select the item that was clicked
            if (this._selectField(grid, e)) {

                // prevent default context menu
                e.preventDefault();

                // show the menu
                this.owner = owner;
                this.show(e);
            }
        });
    }

    // ** implementation

    // select the field that was clicked before showing the context menu
    _selectField(grid: wijmo.grid.FlexGrid, e: MouseEvent): boolean {

        // check that this is a valid cell
        let ht = grid.hitTest(e);
        if (ht.panel != grid.cells || !ht.range.isValid) {
            return false;
        }

        // no context menu for parent fields
        let fld = grid.rows[ht.row].dataItem;
        if (fld instanceof CubePivotField && fld.subFields && fld.subFields.length) {
            return false;
        }

        // select field and return true to show the menu
        grid.select(ht.range, true);
        return true;
    }

    // get the items used to populate the menu
    _getMenuItems(full: boolean): any[] {
        let items: any[];

        // build list (asterisks represent text that will be localized)
        if (full) {
            items = [
                { text: '<div class="menu-icon"></div>*', parm: 'up' },
                { text: '<div class="menu-icon"></div>*', parm: 'down' },
                { text: '<div class="menu-icon"></div>*', parm: 'first' },
                { text: '<div class="menu-icon"></div>*', parm: 'last' },
                { text: '<div class="wj-separator"></div>' },
                { text: '<div class="menu-icon"><span class="wj-glyph-filter"></span></div>*', parm: 'filter' },
                { text: '<div class="menu-icon">&#8801;</div>*', parm: 'rows' },
                { text: '<div class="menu-icon">&#10996;</div>*', parm: 'cols' },
                { text: '<div class="menu-icon">&#931;</div>*', parm: 'vals' },
                { text: '<div class="wj-separator"></div>' },
                { text: '<div class="menu-icon menu-icon-remove">&#10006;</div>*', parm: 'remove' },
                { text: '<div class="wj-separator"></div>' },
                { text: '<div class="menu-icon">&#9965;</div>*', parm: 'edit' }
            ];
        } else {
            items = [
                { text: '<div class="menu-icon"><span class="wj-glyph-filter"></span></div>*', parm: 'filter' },
                { text: '<div class="menu-icon">&#8801;</div>*', parm: 'rows' },
                { text: '<div class="menu-icon">&#10996;</div>*', parm: 'cols' },
                { text: '<div class="menu-icon">&#931;</div>*', parm: 'vals' },
                { text: '<div class="wj-separator"></div>' },
                { text: '<div class="menu-icon">&#9965;</div>*', parm: 'edit' }
            ];
        }

        // localize items
        for (let i = 0; i < items.length; i++) {
            let item = items[i];
            if (item.parm) {
                let text = wijmo.culture.olap._ListContextMenu[item.parm];
                wijmo.assert(text, 'missing localized text for item ' + item.parm);
                item.text = item.text.replace(/([^>]+$)/, text);
            }
        }

        // return localized items
        return items;
    }

    // execute the menu commands
    _execute(parm) {
        let grid = wijmo.Control.getControl(this.owner) as wijmo.grid.FlexGrid,
            flds = grid.itemsSource,
            row = grid.selection.row,
            fld = grid.rows[row].dataItem as PivotField,
            ng = fld ? fld.engine : null,
            target = this._getTargetList(ng, parm);

        switch (parm) {

            // move field within the list
            case 'up':
            case 'first':
            case 'down':
            case 'last':
                if (ng) {
                    let index = flds.indexOf(fld),
                        newIndex =
                            parm == 'up' ? index - 1 :
                                parm == 'first' ? 0 :
                                    parm == 'down' ? index + 1 :
                                        parm == 'last' ? flds.length :
                                            -1;
                    ng.deferUpdate(() => {
                        flds.removeAt(index);
                        flds.insert(newIndex, fld);
                    });
                }
                break;

            // move/copy field to a different list
            case 'filter':
            case 'rows':
            case 'cols':
            case 'vals':
                if (target && fld) {
                    target.push(fld);
                }
                break;

            // remove this field from the list
            case 'remove':
                if (fld) {
                    ng.removeField(fld);
                }
                break;

            // edit this field's settings
            case 'edit':
                if (fld) {
                    ng.editField(fld);
                }
                break;
        }
    }
    _canExecute(parm): boolean {

        // sanity
        let grid = wijmo.Control.getControl(this.owner) as wijmo.grid.FlexGrid;
        if (!grid) {
            return false;
        }

        // go to work
        let row = grid.selection.row,
            fld = row > -1 ? grid.rows[row].dataItem as PivotField : null,
            ng = fld ? fld.engine : null,
            target = this._getTargetList(ng, parm),
            cube = fld ? fld instanceof CubePivotField : false,
            measure = fld ? fld.isMeasure : false;

        // check whether the command can be executed in the current context
        switch (parm) {

            // disable moving first item up/first
            case 'up':
            case 'first':
                return row > 0;

            // disable moving last item down/last
            case 'down':
            case 'last':
                return row < grid.rows.length - 1;

            // disable moving to lists that contain the target
            case 'filter':
            case 'rows':
            case 'cols':
                return !measure && target && target.indexOf(fld) < 0;

            case 'vals':
                return (!cube || measure) && target && target.indexOf(fld) < 0;

            // edit fields only if the engine allows it
            case 'edit':
                return ng && ng.allowFieldEditing;

            // cubes don't show details...
            case 'detail':
                return fld && !cube;
        }

        // all else is OK
        return true;
    }

    // get target list for a command
    _getTargetList(engine: PivotEngine, parm: string) {
        if (engine) {
            switch (parm) {
                case 'filter':
                    return engine.filterFields;
                case 'rows':
                    return engine.rowFields;
                case 'cols':
                    return engine.columnFields;
                case 'vals':
                    return engine.valueFields;
            }
        }
        return null;
    }
}
    }
    


    module wijmo.olap {
    







'use strict';

/**
 * Provides a user interface for interactively transforming regular data tables into Olap
 * pivot tables.
 *
 * Olap pivot tables group data into one or more dimensions. The dimensions are represented
 * by rows and columns on a grid, and the summarized data is stored in the grid cells.
 *
 * Use the {@link itemsSource} property to set the source data, and the {@link pivotView}
 * property to get the output table containing the summarized data.
 */
export class PivotPanel extends wijmo.Control {

    // pivot engine driven by this panel
    private _ng: PivotEngine;

    // child elements
    private _dFields: HTMLElement;
    private _dFilters: HTMLElement;
    private _dRows: HTMLElement;
    private _dCols: HTMLElement;
    private _dVals: HTMLElement;
    private _dMarker: HTMLElement;
    private _dProgress: HTMLElement;
    private _chkDefer: HTMLInputElement;
    private _btnUpdate: HTMLElement;

    // grids with field lists
    private _lbFields: wijmo.grid.FlexGrid;
    private _lbFilters: wijmo.grid.FlexGrid;
    private _lbRows: wijmo.grid.FlexGrid;
    private _lbCols: wijmo.grid.FlexGrid;
    private _lbVals: wijmo.grid.FlexGrid;

    // globalizable elements
    private _gFlds: HTMLElement;
    private _gDrag: HTMLElement;
    private _gFlt: HTMLElement;
    private _gCols: HTMLElement;
    private _gRows: HTMLElement;
    private _gVals: HTMLElement;
    private _gDefer: HTMLElement;

    // context menus
    _ctxMenuShort: _ListContextMenu;
    _ctxMenuFull: _ListContextMenu;

    // drag/drop stuff
    private _dragSource: HTMLElement;
    private _dragField: PivotField;
    private _dropIndex: number;

    // property storage
    private _showIcons = true;
    private _restrictDrag: boolean = null;

    private _isUpdatingChangedBnd: any;

    /**
     * Gets or sets the template used to instantiate {@link PivotPanel} controls.
     */
    static controlTemplate =
        '<div>' +

            // fields
            '<label wj-part="g-flds"></label>' +
            '<div wj-part="d-fields"></div>' +

            // drag/drop area
            '<label wj-part="g-drag"></label>' +
            '<table>' +
                '<tr>' +
                    '<td width="50%">' +
                        '<label><span class="wj-glyph wj-glyph-filter"></span> <span wj-part="g-flt"></span></label>' +
                        '<div wj-part="d-filters"></div>' +
                    '</td>' +
                        '<td width= "50%" style="border-left-style:solid">' +
                        '<label><span class="wj-glyph">&#10996;</span> <span wj-part="g-cols"></span></label>' +
                        '<div wj-part="d-cols"></div>' +
                    '</td>' +
                '</tr>' +
                '<tr style="border-top-style:solid">' +
                    '<td width="50%">' +
                        '<label><span class="wj-glyph">&#8801;</span> <span wj-part="g-rows"></span></label>' +
                        '<div wj-part="d-rows"></div>' +
                    '</td>' +
                    '<td width= "50%" style="border-left-style:solid">' +
                        '<label><span class="wj-glyph">&#931;</span> <span wj-part="g-vals"></span></label>' +
                        '<div wj-part="d-vals"></div>' +
                    '</td>' +
                '</tr>' +
            '</table>' +

            // progress indicator
            '<div wj-part="d-prog" class="wj-state-selected" style="width:0px;height:3px"></div>' +

            // update panel
            '<div style="display:table">' +
                '<label style="display:table-cell;vertical-align:middle">' +
                    '<input wj-part="chk-defer" type="checkbox"/> <span wj-part="g-defer"></span>' +
                '</label>' +
                '<button wj-part="btn-update" class="wj-btn wj-state-disabled" style="float:right;margin:6px" disabled></button>' +
            '</div>' +
        '</div>';

    /**
     * Initializes a new instance of the {@link PivotPanel} class.
     *
     * @param element The DOM element that hosts the control, or a CSS selector for the host element (e.g. '#theCtrl').
     * @param options The JavaScript object containing initialization data for the control.
     */
    constructor(element: any, options?: any) {
        super(element, null, true);

        this._isUpdatingChangedBnd = this._isUpdatingChanged.bind(this);

        // check dependencies
        // let depErr = 'Missing dependency: PivotPanel requires ';
        // assert(input != null, depErr + 'wijmo.input.');
        // assert(grid != null && grid.filter != null, depErr + 'wijmo.grid.filter.');

        // instantiate and apply template
        let tpl = this.getTemplate();
        this.applyTemplate('wj-control wj-content wj-pivotpanel', tpl, {
            _dFields: 'd-fields',
            _dFilters: 'd-filters',
            _dRows: 'd-rows',
            _dCols: 'd-cols',
            _dVals: 'd-vals',
            _dProgress: 'd-prog',
            _btnUpdate: 'btn-update',
            _chkDefer: 'chk-defer',
            _gFlds: 'g-flds',
            _gDrag: 'g-drag',
            _gFlt: 'g-flt',
            _gCols: 'g-cols',
            _gRows: 'g-rows',
            _gVals: 'g-vals',
            _gDefer: 'g-defer'
        });

        // globalization
        this._globalize();

        // enable drag/drop
        let host = this.hostElement;
        this.addEventListener(host, 'dragstart', this._dragstart.bind(this));
        this.addEventListener(host, 'dragover', this._dragover.bind(this));
        this.addEventListener(host, 'dragleave', this._dragover.bind(this));
        this.addEventListener(host, 'drop', this._drop.bind(this));
        this.addEventListener(host, 'dragend', this._dragend.bind(this));

        // create child controls
        this._lbFields = this._createFieldGrid(this._dFields);
        this._lbFilters = this._createFieldGrid(this._dFilters);
        this._lbRows = this._createFieldGrid(this._dRows);
        this._lbCols = this._createFieldGrid(this._dCols);
        this._lbVals = this._createFieldGrid(this._dVals);

        // add context menus to the controls
        let ctx = this._ctxMenuShort = new _ListContextMenu(false);
        ctx.attach(this._lbFields);
        ctx = this._ctxMenuFull = new _ListContextMenu(true);
        ctx.attach(this._lbFilters);
        ctx.attach(this._lbRows);
        ctx.attach(this._lbCols);
        ctx.attach(this._lbVals);

        // create target indicator element
        this._dMarker = wijmo.createElement('<div class="wj-marker" style="display:none">&nbsp;</div>');
        this.hostElement.appendChild(this._dMarker);

        // handle defer update/update buttons
        this.addEventListener(this._btnUpdate, 'click', e => {
            this._ng.refresh(true);
            this.refresh();
            e.preventDefault();
        });
        this.addEventListener(this._chkDefer, 'click', e => {
            this.deferredUpdate = this._chkDefer.checked;
            this._updateDeferredUpdateElements();   // reflect current engine state (for nested PivotEngine.beginUpdate calls)
        });

        // create default engine
        this.engine = new PivotEngine();

        // apply options
        this.initialize(options);
    }
    _getProductInfo(): string {
        return 'D6F4,PivotPanel';
    }

    // ** object model

    /**
     * Gets or sets the {@link PivotEngine} being controlled by this {@link PivotPanel}.
     */
    get engine(): PivotEngine {
        return this._ng;
    }
    set engine(value: PivotEngine) {

        let ng = this._ng;
        let prevDeferredUpdate;

        // remove old handlers
        if (ng) {
            ng.itemsSourceChanged.removeHandler(this._itemsSourceChanged);
            ng.viewDefinitionChanged.removeHandler(this._viewDefinitionChanged);
            ng.updatingView.removeHandler(this._updatingView);
            ng.updatedView.removeHandler(this._updatedView);
            ng.error.removeHandler(this._requestError);
            ng._isUpdatingChanged.removeHandler(this._isUpdatingChangedBnd);
            prevDeferredUpdate = this.deferredUpdate;
        }

        // save the new value
        value = wijmo.asType(value, PivotEngine, false);
        ng = this._ng = value;

        // add new handlers
        ng.itemsSourceChanged.addHandler(this._itemsSourceChanged, this);
        ng.viewDefinitionChanged.addHandler(this._viewDefinitionChanged, this);
        ng.updatingView.addHandler(this._updatingView, this);
        ng.updatedView.addHandler(this._updatedView, this);
        ng.error.addHandler(this._requestError, this);
        ng._isUpdatingChanged.addHandler(this._isUpdatingChangedBnd);

        if (prevDeferredUpdate !== this.deferredUpdate) {
            this.onDeferredUpdateChanged();
        }

        // update grid data sources
        this._lbFields.itemsSource = value.fields;
        this._lbFilters.itemsSource = value.filterFields;
        this._lbRows.itemsSource = value.rowFields;
        this._lbCols.itemsSource = value.columnFields;
        this._lbVals.itemsSource = value.valueFields;

        // hide field clones in fields list
        this._lbFields.collectionView.filter = (item: PivotField): boolean => {
            return item.visible && item.parentField == null;
        }

        // hide invisible fields in all lists
        'Filters,Rows,Cols,Vals'.split(',').forEach(name => {
            this['_lb' + name].collectionView.filter = (item: PivotField): boolean => {
                return item.visible;
            }
        });

        this._updateDeferredUpdateElements();
    }
    /**
     * Gets or sets the array or {@link ICollectionView} that contains the raw data.
     */
    get itemsSource(): any {
        return this._ng.itemsSource;
    }
    set itemsSource(value: any) {
        if (value instanceof PivotEngine) {
            this.engine = value;
        } else {
            this._ng.itemsSource = value;
        }
    }
    /**
     * Gets the {@link ICollectionView} that contains the raw data.
     */
    get collectionView(): wijmo.collections.ICollectionView {
        return this._ng.collectionView;
    }
    /**
     * Gets the {@link ICollectionView} containing the output pivot view.
     */
    get pivotView(): wijmo.collections.ICollectionView {
        return this._ng.pivotView;
    }
    /**
     * Gets or sets a value that determines whether the engine should populate
     * the {@link fields} collection automatically based on the {@link itemsSource}.
     *
     * The default value for this property is **true**.
     */
    get autoGenerateFields(): boolean {
        return this.engine.autoGenerateFields;
    }
    set autoGenerateFields(value: boolean) {
        this._ng.autoGenerateFields = value;
    }
    /**
     * Gets the list of fields available for building views.
     */
    get fields(): PivotFieldCollection {
        return this._ng.fields;
    }
    /**
     * Gets the list of fields that define the rows in the output table.
     */
    get rowFields(): PivotFieldCollection {
        return this._ng.rowFields;
    }
    /**
     * Gets the list of fields that define the columns in the output table.
     */
    get columnFields(): PivotFieldCollection {
        return this._ng.columnFields;
    }
    /**
     * Gets the list of fields that define the values shown in the output table.
     */
    get valueFields(): PivotFieldCollection {
        return this._ng.valueFields;
    }
    /**
     * Gets the list of fields that define filters applied while generating the output table.
     */
    get filterFields(): PivotFieldCollection {
        return this._ng.filterFields;
    }
    /**
     * Gets or sets the current pivot view definition as a JSON string.
     *
     * This property is typically used to persist the current view as 
     * an application setting.
     *
     * For example, the code below implements two functions that save
     * and load view definitions using local storage:
     *
     * ```typescript
     * // save/load views
     * function saveView() {
     *   localStorage.viewDefinition = pivotPanel.viewDefinition;
     * }
     * function loadView() {
     *   pivotPanel.viewDefinition = localStorage.viewDefinition;
     * }
     * ```
     */
    get viewDefinition(): string {
        return this._ng.viewDefinition;
    }
    set viewDefinition(value: string) {
        this._ng.viewDefinition = value;
    }
    /**
     * Gets a value that determines whether a pivot view is currently defined.
     *
     * A pivot view is defined if the {@link valueFields} list is not empty and 
     * either the {@link rowFields} or {@link columnFields} lists are not empty.
     */
    get isViewDefined(): boolean {
        return this._ng.isViewDefined;
    }
    /**
     * Gets or sets a value that determines whether the main field list should 
     * include icons indicating whether fields are measure or dimension fields.
     * 
     * The default value for this property is **true**.
     */
    get showFieldIcons(): boolean {
        return this._showIcons;
    }
    set showFieldIcons(value: boolean) {
        if (value != this._showIcons) {
            this._showIcons = wijmo.asBoolean(value)
            this.invalidate();
        }
    }
    /**
     * Gets or sets a value that determines whether the panel should restrict
     * drag operations based on field types.
     * 
     * Setting this property to true prevents dragging dimension fields into
     * the value field list and measure fields into the row or column field
     * lists.
     * 
     * Setting this property to false allows all drag operations.
     * 
     * The default value for this property is **null**, which 
     * allows all drag operations on regular data sources and
     * restricts dragging on cube data sources.
     */
    get restrictDragging(): boolean | null {
        return this._restrictDrag;
    }
    set restrictDragging(value: boolean | null) {
        this._restrictDrag = wijmo.asBoolean(value, true);
    }

    /**
     * Gets or sets a value that determines whether engine is in deferred update state or not.
     */
    get deferredUpdate(): boolean {
        return this.engine.isUpdating;
    }
    set deferredUpdate(value: boolean) {
        if (this.deferredUpdate != value) {
            if (value) {
                this._ng.beginUpdate();
            } else {
                this._ng.endUpdate();
            }
        }
    }

    /**
     * Occurs after the value of the {@link deferredUpdate} property changes.
     */
    readonly deferredUpdateChanged = new wijmo.Event<PivotPanel, wijmo.EventArgs>();
    /**
     * Raises the {@link deferredUpdateChanged} event.
     */
    onDeferredUpdateChanged(e?: wijmo.EventArgs) {
        this.deferredUpdateChanged.raise(this, e);
    }
    /**
     * Occurs after the value of the {@link itemsSource} property changes.
     */
    readonly itemsSourceChanged = new wijmo.Event<PivotPanel, wijmo.EventArgs>();
    /**
     * Raises the {@link itemsSourceChanged} event.
     */
    onItemsSourceChanged(e?: wijmo.EventArgs) {
        this.itemsSourceChanged.raise(this, e);
    }
    /**
     * Occurs after the view definition changes.
     */
    readonly viewDefinitionChanged = new wijmo.Event<PivotPanel, wijmo.EventArgs>();
    /**
     * Raises the {@link viewDefinitionChanged} event.
     */
    onViewDefinitionChanged(e?: wijmo.EventArgs) {
        this.viewDefinitionChanged.raise(this, e);
    }
    /**
     * Occurs when the engine starts updating the {@link pivotView} list.
     */
    readonly updatingView = new wijmo.Event<PivotPanel, wijmo.EventArgs>();
    /**
     * Raises the {@link updatingView} event.
     * 
     * @param e {@link ProgressEventArgs} that provides the event data.
     */
    onUpdatingView(e: ProgressEventArgs) {
        this.updatingView.raise(this, e);
    }
    /**
     * Occurs after the engine has finished updating the {@link pivotView} list.
     */
    readonly updatedView = new wijmo.Event<PivotPanel, wijmo.EventArgs>();
    /**
     * Raises the {@link updatedView} event.
     */
    onUpdatedView(e?: wijmo.EventArgs) {
        this.updatedView.raise(this, e);
    }

    // ** overrides

    // refresh field lists and culture strings when refreshing the control
    refresh(fullUpdate = true) {
        if (this.hostElement) { // TFS 438146

            // refresh field lists
            ['Fields', 'Filters', 'Rows', 'Cols', 'Vals'].forEach(name => {
                let list = this['_lb' + name],
                    view = list ? list.collectionView : null;
                if (list && view) {
                    list.refresh();
                    view.refresh();
                }
            });

            // refresh culture strings
            if (fullUpdate) {
                this._globalize();
                this._ctxMenuShort.refresh();
                this._ctxMenuFull.refresh();
            }
        }

        // allow base class
        super.refresh(fullUpdate);
    }

    // ** implementation

    // method used in JSON-style initialization
    _copy(key: string, value: any): boolean {
        switch (key) {
            case 'engine':
                this.engine = value;
                return true;
        }
        return false;
    }

    // apply/refresh culture-specific strings
    _globalize() {
        let ci = wijmo.culture.olap.PivotPanel;
        wijmo.setText(this._gFlds, ci.fields);
        wijmo.setText(this._gDrag, ci.drag);
        wijmo.setText(this._gFlt, ci.filters);
        wijmo.setText(this._gCols, ci.cols);
        wijmo.setText(this._gRows, ci.rows);
        wijmo.setText(this._gVals, ci.vals);
        wijmo.setText(this._gDefer, ci.defer);
        wijmo.setText(this._btnUpdate, ci.update);
    }

    // handle and forward events raised by the engine
    _itemsSourceChanged(s: PivotEngine, e?: wijmo.EventArgs) {
        this.onItemsSourceChanged(e);
    }
    _viewDefinitionChanged(s: PivotEngine, e?: wijmo.EventArgs) {
        this.invalidate();
        this.onViewDefinitionChanged(e);
    }
    _updatingView(s: PivotEngine, e: ProgressEventArgs) {
        let pct = wijmo.clamp(e.progress, 5, 100) % 100; // start from 5, done at 100
        this._dProgress.style.width = pct + '%';
        this.onUpdatingView(e);
    }
    _updatedView(s: PivotEngine, e?: wijmo.EventArgs) {
        this.onUpdatedView(e);
    }
    _requestError(s: PivotEngine, e: wijmo.RequestErrorEventArgs) {
        this._dProgress.style.width = '0'; // hide progress bar on errors
    }
    _isUpdatingChanged() {
        this._updateDeferredUpdateElements();
        this.onDeferredUpdateChanged();
    }

    // update states of deferred update checkbox and button
    _updateDeferredUpdateElements() {
        const deferredUpdate = this.deferredUpdate;
        this._chkDefer.checked = deferredUpdate;
        wijmo.enable(this._btnUpdate, deferredUpdate);
    }

    // create a FlexGrid for showing olap fields (draggable)
    _createFieldGrid(host: HTMLElement): wijmo.grid.FlexGrid {

        // create the FlexGrid
        let grid = new wijmo.grid.FlexGrid(host, {
            autoGenerateColumns: false,
            childItemsPath: 'subFields',
            columns: [
                { binding: 'header', width: '*' }
            ],
            headersVisibility: 'None',
            selectionMode: 'Cell',
            alternatingRowStep: 0
        });

        // we don't need horizontal scrollbars
        let root = grid.cells.hostElement.parentElement;
        root.style.overflowX = 'hidden';

        // make items draggable, show active/filter/aggregate indicators
        grid.formatItem.addHandler((s, e: wijmo.grid.FormatItemEventArgs) => {

            // get data item
            let fld = s.rows[e.row].dataItem as PivotField;
            wijmo.assert(fld instanceof PivotField, 'PivotField expected...');

            // special formatting/dragging behavior for header fields
            let isHeader = fld._hasSubFields();
            wijmo.toggleClass(e.cell, 'wj-header', isHeader);
            e.cell.setAttribute('draggable', (!isHeader).toString());

            // customize content
            let html = e.cell.innerHTML;

            // show filter indicator
            if (fld.filter.isActive) {
                html += '&nbsp;&nbsp;<span class="wj-glyph-filter"></span>';
            }

            // show aggregate type in value field list
            if (s == this._lbVals) {
                // no localization here, the names are too long...
                //let aggs = wijmo.culture.olap.PivotFieldEditor.aggs,
                //    aggName = aggs[Object.keys(aggs)[fld.aggregate]];
                html += ' <span class="wj-aggregate">(' + wijmo.Aggregate[fld.aggregate] + ')</span>';
            }

            // add icons and checkboxes to items in the main field list
            if (s == this._lbFields && !isHeader) {

                // icon
                if (this._showIcons) {
                    let fldType = fld.isMeasure ? 'measure' : 'dimension';
                    html = '<span class="wj-glyph-' + fldType + '"></span> ' + html;
                }

                // checkbox
                html = '<label><input type="checkbox"' +
                    (fld.isActive ? ' checked' : '') +
                    '> ' + html + '</label>';
            }

            // update cell content
            e.cell.innerHTML = html;
        });

        // handle checkboxes
        grid.addEventListener(host, 'click', (e) => {
            let check = e.target;
            if (check instanceof HTMLInputElement && check.type == 'checkbox') {
                let fld = this._hitTestField(grid, e);
                if (fld instanceof PivotField) {
                    fld.isActive = check.checked;
                }
            }
        });

        // return the FlexGrid
        return grid;
    }

    // drag/drop event handlers
    _dragstart(e: DragEvent) {
        let target = this._getFlexGridTarget(e);
        if (target) {

            // select field under the mouse, save drag source
            this._dragField = this._hitTestField(target, e);
            this._dragSource = this._dragField instanceof PivotField
                ? target.hostElement
                : null;

            // start drag operation
            if (this._dragSource && e.dataTransfer) {
                wijmo._startDrag(e.dataTransfer, 'copyMove');
                e.stopPropagation();
            }
        }
    }
    _dragover(e: DragEvent) {

        // check whether the move is valid
        let valid = false;

        // get target location
        let target = this._getFlexGridTarget(e);
        if (target && this._dragField) {

            // dragging from main list to view (valid if the target does not contain the item)
            if (this._dragSource == this._dFields && target != this._lbFields) {

                // check that the target is not full
                let list = target.itemsSource;
                if (list.maxItems == null || list.length < list.maxItems) {

                    // check that the target does not contain the item (or is the values list)
                    let fld = this._dragField;
                    if (target.itemsSource.indexOf(fld) < 0) {
                        valid = true;
                    } else if (target == this._lbVals) {
                        valid = fld instanceof CubePivotField ? false : true;
                    }
                }
            }

            // dragging view to main list (to delete the field) or within view lists
            if (this._dragSource && this._dragSource != this._dFields) {
                valid = true;
            }
        }

        // prevent invalid moves
        if (valid && this._getRestrictDrag()) {
            if (this._dragSource != target.hostElement) {
                let isMeasure = this._dragField.isMeasure;
                if (target == this._lbVals) {
                    valid = isMeasure;
                } else if (target == this._lbRows || target == this._lbCols) {
                    valid = !isMeasure;
                }
            }
        }

        // update marker and drop effect
        if (valid) {
            this._updateDropMarker(target, e);
            e.dataTransfer.dropEffect = this._dragSource == this._dFields ? 'copy' : 'move';
            e.preventDefault();
            e.stopPropagation();
        } else {
            this._updateDropMarker();
        }
    }
    _drop(e: DragEvent) {

        // perform drop operation
        let target = this._getFlexGridTarget(e);
        if (target && this._dragField) {
            let source = wijmo.Control.getControl(this._dragSource) as wijmo.grid.FlexGrid,
                fld = this._dragField;

            // if dragging a duplicate from main list to value list, 
            // make a clone, add it do the main list, and continue as usual
            if (source == this._lbFields && target == this._lbVals) {
                if (target.itemsSource.indexOf(fld) > -1) {
                    fld = fld._clone();
                    this.engine.fields.push(fld);
                }
            }

            // if the target is the main list, remove from source
            // otherwise, add to or re-position field in target list
            if (target == this._lbFields) {
                fld.isActive = false;
            } else {
                this._ng.deferUpdate(() => {
                    let items = target.itemsSource as wijmo.collections.ObservableArray,
                        index = items.indexOf(fld);
                    if (index != this._dropIndex) {
                        if (index > -1) {
                            items.removeAt(index);
                            if (index < this._dropIndex) {
                                this._dropIndex--;
                            }
                        }
                        items.insert(this._dropIndex, fld);
                    }
                });
            }
        }

        // always reset the mouse state when done
        this._resetMouseState();
    }
    _dragend(e: DragEvent) {
        this._resetMouseState();
    }

    // select and return the field at the given mouse position
    _hitTestField(grid: wijmo.grid.FlexGrid, e: MouseEvent): PivotField {

        // use hit-test on target element because IE sends wrong mouse
        // coordinates when clicking the label and not the checkbox (TFS 247212)
        let ht = grid.hitTest(e.target as HTMLElement);
        if (ht.panel == grid.cells && ht.range.isValid) {
            grid.select(ht.range, true);
            return grid.rows[ht.row].dataItem as PivotField;
        }
        return null;
    }

    // check field types when dragging?
    _getRestrictDrag(): boolean {
        let restrict = this._restrictDrag;
        if (restrict == null && this.fields.length) {
            restrict = this.fields[0] instanceof CubePivotField;
        }
        return restrict;
    }

    // reset the mouse state after a drag operation
    _resetMouseState() {
        this._dragSource = null;
        this._updateDropMarker();
    }

    // gets the FlexGrid that contains the target of a drag event
    _getFlexGridTarget(e: DragEvent): wijmo.grid.FlexGrid {
        let grid = wijmo.Control.getControl(wijmo.closest(e.target, '.wj-flexgrid')) as wijmo.grid.FlexGrid;
        return grid instanceof wijmo.grid.FlexGrid ? grid : null;
    }

    // show the drop marker
    _updateDropMarker(grid?: wijmo.grid.FlexGrid, e?: DragEvent) {

        // hide marker
        if (!e) {
            this._dMarker.style.display = 'none';
            return;
        }

        // get target rect and drop index
        let host = this.hostElement,
            rcHost = host.getBoundingClientRect(),
            rc: wijmo.Rect;
        if (!grid.rows.length) { // if grid is empty, drop at index 0
            rc = wijmo.Rect.fromBoundingRect(grid.hostElement.getBoundingClientRect());
            rc.top += 4;
            this._dropIndex = 0;
        } else { // drop at current position
            let ht = grid.hitTest(e),
                row = ht.row;
            if (row > -1) {

                // dropping before or after a row
                rc = grid.getCellBoundingRect(row, 0);
                if (e.clientY > host.scrollTop + rc.top + rc.height / 2) {
                    if (row < grid.rows.length) {
                        rc.top += rc.height;
                        row++;
                    }
                }
                this._dropIndex = row;

            } else { // dropping after the last row
                row = grid.viewRange.bottomRow;
                rc = grid.getCellBoundingRect(row, 0);
                rc.top += rc.height;
                this._dropIndex = row + 1;
            }
        }

        // show the drop marker
        wijmo.setCss(this._dMarker, {
            left: Math.round(rc.left - rcHost.left) + host.scrollLeft, // TFS 246101
            top: Math.round(rc.top - rcHost.top - 2) + host.scrollTop, // TFS 246101
            width: Math.round(rc.width),
            height: 4,
            display: ''
        });
    }
}

    }
    


    module wijmo.olap {
    











'use strict';

/**
 * Extends the {@link FlexGrid} control to display pivot tables.
 *
 * To use this control, set its {@link itemsSource} property to an instance of a 
 * {@link PivotPanel} control or to a {@link PivotEngine}.
 */
export class PivotGrid extends wijmo.grid.FlexGrid {
    private _ng: PivotEngine;
    private _htDown: wijmo.grid.HitTestInfo;
    private _showDetailOnDoubleClick = true;
    private _collapsibleSubtotals = true;
    private _customCtxMenu = true;
    private _ctxMenu = new _GridContextMenu();
    private _showRowFldSort = false;
    private _showRowFldHdrs = true;
    private _showColFldHdrs = true;
    private _showValFldHdrs = false;
    private _centerVert = true;
    private _collapsedKeys: any = {};
    private _resizingColumn = false;
    private _dlgDetail: DetailDialog;
    private _outlineMode = false;
    private _ignoreClick = false;
    /*private*/ _colRowFields = new Map<wijmo.grid.Column, PivotField>();

    // previous culture name to update fixed content on dynamically changed culture (WJM-19988)
    private _prevCulture = wijmo.culture.Globalize.name;

    static _WJC_COLLAPSE = 'wj-pivot-collapse';

    /**
     * Initializes a new instance of the {@link PivotGrid} class.
     *
     * @param element The DOM element that will host the control, or a CSS selector for the host element (e.g. '#theCtrl').
     * @param options JavaScript object containing initialization data for the control.
     */
    constructor(element: any, options?: any) {
        super(element);

        // suppress ambiguity for header columns defaultSize during period from initialization to first rendering
        this._hdrCols._setDefaultSize(this._cols.defaultSize);

        // add class name to enable styling
        wijmo.addClass(this.hostElement, 'wj-pivotgrid');

        // change some defaults
        this.isReadOnly = true;
        this.copyHeaders = wijmo.grid.HeadersVisibility.All;
        this.deferResizing = true;
        this.alternatingRowStep = 0;
        this.autoGenerateColumns = false;
        this.allowDragging = wijmo.grid.AllowDragging.None;
        this.allowMerging = wijmo.grid.AllowMerging.All;
        this.mergeManager = new _PivotMergeManager();
        this.customContextMenu = true;
        this.treeIndent = 32;

        // apply options
        this.initialize(options);

        // customize cell rendering
        this.formatItem.addHandler(this._formatItem, this);

        // customize mouse/keyboard handling
        var host = this.hostElement;
        this.addEventListener(host, 'mousedown', this._mousedown.bind(this), true);
        this.addEventListener(host, 'mouseup', this._mouseup.bind(this), true);
        this.addEventListener(host, 'dblclick', this._dblclick.bind(this), true);
        this.addEventListener(host, 'click', this._click.bind(this), true);
        this.addEventListener(host, 'keydown', this._keydown.bind(this), true);

        // custom context menu
        this._ctxMenu.attach(this);
    }
    _getProductInfo(): string {
        return 'D6F4,PivotGrid';
    }

    /**
     * Gets a reference to the {@link PivotEngine} that owns this {@link PivotGrid}.
     */
    get engine(): PivotEngine {
        return this._ng;
    }
    /**
     * Gets or sets a value that determines whether the grid should show a popup 
     * containing the detail records when the user double-clicks a cell.
     *
     * The default value for this property is **true**.
     */
    get showDetailOnDoubleClick(): boolean {
        return this._showDetailOnDoubleClick;
    }
    set showDetailOnDoubleClick(value: boolean) {
        this._showDetailOnDoubleClick = wijmo.asBoolean(value);
    }
    /**
     * Gets a reference to the {@link DetailDialog} used to display the detail records
     * when the user double-clicks a cell.
     *
     * This property can be used to customize the content of the {@link DetailDialog}.
     * 
     * It can also be used to customize properties of the dialog, which is a {@link Popup}
     * control. For example, this code disables the default animations used when
     * showing and hiding the detail dialog:
     * 
     * ```typscript
     * let dlg = thePivotGrid.detailDialog;
     * dlg.fadeIn = false;
     * dlg.fadeOut = false;
     * ```
     *
     * See also the {@link showDetailOnDoubleClick} property and the {@link showDetail}
     * method.
     */
    get detailDialog(): DetailDialog {
        if (!this._dlgDetail) {
            this._dlgDetail = new DetailDialog(document.createElement('div'));
        }
        return this._dlgDetail;
    }
    /**
     * Gets or sets a value that determines whether the grid should
     * display row field headers in its top-left panel.
     *
     * The default value for this property is **true**.
     */
    get showRowFieldHeaders(): boolean {
        return this._showRowFldHdrs;
    }
    set showRowFieldHeaders(value: boolean) {
        if (value != this._showRowFldHdrs) {
            this._showRowFldHdrs = wijmo.asBoolean(value);
            this._updateFixedContent(); // TFS 257954
        }
    }
    /**
     * Gets or sets a value that determines whether the grid should
     * display column field headers in its top-left panel.
     *
     * The default value for this property is **true**.
     */
    get showColumnFieldHeaders(): boolean {
        return this._showColFldHdrs;
    }
    set showColumnFieldHeaders(value: boolean) {
        if (value != this._showColFldHdrs) {
            this._showColFldHdrs = wijmo.asBoolean(value);
            this._updateFixedContent(); // TFS 257954
        }
    }
    /**
     * Gets or sets a value that determines whether the grid should
     * display value field headers in its content panel even when
     * the view has a single value field and a single column field.
     *
     * The default value for this property is **false**.
     */
    get showValueFieldHeaders(): boolean {
        return this._showValFldHdrs;
    }
    set showValueFieldHeaders(value: boolean) {
        if (value != this._showValFldHdrs) {
            this._showValFldHdrs = wijmo.asBoolean(value);
            this._updateFixedCounts();
            this._updateFixedContent();
        }
    }
    /**
     * Gets or sets a value that determines whether the grid should display 
     * sort indicators in the column headers for row fields.
     *
     * Unlike regular column headers, row fields are always sorted, either
     * in ascending or descending order. If you set this property to true,
     * sort icons will always be displayed over any row field headers.
     *
     * The default value for this property is **false**.
     */
    get showRowFieldSort(): boolean {
        return this._showRowFldSort;
    }
    set showRowFieldSort(value: boolean) {
        if (value != this._showRowFldSort) {
            this._showRowFldSort = wijmo.asBoolean(value);
            this._updateFixedContent(); // TFS 257954
        }
    }
    /**
     * Gets or sets a value that determines whether the grid should provide a
     * custom context menu.
     *
     * The custom context menu includes commands for changing field settings, 
     * removing fields, or showing detail records for the grid cells.
     *
     * The default value for this property is **true**.
     */
    get customContextMenu(): boolean {
        return this._customCtxMenu;
    }
    set customContextMenu(value: boolean) {
        this._customCtxMenu = wijmo.asBoolean(value);
    }
    /**
     * Gets or sets a value that determines whether the grid should allow
     * users to collapse and expand subtotal groups of rows and columns.
     *
     * The default value for this property is **true**.
     */
    get collapsibleSubtotals(): boolean {
        return this._collapsibleSubtotals;
    }
    set collapsibleSubtotals(value: boolean) {
        if (value != this._collapsibleSubtotals) {
            this._collapsibleSubtotals = wijmo.asBoolean(value);
            this.invalidate();
        }
    }
    /**
     * Gets or sets a value that determines whether the content of
     * header cells should be vertically centered.
     *
     * The default value for this property is **true**.
     */
    get centerHeadersVertically(): boolean {
        return this._centerVert;
    }
    set centerHeadersVertically(value: boolean) {
        if (value != this._centerVert) {
            this._centerVert = wijmo.asBoolean(value);
            this.invalidate();
        }
    }
    /**
     * Gets or sets a value that determines whether the grid should display
     * row groups in outline format, allowing for more compact displays.
     * 
     * The default value for this property is **false**.
     * 
     * In most applications, outline mode works best when rows have
     * subtotals shown before the data, so if you set {@link outlineMode}
     * to true it makes sense to set the pivotEngine's {@link showRowTotals}
     * property to **ShowTotals.Subtotals** and the {@link totalsBeforeData} 
     * property to **true**.
     * 
     * For example:
     *
     * ```typescript
     * import { PivotEngine, ShowTotals} from '@grapecity/wijmo.olap';
     * let theEngine = new PivotEngine({
     *     showRowTotals: ShowTotals.Subtotals,
     *     totalsBeforeData: true,
     *     itemsSource: getData()
     * });
     * let theGrid = new PivotGrid('#theGrid', {
     *     itemsSource: theEngine,
     *     outlineMode: true
     * });
     * ```
     */
    get outlineMode(): boolean {
        return this._outlineMode;
    }
    set outlineMode(value: boolean) {
        if (value != this._outlineMode) {
            this._outlineMode = wijmo.asBoolean(value);
            this._bindGrid(true);
            //this.invalidate();
        }
    }
    /**
     * Gets an object with information about the fields and values
     * being used to summarize a given cell.
     *
     * For more details, see the @PivotEngine.getKeys method.
     *
     * @param row Index of the row that contains the cell.
     * @param col Index of the column that contains the cell.
     */
    getKeys(row: number, col: number): any {
        let r = this.rows[wijmo.asInt(row)] as wijmo.grid.Row,
            c = this.columns[wijmo.asInt(col)] as wijmo.grid.Column,
            item = r ? r.dataItem : null,
            binding = c ? c.binding : null;
        return this._ng.getKeys(item, binding);
    }
    /**
     * Gets an array containing the records summarized by a given grid cell.
     * 
     * @param row Index of the row that contains the cell.
     * @param col Index of the column that contains the cell.
     */
    getDetail(row: number, col: number): any[] {
        let item = this.rows[wijmo.asInt(row)].dataItem,
            binding = this.columns[wijmo.asInt(col)].binding;
        return this._ng.getDetail(item, binding);
    }
    /**
     * Gets an {@link wijmo.ICollectionView} containing the records
     * summarized by a given grid cell.
     * 
     * @param row Index of the row that contains the cell.
     * @param col Index of the column that contains the cell.
     */
    getDetailView(row: number, col: number): wijmo.collections.ICollectionView {
        let item = this.rows[wijmo.asInt(row)].dataItem,
            binding = this.columns[wijmo.asInt(col)].binding;
        return this._ng.getDetailView(item, binding);
    }
    /**
     * Shows a dialog containing details for a given grid cell.
     * 
     * @param row Index of the row that contains the cell.
     * @param col Index of the column that contains the cell.
     */
    showDetail(row: number, col: number) {
        if (this._ng.valueFields.length) {
            let dd = this.detailDialog;
            dd.showDetail(this, new wijmo.grid.CellRange(row, col));
            dd.show(true);
        }
    }
    /**
     * Collapses all rows to a given level.
     *
     * @param level Maximum row level to show. Zero means show only
     * grand totals; one means show only top-level groups; very high
     * levels expand all rows.
     */
    collapseRowsToLevel(level: number) {
        this._collapseRowsToLevel(level);
    }
    /**
     * Collapses all columns to a given level.
     *
     * @param level Maximum column level to show. Zero means show only
     * grand totals; one means show only top-level groups; very high
     * levels expand all columns.
     */
    collapseColumnsToLevel(level: number) {
        this._collapseColsToLevel(level);
    }

    // ** overrides

    // use quick auto size if there aren't any external item formatters
    _getQuickAutoSize() {
        return wijmo.isBoolean(this.quickAutoSize)
            ? this.quickAutoSize
            : this.formatItem.handlerCount <= 1 && this.itemFormatter == null;
    }

    // overridden to preserve outline state
    _bindGrid(full: boolean) {
        this.deferUpdate(() => { // no flicker...
            let preserveState = this.preserveOutlineState,
                collapsed = this._collapsedKeys,
                rows = this.rows,
                cols = this.columns;

            // if not preserving collapsed state, clear it!
            if (!preserveState) {
                collapsed = this._collapsedKeys = {};
            }

            // bind the grid
            super._bindGrid(full);

            // restore collapsed state
            if (this._ng && preserveState && !wijmo.isEmpty(collapsed)) {
                let tbd = this._ng.totalsBeforeData,
                    start = tbd ? rows.length - 1 : 0,
                    end = tbd ? -1 : rows.length,
                    step = tbd ? -1 : +1;
                for (let i = start; i != end; i += step) {
                    let item = rows[i].dataItem,
                        key = item ? item[_PivotKey._ROW_KEY_NAME] as _PivotKey : null;
                    if (key && key.level > 0 && collapsed[key.toString()]) {
                        this._setRowCollapsed(new wijmo.grid.CellRange(i, key.level - 1), true);
                    }
                }
                start = tbd ? cols.length - 1 : 0;
                end = tbd ? -1 : cols.length;
                step = tbd ? -1 : +1;
                for (let i = start; i != end; i += step) {
                    let binding = cols[i].binding,
                        key = this._ng._getKey(binding);
                    if (key && key.level > 0 && collapsed[key.toString()]) {
                        this._setColCollapsed(new wijmo.grid.CellRange(key.level - 1, i), true);
                    }
                }
            }
        });
    }

    // overridden to accept PivotPanel and PivotEngine as well as ICollectionView sources
    protected _getCollectionView(value: any): wijmo.collections.ICollectionView {
        if (value instanceof PivotPanel) {
            value = (value as PivotPanel).engine.pivotView;
        } else if (value instanceof PivotEngine) {
            value = (value as PivotEngine).pivotView;
        }
        return wijmo.asCollectionView(value);
    }

    // refresh menu items in case culture changed
    refresh(fullUpdate = true) {
        this._ctxMenu.refresh();
        const currentCulture = wijmo.culture.Globalize.name
        if (this._prevCulture !== currentCulture) {
            this._prevCulture = currentCulture;
            this._updateFixedContent();
        }
        super.refresh(fullUpdate);
    }

    // overridden to connect to PivotEngine events
    onItemsSourceChanged(e?: wijmo.EventArgs) {

        // disconnect old engine
        if (this._ng) {
            this._ng.updatingView.removeHandler(this._updatingView, this);
            this._ng.viewDefinitionChanged.removeHandler(this._viewDefinitionChanged, this);
        }

        // discard outline state
        this._collapsedKeys = {};

        // get new engine
        let view = this.collectionView;
        this._ng = view instanceof PivotCollectionView
            ? (view as PivotCollectionView).engine
            : null;

        // connect new engine
        if (this._ng) {
            this._ng.updatingView.addHandler(this._updatingView, this);
            this._ng.viewDefinitionChanged.addHandler(this._viewDefinitionChanged, this);
        }
        this._updatingView(); // TFS 340084
        this._bindGrid(true);

        // fire event as usual
        super.onItemsSourceChanged(e);
    }

    // overridden to save column widths into view definition
    onResizedColumn(e: wijmo.grid.CellRangeEventArgs) {
        let ng = this._ng;
        if (ng) {

            this._resizingColumn = true;

            // resized fixed column
            if (e.panel.columns == this.rowHeaders.columns) {
                let fld = this._colRowFields.get(e.getColumn()); // TFS 469842
                if (fld instanceof PivotField) {
                    fld.width = e.panel.columns[e.col].renderWidth;
                }
            }

            // resized scrollable column
            if (e.panel.columns == this.columnHeaders.columns) {
                let vf = ng.valueFields;
                if (vf.length > 0) {
                    let fld = vf[e.col % vf.length] as PivotField;
                    fld.width = e.panel.columns[e.col].renderWidth;
                }
            }

            this._resizingColumn = false;
        }

        // raise the event
        super.onResizedColumn(e);
    }

    // overridden to prevent sorting while updating (TFS 320362)
    onSortingColumn(e: wijmo.grid.CellRangeEventArgs): boolean {
        let ng = this._ng;
        return ng && ng.isUpdating ? false : super.onSortingColumn(e);
    }

    // overridden to prevent dragging while updating (TFS 320362)
    onDraggingColumn(e: wijmo.grid.CellRangeEventArgs): boolean {
        let ng = this._ng;
        return ng && ng.isUpdating ? false : super.onDraggingColumn(e);
    }

    // overridden to re-order row fields after dragging
    onDraggedColumn(e: wijmo.grid.CellRangeEventArgs) {
        let ng = this._ng;
        if (ng) {
            if (e.panel.columns == this.topLeftCells.columns) {
                let rowFields = ng.rowFields as wijmo.collections.ObservableArray,
                    fld = rowFields[e.data.col];
                ng.deferUpdate(() => {
                    rowFields.removeAt(e.data.col);
                    rowFields.insert(e.col, fld);
                });
            }
        }
        super.onDraggedColumn(e);
    }

    // ** implementation

    // reset the grid layout/bindings when the pivot view starts updating
    _updatingView() {

        // update fixed row/column counts
        this._updateFixedCounts();

        // clear scrollable rows/columns
        this.columns.clear();
        this.rows.clear();
    }

    // clear collapsed state when the view definition changes
    _viewDefinitionChanged() {
        if (!this._resizingColumn) { // TFS 396541
            this._collapsedKeys = {};
        }
    }

    // update fixed cell content after loading rows
    onLoadedRows(e?: wijmo.EventArgs) {
        // generate columns and headers if necessary
        if (this.columns.length == 0) {
            this._generateColumns();
        }

        // update row/column headers
        this._updateFixedCounts(); // TFS 469842
        this._updateFixedContent();

        // fire event as usual
        super.onLoadedRows(e);
    }

    // generate columns of appropriate type
    private _generateColumns() {
        let view = this.collectionView,
            arr = view ? view.sourceCollection : null,
            arrLength = arr && arr.length;
        if (arrLength) {
            // keys for which columns should be generated
            const colKeys = Object.keys(arr[0]).filter(key => key != _PivotKey._ROW_KEY_NAME);

            // find column data types
            const dataTypesByKey = {};
            const nonHandledKeys = [ ...colKeys ] // copy array
            for (let i = 0; i < arrLength; i++) {
                const item = arr[i];
                for (let j = nonHandledKeys.length - 1; j >= 0; j--) {  // reverse order to simplify array element deletion handling
                    const key = nonHandledKeys[j];
                    const value = item[key];
                    if ((value !== undefined) && (value !== null)) {    // it's slightly faster than (value != null)
                        dataTypesByKey[key] = wijmo.getType(value);
                        nonHandledKeys.splice(j, 1);
                    }
                }
                if (!nonHandledKeys.length) {
                    break;
                }
            }

            // create columns
            colKeys.forEach(key => {
                this.columns.push(new wijmo.grid.Column({
                    binding: key,
                    dataType: dataTypesByKey[key] != null ? dataTypesByKey[key] : wijmo.DataType.Number,
                    allowMerging: true,
                }))
            });
        }
    }

    // update the number of fixed rows and columns
    _updateFixedCounts() {
        let ng = this._ng,
            hasView = ng && ng.isViewDefined,
            cnt: number;

        // fixed columns
        cnt = Math.max(1, hasView ? ng.rowFields.length : 1);
        let cols = this.topLeftCells.columns;
        cols.clear();
        this._colRowFields.clear();
        for (let i = 0; i < cnt; i++) {
            let col = new wijmo.grid.Column({
                allowMerging: true
            });
            cols.push(col);
            if (hasView) {
                this._colRowFields.set(col, ng.rowFields[i]);
            }
        }

        // fixed rows
        cnt = Math.max(1, hasView ? ng.columnFields.length : 1);
        if (ng && ng.columnFields.length) {
            if (ng.valueFields.length > 1 || this.showValueFieldHeaders) {
                cnt++;
            }
        }
        let rows = this.topLeftCells.rows;
        rows.clear();
        for (let i = 0; i < cnt; i++) {
            rows.push(new wijmo.grid.Row());
        }
    }

    // update the content of the fixed cells
    _updateFixedContent() {
        let ng = this._ng;

        // if no view, clear top-left (single) cell and be done
        if (!ng || !ng.isViewDefined) {
            this.topLeftCells.setCellData(0, 0, null);
            return;
        }

        // get field collections
        let rf = ng.rowFields,
            cf = ng.columnFields,
            vf = ng.valueFields;

        // build outline header with row field headers
        let outlineHeader = this.outlineMode
            ? rf.map(fld => { return fld.header }).join(' / ')
            : '';

        // populate top-left cells
        let p = this.topLeftCells;
        for (let r = 0; r < p.rows.length; r++) {
            for (let c = 0; c < p.columns.length; c++) {
                let value = '';

                // row field headers
                if (this.showRowFieldHeaders) {
                    if (c < rf.length && r == p.rows.length - 1) {
                        value = this.outlineMode
                            ? outlineHeader
                            : rf[c].header;
                    }
                }

                // column field headers
                if (this.showColumnFieldHeaders) {
                    if (!value && r < cf.length && c == 0) {
                        value = cf[r].header + ':';
                    }
                }

                // set it
                p.setCellData(r, c, value, false, false);
            }
        }

        // populate row headers
        p = this.rowHeaders;
        for (let r = 0; r < p.rows.length; r++) {
            let key = p.rows[r].dataItem[_PivotKey._ROW_KEY_NAME] as _PivotKey;
            wijmo.assert(key instanceof _PivotKey, 'missing PivotKey for row...');
            for (let c = 0; c < p.columns.length; c++) {
                let value = key.getValue(c, true) as string;
                p.setCellData(r, c, value, false, false);
            }
        }

        // populate column headers
        p = this.columnHeaders;
        for (let c = 0; c < p.columns.length; c++) {
            let key = ng._getKey(p.columns[c].binding);
            wijmo.assert(key instanceof _PivotKey, 'missing PivotKey for column...');
            for (let r = 0; r < p.rows.length; r++) {

                // get cell data (field value or 'subtotal')
                let value = key.getValue(r, true) as string;

                // replace row subtotal label with value field header 
                // pretty nasty, many possible situations... (TFS 145673)
                if (r == p.rows.length - 1 && vf.length) {
                    if (vf.length > 1 || cf.length == 0 || key.level > -1 || this.showValueFieldHeaders) {
                        value = vf[c % vf.length].header as string;
                    }
                }

                // set cell data
                p.setCellData(r, c, value, false, false);
            }
        }

        // set column widths
        p = this.topLeftCells;
        for (let c = 0; c < p.columns.length; c++) {
            let col = p.columns[c] as wijmo.grid.Column,
                fld = (c < rf.length ? rf[c] : null) as PivotField;
            col.wordWrap = fld ? fld.wordWrap : null;
            col.align = fld ? fld.align : null;
            if (this.outlineMode && c < p.columns.length - 1) { // outline columns
                col.width = this.treeIndent; // narrow
                col.allowResizing = false; // and non-resizable
            } else { // regular column, use field width
                col.allowResizing = true; // TFS 393160
                col.width = (fld && wijmo.isNumber(fld.width)) ? fld.width : null;
            }
        }
        p = this.cells;
        for (let c = 0; c < p.columns.length; c++) {
            let col = p.columns[c] as wijmo.grid.Column,
                fld = (vf.length ? vf[c % vf.length] : null) as PivotField;
            col.width = (fld && wijmo.isNumber(fld.width)) ? fld.width : null;
            col.wordWrap = fld ? fld.wordWrap : null;
            col.format = fld ? fld.format : null;
            col.align = fld ? fld.align : null;
        }

        // and invalidate the grid (TFS 466793)
        this.invalidate();
    }

    protected _updateDefaultSizes(): number {
        const defRowHei = super._updateDefaultSizes();
        this._hdrCols._setDefaultSize(defRowHei * 4);
        return defRowHei;
    }

    // customize the grid display
    _formatItem(s, e: wijmo.grid.FormatItemEventArgs) {
        let ng = this._ng,
            panel = e.panel,
            cell = e.cell;

        // make sure we're connected
        if (!ng) {
            return;
        }

        // let CSS align the top-left panel
        if (panel == this.topLeftCells) {
            let isColHdr = ng.rowFields.length == 0 ||
                e.row < panel.rows.length - 1 ||
                (e.row == panel.rows.length - 1 && !this.showRowFieldHeaders);
            wijmo.toggleClass(cell, 'wj-col-field-hdr', isColHdr);
            wijmo.toggleClass(cell, 'wj-row-field-hdr', !isColHdr);
        }

        // allow dragging row fields only
        let draggable = null;
        if (panel == this.topLeftCells) {
            if (e.row == panel.rows.length - 1) {
                if (this.allowDragging & wijmo.grid.AllowDragging.Columns) {
                    draggable = true;
                }
            }
        }
        wijmo.setAttribute(cell, 'draggable', draggable);
        
        // honor isContentHtml (before any other changes to the content, TFS 328746)
        let fld: PivotField;
        switch (panel) {
            case this.rowHeaders:
                fld = ng.rowFields[e.col % ng.rowFields.length];
                break;
            case this.columnHeaders:
                fld = ng.columnFields[e.row];
                break;
            case this.cells:
                fld = ng.valueFields[e.col];
                break;
        }
        if (fld && fld.isContentHtml) {
            cell.innerHTML = cell.textContent;
        }

        // apply wj-group class name to total rows and columns (TFS 355176)
        let binding = panel.columns[e.col].binding,
            rowLevel = panel.rows == this.rows ? ng._getRowLevel(e.row) : -1,
            colLevel = panel.columns == this.columns ? ng._getColLevel(binding) : -1;
        wijmo.toggleClass(cell, 'wj-aggregate', rowLevel > -1 || colLevel > -1);

        // add collapse/expand icons
        if (this._collapsibleSubtotals) {

            // collapsible row
            if (panel == this.rowHeaders && ng._getShowRowTotals() == ShowTotals.Subtotals) {
                if (this.outlineMode) {
                    let rng = this._getGroupedRows(e.range); // does not include header row
                    if (e.col < ng.rowFields.length - 1) { // && rng.rowSpan > 1) {
                        let showGlyph = !rng.containsRow(e.row);
                        if (showGlyph) {
                            let collapsed = this._getRowCollapsed(e.range);
                            cell.innerHTML = this._getCollapsedGlyph(collapsed) + cell.innerHTML;
                        }
                    }
                } else {
                    let rng = this.getMergedRange(panel, e.row, e.col, false) || e.range;
                    if (e.col < ng.rowFields.length - 1 && rng.rowSpan > 1) {
                        let collapsed = this._getRowCollapsed(rng);
                        cell.innerHTML = this._getCollapsedGlyph(collapsed) + cell.innerHTML;
                    }
                }
            }

            // hide redundant outline items
            if (this.outlineMode && panel == this.rowHeaders) {
                if (e.range.rightCol < panel.columns.length - 1) {
                    cell.innerHTML = '';
                }
            }

            // collapsible column
            if (panel == this.columnHeaders && ng._getShowColTotals() == ShowTotals.Subtotals) {
                let rng = this.getMergedRange(panel, e.row, e.col, false) || e.range;
                if (e.row < ng.columnFields.length - 1 && rng.columnSpan > 1) {
                    let isCollapsed = this._getColCollapsed(rng);
                    cell.innerHTML = this._getCollapsedGlyph(isCollapsed) + cell.innerHTML;
                }
            }
        }

        // show sort icons on row field headers
        if (panel == this.topLeftCells && this.showRowFieldSort &&
            e.col < ng.rowFields.length && e.row == this._getSortRowIndex()) {
            fld = ng.rowFields[e.col];
            wijmo.toggleClass(cell, 'wj-sort-asc', !fld.descending);
            wijmo.toggleClass(cell, 'wj-sort-desc', fld.descending);
            cell.innerHTML += ' <span class="wj-glyph-' + (fld.descending ? 'down' : 'up') + '"></span>';
        }

        // center-align header cells vertically (TFS 399113)
        if (panel != this.cells) { // header cell
            wijmo.toggleClass(cell, 'wj-align-vcenter', this._centerVert);
        }
    }
    _getCollapsedGlyph(collapsed: boolean): string {
        return '<div class="' + PivotGrid._WJC_COLLAPSE + '">' +
            '<span class="wj-glyph-' + (collapsed ? 'plus' : 'minus') + '"></span>' +
            '</div>';
    }

    // mouse handling
    _mousedown(e: MouseEvent) {

        // make sure we want this event
        if (e.defaultPrevented || e.button != 0) {
            this._htDown = null;
            return;
        }

        // save mouse down position to use later on mouse up
        this._htDown = this.hitTest(e);
        this._ignoreClick = false;

        // collapse/expand on mousedown
        let icon = wijmo.closestClass(e.target, PivotGrid._WJC_COLLAPSE);
        if (icon != null && this._htDown.panel != null) {
            let rng = this._htDown.range,
                collapsed: boolean;
            switch (this._htDown.panel.cellType) {
                case wijmo.grid.CellType.RowHeader:
                    collapsed = this._getRowCollapsed(rng);
                    if (e.shiftKey || e.ctrlKey) {
                        this._collapseRowsToLevel(rng.col + (collapsed ? 2 : 1));
                    } else {
                        this._setRowCollapsed(rng, !collapsed);
                    }
                    break;
                case wijmo.grid.CellType.ColumnHeader:
                    collapsed = this._getColCollapsed(rng);
                    if (e.shiftKey || e.ctrlKey) {
                        this._collapseColsToLevel(rng.row + (collapsed ? 2 : 1));
                    } else {
                        this._setColCollapsed(rng, !collapsed);
                    }
                    break;
            }
            e.preventDefault();
            this._ignoreClick = true;
            this._htDown = null;
            this.focus(); // close context menus (TFS 402641)
        }
    }
    _mouseup(e: MouseEvent) {

        // make sure we want this event
        if (!this._htDown || e.defaultPrevented) {
            return;
        }

        // make sure we're not resizing (TFS 396718)
        if (this._mouseHdl._szRowCol) {
            return;
        }

        // make sure this is the same cell where the mouse was pressed
        let ht = this.hitTest(e);
        if (this._htDown.panel != ht.panel || !ht.range.equals(this._htDown.range)) {
            return;
        }

        // toggle sort direction when user clicks the row field headers
        let ng = this._ng,
            topLeft = this.topLeftCells;
        if (ht.panel == topLeft && ht.row == topLeft.rows.length - 1 && ht.col > -1) {
            let col = ht.getColumn();
            if (this.allowSorting && col.allowSorting) {
                let fld = this._colRowFields.get(col) as PivotField; // TFS 469842
                if (fld && !ng.isUpdating) { // TFS 145269, 320362
                    let args = new wijmo.grid.CellRangeEventArgs(ht.panel, ht.range);
                    if (this.onSortingColumn(args)) {
                        ng.pivotView.sortDescriptions.clear();
                        fld.descending = !fld.descending;
                        this.onSortedColumn(args)
                    }
                }
            }
            e.preventDefault();
            this._ignoreClick = true;
        }
    }
    _click(e: MouseEvent) { // TFS 436656
        if (this._ignoreClick) {
            e.preventDefault();
        }
    }
    _dblclick(e: MouseEvent) {

        // check that we want this event
        if (!e.defaultPrevented && this._showDetailOnDoubleClick) {
            let ht = this._htDown;
            if (ht && ht.panel == this.cells) {

                // check that we have an engine and it's not a cube
                let ng = this._ng;
                if (ng && ng.fields.length > 0) {
                    if (!(ng.fields[0] instanceof CubePivotField)) {

                        // go show the detail
                        this.showDetail(ht.row, ht.col);
                    }
                }
            }
        }
    }
    _keydown(e: KeyboardEvent) {

        // check that we want this event
        if (!e.defaultPrevented && !e.ctrlKey && e.altKey && this.collapsibleSubtotals) {
            let sel = this.selection;
            if (sel.isValid) {

                // calculate outline level
                let level = this._getRowLevel(sel.topRow);
                if (level < 0) {
                    level = this.rowHeaders.columns.length - 1;
                }

                // alt-left collapses, alt-right expands the current row
                let keyCode = this._getKeyCode(e);
                switch (keyCode) {
                    case wijmo.Key.Left:
                    case wijmo.Key.Right:
                        let rng = new wijmo.grid.CellRange(sel.row, level - 1);
                        this._setRowCollapsed(rng, keyCode == wijmo.Key.Left);
                        e.preventDefault();
                        break;
                }
            }
        }
    }

    // ** row groups
    _getRowLevel(row: number): number {
        return this._ng._getRowLevel(row);
    }
    _getGroupedRows(rng: wijmo.grid.CellRange): wijmo.grid.CellRange {
        let getLevel = this._getRowLevel.bind(this),
            level = rng.col + 1,
            len = this.rows.length,
            tbd = this._ng.totalsBeforeData,
            start = rng.row,
            end: number;
        
        if (getLevel(start) == 0) { // grand totals
            start = tbd ? 1 : 0;
            end = tbd ? len - 1 : len - 2;
        } else { // regular groups
        
            // move start past totals (TFS 378104)
            if (tbd) {
                for (; start < len; start++) { 
                    if (getLevel(start) < 0) break;
                }
            } else {
                for (; start >= 0; start--) {
                    if (getLevel(start) < 0) break;
                }
            }

            // expand range
            for (; start > 0; start--) {
                let lvl = getLevel(start - 1);
                if (lvl >= 0 && lvl <= level) break;
            }
            for (end = start; end < len - 1; end++) {
                let lvl = getLevel(end + 1);
                if (lvl >= 0 && lvl <= level) break;
            }
        }

        // done
        wijmo.assert(end >= start, 'group end < start?');
        return end >= start // TFS 190950
            ? new wijmo.grid.CellRange(start, rng.col, end, rng.col2)
            : rng;
    }
    _toggleRowCollapsed(rng: wijmo.grid.CellRange) {
        this._setRowCollapsed(rng, !this._getRowCollapsed(rng));
    }
    _getRowCollapsed(rng: wijmo.grid.CellRange): boolean {
        rng = this._getGroupedRows(rng);
        let ng = this._ng,
            totIndex = ng.totalsBeforeData ? rng.row - 1 : rng.row2 + 1,
            totRow = this.rows[totIndex] || this.rows[rng.row],
            key = totRow ? totRow.dataItem[_PivotKey._ROW_KEY_NAME] : null;
        return key ? this._collapsedKeys[key.toString()] : false;
    }
    _setRowCollapsed(rng: wijmo.grid.CellRange, collapse: boolean) {
        rng = this._getGroupedRows(rng);
        let ng = this._ng,
            totIndex = ng.totalsBeforeData ? rng.row - 1 : rng.row2 + 1,
            totRow = this.rows[totIndex] || this.rows[rng.row],
            key = totRow ? totRow.dataItem[_PivotKey._ROW_KEY_NAME] : null;

        // update key's collapsed state
        if (key) {
            this._collapsedKeys[key.toString()] = collapse;
        }

        // update row visibility
        this.deferUpdate(() => {

            // hide/show data, show total row
            // show the total after hiding the data, in case there's paging and 
            // we are using a data row as the total (argh...)
            for (let r = rng.row; r <= rng.row2; r++) {
                this.rows[r].visible = !collapse;
            }
            if (totRow) {
                totRow.visible = true;
            }

            // when expanding, apply state to child ranges
            if (!collapse) {
                let level = this._getRowLevel(totIndex),
                    childRanges = [];
                for (let r = rng.row; r <= rng.row2; r++) {
                    if (this._getRowLevel(r) > -1) {
                        let childRange = this._getGroupedRows(new wijmo.grid.CellRange(r, level));
                        wijmo.assert(childRange.row >= rng.row && childRange.row2 <= rng.row2, 'child range overflow');
                        childRanges.push(childRange);
                        r++;
                    }
                }
                childRanges.forEach(rng => {
                    let collapsed = this._getRowCollapsed(rng);
                    this._setRowCollapsed(rng, collapsed);
                });
            }
        });
    }
    _collapseRowsToLevel(level: number) {
        if (level >= this._ng.rowFields.length) {
            level = -1; // show all
        }
        this.deferUpdate(() => {
            for (let r = 0; r < this.rows.length; r++) {

                // update key's collapsed state
                let rowLevel = this._getRowLevel(r);
                if (rowLevel > 0) {
                    let key = this.rows[r].dataItem[_PivotKey._ROW_KEY_NAME];
                    this._collapsedKeys[key.toString()] = level > 0 && rowLevel >= level;
                }

                // update row visibility
                if (level < 0) {
                    this.rows[r].visible = true;
                } else {
                    let visible = rowLevel > -1 && rowLevel <= level;

                    // handle paging (avoid hiding all rows in group)
                    if (!visible) {
                        if (this._ng.totalsBeforeData) {
                            if (r == 0) {
                                visible = true;
                            }
                        } else {
                            if (r == this.rows.length - 1) {
                                visible = true;
                            }
                        }
                    }

                    this.rows[r].visible = visible;
                }
            }
        });
    }

    // ** column groups
    _getColLevel(col: number): number {
        return this._ng._getColLevel(this.columns[col].binding);
    }
    _getGroupedCols(rng: wijmo.grid.CellRange): wijmo.grid.CellRange {
        let getLevel = this._getColLevel.bind(this),
            level = rng.row + 1,
            len = this.columns.length,
            tbd = this._ng.totalsBeforeData,
            start = rng.col,
            end: number;

        if (getLevel(start) == 0) { // grand totals
            start = tbd ? 1 : 0;
            end = tbd ? len - 1 : len - 2;
        } else { // regular groups
            
            // move start past totals (TFS 378104)
            if (this._ng.totalsBeforeData) {
                for (start = rng.col; start < len; start++) {
                    if (getLevel(start) < 0) break;
                }
            } else {
                for (start = rng.col; start >= 0; start--) {
                    if (getLevel(start) < 0) break;
                }
            }

            // expand range
            for (; start > 0; start--) {
                let lvl = getLevel(start - 1);
                if (lvl >= 0 && lvl <= level) break;
            }
            for (end = start; end < len - 1; end++) {
                let lvl = getLevel(end + 1);
                if (lvl >= 0 && lvl <= level) break;
            }
        }

        // done
        wijmo.assert(end >= start, 'group end < start?');
        return end >= start // TFS 190950
            ? new wijmo.grid.CellRange(rng.row, start, rng.row2, end)
            : rng;
    }
    _toggleColCollapsed(rng: wijmo.grid.CellRange) {
        this._setColCollapsed(rng, !this._getColCollapsed(rng));
    }
    _getColCollapsed(rng: wijmo.grid.CellRange): boolean {
        rng = this._getGroupedCols(rng);
        let ng = this._ng,
            totIndex = ng.totalsBeforeData ? rng.col - ng.valueFields.length : rng.col2 + 1,
            totCol = this.columns[totIndex],
            key = totCol ? totCol.binding : null;
        return key ? this._collapsedKeys[key.toString()] : false;
    }
    _setColCollapsed(rng: wijmo.grid.CellRange, collapse: boolean) {
        rng = this._getGroupedCols(rng);
        let ng = this._ng,
            totIndex = ng.totalsBeforeData ? rng.col - ng.valueFields.length : rng.col2 + 1,
            totCol = this.columns[totIndex],
            key = totCol ? totCol.binding : null;

        // update key's collapsed state
        if (key) {
            this._collapsedKeys[key.toString()] = collapse;
        }

        // update column visibility
        this.deferUpdate(() => {

            // show totals, hide/show data
            for (let v = 1; v <= ng.valueFields.length; v++) {
                this.columns[ng.totalsBeforeData ? rng.col - v : rng.col2 + v].visible = true;
            }
            for (let c = rng.col; c <= rng.col2; c++) {
                this.columns[c].visible = !collapse;
            }

            // when expanding, apply state to child ranges
            if (!collapse) {
                let level = this._getColLevel(totIndex),
                    childRanges = [];
                for (let c = rng.col; c <= rng.col2; c++) {
                    if (this._getColLevel(c) > -1) {
                        let childRange = this._getGroupedCols(new wijmo.grid.CellRange(level, c));
                        wijmo.assert(childRange.col >= rng.col && childRange.col2 <= rng.col2, 'child range overflow');
                        childRanges.push(childRange);
                        c += ng.valueFields.length - 1;
                    }
                }
                childRanges.forEach(rng => {
                    let collapsed = this._getColCollapsed(rng);
                    this._setColCollapsed(rng, collapsed);
                });
            }
        });
    }
    _collapseColsToLevel(level: number) {
        if (level >= this._ng.columnFields.length) {
            level = -1; // show all
        }
        this.deferUpdate(() => {
            for (let c = 0; c < this.columns.length; c++) {

                // update key's collapsed state
                let colLevel = this._getColLevel(c);
                if (colLevel > 0) {
                    let key = this._ng._getKey(this.columns[c].binding);
                    this._collapsedKeys[key.toString()] = level > 0 && colLevel >= level;
                }

                // update column visibility
                if (level < 0) {
                    this.columns[c].visible = true;
                } else {
                    let visible = colLevel > -1 && colLevel <= level;
                    this.columns[c].visible = visible;
                }
            }
        });
    }
}

    }
    


    module wijmo.olap {
    






'use strict';

/**
 * Represents a dialog used to display details for a grid cell.
 */
export class DetailDialog extends wijmo.input.Popup {

    // child grid
    private _g: wijmo.grid.FlexGrid;

    // child elements
    private _sCnt: HTMLElement;
    private _dSummary: HTMLElement;
    private _dGrid: HTMLElement;
    private _btnOK: HTMLElement;
    private _gHdr: HTMLElement;

    // property storage
    private _rowHdr: string;
    private _colHdr: string;
    private _cellHdr: string;
    private _cellValue: string;
    private _detailCount: number;

    /**
     * Gets or sets the template used to instantiate {@link PivotFieldEditor} controls.
     */
    static controlTemplate =
        '<div>' +
            '<div class="wj-dialog-header">' +
                '<span wj-part="g-hdr">Detail View:</span> <span wj-part="sp-cnt"></span>' +
            '</div>' +
            '<div class="wj-dialog-body">' +
                '<div wj-part="div-summary" class="wj-summary"></div>' +
                '<div wj-part="div-grid"></div>' +
            '</div>' +
            '<div class="wj-dialog-footer">' +
                '<button wj-part="btn-ok"class="wj-hide wj-btn">OK</button>&nbsp;&nbsp;' +
            '</div>' +
        '</div>';

    /**
     * Initializes a new instance of the {@link DetailDialog} class.
     *
     * @param element The DOM element that hosts the control, or a CSS selector for the host element (e.g. '#theCtrl').
     * @param options The JavaScript object containing initialization data for the control.
     */
    constructor(element: any, options?: any) {
        super(element, null);

        // instantiate and apply template
        let tpl = this.getTemplate();
        this.applyTemplate('wj-control wj-detaildialog', tpl, {
            _sCnt: 'sp-cnt',
            _dSummary: 'div-summary',
            _dGrid: 'div-grid',
            _btnOK: 'btn-ok',
            _gHdr: 'g-hdr'
        });

        // create child grid
        this._g = new wijmo.grid.FlexGrid(this._dGrid, {
            isReadOnly: true
        });

        // apply options
        this.initialize(options);
    }

    // populates the dialog to show the detail for a given cell
    showDetail(ownerGrid: PivotGrid, cell: wijmo.grid.CellRange) {

        // populate child grid
        let view = ownerGrid.getDetailView(cell.row, cell.col);
        this._g.itemsSource = view;

        // update caption
        let pcv = wijmo.tryCast(view, 'IPagedCollectionView') as wijmo.collections.IPagedCollectionView;
        this._updateDetailCount(pcv ? pcv.totalItemCount : view.items.length);
        view.collectionChanged.addHandler(() => {
            this._updateDetailCount(view.items.length);
        });

        // update summary
        let ng = ownerGrid.engine,
            ci = wijmo.culture.olap.DetailDialog,
            summary = '';

        // update culture dependent elements here to apply culture dynamically (WJM-19988)
        this._gHdr.textContent = ci.header;
        this._btnOK.textContent = ci.ok;

        // row info
        let rowKey = ownerGrid.rows[cell.row].dataItem[_PivotKey._ROW_KEY_NAME];
        this._rowHdr = wijmo.escapeHtml(this._getHeader(rowKey));
        if (this._rowHdr) {
            summary += ci.row + ': <b>' + this._rowHdr + '</b><br>';
        }

        // column info
        let colKey = ng._getKey(ownerGrid.columns[cell.col].binding);
        this._colHdr = wijmo.escapeHtml(this._getHeader(colKey));
        if (this._colHdr) {
            summary += ci.col + ': <b>' + this._colHdr + '</b><br>';
        }

        // value info
        let valFlds = ng.valueFields,
            valFld = valFlds[cell.col % valFlds.length],
            val = ownerGrid.getCellData(cell.row, cell.col, true);
        this._cellHdr = wijmo.escapeHtml(valFld.header);
        this._cellValue = wijmo.escapeHtml(val);
        summary += this._cellHdr + ': <b>' + this._cellValue + '</b>';

        // show it
        this._dSummary.innerHTML = summary;
    }

    /**
     * Gets the row header for the value being shown.
     * 
     * This information is updated before the dialog is shown and
     * is displayed above the detail grid.
     */
    get rowHeader(): string {
        return this._rowHdr;
    }
    /**
     * Gets the column header for the value being shown.
     * 
     * This information is updated before the dialog is shown and
     * is displayed above the detail grid.
     */
    get columnHeader(): string {
        return this._colHdr;
    }
    /**
     * Gets the cell header for the value being shown.
     * 
     * This information is updated before the dialog is shown and
     * is displayed above the detail grid.
     */
    get cellHeader(): string {
        return this._cellHdr;
    }
    /**
     * Gets the formatted cell value for the value being shown.
     * 
     * This information is updated before the dialog is shown and
     * is displayed above the detail grid.
     */
    get cellValue(): string {
        return this._cellValue;
    }
    /**
     * Gets the number of items shown in the detail dialog.
     *
     * This information is updated before the dialog is shown and
     * is in the dialog header.
     */
    get detailCount(): number {
        return this._detailCount;
    }

    // ** implementation

    // update record count in dialog header
    _updateDetailCount(cnt: number) {
        let ci = wijmo.culture.olap.DetailDialog;
        this._sCnt.textContent = wijmo.format(cnt == 1 ? ci.item : ci.items, { cnt: cnt });
        this._detailCount = cnt;
    }

    // gets the headers that describe a key
    _getHeader(key: _PivotKey) {
        if (key && key.values && key.values.length) {
            let arr = [];
            for (let i = 0; i < key.values.length; i++) {
                arr.push(key.getValue(i, true));
            }
            return arr.join(' - ');
        }
        return null;
    }
}

    }
    


    module wijmo.olap {
    






'use strict';

/**
 * Provides custom merging for {@link PivotGrid} controls.
 */
export class _PivotMergeManager extends wijmo.grid.MergeManager {
    protected _ng: PivotEngine;

    /**
     * Gets a {@link CellRange} that specifies the merged extent of a cell
     * in a {@link GridPanel}.
     *
     * @param p The {@link GridPanel} that contains the range.
     * @param r The index of the row that contains the cell.
     * @param c The index of the column that contains the cell.
     * @param clip Whether to clip the merged range to the grid's current view range.
     * @return A {@link CellRange} that specifies the merged range, or null if the cell is not merged.
     */
    getMergedRange(p: wijmo.grid.GridPanel, r: number, c: number, clip = true): wijmo.grid.CellRange {

        // get the engine from the grid
        let view = p.grid.collectionView;
        this._ng = view instanceof PivotCollectionView
            ? (view as PivotCollectionView).engine
            : null;

        // not connected? use default implementation
        if (!this._ng) {
            return super.getMergedRange(p, r, c, clip);
        }

        // sanity
        if (r < 0 || r >= p.rows.length || c < 0 || c >= p.columns.length) {
            return null;
        }

        // merge row and column headers
        let allowMerging = p.grid.allowMerging,
            am = wijmo.grid.AllowMerging;
        switch (p.cellType) {
            case wijmo.grid.CellType.TopLeft:
                return (allowMerging & am.AllHeaders) != 0
                    ? this._getMergedTopLeftRange(p, r, c)
                    : null;
            case wijmo.grid.CellType.RowHeader:
                return (allowMerging & am.RowHeaders) != 0 // TFS 369672
                    ? this._getMergedRowHeaderRange(p, r, c, clip ? p.viewRange : null)
                    : null;
            case wijmo.grid.CellType.ColumnHeader:
                return (allowMerging & am.ColumnHeaders) != 0
                    ? this._getMergedColumnHeaderRange(p, r, c, clip ? p.viewRange : null)
                    : null;
        }

        // not merged
        return null;
    }

    // get merged top/left cells
    _getMergedTopLeftRange(p: wijmo.grid.GridPanel, r: number, c: number): wijmo.grid.CellRange {

        // start with a single cell
        let rng = new wijmo.grid.CellRange(r, c);

        // special handling for outline mode
        let g = p.grid as PivotGrid;
        if (g.outlineMode && g.showRowFieldHeaders) {
            if (rng.row == p.rows.length - 1) {
                rng.col = 0;
                rng.col2 = p.columns.length - 1;
                return rng;
            }
        }

        // expand left until we get a non-empty cell
        while (rng.col > 0 && !p.getCellData(r, rng.col, true)) {
            rng.col--;
        }

        // expand right to include empty cells
        while (rng.col2 < p.columns.length - 1 && !p.getCellData(r, rng.col2 + 1, true)) {
            rng.col2++;
        }

        // done
        return rng.isSingleCell ? null : rng;
    }

    // get merged row header cells
    _getMergedRowHeaderRange(p: wijmo.grid.GridPanel, r: number, c: number, rng: wijmo.grid.CellRange): wijmo.grid.CellRange {
        let g = p.grid as PivotGrid,
            col = p.columns[c];

        // honor Column.allowMerging
        if (!col.allowMerging) {
            return null;
        }

        // handle outline mode
        if (g.outlineMode) {

            // collapsible node
            if (this._isSubtotal(p, r, c) || this._isSubtotal(p, r, c + 1)) {
                let rng = this._getOutlineRange(p, r, c);
                return rng.isSingleCell ? null : rng;
            }

            // merged cells below collapsible node
            if (c < p.columns.length - 1) {
                let rng = g._getGroupedRows(new wijmo.grid.CellRange(r, c));
                return rng.isSingleCell ? null : rng;
            }

            // no merge
            return null;
        }

        // expand range left and right (totals)
        let rowLevel = this._ng._getRowLevel(r);
        if (rowLevel > -1 && c >= rowLevel) {
            let val = p.getCellData(r, c, false),
                c1: number,
                c2: number,
                cMin = rng ? rng.col : 0,
                cMax = rng ? rng.col2 : p.columns.length - 1;
            for (c1 = c; c1 > cMin; c1--) {
                if (p.getCellData(r, c1 - 1, false) != val) {
                    break;
                }
            }
            for (c2 = c; c2 < cMax; c2++) {
                if (p.getCellData(r, c2 + 1, false) != val) {
                    break;
                }
            }
            return c1 != c2
                ? new wijmo.grid.CellRange(r, c1, r, c2) // merged columns
                : null; // not merged
        }

        // expand range up and down
        let r1: number,
            r2: number,
            rMin = rng ? rng.row : 0,
            rMax = rng ? rng.row2 : p.rows.length - 1;
        for (r1 = r; r1 > rMin; r1--) {
            if (!this._sameColumnValues(p, r, r1 - 1, c)) {
                break;
            }
        }
        for (r2 = r; r2 < rMax; r2++) {
            if (!this._sameColumnValues(p, r, r2 + 1, c)) {
                break;
            }
        }
        return r1 != r2
            ? new wijmo.grid.CellRange(r1, c, r2, c) // merged rows
            : null; // not merged
    }

    // compare column values to perform restricted merging (TFS 257125)
    _sameColumnValues(p: wijmo.grid.GridPanel, r1: number, r2: number, c: number): boolean {
        for (; c >= 0; c--) {
            let v1 = p.getCellData(r1, c, false),
                v2 = p.getCellData(r2, c, false);
            if (v1 != v2) {
                return false;
            }
        }
        return true;
    }

    // outline mode helpers
    _isSubtotal(p: wijmo.grid.GridPanel, r: number, c: number): boolean {
        let item = p.rows[r].dataItem, // TFS 371599
            key = item ? item[_PivotKey._ROW_KEY_NAME] : null;
        return item && c > key.values.length - 1 && c < p.columns.length;
    }
    _getOutlineRange(p: wijmo.grid.GridPanel, r: number, c: number): wijmo.grid.CellRange {
        let rng = new wijmo.grid.CellRange(r, c);
        rng.col2 = p.columns.length - 1;
        while (rng.col && this._isSubtotal(p, r, rng.col)) {
            rng.col--;
        }
        return rng;
    }

    // get merged column header cells
    _getMergedColumnHeaderRange(p: wijmo.grid.GridPanel, r: number, c: number, rng: wijmo.grid.CellRange): wijmo.grid.CellRange {
        let col = p.columns[c],
            key = this._ng._getKey(col.binding),
            val = p.getCellData(r, c, false);

        // expand range up and down (totals)
        let colLevel = this._ng._getColLevel(key);
        if (colLevel > -1 && r >= colLevel) {
            let r1: number,
                r2: number,
                rMin = rng ? rng.row : 0,
                rMax = rng ? rng.row2 : p.rows.length - 1;
            for (r1 = r; r1 > rMin; r1--) {
                if (p.getCellData(r1 - 1, c, false) != val) {
                    break;
                }
            }
            for (r2 = r; r2 < rMax; r2++) {
                if (p.getCellData(r2 + 1, c, false) != val) {
                    break;
                }
            }
            if (r1 != r2) { // merged rows
                return new wijmo.grid.CellRange(r1, c, r2, c);
            }
            // fall through to allow merging subtotals over multiple value fields
            //return r1 != r2 ? new grid.CellRange(r1, c, r2, c) : null;
        }

        // account for frozen cells (TFS 496696)
        if (rng) {
            if (c < p.columns.frozen) {
                rng.col = rng.col2 = 0;
            }
            if (r < p.rows.frozen) {
                rng.row = rng.row2 = 0;
            }
        }

        // expand range left and right
        let c1: number,
            c2: number,
            cMin = rng ? rng.col : 0,
            cMax = rng ? rng.col2 : p.columns.length - 1;
        for (c1 = c; c1 > cMin; c1--) {
            if (!this._sameRowValues(p, r, c, c1 - 1)) {
                break;
            }
        }
        for (c2 = c; c2 < cMax; c2++) {
            if (!this._sameRowValues(p, r, c, c2 + 1)) {
                break;
            }
        }
        if (c1 != c2) { // merged columns
            return new wijmo.grid.CellRange(r, c1, r, c2);
        }

        // not merged
        return null;
    }

    // compare row values to perform restricted merging (TFS 257125)
    _sameRowValues(p: wijmo.grid.GridPanel, r: number, c1: number, c2: number): boolean {
        for (; r >= 0; r--) {
            let v1 = p.getCellData(r, c1, false),
                v2 = p.getCellData(r, c2, false);
            if (v1 != v2) {
                return false;
            }
        }
        return true;
    }
}
    }
    


    module wijmo.olap {
    









'use strict';

/**
 * Specifies constants that define the chart type.
 */
export enum PivotChartType {
    /** Shows vertical bars and allows you to compare values of items across categories. */
    Column,
    /** Shows horizontal bars. */
    Bar,
    /** Shows patterns within the data using X and Y coordinates. */
    Scatter,
    /** Shows trends over a period of time or across categories. */
    Line,
    /** Shows line chart with the area below the line filled with color. */
    Area,
    /** Shows pie chart. */
    Pie
}

/**
 * Specifies constants that define when the chart legend should be displayed.
 */
export enum LegendVisibility {
    /** Always show the legend. */
    Always,
    /** Never show the legend. */
    Never,
    /** Show the legend if the chart has more than one series. */
    Auto
}

/**
 * Provides visual representations of {@link wijmo.olap} pivot tables.
 *
 * To use the control, set its {@link itemsSource} property to an instance of a 
 * {@link PivotPanel} control or to a {@link PivotEngine}.
 */
export class PivotChart extends wijmo.Control {

    static MAX_SERIES = 100;
    static MAX_POINTS = 100;
    static HRHAXISCSS = 'wj-hierarchicalaxes-line';

    private _ng: PivotEngine;
    private _chartType = PivotChartType.Column;
    private _showHierarchicalAxes = true;
    private _showTotals = false;
    private _showTitle = true;
    private _showLegend = LegendVisibility.Always;
    private _legendPosition = wijmo.chart.Position.Right;
    private _maxSeries = PivotChart.MAX_SERIES;
    private _maxPoints = PivotChart.MAX_POINTS;
    private _stacking = wijmo.chart.Stacking.None;
    private _header: string;
    private _headerStyle: any;
    private _footer: string;
    private _footerStyle: any;

    private _itemsSource: any;
    private _flexChart: wijmo.chart.FlexChart;
    private _flexPie: wijmo.chart.FlexPie;
    private _colMenu: wijmo.input.MultiSelect;

    private _colItms = [];
    private _dataItms = [];
    private _lblsSrc = [];
    private _grpLblsSrc = [];

    /**
     * Initializes a new instance of the {@link PivotChart} class.
     *
     * @param element The DOM element that will host the control, or a CSS selector for the host element (e.g. '#theCtrl').
     * @param options JavaScript object containing initialization data for the control.
     */
    constructor(element: any, options?: any) {
        super(element);

        // add class name to enable styling
        wijmo.addClass(this.hostElement, 'wj-pivotchart');

        // add flex chart & flex pie
        if (!this._isPieChart()) {
            this._createFlexChart();
        } else {
            this._createFlexPie();
        }
        super.initialize(options);
    }
    _getProductInfo(): string {
        return 'D6F4,PivotChart';
    }

    /**
     * Gets a reference to the {@link PivotEngine} that owns this {@link PivotChart}.
     */
    get engine(): PivotEngine {
        return this._ng;
    }
    /**
     * Gets or sets the {@link PivotEngine} or {@link PivotPanel} that provides data 
     * for this {@link PivotChart}.
     */
    get itemsSource(): any {
        return this._itemsSource;
    }
    set itemsSource(value: any) {
        if (value && this._itemsSource !== value) {
            let oldVal = this._itemsSource;
            if (value instanceof PivotPanel) {
                value = (value as PivotPanel).engine.pivotView;
            } else if (value instanceof PivotEngine) {
                value = (value as PivotEngine).pivotView;
            }
            this._itemsSource = wijmo.asCollectionView(value);
            this._onItemsSourceChanged(oldVal);
        }
    }
    /**
     * Gets or sets the type of chart to create.
     * 
     * The default value for this property is <b>PivotChartType.Column</b>.
     */
    get chartType(): PivotChartType {
        return this._chartType;
    }
    set chartType(value: PivotChartType) {
        value = wijmo.asEnum(value, PivotChartType);
        if (value != this._chartType) {
            var type = this._chartType;
            this._chartType = value;
            this._changeChartType();
            if (value === PivotChartType.Bar || type === PivotChartType.Bar) {
                this._updatePivotChart();
            }
        }
    }
    /**
     * Gets or sets a value that determines whether the chart should group axis 
     * annotations for grouped data.
     *
     * The default value for this property is <b>true</b>.
     */
    get showHierarchicalAxes(): boolean {
        return this._showHierarchicalAxes;
    }
    set showHierarchicalAxes(value: boolean) {
        if (value != this._showHierarchicalAxes) {
            this._showHierarchicalAxes = wijmo.asBoolean(value, true);
            if (!this._isPieChart() && this._flexChart) {
                this._updateFlexChart(this._dataItms, this._lblsSrc, this._grpLblsSrc);
            }
        }
    }
    /**
     * Gets or sets a value that determines whether the chart should 
     * include only totals.
     *
     * If showTotals is true and the view has Column Fields, then the 
     * chart will show column totals instead of individual values.
     *
     * The default value for this property is <b>false</b>.
     */
    get showTotals(): boolean {
        return this._showTotals;
    }
    set showTotals(value: boolean) {
        if (value != this._showTotals) {
            this._showTotals = wijmo.asBoolean(value, true);
            this._updatePivotChart();
        }
    }
    /**
     * Gets or sets a value that determines whether the chart 
     * should include a title.
     *
     * The default value for this property is <b>true</b>.
     */
    get showTitle(): boolean {
        return this._showTitle;
    }
    set showTitle(value: boolean) {
        if (value != this._showTitle) {
            this._showTitle = wijmo.asBoolean(value, true);
            this._updatePivotChart();
        }
    }
    /**
     * Gets or sets a value that determines whether the chart 
     * should include a legend.
     *
     * The default value for this property is <b>LegendVisibility.Always</b>.
     */
    get showLegend(): LegendVisibility {
        return this._showLegend;
    }
    set showLegend(value: LegendVisibility) {
        value = wijmo.asEnum(value, LegendVisibility);
        if (value != this.showLegend) {
            this._showLegend = value;
            this._updatePivotChart();
        }
    }
    /**
     * Gets or sets a value that determines whether and where the legend
     * appears in relation to the plot area.
     *
     * The default value for this property is <b>Position.Right</b>.
     */
    get legendPosition(): wijmo.chart.Position {
        return this._legendPosition;
    }
    set legendPosition(value: wijmo.chart.Position) {
        value = wijmo.asEnum(value, wijmo.chart.Position);
        if (value != this.legendPosition) {
            this._legendPosition = value;
            this._updatePivotChart();
        }
        return;
    }
    /**
     * Gets or sets a value that determines whether and how the
     * series objects are stacked.
     *
     * The default value for this property is <b>Stacking.None</b>.
     */
    get stacking(): wijmo.chart.Stacking {
        return this._stacking;
    }
    set stacking(value: wijmo.chart.Stacking) {
        value = wijmo.asEnum(value, wijmo.chart.Stacking);
        if (value != this._stacking) {
            this._stacking = value;
            if (this._flexChart) {
                this._flexChart.stacking = this._stacking;
                this._updatePivotChart();
            }
        }
    }
    /**
     * Gets or sets the maximum number of data series to be
     * shown in the chart.
     * 
     * The default value for this property is <b>100</b> series.
     */
    get maxSeries(): number {
        return this._maxSeries;
    }
    set maxSeries(value: number) {
        if (value != this._maxSeries) {
            this._maxSeries = wijmo.asNumber(value);
            this._updatePivotChart();
        }
    }
    /**
     * Gets or sets the maximum number of points to be shown in each series.
     *
     * The default value for this property is <b>100</b> points.
     */
    get maxPoints(): number {
        return this._maxPoints;
    }
    set maxPoints(value: number) {
        if (value != this._maxPoints) {
            this._maxPoints = wijmo.asNumber(value);
            this._updatePivotChart();
        }
    }
    /**
     * Gets a reference to the inner <b>FlexChart</b> control.
     */
    get flexChart(): wijmo.chart.FlexChart {
        return this._flexChart;
    }
    /**
     * Gets a reference to the inner <b>FlexPie</b> control.
     */
    get flexPie(): wijmo.chart.FlexPie {
        return this._flexPie;
    }

    /**
     * Gets or sets the text displayed in the chart header.
     */
    get header(): string {
        return this._header;
    }
    set header(value: string) {
        if (value != this._header) {
            this._header = wijmo.asString(value, true);
            this.invalidate();
        }
    }

    /**
     * Gets or sets the text displayed in the chart footer.
     */
    get footer(): string {
        return this._footer;
    }
    set footer(value: string) {
        if (value != this._footer) {
            this._footer = wijmo.asString(value, true);
            this.invalidate();
        }
    }

    /**
     * Gets or sets the style of the chart header.
     */
    get headerStyle(): any {
        return this._headerStyle;
    }
    set headerStyle(value: any) {
        if (value != this._headerStyle) {
            this._headerStyle = value;
            this.invalidate();
        }
    }

    /**
     * Gets or sets the style of the chart footer.
     */
    get footerStyle(): any {
        return this._footerStyle;
    }
    set footerStyle(value: any) {
        if (value != this._footerStyle) {
            this._footerStyle = value;
            this.invalidate();
        }
    }

    /**
     * Refreshes the control.
     *
     * @param fullUpdate Whether to update the control layout as well as the content.
     */
    refresh(fullUpdate = true) {
        super.refresh(fullUpdate); // always call the base class
        if (this._isPieChart()) {
            if (this._flexPie) {
                this._flexPie.refresh(fullUpdate);
            }
        } else {
            if (this._flexChart) {
                this._flexChart.refresh(fullUpdate);
            }
        }
        this._updatePivotChart();
    }

    /**
     * Saves the chart to an image data url.
     * 
     * NOTE: This method does not work in IE browsers. If you require IE support,
     * add the <code>wijmo.chart.render</code> module to the page.
     *
     * @param format The {@link wijmo.chart.ImageFormat} for the exported image.
     * @param done A function to be called after data url is generated. The function gets passed the data url as its argument. 
     */
    saveImageToDataUrl(format: wijmo.chart.ImageFormat, done: Function): void {
        if (this._isPieChart()) {
            if (this._flexPie) {
                this._flexPie.saveImageToDataUrl(format, done);
            }
        } else {
            if (this._flexChart) {
                this._flexChart.saveImageToDataUrl(format, done);
            }
        }
    }

    /**
     * Saves the chart to an image file.
     * 
     * NOTE: This method does not work in IE browsers. If you require IE support,
     * add the <code>wijmo.chart.render</code> module to the page.
     * 
     * @param filename The filename for the exported image file including extension.
     * Supported types are PNG, JPEG and SVG.
     */
    saveImageToFile(filename: string): void {
        if (this._isPieChart()) {
            if (this._flexPie) {
                this._flexPie.saveImageToFile(filename);
            }
        } else {
            if (this._flexChart) {
                this._flexChart.saveImageToFile(filename);
            }
        }
    }

    // ** implementation

    // occur when items source changed
    private _onItemsSourceChanged(oldItemsSource?) {

        // disconnect old engine
        if (this._ng) {
            this._ng.updatedView.removeHandler(this._updatePivotChart, this);
        }
        if (oldItemsSource) {
            (oldItemsSource as PivotCollectionView).collectionChanged.removeHandler(this._updatePivotChart, this);
        }

        // get new engine
        let cv = this._itemsSource;
        this._ng = cv instanceof PivotCollectionView
            ? (cv as PivotCollectionView).engine
            : null;
        // connect new engine
        if (this._ng) {
            this._ng.updatedView.addHandler(this._updatePivotChart, this);
        }
        if (this._itemsSource) {
            (this._itemsSource as PivotCollectionView).collectionChanged.addHandler(this._updatePivotChart, this);
        }

        this._updatePivotChart();
    }

    // create flex chart
    private _createFlexChart() {
        let hostEle = document.createElement('div');
        this.hostElement.appendChild(hostEle);
        this._flexChart = new wijmo.chart.FlexChart(hostEle);
        this._flexChart._bindingSeparator = null; // don't parse bindings at the commas
        this._flexChart.legend.position = wijmo.chart.Position.Right;
        this._flexChart.bindingX = _PivotKey._ROW_KEY_NAME;
        this._flexChart.stacking = this._stacking;
        this._flexChart.tooltip.content = (ht) => {
            let content = ht.name
                ? '<b>' + ht.name + '</b> ' + '<br/>'
                : '';
            content += this._getLabel(ht.x) + ' ' + this._getValue(ht);
            return content;
        }
        this._flexChart.hostElement.style.visibility = 'hidden';
    }

    // create flex pie
    private _createFlexPie() {
        let menuHost = document.createElement('div');
        this.hostElement.appendChild(menuHost);
        this._colMenu = new wijmo.input.MultiSelect(menuHost, {
            displayMemberPath: 'text',
            placeholder: wijmo.culture.olap.PivotPanel.cols,
            selectedValuePath: 'prop',
            showSelectAllCheckbox: true
        });
        this._colMenu.hostElement.style.visibility = 'hidden';
        this._colMenu.checkedItemsChanged.addHandler((sender, args) => this._updateFlexPieBinding());

        let hostEle = document.createElement('div');
        this.hostElement.appendChild(hostEle);
        this._flexPie = new wijmo.chart.FlexPie(hostEle);
        this._flexPie.bindingName = _PivotKey._ROW_KEY_NAME;
        this._flexPie.tooltip.content = (ht) => {
            return '<b>' + this._getLabel(this._dataItms[ht.pointIndex][_PivotKey._ROW_KEY_NAME]) + '</b> ' + '<br/>' + this._getValue(ht);
        }
        this._flexPie.rendering.addHandler(this._updatePieInfo, this);
    }

    // update chart
    private _updatePivotChart() {
        if (!this._ng || !this._ng.pivotView) {
            return;
        }

        let dataItems = [], lblsSrc = [], grpLblsSrc = [],
            lastLabelIndex = 0, lastRowKey,
            view = this._ng.pivotView,
            rowFields = this._ng.rowFields;

        // prepare data for chart
        for (let i = 0; i < view.items.length; i++) {
            let item = view.items[i],
                rowKey = item.$rowKey;

            // get columns
            if (i == 0) {
                this._getColumns(item);
            }

            // max points
            if (dataItems.length >= this._maxPoints) {
                break;
            }

            // skip total row
            if (!this._isTotalRow(item[_PivotKey._ROW_KEY_NAME])) {
                dataItems.push(item);

                // organize the axis label data source
                // 1. _groupAnnotations  = false;
                lblsSrc.push({ value: dataItems.length - 1, text: this._getLabel(item[_PivotKey._ROW_KEY_NAME]) });

                // 2. _groupAnnotations  = true;
                for (let j = 0; j < rowFields.length; j++) {
                    if (grpLblsSrc.length <= j) {
                        grpLblsSrc.push([]);
                    }
                    let mergeIndex = this._getMergeIndex(rowKey, lastRowKey);
                    if (mergeIndex < j) {

                        // center previous label based on values
                        lastLabelIndex = grpLblsSrc[j].length - 1;
                        let grpLbl = grpLblsSrc[j][lastLabelIndex];

                        // first group label
                        if (lastLabelIndex === 0 && j < rowFields.length - 1) {
                            grpLbl.value = (grpLbl.width - 1) / 2;
                        }
                        if (lastLabelIndex > 0 && j < rowFields.length - 1) {
                            let offsetWidth = this._getOffsetWidth(grpLblsSrc[j]);
                            grpLbl.value = offsetWidth + (grpLbl.width - 1) / 2;
                        }
                        grpLblsSrc[j].push({ value: dataItems.length - 1, text: rowKey.getValue(j, true), width: 1 });
                    } else {

                        // calculate the width
                        lastLabelIndex = grpLblsSrc[j].length - 1;
                        grpLblsSrc[j][lastLabelIndex].width++;
                    }
                }
                lastRowKey = rowKey;
            }
        }
        // center last label
        for (let j = 0; j < rowFields.length; j++) {
            if (j < grpLblsSrc.length) { //this._ng.rowFields.length - 1) {
                lastLabelIndex = grpLblsSrc[j].length - 1;
                grpLblsSrc[j][lastLabelIndex].value = this._getOffsetWidth(grpLblsSrc[j]) + (grpLblsSrc[j][lastLabelIndex].width - 1) / 2;
            }
        }

        this._dataItms = dataItems;
        this._lblsSrc = lblsSrc;
        this._grpLblsSrc = grpLblsSrc;

        this._updateFlexChartOrPie();
    }

    private _updateFlexChartOrPie() {
        let isPie = this._isPieChart();
        if (!isPie && this._flexChart) {
            this._updateFlexChart(this._dataItms, this._lblsSrc, this._grpLblsSrc);
        } else if (isPie && this._flexPie) {
            this._updateFlexPie(this._dataItms, this._lblsSrc);
        }
    }

    // update FlexChart
    private _updateFlexChart(dataItms: any, labelsSource: any, grpLblsSrc: any) {
        let chart = this._flexChart,
            host = chart ? chart.hostElement : null,
            axis: wijmo.chart.Axis;

        if (!this._ng || !chart || !host) { // TFS 331945
            return;
        }

        chart.beginUpdate();
        chart.itemsSource = dataItms;
        this._createSeries();

        if (chart.series &&
            chart.series.length > 0 &&
            dataItms.length > 0) {
            host.style.visibility = 'visible';
        } else {
            host.style.visibility = 'hidden';
        }
        chart.header = this.header || this._getChartTitle();
        if (this.headerStyle) {
            chart.headerStyle = this.headerStyle;
        }
        if (this.footer) {
            chart.footer = this.footer;
        }
        if (this.footerStyle) {
            chart.footerStyle = this.footerStyle;
        }
        if (this._isRotatedChart()) {
            if (this._showHierarchicalAxes && grpLblsSrc.length > 0) {
                chart.axisY.itemsSource = grpLblsSrc[grpLblsSrc.length - 1];
                chart.axisX.labelAngle = undefined;
                if (grpLblsSrc.length >= 2) {
                    for (let i = grpLblsSrc.length - 2; i >= 0; i--) {
                        this._createGroupAxes(grpLblsSrc[i]);
                    }
                }
            } else {
                chart.axisY.labelAngle = undefined;
                chart.axisY.itemsSource = labelsSource;
            }
            chart.axisX.itemsSource = undefined;
        } else {
            if (this._showHierarchicalAxes && grpLblsSrc.length > 0) {
                chart.axisX.itemsSource = grpLblsSrc[grpLblsSrc.length - 1];
                if (grpLblsSrc.length >= 2) {
                    for (let i = grpLblsSrc.length - 2; i >= 0; i--) {
                        this._createGroupAxes(grpLblsSrc[i]);
                    }
                }
            } else {
                chart.axisX.labelAngle = undefined;
                chart.axisX.itemsSource = labelsSource;
            }
            chart.axisY.itemsSource = undefined;
        }
        chart.axisX.labelPadding = 6;
        chart.axisY.labelPadding = 6;
        if (this._isRotatedChart()) {
            axis = chart.axisX;
            chart.axisY.reversed = true;
        } else {
            axis = chart.axisY;
            chart.axisY.reversed = false;
        }
        if (chart.stacking !== wijmo.chart.Stacking.Stacked100pc && this._ng.valueFields.length > 0 && this._ng.valueFields[0].format) {
            axis.format = this._ng.valueFields[0].format;
        } else {
            axis.format = '';
        }
        chart.legend.position = this._getLegendPosition();
        chart.endUpdate();
    }

    // update FlexPie
    private _updateFlexPie(dataItms: any, labelsSource: any) {
        let pie = this._flexPie,
            host = pie ? pie.hostElement : null,
            colMenu = this._colMenu;

        if (!this._ng || !pie || !host) { // TFS 331945
            return;
        }

        if (this._colItms.length > 0 &&
            dataItms.length > 0) {
            host.style.visibility = 'visible';
        } else {
            host.style.visibility = 'hidden';
        }

        // updating pie: binding the first column
        pie.beginUpdate();
        pie.itemsSource = dataItms;
        pie.bindingName = _PivotKey._ROW_KEY_NAME;
        if (this._colItms && this._colItms.length > 0) {
            pie.binding = this._colItms[0]['prop'];
        }
        pie.header = this.header || this._getChartTitle();
        if (this.headerStyle) {
            pie.headerStyle = this.headerStyle;
        }
        if (this.footer) {
            pie.footer = this.footer;
        }
        if (this.footerStyle) {
            pie.footerStyle = this.footerStyle;
        }
        pie.legend.position = this._getLegendPosition();
        pie.endUpdate();

        // updating column selection menu
        let headerPrefix = this._getTitle(this._ng.columnFields);
        if (headerPrefix !== '') {
            headerPrefix = '<b>' + headerPrefix + ': </b>';
        }
        if (this._colItms && this._colItms.length > 1 && dataItms.length > 0) {
            colMenu.hostElement.style.visibility = 'visible';
            colMenu.itemsSource = this._colItms;
            colMenu.checkedItems = [this._colItms[0]];
            colMenu.invalidate();
            // colMenu.listBox.invalidate();
        } else {
            colMenu.hostElement.style.visibility = 'hidden';
        }
    }

    // gets the position for the legend
    private _getLegendPosition(): wijmo.chart.Position {
        let pos = this.legendPosition;
        if (this.showLegend == LegendVisibility.Never) {
            pos = wijmo.chart.Position.None;
        } else if (this.showLegend == LegendVisibility.Auto) {
            if (this.flexChart && this.flexChart.series) {
                let cnt = 0;
                this.flexChart.series.forEach(series => {
                    let vis = series.visibility;
                    if (series.name &&
                        vis != wijmo.chart.SeriesVisibility.Hidden &&
                        vis != wijmo.chart.SeriesVisibility.Plot) {
                        cnt++;
                    }
                });
                if (cnt < 2) {
                    pos = wijmo.chart.Position.None;
                }
            }
        }
        return pos;
    }

    // create series
    private _createSeries() {

        // clear the old series
        if (this._flexChart) {
            this._flexChart.series.length = 0;
        }

        // trim series names if we have only one value field
        // so the legend doesn't show "Foo; Sales" "Bar; Sales" "Etc; Sales"
        let trimNames = this._ng.valueFields.length == 1;

        // create the new series
        for (let i = 0; i < this._colItms.length; i++) {
            let series = new wijmo.chart.Series(),
                binding = this._colItms[i]['prop'],
                name = this._colItms[i]['text'];
            if (trimNames) {
                let pos = name.lastIndexOf(';');
                if (pos > -1) {
                    name = name.substr(0, pos)
                }
            }
            series.binding = binding;
            series.name = name;
            this._flexChart.series.push(series);
        }
    }

    // get columns from item
    private _getColumns(itm: any) {
        let sersCount = 0, colKey, colLbl;
        if (!itm) {
            return;
        }
        this._colItms = [];
        for (let prop in itm) {
            if (itm.hasOwnProperty(prop)) {
                if (prop !== _PivotKey._ROW_KEY_NAME && sersCount < this._maxSeries) {
                    if (this._isValidColumn(prop)) {
                        colKey = this._ng._getKey(prop);
                        colLbl = this._getLabel(colKey);
                        this._colItms.push({ prop: prop, text: this._getLabel(colKey) });
                        sersCount++;
                    }
                }
            }
        }
    }

    // create group axes
    private _createGroupAxes(groups: any) {
        let chart = this._flexChart,
            rawAxis = this._isRotatedChart() ? chart.axisY : chart.axisX,
            ax;

        if (!groups) {
            return;
        }

        // create auxiliary series
        ax = new wijmo.chart.Axis();
        ax.labelAngle = 0;
        ax.labelPadding = 6;
        ax.position = this._isRotatedChart() ? wijmo.chart.Position.Left : wijmo.chart.Position.Bottom;
        ax.majorTickMarks = wijmo.chart.TickMark.None;

        // set axis data source
        ax.itemsSource = groups;
        ax.reversed = rawAxis.reversed;
        ax.axisLine = false;

        // custom item formatting
        ax.itemFormatter = (engine, label) => {
            if (ax._axrect) { // item formatter may be called before layout when axis rect isn't set yet
                // find group
                let group = groups.filter(function (obj) {
                    return obj.value == label.val;
                })[0];

                // draw custom decoration
                let w = 0.5 * group.width;
                if (!this._isRotatedChart()) {
                    let x1 = ax.convert(label.val - w) + 5,
                        x2 = ax.convert(label.val + w) - 5,
                        y = ax._axrect.top;
                    engine.drawLine(x1, y, x2, y, PivotChart.HRHAXISCSS);
                    engine.drawLine(x1, y, x1, y - 5, PivotChart.HRHAXISCSS);
                    engine.drawLine(x2, y, x2, y - 5, PivotChart.HRHAXISCSS);
                    engine.drawLine(label.pos.x, y, label.pos.x, y + 5, PivotChart.HRHAXISCSS);
                } else {
                    let reversed = ax.reversed ? -1 : +1,
                        y1 = ax.convert(label.val + w) + 5 * reversed,
                        y2 = ax.convert(label.val - w) - 5 * reversed,
                        x = ax._axrect.left + ax._axrect.width - 5;
                    engine.drawLine(x, y1, x, y2, PivotChart.HRHAXISCSS);
                    engine.drawLine(x, y1, x + 5, y1, PivotChart.HRHAXISCSS);
                    engine.drawLine(x, y2, x + 5, y2, PivotChart.HRHAXISCSS);
                    engine.drawLine(x, label.pos.y, x - 5, label.pos.y, PivotChart.HRHAXISCSS);
                }
            }
            return label;
        };

        ax.min = rawAxis.actualMin;
        ax.max = rawAxis.actualMax;

        // sync axis limits with main x-axis
        rawAxis.rangeChanged.addHandler(function () {
            if (!(isNaN(ax.min) && isNaN(rawAxis.actualMin)) && ax.min != rawAxis.actualMin) {
                ax.min = rawAxis.actualMin;
            }
            if (!(isNaN(ax.max) && isNaN(rawAxis.actualMax)) && ax.max != rawAxis.actualMax) {
                ax.max = rawAxis.actualMax;
            }
        });
        let series = new wijmo.chart.Series();
        series.visibility = wijmo.chart.SeriesVisibility.Hidden;
        if (!this._isRotatedChart()) {
            series.axisX = ax;
        } else {
            series.axisY = ax;
        }
        chart.series.push(series);
    }

    private _updateFlexPieBinding() {
        let bnd = '';
        let titles = [];
        this._colMenu.checkedItems.forEach((item) => {
            if (bnd.length > 0) {
                bnd += ',';
            }
            bnd += item['prop'];
            titles.push(item['text'])
        });
        this._flexPie.binding = bnd;
        this._flexPie.titles = titles.length > 1 ? titles : null;
    }

    private _updatePieInfo() {
        if (!this._flexPie) {
            return;
        }
        this._flexPie._labels = this._flexPie._labels.map((v, i) => {
            return this._lblsSrc[i].text;
        });
    }

    // change chart type
    private _changeChartType() {
        let ct = null;

        if (this.chartType === PivotChartType.Pie) {
            if (!this._flexPie) {
                this._createFlexPie();
            }
            this._updateFlexPie(this._dataItms, this._lblsSrc);
            this._swapChartAndPie(false);
        } else {
            switch (this.chartType) {
                case PivotChartType.Column:
                    ct = wijmo.chart.ChartType.Column;
                    break;
                case PivotChartType.Bar:
                    ct = wijmo.chart.ChartType.Bar;
                    break;
                case PivotChartType.Scatter:
                    ct = wijmo.chart.ChartType.Scatter;
                    break;
                case PivotChartType.Line:
                    ct = wijmo.chart.ChartType.Line;
                    break;
                case PivotChartType.Area:
                    ct = wijmo.chart.ChartType.Area;
                    break;
            }
            if (!this._flexChart) {
                this._createFlexChart();
                this._updateFlexChart(this._dataItms, this._lblsSrc, this._grpLblsSrc);
            } else {
                // 1.from pie to flex chart
                // 2.switch between bar chart and other flex charts
                // then rebind the chart.
                if (this._flexChart.hostElement.style.display === 'none' ||
                    ct === PivotChartType.Bar || this._flexChart.chartType === wijmo.chart.ChartType.Bar) {
                    this._updateFlexChart(this._dataItms, this._lblsSrc, this._grpLblsSrc);
                }
            }
            this._flexChart.chartType = ct;
            this._swapChartAndPie(true);
        }
    }

    private _swapChartAndPie(chartshow: boolean) {
        if (this._flexChart) {
            this._flexChart.hostElement.style.display = chartshow ? 'block' : 'none';
        }
        if (this._flexPie) {
            this._flexPie.hostElement.style.display = !chartshow ? 'block' : 'none';;
        }
        if (this._colMenu && this._colMenu.hostElement) {
            this._colMenu.hostElement.style.display = chartshow ? 'none' : 'block';
            //workaround for #276985
            this._colMenu.hostElement.style.top = '0';
            setTimeout(() => {
                this._colMenu.hostElement.style.top = '';
            }, 0);
        }
    }

    private _getLabel(key: _PivotKey) {
        let sb = '';
        if (!key || !key.values) {
            return sb;
        }
        let fld = key.valueFields ? key.valueField : null; // TFS 258996
        switch (key.values.length) {
            case 0:
                if (fld) {
                    sb += fld.header;
                }
                break;
            case 1:
                sb += key.getValue(0, true);
                if (fld) {
                    sb += '; ' + fld.header;
                }
                break;
            default:
                for (let i = 0; i < key.values.length; i++) {
                    if (i > 0) sb += "; ";
                    sb += key.getValue(i, true);
                }
                if (fld) {
                    sb += '; ' + fld.header;
                }
                break;
        }
        return sb;
    }

    private _getValue(ht: wijmo.chart.HitTestInfo): string {
        let vf = this._ng.valueFields,
            idx = ht.series ? ht.series.chart.series.indexOf(ht.series) : 0,
            fmt = idx < vf.length ? vf[idx].format : vf.length ? vf[0].format : '';

        return fmt ? wijmo.Globalize.format(ht.y, fmt) : ht._yfmt;
    }

    private _getChartTitle() {

        // no title? no value fields? no work
        if (!this.showTitle || !this._ng.valueFields.length) {
            return null;
        }

        // build chart title
        let ng = this._ng,
            value = this._getTitle(ng.valueFields),
            rows = this._getTitle(ng.rowFields),
            cols = this._getTitle(ng.columnFields),
            title = value,
            str = wijmo.culture.olap.PivotChart;
        if (value && this._dataItms.length > 0) {
            if (rows) {
                title += wijmo.format(' {by} {rows}', {
                    by: str.by,
                    rows: rows
                });
            }
            if (cols) {
                title += wijmo.format(' {and} {cols}', {
                    and: rows ? str.and : str.by,
                    cols: cols
                });
            }
        }
        return title;
    }

    private _getTitle(fields: PivotFieldCollection) {
        let sb = '';
        for (let i = 0; i < fields.length; i++) {
            if (sb.length > 0) sb += '; ';
            sb += fields[i].header;
        }
        return sb;
    }

    private _isValidColumn(colKey: string): boolean {
        let kVals = colKey.split(';');
        let showTotals = this._showTotals;
        if (this._ng.columnFields.length === 0) {
            return true;
        } else {
            if (kVals && kVals.length === 2) {
                return showTotals;
            } else if (kVals && (kVals.length - 2 === this._ng.columnFields.length)) {
                return !showTotals;
            } else {
                return false;
            }
        }
    }

    private _isTotalRow(rowKey: _PivotKey): boolean {
        if (rowKey.values.length < this._ng.rowFields.length) {
            return true;
        }
        return false;
    }

    private _isPieChart(): boolean {
        return this._chartType == PivotChartType.Pie;
    }

    private _isRotatedChart(): boolean {
        //xor
        return !this._isPieChart() && ((this._chartType == PivotChartType.Bar) !== this._flexChart.rotated);
    }

    private _getMergeIndex(key1: _PivotKey, key2: _PivotKey) {
        let index = -1;
        if (key1 != null && key2 != null &&
            key1.values.length == key2.values.length &&
            key1.values.length == key1.fields.length &&
            key2.values.length == key2.fields.length) {
            for (let i = 0; i < key1.values.length; i++) {
                let v1 = key1.getValue(i, true);
                let v2 = key2.getValue(i, true);
                if (v1 == v2) {
                    index = i;
                }
                else {
                    return index;
                }
            }
        }
        return index;
    }

    private _getOffsetWidth(labels: any): number {
        let offsetWidth = 0;
        if (labels.length <= 1) {
            return offsetWidth;
        }
        for (let i = 0; i < labels.length - 1; i++) {
            offsetWidth += labels[i].width;
        }
        return offsetWidth;
    }
}
    }
    


    module wijmo.olap {
    







'use strict';

/**
 * Generates MDX queries for the {@link _SqlServerConnection} class.
 */
export class _MdxQueryBuilder {
    private _ng: PivotEngine = null;
    private _cubeName: string = null;

    /**
     * Initializes a new instance of the {@link _MdxQueryBuilder} class.
     *
     * @param engine {@link PivotEngine} from which to derive a query.
     * @param cubeName Name of the cube to be queried.
     */
    constructor(engine: PivotEngine, cubeName: string) {
        this._ng = engine;
        this._cubeName = cubeName;
    }

    /**
     * Builds the MDX query according to information from the {@link PivotEngine}.
     */
    buildQuery(): string {
        let expr = new _TextBuilder();
        let where = this.buildWhereSection(this._ng.valueFields);
        expr.append(
            "SELECT ", this.buildAxes(),
            " FROM ", this.buildCubeName(),
            where);

        expr.append(" CELL PROPERTIES VALUE, FORMAT_STRING");
        return expr.toString();
    }

    /**
     * Builds expressions for the WHERE section of the MDX query.
     * 
     * @param measureShelf Collection of measure fields.
     */
    private buildWhereSection(measureShelf: PivotFieldCollection): string {
        let expr = new _TextBuilder();
        if (measureShelf.length == 1) {
            expr.append(this.buildSetForMeasuresShelf(measureShelf));
            expr.wrap(" WHERE ", "");
        }
        return expr.toString();
    }

    /**
     * Returns the cube name for the FROM section of the MDX query.
     */
    private buildCubeName(): string {
        let expr = new _TextBuilder();
        expr.append(this.buildSubcubeExpression());
        let needSubCube = expr.length > 0;

        if (needSubCube) {
            expr.wrap("SELECT ", " FROM ");
        }

        expr.append("[", this._cubeName, "]");

        if (needSubCube) {
            expr.wrap("(", ")");
        }

        return expr.toString();
    }

    /**
     * Builds the subcube section.
     */
    private buildSubcubeExpression(): string {
        let expr = new _TextBuilder();
        let measures = this.getMeasureFilterExpressions(this._ng.valueFields);
        let filterSet = this.buildFilterAttributeSet(this._ng.filterFields);
        let rowSet = this.buildFilterAttributeSet(this._ng.rowFields, measures);
        let colSet = this.buildFilterAttributeSet(this._ng.columnFields, (rowSet.length == 0) ? measures : null);

        expr.joinItemToList(filterSet);
        expr.joinItemToList(rowSet);
        expr.joinItemToList(colSet);

        if (expr.length > 0) {
            expr.wrap("(", ")");
            expr.append(" ON COLUMNS");
        }

        return expr.toString();
    }

    private buildFilterAttributeSet(shelf: PivotFieldCollection, measures?: string[]): string {
        let expr = new _TextBuilder();

        for (let i = 0; i < shelf.length; i++) {
            let field = shelf[i] as CubePivotField;
            let filter = this.buildFilterString(field, (i == 0) ? measures : null);
            expr.joinItemToList(filter);
        }

        return expr.toString();
    }

    private buildFilterString(field: CubePivotField, measures?: string[]): string {
        let expr = new _TextBuilder();

        if (field.filter.isActive) {
            if (field.filter.conditionFilter.isActive) {
                expr.append(this.getConditionFilterString(field, measures));
            } else if (field.filter.valueFilter.isActive) {
                expr.append(this.getValueFilterString(field));
            }
        } else if (measures) {
            expr.append(this.getConditionFilterString(field, measures));
        }

        return expr.toString();
    }

    private getValueFilterString(field: CubePivotField): string {
        let expr = new _TextBuilder();
        let filter = field.filter.valueFilter;
        let values = Object.keys(filter.showValues).map(v => field.key + ".[" + v + "]");
        expr.append(values.join(","));

        if (expr.length > 0) {
            expr.wrap("{", "}");
        }

        return expr.toString();
    }
    
    private getConditionFilterString(field: CubePivotField, measures?: string[]): string {
        let expr = new _TextBuilder();
        let allMembers = field.key + ".LEVELS(1).ALLMEMBERS";
        let condition1 = field.filter.conditionFilter.condition1;
        let condition2 = field.filter.conditionFilter.condition2;

        if (condition1.isActive) {
            expr.append(this.getConditionFilterExpression(field, condition1));
            if (condition2.isActive) {
                expr.append(field.filter.conditionFilter.and ? " AND " : " OR ");
            }
        }
        if (condition2.isActive) {
            expr.append(this.getConditionFilterExpression(field, condition2));
        }
        if (measures && measures.length > 0) {
            if (expr.length > 0) {
                expr.append(" AND ");
            }
            expr.append(measures.join(" AND "));
        }
        if (expr.length > 0) {
            expr.wrap("Filter(" + allMembers + ",(", "))");
        }

        return expr.toString();
    }

    private getMeasureFilterExpressions(shelf: PivotFieldCollection): string[] {
        let filters = [];

        for (let i = 0; i < shelf.length; i++) {
            let expr = new _TextBuilder();
            let field = shelf[i] as CubePivotField;
            let isMeasure: boolean = field.dimensionType == DimensionType.Measure;
            let condition1 = field.filter.conditionFilter.condition1;
            let condition2 = field.filter.conditionFilter.condition2;

            if (condition1.isActive) {
                expr.append(this.getConditionFilterExpression(field, condition1));
                if (condition2.isActive) {
                    expr.append(field.filter.conditionFilter.and ? " AND " : " OR ");
                }
            }
            if (condition2.isActive) {
                expr.append(this.getConditionFilterExpression(field, condition2));
            }
            if (expr.length > 0) {
                expr.wrap("(", ")");
                filters.push(expr.toString());
            }
        }

        return filters;
    }

    private getConditionFilterExpression(field: CubePivotField, condition: any): string {
        if (!condition.isActive) {
            return "";
        }

        let isMeasure: boolean = field.dimensionType == DimensionType.Measure;
        let isNumeric: boolean = field.dataType == wijmo.DataType.Number;
        let isDate: boolean = field.dataType == wijmo.DataType.Date;
        let property: string = (isNumeric || isDate) ? "member_value" : "member_caption";
        let currentMembers: string = isMeasure ? field.key : field.key + ".CurrentMember." + property;
        let value = isDate ? "CDate('" + wijmo.Globalize.formatDate(condition.value, "d") + "')" : condition.value.toString();
        let expr = new _TextBuilder();

        switch (condition.operator) {
            case wijmo.grid.filter.Operator.BW:
                expr.append("(Left(", currentMembers, ",", value.length.toString(), ")=\"", value, "\")");
                break;
            case wijmo.grid.filter.Operator.EW:
                expr.append("(Right(", currentMembers, ",", value.length.toString(), ")=\"", value, "\")");
                break;
            case wijmo.grid.filter.Operator.EQ:
                if (isMeasure || isNumeric || isDate) {
                    expr.append("(", currentMembers, ")=", value);
                } else {
                    expr.append("(", currentMembers, ")=\"", value, "\"");
                }
                break;
            case wijmo.grid.filter.Operator.NE:
                if (isMeasure || isNumeric || isDate) {
                    expr.append("(", currentMembers, ")<>", value);
                } else {
                    expr.append("(", currentMembers, ")<>\"", value, "\"");
                }
                break;
            case wijmo.grid.filter.Operator.CT:
                expr.append("(InStr(1,", currentMembers, ",\"", value, "\")>0)");
                break;
            case wijmo.grid.filter.Operator.NC:
                expr.append("(InStr(1,", currentMembers, ",\"", value, "\")=0))");
                break;
            case wijmo.grid.filter.Operator.GT:
                expr.append("(", currentMembers, ")>", value);
                break;
            case wijmo.grid.filter.Operator.LT:
                expr.append("(", currentMembers, ")<", value);
                break;
            case wijmo.grid.filter.Operator.GE:
                expr.append("(", currentMembers, ")>=", value);
                break;
            case wijmo.grid.filter.Operator.LE:
                expr.append("(", currentMembers, ")<=", value);
                break;
            default:
                break;
        }

        return expr.toString();
    }

    /**
     * Builds expressions for the SELECT section of the MDX query.
     */
    private buildAxes(): string {
        let expr = new _TextBuilder();

        let axisSet = this.buildSetForAttributesShelf(this._ng.rowFields);
        expr.joinItemToList(axisSet);

        if (this._ng.rowFields.length > 0) {
            if (this._ng.columnFields.length > 0 || this._ng.valueFields.length > 1) {
                expr.append(" ON ROWS");
            } else {
                expr.append(" ON COLUMNS");
            }
        }

        axisSet = this.buildSetForAttributesColumnShelf(this._ng.columnFields);
        expr.joinItemToList(axisSet);

        if (this._ng.columnFields.length > 0) {
            expr.append(" ON COLUMNS");
        }
        if (this._ng.valueFields.length > 1 && this._ng.columnFields.length == 0) {
            axisSet = this.buildSetForMeasuresShelf(this._ng.valueFields);
            expr.joinItemToList(axisSet);
            expr.append(" ON COLUMNS");
        }
        return expr.toString();
    }

    /**
     * Builds set for one axis.
     * 
     * @param shelf Collection of fields to include in tuples of the set.
     */
    private buildSetForAttributesShelf(shelf: PivotFieldCollection): string {
        let expr = new _TextBuilder();

        for (let i = 0; i < shelf.length; i++) {
            var field = shelf[i] as CubePivotField;
            if (field.dimensionType == DimensionType.Attribute || field.dimensionType == DimensionType.Hierarchy) {
                expr.joinItemToList(this.buildAttributeSetForAxis(field));
            }
            if (i > 0) {
                expr.wrap("CrossJoin(", ")");
            }
        }

        expr.wrap("NON EMPTY ", "");
        return expr.toString();
    }

    /**
     * Builds set for one axis.
     * 
     * @param shelf Collection of fields to include in tuples of the set.
     */
    private buildSetForAttributesColumnShelf(shelf: PivotFieldCollection): string {
        let expr = new _TextBuilder();

        for (let i = 0; i < shelf.length; i++) {
            var field = shelf[i] as CubePivotField;
            if (field.dimensionType == DimensionType.Attribute || field.dimensionType == DimensionType.Hierarchy) {
                expr.joinItemToList(this.buildAttributeSetForAxis(field));
            }
        }

        if (this._ng.valueFields.length > 1 && shelf.length > 0) {
            expr.joinItemToList(this.buildSetForMeasuresShelf(this._ng.valueFields));
        }
        if ((this._ng.valueFields.length > 1 && shelf.length > 0) || shelf.length > 1) {
            expr.wrap("CrossJoin(", ")");
        }

        expr.wrap("NON EMPTY ", "");
        return expr.toString();
    }

    /**
     * Builds set for one axis.
     * 
     * @param shelf Collection of fields to include in tuples of the set.
     */
    private buildSetForMeasuresShelf(shelf: PivotFieldCollection): string {
        let expr = new _TextBuilder();

        for (let i = 0; i < shelf.length; i++) {
            var field = shelf[i] as CubePivotField;
            if (field.dimensionType == DimensionType.Measure || field.dimensionType == DimensionType.Kpi) {
                expr.joinItemToList(this.buildMeasureSetForAxis(field));
            }
        }

        expr.wrap("{", "}");
        return expr.toString();
    }

    /**
     * Builds set for one attribute.
     * 
     * @param field Attribute or named set.
     */
    private buildAttributeSetForAxis(field: CubePivotField): string {
        let expr = new _TextBuilder();

        if (field.dimensionType == DimensionType.Hierarchy) {
            expr.append(field.key);
            expr.append(".ALLMEMBERS");
            expr.wrap("{", "}");
            expr.wrap("HIERARCHIZE(", ")");
        }
        return expr.toString();
    }

    /**
     * Builds set for one attribute.
     * 
     * @param field Attribute or named set.
     */
    private buildMeasureSetForAxis(field: CubePivotField): string {
        let expr = new _TextBuilder();

        if (field.dimensionType == DimensionType.Measure || field.dimensionType == DimensionType.Kpi) {
            expr.append(field.key);
        }

        return expr.toString();
    }
}
    }
    


    module wijmo.olap {
    







'use strict';

/**
 * Represents a connection to a standard SSAS service.
 */
export class _SqlServerConnection extends _ServerConnection {
    private _jsonResult = null;
    private _dataTypes = null;
    private _cubeName: string;
    private _catalogName: string;
    private _url: string;
    private _user: string;
    private _password: string;
    private _debug = false;
    //private _override = null;

    /**
     * Initializes a new instance of the {@link _SqlServerConnection} class.
     *
     * @param engine {@link PivotEngine} that owns this field.
     * @param options Options used to communicate with the server.
     */
    constructor(engine: PivotEngine, options: any) {
        super(engine, options.url);
        engine.sortOnServer = true;
        wijmo.assert(wijmo.isString(options.cube) && !wijmo.isNullOrWhiteSpace(options.cube), "Cube name required.");
        this._cubeName = options.cube;
        this._catalogName = (wijmo.isString(options.catalog) && !wijmo.isNullOrWhiteSpace(options.catalog)) ? options.catalog : "";
        this._url = options.url;
        this._user = options.user;
        this._password = options.password;
        //this._override = options.query;
    }

    /**
     * Gets a list of fields available on the server.
     */
    getFields(): PivotField[] {
        // get SSAS session id
        let xhr = this._getSession();

        // parse and return result
        this._jsonResult = null;
        this._dataTypes = null;
        this._getProperties(this._token);
        this._getDimensions(this._token);
        this._endSession();
        return this._jsonResult;
    }

    /**
     * Gets the output view for the current view definition.
     *
     * @param callBack function invoked to handle the results.
     */
    getOutputView(callBack: Function) {
        this._ng.onUpdatingView(new ProgressEventArgs(0));
        let mdx = new _MdxQueryBuilder(this._ng, this._cubeName);
        let query = mdx.buildQuery();
        //if (this._override) {
        //    query = this._override(query);
        //}
        this._jsonResult = [];
        this._getSession();
        this._execQuery(this._token, query, (xhr: XMLHttpRequest) => {
            //if (this._debug && isFunction(saveAs)) {
            //    let blob = new Blob([xhr.responseText], {type: "text/plain;charset=utf-8"});
            //    saveAs(blob, this._token + ".xml");
            //    if (this._jsonResult.length > 0) {
            //        let blob = new Blob([JSON.stringify(this._jsonResult)], {type: "text/plain;charset=utf-8"});
            //        saveAs(blob, this._token + ".json");
            //    }
            //}
            wijmo.asFunction(callBack)(this._jsonResult);
            this._ng.onUpdatedView(new ProgressEventArgs(100)); // TFS 404441
        });
    }

    /**
     * Gets an array containing the data items that were used to calculate
     * an aggregated cell.
     *
     * @param rowKey Identifies the row that contains the aggregated cell.
     * @param colKey Identifies the column that contains the aggregated cell.
     */
    getDetail(rowKey, colKey): any[] {
        throw 'getDetail method not supported';
    }

    /**
     * Returns a sorted array of PivotKey ids (if sortOnServer is true, the assumption is
     * that subtotal keys are returned by the server as if totalsBeforeData is also true).
     */
    getSortedKeys(obj: any, isRow?: boolean): string[] {
        let keys = Object.keys(obj);
        if (!this._ng.sortOnServer) {
            keys.sort((id1, id2) => {
                return this._ng._keys[id1].compareTo(this._ng._keys[id2]);
            });
        } else if (keys.length > 1) {
            let showTotals = isRow ? this._ng.showRowTotals : this._ng.showColumnTotals;
            let maxKeys = isRow ? this._ng.rowFields.length : this._ng.columnFields.length;
            let maxValues = this._ng.valueFields.length;
            if (!this._ng.totalsBeforeData) {
                if (showTotals !== ShowTotals.None) {
                    let last = -1;
                    let totals = [], result = [];
                    keys.forEach(key => {
                        let n = this._getKeyLength(key, isRow);
                        if (n === maxKeys) {
                            result.push(key);
                        } else if (n >= last) {
                            totals.push(key);
                        } else {
                            if (totals.length >= maxValues) {
                                for (var i = 0; i < maxValues; i++) {
                                    result.push(totals.pop());
                                }
                            }
                            totals.push(key);
                        }
                        last = n;
                    });
                    if (totals.length > 0) {
                        totals.reverse();
                        result = result.concat(totals);
                    }
                    return result;
                }
            }
        }
        return keys;
    }
    
    // ** implementation

    // get SSAS session id
    _getSession() {
        let url = this._url;
        return wijmo.httpRequest(url, {
            async: false,
            data: _ENV_SESSION,
            method: "POST",
            user: this._user,
            password: this._password,
            requestHeaders: {
                "Content-Type": "text/xml"
            },
            success: (xhr: XMLHttpRequest) => {
                let xml = xhr.responseXML;
                let session = xml.getElementsByTagName("Session");
                this._token = session[0].getAttribute("SessionId");
            },
            error: (xhr: XMLHttpRequest) => {
                this._handleError("Begin Session", xhr);
            }
        });
    }

    // end SSAS session
    _endSession() {
        let url = this._url;
        return wijmo.httpRequest(url, {
            async: false,
            data: _ENV_ENDSESSION(this._token),
            method: "POST",
            user: this._user,
            password: this._password,
            requestHeaders: {
                "Content-Type": "text/xml"
            },
            error: (xhr: XMLHttpRequest) => {
                this._handleError("End Session", xhr);
            },
            complete: (xhr: XMLHttpRequest) => {
                this._token = undefined;
            }
        });
    }

    // get properties of database members
    _getProperties(id) {
        let url = this._url;
        return wijmo.httpRequest(url, {
            async: false,
            data: _ENV_PROPERTIES(id, this._catalogName, this._cubeName),
            method: "POST",
            user: this._user,
            password: this._password,
            requestHeaders: {
                "Content-Type": "text/xml"
            },
            success: (xhr: XMLHttpRequest) => {
                var types = {};
                var xml = xhr.responseXML;
                var rows = xml.getElementsByTagName("row");
                for (var i = 0; i < rows.length; i++) {
                    var name = _getTagValue(rows[i], "HIERARCHY_UNIQUE_NAME");
                    var type = Number(_getTagValue(rows[i], "DATA_TYPE"));
                    switch (type) {
                        case 2: // Small Integer
                        case 3: // Integer
                        case 4: // Single
                        case 5: // Double
                        case 6: // Currency
                            types[name] = wijmo.DataType.Number;
                            break;
                        case 7: // Date
                            types[name] = wijmo.DataType.Date;
                            break;
                    }
                }
                this._dataTypes = types;
            },
            error: (xhr: XMLHttpRequest) => {
                this._handleError("Get Properties", xhr);
            }
        });
    }

    // get first level dimensions
    _getDimensions(id) {
        let url = this._url;
        return wijmo.httpRequest(url, {
            async: false,
            data: _ENV_DIMENSIONS(id, this._catalogName, this._cubeName),
            method: "POST",
            user: this._user,
            password: this._password,
            requestHeaders: {
                "Content-Type": "text/xml"
            },
            success: (xhr: XMLHttpRequest) => {
                var data = [];
                var xml = xhr.responseXML;
                var rows = xml.getElementsByTagName("row");
                for (var i = 0; i < rows.length; i++) {
                    var type = _getTagValue(rows[i], "DIMENSION_TYPE");
                    if (type !== "2") { // MD_DIMTYPE_MEASURE
                        var dim = _getTagValue(rows[i], "DIMENSION_UNIQUE_NAME");
                        var field = {
                            "header": _getTagValue(rows[i], "DIMENSION_CAPTION"),
                            "dataType": wijmo.DataType.Object,
                            "dimensionType": DimensionType.Dimension,
                            "subFields": []
                        };
                        this._getSubFolders(id, dim, field);
                        data.push(field);
                    } else {
                        this._getMeasures(id, data);
                    }
                }
                var kpi = {
                    "header": "KPIs",
                    "dataType": wijmo.DataType.Object,
                    "dimensionType": DimensionType.Kpi,
                    "subFields": []
                }
                this._getKPIs(id, kpi);
                data.push(kpi);
                this._jsonResult = data;
            },
            error: (xhr: XMLHttpRequest) => {
                this._handleError("Get Dimensions", xhr);
            }
        });
    }

    // get subfolders for second level
    _getSubFolders(id, dimension, field) {
        let url = this._url;
        wijmo.httpRequest(url, {
            async: false,
            data: _ENV_HIERARCHIES(id, this._catalogName, this._cubeName, dimension),
            method: "POST",
            user: this._user,
            password: this._password,
            requestHeaders: {
                "Content-Type": "text/xml"
            },
            success: (xhr: XMLHttpRequest) => {
                var xml = xhr.responseXML;
                var rows = xml.getElementsByTagName("row");
                for (var i = 0; i < rows.length; i++) {
                    var row = {
                        "header": _getTagValue(rows[i], "HIERARCHY_NAME"),
                        "binding": _getTagValue(rows[i], "HIERARCHY_UNIQUE_NAME"),
                        "dataType": wijmo.DataType.String,
                        "dimensionType": DimensionType.Hierarchy
                    };
                    if (this._dataTypes[row.binding]) {
                        row.dataType = this._dataTypes[row.binding];
                    }
                    var folder = _getTagValue(rows[i], "HIERARCHY_DISPLAY_FOLDER");
                    var names = folder.split("\\");
                    var temp: any = field;
                    for (var n = 0; n < names.length; n++) {
                        if (names[n] == "") continue;
                        var child = {
                            "header": names[n],
                            "dataType": wijmo.DataType.Object,
                            "dimensionType": DimensionType.Folder,
                            "subFields": []
                        };
                        if (!_containsFolder(temp, names[n])) {
                            temp.subFields.push(child);
                            temp = child;
                        } else {
                            temp = _findSubFieldByName(temp, names[n]);
                        }
                    }
                    temp.subFields.push(row);
                }
            },
            error: (xhr: XMLHttpRequest) => {
                this._handleError("Get Hierarchies", xhr);
            }
        });
    }

    // get measures
    _getMeasures(id, fields) {
        let url = this._url;
        return wijmo.httpRequest(url, {
            async: false,
            data: _ENV_MEASURES(id, this._catalogName, this._cubeName),
            method: "POST",
            user: this._user,
            password: this._password,
            requestHeaders: {
                "Content-Type": "text/xml"
            },
            success: (xhr: XMLHttpRequest) => {
                var xml = xhr.responseXML;
                var rows = xml.getElementsByTagName("row");
                var folders = {};
                for (var i = 0; i < rows.length; i++) {
                    var folder = _getTagValue(rows[i], "MEASUREGROUP_NAME");
                    var field = {
                        "header": _getTagValue(rows[i], "MEASURE_CAPTION"),
                        "binding": _getTagValue(rows[i], "MEASURE_UNIQUE_NAME"),
                        "dataType": wijmo.DataType.Number,
                        "dimensionType": DimensionType.Measure
                    };
                    if (Object.keys(folders).indexOf(folder) < 0) {
                        var measure = {
                            "header": folder,
                            "dataType": wijmo.DataType.Number,
                            "dimensionType": DimensionType.Measure,
                            "subFields": []
                        };
                        measure.subFields.push(field);
                        fields.push(measure);
                        folders[folder] = measure;
                    } else {
                        folders[folder].subFields.push(field);
                    }
                }
            },
            error: (xhr: XMLHttpRequest) => {
                this._handleError("Get Measures", xhr);
            }
        });
    }

    // get KPIs
    _getKPIs(id, field) {
        let url = this._url;
        return wijmo.httpRequest(url, {
            async: false,
            data: _ENV_KPIS(id, this._catalogName, this._cubeName),
            method: "POST",
            user: this._user,
            password: this._password,
            requestHeaders: {
                "Content-Type": "text/xml"
            },
            success: (xhr: XMLHttpRequest) => {
                var xml = xhr.responseXML;
                var rows = xml.getElementsByTagName("row");
                for (var i = 0; i < rows.length; i++) {
                    var folder = _getTagValue(rows[i], "KPI_DISPLAY_FOLDER");
                    var names = folder.split("\\");
                    var temp: any = field;
                    for (var n = 0; n < names.length; n++) {
                        var child = {
                            "header": names[n],
                            "dataType": wijmo.DataType.Object,
                            "dimensionType": DimensionType.Folder,
                            "subFields": []
                        };
                        if (!_containsFolder(temp, names[n])) {
                            temp.subFields.push(child);
                            temp = child;
                        } else {
                            temp = _findSubFieldByName(temp, names[n]);
                        }
                    }
                    var kpi = {
                        "header": _getTagValue(rows[i], "KPI_CAPTION"),
                        "binding": _getTagValue(rows[i], "KPI_VALUE"),
                        "dataType": wijmo.DataType.Number,
                        "dimensionType": DimensionType.Kpi
                    };
                    temp.subFields.push(kpi);
                }
            },
            error: (xhr: XMLHttpRequest) => {
                this._handleError("Get KPIs", xhr);
            }
        });
    }

    // execute mdx query
    _execQuery(id, query, success: Function) {
        let url = this._url;
        return wijmo.httpRequest(url, {
            async: true,
            data: _ENV_QUERY(id, this._catalogName, query),
            method: "POST",
            user: this._user,
            password: this._password,
            requestHeaders: {
                "Content-Type": "text/xml"
            },
            success: (xhr: XMLHttpRequest) => {
                let xml: Document = xhr.responseXML;
                let error: Element = xml.querySelector("Error");
                if (error) {
                    let desc = error.getAttribute("Description");
                    throw "SSAS Error" + '\r\n' + desc + '\r\n' + query;
                } else {
                    this._createPivotKeys(xml);
                    wijmo.asFunction(success)(xhr);
                }
            },
            error: (xhr: XMLHttpRequest) => {
                this._handleError("Execute Query", xhr);
            },
            complete: () => {
                this._endSession();
            }
        });
    }

    // convert XML cell data to an array of objects
    _createPivotKeys(xml: Document) {
        let rowAxis: Element = null;
        let columnAxis: Element = null;
        let cellData: Element = xml.querySelector("CellData");
        if (this._ng.columnFields.length > 0 || this._ng.valueFields.length > 1) {
            columnAxis = xml.querySelector("Axis[name='Axis0']");
            if (this._ng.rowFields.length > 0) {
                rowAxis = xml.querySelector("Axis[name='Axis1']");
            }
        } else {
            if (this._ng.rowFields.length > 0) {
                rowAxis = xml.querySelector("Axis[name='Axis0']");
            }
        }
        let hasRows = rowAxis && this._ng.rowFields.length > 0;
        let hasColumns = columnAxis && this._ng.columnFields.length > 0;
        if (hasRows && hasColumns) {
            this._createRowKeys(cellData, rowAxis, columnAxis);
        } else if (hasRows) {
            this._createRowOnlyKeys(cellData, rowAxis);
        } else if (hasColumns) {
            this._createColumnOnlyKeys(cellData, columnAxis);
        }
    }

    // process row tuples when there are columns
    _createRowKeys(cellData: Element, rowAxis: Element, columnAxis: Element) {
        let rowTuples = rowAxis.getElementsByTagName("Tuple");
        let columnTuples = columnAxis.getElementsByTagName("Tuple");
        let rowStart = this._ng.showRowTotals !== ShowTotals.None ? 0 : 1;
        let columnStart = this._ng.showColumnTotals !== ShowTotals.None ? 0 : this._ng.valueFields.length;
        for (let i = rowStart; i < rowTuples.length; i++) {
            let ordinal = i * columnTuples.length;
            let rowTuple = rowTuples[i];
            let cell = this._validateTuple(rowTuple, this._ng.showRowTotals);
            if (cell) {
                for (let j = columnStart; j < columnTuples.length; j++) {
                    let columnTuple = columnTuples[j];
                    let result = this._validateTuple(columnTuple, this._ng.showColumnTotals);
                    if (result) {
                        for (let key in cell) {
                            result[key] = cell[key];
                        }
                        for (let v = 0; v < this._ng.valueFields.length; v++) {
                            let field = this._ng.valueFields[v] as CubePivotField;
                            result[field.key] = _getCellValue(cellData, ordinal + j + v);
                        }
                        this._jsonResult.push(result);
                    }
                }
            }
        }
    }

    // process row tuples when there are no columns
    _createRowOnlyKeys(cellData: Element, rowAxis: Element) {
        let tuples = rowAxis.getElementsByTagName("Tuple");
        let skip = this._ng.valueFields.length;
        let start = this._ng.showRowTotals !== ShowTotals.None ? 0 : 1;
        let ordinal = start * skip;
        for (let i = start; i < tuples.length; i++) {
            let tuple = tuples[i];
            let cell = this._validateTuple(tuple, this._ng.showRowTotals);
            if (cell) {
                for (let v = 0; v < this._ng.valueFields.length; v++) {
                    let field = this._ng.valueFields[v] as CubePivotField;
                    cell[field.key] = _getCellValue(cellData, ordinal++);
                }
                this._jsonResult.push(cell);
            } else {
                ordinal++;
            }
        }
    }

    // process column tuples when there are no rows
    _createColumnOnlyKeys(cellData: Element, columnAxis: Element) {
        let tuples = columnAxis.getElementsByTagName("Tuple");
        let skip = this._ng.valueFields.length;
        let start = this._ng.showColumnTotals !== ShowTotals.None ? 0 : 1;
        for (let i = start; i < tuples.length; i += skip) {
            let tuple = tuples[i];
            let cell = this._validateTuple(tuple, this._ng.showColumnTotals);
            if (cell) {
                for (let v = 0; v < this._ng.valueFields.length; v++) {
                    let field = this._ng.valueFields[v] as CubePivotField;
                    cell[field.key] = _getCellValue(cellData, i - start + v);
                }
                this._jsonResult.push(cell);
	        }
        }
    }

    // return an object that maps hierarchy keys to axis captions
    // (null return means skip this tuple and its <CellData> entries)
    _validateTuple(tuple: Element, totals: ShowTotals): any {
        let members = tuple.getElementsByTagName("Member");
        let oldLevel = undefined;
        let result = {};
        for (let m = 0; m < members.length; m++) {
            let member = members[m];
            let level = _getLevelNumber(member);
            let hierarchy = member.getAttribute("Hierarchy");
            let caption = _getCaptionValue(member);
            if (m == 0) {
                oldLevel = level;
            } else if (level > oldLevel) {
                return null;
            } else if (totals !== ShowTotals.Subtotals && level !== oldLevel && hierarchy !== "[Measures]") {
                return null;
            } else {
                oldLevel = level;
            }
            if (hierarchy.indexOf(".") >= 0) { // ignore [Measures], for example
                result[hierarchy] = caption;
            } else if (caption !== null) {
                result[caption] = null;
            }
        }
        return result;
    }
}

// ** helper functions for XML parsing

function _getTagValue(row: Element, name: string): string {
    let tag = row.querySelector(name);
    return tag ? (tag.innerHTML || tag.textContent) : null;
}

function _getLevelNumber(row: Element): number {
    return Number(_getTagValue(row, "LNum"));
}

function _getCaptionValue(row: Element): string {
    return _getLevelNumber(row) > 0 ? _getTagValue(row, "Caption") : null;
}

function _getCellValue(cells: Element, ordinal: number): number {
    let expr = "Cell[CellOrdinal='" + ordinal.toString() + "']";
    let cell = cells.querySelector(expr);
    if (cell) {
        let value = _getTagValue(cell, "Value");
        if (value) {
            return Number(value);
        }
    }
    return null;
}

// ** helper functions for building field hierarchy

function _findSubFieldByName(field, name: string) {
    if (field.subFields) {
        for (var i = 0; i < field.subFields.length; i++) {
            var sub = field.subFields[i];
            if (sub.header == name) {
                return sub;
            }
        }
    }
    return field;
}

function _containsFolder(field, name: string): boolean {
    if (field.subFields) {
        for (var i = 0; i < field.subFields.length; i++) {
            var sub = field.subFields[i];
            if (sub.header == name) {
                return true;
            }
        }
    }
    return false;
}

// ** SOAP envelope templates for XMLA

const _ENV_SESSION = `
    <Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/">
        <Header>
            <BeginSession soap:mustUnderstand="1" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns="urn:schemas-microsoft-com:xml-analysis" />
        </Header>
        <Body>
            <Execute xmlns="urn:schemas-microsoft-com:xml-analysis">
                <Command>
                    <Statement />
                </Command>
                <Properties>
                </Properties>
            </Execute>
        </Body>
    </Envelope>`;

const _ENV_ENDSESSION = (sessionId) => `
    <Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/">
        <Header>
            <XA:EndSession soap:mustUnderstand="1" SessionId="${sessionId}" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:XA="urn:schemas-microsoft-com:xml-analysis" />
        </Header>
        <Body>
            <Execute xmlns="urn:schemas-microsoft-com:xml-analysis">
                <Command>
                    <Statement />
                </Command>
                <Properties>
                </Properties>
            </Execute>
        </Body>
    </Envelope>`;

const _ENV_DIMENSIONS = (sessionId, catalogName, cubeName) => `
    <Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/">
        <Header>
            <XA:Session soap:mustUnderstand="1" SessionId="${sessionId}" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:XA="urn:schemas-microsoft-com:xml-analysis" />
        </Header>
        <Body>
            <Discover xmlns="urn:schemas-microsoft-com:xml-analysis">
                <RequestType>MDSCHEMA_DIMENSIONS</RequestType>
                <Restrictions>
                    <RestrictionList>
                        <CATALOG_NAME>${catalogName}</CATALOG_NAME>
                        <CUBE_NAME>${cubeName}</CUBE_NAME>
                    </RestrictionList>
                </Restrictions>
                <Properties>
                </Properties>
            </Discover>
        </Body>
    </Envelope>`;

const _ENV_HIERARCHIES = (sessionId, catalogName, cubeName, dimensionName) => `
    <Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/">
        <Header>
            <XA:Session soap:mustUnderstand="1" SessionId="${sessionId}" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:XA="urn:schemas-microsoft-com:xml-analysis" />
        </Header>
        <Body>
            <Discover xmlns="urn:schemas-microsoft-com:xml-analysis">
                <RequestType>MDSCHEMA_HIERARCHIES</RequestType>
                <Restrictions>
                    <RestrictionList>
                        <CATALOG_NAME>${catalogName}</CATALOG_NAME>
                        <CUBE_NAME>${cubeName}</CUBE_NAME>
                        <DIMENSION_UNIQUE_NAME>${dimensionName}</DIMENSION_UNIQUE_NAME>
                    </RestrictionList>
                </Restrictions>
                <Properties>
                </Properties>
            </Discover>
        </Body>
    </Envelope>`;

const _ENV_MEASURES = (sessionId, catalogName, cubeName) => `
    <Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/">
        <Header>
            <XA:Session soap:mustUnderstand="1" SessionId="${sessionId}" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:XA="urn:schemas-microsoft-com:xml-analysis" />
        </Header>
        <Body>
            <Discover xmlns="urn:schemas-microsoft-com:xml-analysis">
                <RequestType>MDSCHEMA_MEASURES</RequestType>
                <Restrictions>
                    <RestrictionList>
                        <CATALOG_NAME>${catalogName}</CATALOG_NAME>
                        <CUBE_NAME>${cubeName}</CUBE_NAME>
                    </RestrictionList>
                </Restrictions>
                <Properties>
                </Properties>
            </Discover>
        </Body>
    </Envelope>`;

const _ENV_KPIS = (sessionId, catalogName, cubeName) => `
    <Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/">
        <Header>
            <XA:Session soap:mustUnderstand="1" SessionId="${sessionId}" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:XA="urn:schemas-microsoft-com:xml-analysis" />
        </Header>
        <Body>
            <Discover xmlns="urn:schemas-microsoft-com:xml-analysis">
                <RequestType>MDSCHEMA_KPIS</RequestType>
                <Restrictions>
                    <RestrictionList>
                        <CATALOG_NAME>${catalogName}</CATALOG_NAME>
                        <CUBE_NAME>${cubeName}</CUBE_NAME>
                    </RestrictionList>
                </Restrictions>
                <Properties>
                </Properties>
            </Discover>
        </Body>
    </Envelope>`;

const _ENV_LEVELS = (sessionId, catalogName, cubeName) => `
    <Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/">
        <Header>
            <XA:Session soap:mustUnderstand="1" SessionId="${sessionId}" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:XA="urn:schemas-microsoft-com:xml-analysis" />
        </Header>
        <Body>
            <Discover xmlns="urn:schemas-microsoft-com:xml-analysis">
                <RequestType>MDSCHEMA_LEVELS</RequestType>
                <Restrictions>
                    <RestrictionList>
                        <CATALOG_NAME>${catalogName}</CATALOG_NAME>
                        <CUBE_NAME>${cubeName}</CUBE_NAME>
                    </RestrictionList>
                </Restrictions>
                <Properties>
                </Properties>
            </Discover>
        </Body>
    </Envelope>`;

const _ENV_PROPERTIES = (sessionId, catalogName, cubeName) => `
    <Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/">
        <Header>
            <XA:Session soap:mustUnderstand="1" SessionId="${sessionId}" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:XA="urn:schemas-microsoft-com:xml-analysis" />
        </Header>
        <Body>
            <Discover xmlns="urn:schemas-microsoft-com:xml-analysis">
                <RequestType>MDSCHEMA_PROPERTIES</RequestType>
                <Restrictions>
                    <RestrictionList>
                        <CATALOG_NAME>${catalogName}</CATALOG_NAME>
                        <CUBE_NAME>${cubeName}</CUBE_NAME>
                        <PROPERTY_NAME>MEMBER_VALUE</PROPERTY_NAME>
                    </RestrictionList>
                </Restrictions>
                <Properties>
                </Properties>
            </Discover>
        </Body>
    </Envelope>`;

const _ENV_QUERY = (sessionId, catalogName, query) => `
    <Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/">
        <Header>
            <XA:Session soap:mustUnderstand="1" SessionId="${sessionId}" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:XA="urn:schemas-microsoft-com:xml-analysis" />
        </Header>
        <Body>
            <Execute xmlns="urn:schemas-microsoft-com:xml-analysis">
                <Command>
                    <Statement>
                        <![CDATA[
                        ${query}
                        ]]>
                    </Statement>
                </Command>
                <Properties>
                    <PropertyList>
                        <Catalog>${catalogName}</Catalog>
                        <Content>Data</Content>
                    </PropertyList>
                </Properties>
            </Execute>
        </Body>
    </Envelope>`;
    }
    


    module wijmo.olap {
    




'use strict';

/**
 * Represents a filter used to select values for a {@link PivotField}.
 * 
 * There are two types of filter: by value and by condition. 
 * 
 * Value filters allow users to select specific values they want 
 * to include in the analysis. This is done by checking specific
 * values from a list.
 * 
 * Condition filters include two conditions specified by an operator
 * and a value (e.g. 'begins with' and 's'). The conditions may
 * be combined with an 'and' or an 'or' operator.
 * 
 * When the {@link PivotEngine} is connected to server-based data 
 * sources, only condition filters can be used (value filters are
 * automatically hidden).
 */
export class PivotFilter {
    private _fld: PivotField;
    private _valueFilter: wijmo.grid.filter.ValueFilter;
    private _conditionFilter: wijmo.grid.filter.ConditionFilter;
    /*private*/ _filterType: wijmo.grid.filter.FilterType; // visible to PivotEngine

    /**
     * Initializes a new instance of the {@link PivotFilter} class.
     *
     * @param field {@link PivotField} that owns this filter.
     */
    constructor(field: PivotField) {
        this._fld = field;

        // REVIEW
        // use the field as a 'pseudo-column' to build value and condition filters;
        // properties in common:
        //   binding, format, dataType, isContentHtml, collectionView
        let col = field as any;

        this._valueFilter = new wijmo.grid.filter.ValueFilter(col);
        this._valueFilter.exclusiveValueSearch = this._fld.engine.exclusiveValueSearch;
        this._conditionFilter = new wijmo.grid.filter.ConditionFilter(col);
    }

    // ** object model

    /**
     * Gets or sets the types of filtering provided by this filter.
     *
     * Setting this property to null causes the filter to use the value
     * defined by the owner filter's {@link FlexGridFilter.defaultFilterType}
     * property.
     */
    get filterType(): wijmo.grid.filter.FilterType {
        return this._filterType != null
            ? this._filterType
            : this._fld.engine.defaultFilterType;
    }
    set filterType(value: wijmo.grid.filter.FilterType) {
        value = wijmo.asEnum(value, wijmo.grid.filter.FilterType, true);
        if (value != this._filterType) {
            this._filterType = value;
            this.clear();
        }
    }
    /**
     * Gets a value that indicates whether a value passes the filter.
     *
     * @param value The value to test.
     */
    apply(value: any): boolean {
        return this._conditionFilter.apply(value) && this._valueFilter.apply(value);
    }
    /**
     * Gets a value that indicates whether the filter is active.
     */
    get isActive(): boolean {
        return this._conditionFilter.isActive || this._valueFilter.isActive;
    }
    /**
     * Clears the filter.
     */
    clear(): void {
        let changed = false;
        if (this._valueFilter.isActive) {
            this._valueFilter.clear();
            changed = true;
        }
        if (this._conditionFilter.isActive) {
            this._valueFilter.clear();
            changed = true;
        }
        if (changed) {
            this._fld.onPropertyChanged(new wijmo.PropertyChangedEventArgs('filter', null, null));
        }
    }
    /**
     * Gets the {@link ValueFilter} in this {@link PivotFilter}.
     */
    get valueFilter(): wijmo.grid.filter.ValueFilter {
        return this._valueFilter;
    }
    /**
     * Gets the {@link ConditionFilter} in this {@link PivotFilter}.
     */
    get conditionFilter(): wijmo.grid.filter.ConditionFilter {
        return this._conditionFilter;
    }
}
    }
    


    module wijmo.olap {
    




'use strict';

/**
 * Editor for {@link PivotFilter} objects.
 */
export class PivotFilterEditor extends wijmo.Control {

    // property storage
    private _fld: PivotField;
    private _uniqueValues: any[];

    // child elements
    private _divType: HTMLInputElement;
    private _aCnd: HTMLLinkElement;
    private _aVal: HTMLLinkElement;
    private _divEdtVal: HTMLElement;
    private _divEdtCnd: HTMLElement;
    private _btnOk: HTMLLinkElement;

    // child controls
    private _edtVal: wijmo.grid.filter.ValueFilterEditor;
    private _edtCnd: wijmo.grid.filter.ConditionFilterEditor;

    /**
     * Gets or sets the template used to instantiate {@link PivotFilterEditor} controls.
     */
    static controlTemplate =
        '<div>' +
            '<div wj-part="div-type" style="text-align:center;margin-bottom:12px;font-size:80%">' +
                '<a wj-part="a-cnd" href="" tabindex="-1" draggable="false"></a>' +
                '&nbsp;|&nbsp;' +
                '<a wj-part="a-val" href="" tabindex="-1" draggable="false"></a>' +
            '</div>' +
            '<div wj-part="div-edt-val" tabindex="-1"></div>' +
            '<div wj-part="div-edt-cnd" tabindex="-1"></div>' +
            '<div style="text-align:right;margin-top:10px">' +
                '<button wj-part="btn-ok" class="wj-btn"></button>' +
            '</div>' +
        '</div>';

    /**
     * Initializes a new instance of the {@link PivotFilterEditor} class.
     *
     * @param element The DOM element that hosts the control, or a selector 
     * for the host element (e.g. '#theCtrl').
     * @param field The {@link PivotField} to edit.
     * @param options JavaScript object containing initialization data for the editor.
     */
    constructor(element: any, field: PivotField, options?: any) {
        super(element);

        // check dependencies
        //  let depErr = 'Missing dependency: PivotFilterEditor requires ';
        //  assert(input != null, depErr + 'wijmo.input.');

        // no focus on the control host (TFS 208262)
        this.hostElement.tabIndex = -1;

        // instantiate and apply template
        let tpl = this.getTemplate();
        this.applyTemplate('wj-control wj-content wj-pivotfiltereditor', tpl, {
            _divType: 'div-type',
            _aVal: 'a-val',
            _aCnd: 'a-cnd',
            _divEdtVal: 'div-edt-val',
            _divEdtCnd: 'div-edt-cnd',
            _btnOk: 'btn-ok'
        });

        // localization
        wijmo.setText(this._aVal, wijmo.culture.FlexGridFilter.values);
        wijmo.setText(this._aCnd, wijmo.culture.FlexGridFilter.conditions);
        wijmo.setText(this._btnOk, wijmo.culture.olap.PivotFieldEditor.ok);

        // handle button clicks
        let bnd = this._btnClicked.bind(this);
        this.addEventListener(this._btnOk, 'click', bnd);
        this.addEventListener(this._aVal, 'click', bnd);
        this.addEventListener(this._aCnd, 'click', bnd);

        // commit/dismiss on Enter/Esc, keep focus within control when tabbing
        this.addEventListener(this.hostElement, 'keydown', (e) => {
            switch (e.keyCode) {
                case wijmo.Key.Enter:
                    switch ((e.target as HTMLElement).tagName) {
                        case 'A':
                        case 'BUTTON':
                            this._btnClicked(e);
                            break;
                        default:
                            this.onFinishEditing(new wijmo.CancelEventArgs());
                            break;
                    }
                    e.preventDefault();
                    break;
                case wijmo.Key.Escape:
                    this.onFinishEditing(new wijmo.CancelEventArgs());
                    e.preventDefault();
                    break;
                case wijmo.Key.Tab:
                    wijmo.moveFocus(this.hostElement, e.shiftKey ? -1 : +1);
                    e.preventDefault();
                    break;
            }
        });

        // field being edited
        this._fld = field;
        this._uniqueValues = field.filter.valueFilter.uniqueValues;

        // apply options
        this.initialize(options);

        // initialize all values
        this.updateEditor();
    }

    // ** object model

    /**
     * Gets a reference to the {@link PivotField} whose filter is being edited.
     */
    get field(): PivotField {
        return this._fld;
    }
    /**
     * Gets a reference to the {@link PivotFilter} being edited.
     */
    get filter(): PivotFilter {
        return this._fld ? this._fld.filter : null;
    }
    /**
     * Gets a value that determines whether the editor has been cleared.
     */
    get isEditorClear(): boolean {
        switch (this._getFilterType()) {
            case wijmo.grid.filter.FilterType.Value:
                return !this._edtVal || this._edtVal.isEditorClear;
            case wijmo.grid.filter.FilterType.Condition:
                return !this._edtCnd || this._edtCnd.isEditorClear;
        }
        wijmo.assert(false, 'unknown filter type?')
        return false;
    }
    /**
     * Updates the editor with current filter settings.
     */
    updateEditor() {

        // show/hide filter editors
        let FT = wijmo.grid.filter.FilterType,
            ft = FT.None;
        if (this.filter) {
            ft = (this.filter.conditionFilter.isActive || (this.filter.filterType & FT.Value) == 0)
                ? FT.Condition
                : FT.Value;
            this._showFilter(ft);
        }

        // update filter editors
        if (this._edtVal) {
            let fld = this._fld,
                ng = fld.engine;
            if (ng.isServer && !this._uniqueValues) {
                let arr = ng._getUniqueValues(fld);
                fld.filter.valueFilter.uniqueValues = arr;
            }
            this._edtVal.updateEditor();
        }
        if (this._edtCnd) {
            this._edtCnd.updateEditor();
        }
    }
    /**
     * Updates the filter to reflect the current editor values.
     */
    updateFilter() {

        // update the filter
        switch (this._getFilterType()) {
            case wijmo.grid.filter.FilterType.Value:
                this._edtVal.updateFilter();
                this.filter.conditionFilter.clear();
                break;
            case wijmo.grid.filter.FilterType.Condition:
                this._edtCnd.updateFilter();
                this.filter.valueFilter.clear();
                break;
        }

        // refresh the view
        this.field.onPropertyChanged(new wijmo.PropertyChangedEventArgs('filter', null, null));
    }
    /**
     * Clears the editor fields without applying changes to the filter.
     */
    clearEditor() {
        if (this._edtVal) {
            this._edtVal.clearEditor();
        }
        if (this._edtCnd) {
            this._edtCnd.clearEditor();
        }
    }

    /**
     * Occurs when the user finishes editing the filter.
     */
    readonly finishEditing = new wijmo.Event<PivotFilterEditor, wijmo.CancelEventArgs>();
    /**
     * Raises the {@link finishEditing} event.
     */
    onFinishEditing(e?: wijmo.CancelEventArgs) {
        this.finishEditing.raise(this, e);
        return !e.cancel;
    }

    // ** implementation

    // shows the value or filter editor
    private _showFilter(filterType: wijmo.grid.filter.FilterType) {

        // create editor if we have to
        if (filterType == wijmo.grid.filter.FilterType.Value && this._edtVal == null) {
            this._edtVal = new wijmo.grid.filter.ValueFilterEditor(this._divEdtVal, this.filter.valueFilter);
        }
        if (filterType == wijmo.grid.filter.FilterType.Condition && this._edtCnd == null) {
            this._edtCnd = new wijmo.grid.filter.ConditionFilterEditor(this._divEdtCnd, this.filter.conditionFilter);
        }

        // show selected editor
        if ((filterType & this.filter.filterType) != 0) {
            if (filterType == wijmo.grid.filter.FilterType.Value) {
                this._divEdtVal.style.display = '';
                this._divEdtCnd.style.display = 'none';
                this._enableLink(this._aVal, false);
                this._enableLink(this._aCnd, true);
            } else {
                this._divEdtVal.style.display = 'none';
                this._divEdtCnd.style.display = '';
                this._enableLink(this._aVal, true);
                this._enableLink(this._aCnd, false);
            }
        }

        // hide switch button if only one filter type is supported
        switch (this.filter.filterType) {
            case wijmo.grid.filter.FilterType.None:
            case wijmo.grid.filter.FilterType.Condition:
            case wijmo.grid.filter.FilterType.Value:
                this._divType.style.display = 'none';
                break;
            default:
                this._divType.style.display = '';
                break;
        }
    }

    // enable/disable filter switch links
    _enableLink(a: HTMLLinkElement, enable: boolean) {
        a.style.textDecoration = enable ? '' : 'none';
        a.style.fontWeight = enable ? '' : 'bold';
        wijmo.setAttribute(a, 'href', enable ? '' : null);
    }

    // gets the type of filter currently being edited
    private _getFilterType(): wijmo.grid.filter.FilterType {
        let ft = wijmo.grid.filter.FilterType;
        return this._divEdtVal.style.display != 'none' ? ft.Value : ft.Condition;
    }

    // handle buttons
    private _btnClicked(e) {
        e.preventDefault();
        e.stopPropagation();

        // ignore disabled elements
        if (wijmo.hasClass(e.target, 'wj-state-disabled')) {
            return;
        }

        // switch filters
        if (e.target == this._aVal) {
            this._showFilter(wijmo.grid.filter.FilterType.Value);
            wijmo.moveFocus(this._edtVal.hostElement, 0);
            return;
        }
        if (e.target == this._aCnd) {
            this._showFilter(wijmo.grid.filter.FilterType.Condition);
            wijmo.moveFocus(this._edtCnd.hostElement, 0);
            return;
        }

        // finish editing
        this.onFinishEditing(new wijmo.CancelEventArgs());
    }
}

    }
    


    module wijmo.olap {
    







'use strict';

/**
 * Editor for {@link PivotField} objects.
 */
export class PivotFieldEditor extends wijmo.Control {

    // property storage
    private _fld: PivotField;   // field being edited
    private _pvDate: Date;      // date to show in the preview

    // child elements
    private _dBnd: HTMLElement;
    private _dHdr: HTMLElement;
    private _dAgg: HTMLElement;
    private _dShw: HTMLElement;
    private _dWFl: HTMLElement;
    private _dSrt: HTMLElement;
    private _dFmt: HTMLElement;
    private _dSmp: HTMLElement;
    private _dFlt: HTMLElement;
    private _btnFltEdt: HTMLButtonElement;
    private _btnFltClr: HTMLButtonElement;
    private _btnApply: HTMLButtonElement;
    private _btnCancel: HTMLButtonElement;

    // child controls
    private _cmbHdr: wijmo.input.ComboBox;
    private _cmbAgg: wijmo.input.ComboBox;
    private _cmbShw: wijmo.input.ComboBox;
    private _cmbWFl: wijmo.input.ComboBox;
    private _cmbSrt: wijmo.input.ComboBox;
    private _cmbFmt: wijmo.input.ComboBox;
    private _cmbSmp: wijmo.input.ComboBox;
    private _eFlt: PivotFilterEditor;

    // globalizable elements
    private _gDlg: HTMLElement;
    private _gHdr: HTMLElement;
    private _gAgg: HTMLElement;
    private _gShw: HTMLElement;
    private _gWfl: HTMLElement;
    private _gSrt: HTMLElement;
    private _gFlt: HTMLElement;
    private _gFmt: HTMLElement;
    private _gSmp: HTMLElement;

    /**
     * Gets or sets the template used to instantiate {@link PivotFieldEditor} controls.
     */
    static controlTemplate = '<div>' +

        // header
        '<div class="wj-dialog-header" tabindex="-1">' +
        '<span wj-part="g-dlg"></span> <span wj-part="sp-bnd"></span>' +
        '</div>' +

        // body
        '<div class="wj-dialog-body">' +

        // content
        '<table style="table-layout:fixed">' +
        '<tr>' +
        '<td wj-part="g-hdr"></td>' +
        '<td><div wj-part="div-hdr"></div></td>' +
        '</tr>' +
        '<tr class="wj-separator">' +
        '<td wj-part="g-agg"></td>' +
        '<td><div wj-part="div-agg"></div></td>' +
        '</tr>' +
        '<tr class="wj-separator">' +
        '<td wj-part="g-shw"></td>' +
        '<td><div wj-part="div-shw"></div></td>' +
        '</tr>' +
        '<tr>' +
        '<td wj-part="g-wfl"></td>' +
        '<td><div wj-part="div-wfl"></div></td>' +
        '</tr>' +
        '<tr>' +
        '<td wj-part="g-srt"></td>' +
        '<td><div wj-part="div-srt"></div></td>' +
        '</tr>' +
        '<tr class="wj-separator">' +
        '<td wj-part="g-flt"></td>' +
        '<td>' +
        '<div>' + // TFS 318475
        '<button wj-part="btn-flt-edt" class="wj-btn"></button>&nbsp;&nbsp;' +
        '<button wj-part="btn-flt-clr" class="wj-btn"></button>' +
        '</div>' +
        '</td>' +
        '</tr>' +
        '<tr class="wj-separator">' +
        '<td wj-part="g-fmt"></td>' +
        '<td><div wj-part="div-fmt"></div></td>' +
        '</tr>' +
        '<tr>' +
        '<td wj-part="g-smp"></td>' +
        '<td><div wj-part="div-smp" readonly tabindex="-1"></div></td>' +
        '</tr>' +
        '</table>' +
        '</div>' +

        // footer
        '<div class="wj-dialog-footer">' +
        '<button wj-part="btn-apply" class="wj-btn wj-hide"></button>&nbsp;&nbsp;' +
        '<button wj-part="btn-cancel" class="wj-btn wj-hide"></button>' +
        '</div>' +
        '</div>';

    /**
     * Initializes a new instance of the {@link PivotFieldEditor} class.
     *
     * @param element The DOM element that hosts the control, or a CSS selector for the host element (e.g. '#theCtrl').
     * @param options The JavaScript object containing initialization data for the control.
     */
    constructor(element: any, options?: any) {
        super(element, null, true);

        // check dependencies
        // let depErr = 'Missing dependency: PivotFieldEditor requires ';
        // assert(input != null, depErr + 'wijmo.input.');

        // no focus on the control host (TFS 208262)
        this.hostElement.tabIndex = -1;

        // instantiate and apply template
        let tpl = this.getTemplate();
        this.applyTemplate('wj-control wj-pivotfieldeditor', tpl, {
            _dBnd: 'sp-bnd',
            _dHdr: 'div-hdr',
            _dAgg: 'div-agg',
            _dShw: 'div-shw',
            _dWFl: 'div-wfl',
            _dSrt: 'div-srt',
            _btnFltEdt: 'btn-flt-edt',
            _btnFltClr: 'btn-flt-clr',
            _dFmt: 'div-fmt',
            _dSmp: 'div-smp',
            _btnApply: 'btn-apply',
            _btnCancel: 'btn-cancel',
            _gDlg: 'g-dlg',
            _gHdr: 'g-hdr',
            _gAgg: 'g-agg',
            _gShw: 'g-shw',
            _gWfl: 'g-wfl',
            _gSrt: 'g-srt',
            _gFlt: 'g-flt',
            _gFmt: 'g-fmt',
            _gSmp: 'g-smp'
        });

        // date to use for preview
        this._pvDate = new Date();

        // globalization
        let ci = wijmo.culture.olap.PivotFieldEditor;
        wijmo.setText(this._gDlg, ci.dialogHeader);
        wijmo.setText(this._gHdr, ci.header);
        wijmo.setText(this._gAgg, ci.summary);
        wijmo.setText(this._gShw, ci.showAs);
        wijmo.setText(this._gWfl, ci.weighBy);
        wijmo.setText(this._gSrt, ci.sort);
        wijmo.setText(this._gFlt, ci.filter);
        wijmo.setText(this._gFmt, ci.format);
        wijmo.setText(this._gSmp, ci.sample);
        wijmo.setText(this._btnFltEdt, ci.edit);
        wijmo.setText(this._btnFltClr, ci.clear);
        wijmo.setText(this._btnApply, ci.ok);
        wijmo.setText(this._btnCancel, ci.cancel);

        // create inner controls
        this._cmbHdr = new wijmo.input.ComboBox(this._dHdr);
        this._cmbAgg = new wijmo.input.ComboBox(this._dAgg);
        this._cmbShw = new wijmo.input.ComboBox(this._dShw);
        this._cmbWFl = new wijmo.input.ComboBox(this._dWFl);
        this._cmbSrt = new wijmo.input.ComboBox(this._dSrt);
        this._cmbFmt = new wijmo.input.ComboBox(this._dFmt);
        this._cmbSmp = new wijmo.input.ComboBox(this._dSmp);

        // initialize inner controls
        this._initAggregateOptions();
        this._initShowAsOptions();
        this._initFormatOptions();
        this._initSortOptions();
        this._updatePreview();

        // handle events
        this._cmbShw.textChanged.addHandler(this._updateFormat, this);
        this._cmbFmt.textChanged.addHandler(this._updatePreview, this);
        this.addEventListener(this._btnFltEdt, 'click', (e) => {
            this._editFilter();
            e.preventDefault();
        });
        this.addEventListener(this._btnFltClr, 'click', (e) => {
            this._createFilterEditor();
            setTimeout(() => { // editor populates list in a timeOut (TFS 238727)
                this._eFlt.clearEditor();
                this._btnFltEdt.focus(); // clear button will lose focus when disabled (TFS 336876)
                wijmo.enable(this._btnFltClr, false);
            });
            e.preventDefault();
        });
        this.addEventListener(this._btnApply, 'click', (e) => {
            this.updateField();
        });

        // apply options
        this.initialize(options);
    }

    // ** object model

    /**
     * Gets or sets a reference to the {@link PivotField} being edited.
     */
    get field(): PivotField {
        return this._fld;
    }
    set field(value: PivotField) {
        if (value != this._fld) {
            this._fld = wijmo.asType(value, PivotField);
            this.updateEditor();
        }
    }
    /**
     * Updates editor to reflect the current field values.
     */
    updateEditor() {
        let fld = this._fld;
        if (fld && fld.engine) {

            // binding, header
            this._dBnd.textContent = fld.binding;
            this._cmbHdr.text = fld.header;

            // aggregate, weigh by, sort
            this._cmbAgg.collectionView.refresh();
            this._cmbAgg.selectedValue = fld.aggregate;
            this._cmbSrt.selectedValue = fld.descending;
            this._cmbShw.selectedValue = fld.showAs;
            this._initWeighByOptions();

            // filter
            let canFilter = fld.engine.defaultFilterType != wijmo.grid.filter.FilterType.None;
            wijmo.enable(this._btnFltEdt, canFilter); // WJM19599
            wijmo.enable(this._btnFltClr, canFilter && fld.filter.isActive); // WJM19599

            // format, sample
            this._cmbFmt.collectionView.refresh();
            this._cmbFmt.selectedValue = fld.format;
            if (!this._cmbFmt.selectedValue) {
                this._cmbFmt.text = fld.format;
            }

            // disable items not supported by cube fields
            let isCube = fld instanceof CubePivotField;
            this._cmbAgg.isDisabled = isCube;
            this._cmbWFl.isDisabled = isCube;
        }
    }
    /**
     * Updates field to reflect the current editor values.
     */
    updateField() {
        let fld = this._fld;
        if (fld) {

            // save header
            let hdr = this._cmbHdr.text.trim();
            fld.header = hdr ? hdr : wijmo.toHeaderCase(fld.binding);

            // save aggregate, weigh by, sort
            fld.aggregate = this._cmbAgg.selectedValue;
            fld.showAs = this._cmbShw.selectedValue;
            fld.weightField = this._cmbWFl.selectedValue;
            fld.descending = this._cmbSrt.selectedValue;

            // save format
            let oldFmt = fld.format;
            fld.format = this._cmbFmt.selectedValue || this._cmbFmt.text;

            // save filter
            let eFlt = this._eFlt;
            if (eFlt) {

                // save the new filter
                eFlt.updateFilter();

                // update value filter to account for format changes (TFS 467450)
                // apply only for number and date fields (WJM-19609)
                const isNumberField = (fld.dataType == wijmo.DataType.Number);
                const isDateField = (fld.dataType == wijmo.DataType.Date);
                if (oldFmt != fld.format && (isNumberField || isDateField)) {
                    let vf = fld.filter.valueFilter;
                    if (vf && vf.isActive && !vf.dataMap) {
                        let svFmt = {};
                        if (isNumberField) {
                            for (let k in vf.showValues) {
                                let val = wijmo.Globalize.parseFloat(k);
                                svFmt[wijmo.Globalize.format(val, fld.format)] = true;
                            }
                        } else if (isDateField) {
                            for (let k in vf.showValues) {
                                let val = wijmo.Globalize.parseDate(k, oldFmt);
                                svFmt[wijmo.Globalize.format(val, fld.format)] = true;
                            }
                        }
                        vf.showValues = svFmt;
                    }
                }
            }
        }
    }

    // ** implementation

    // initialize aggregate options
    _initAggregateOptions() {
        let g = wijmo.culture.olap.PivotFieldEditor.aggs,
            agg = wijmo.Aggregate,
            list = [
                { key: g.sum, val: agg.Sum, all: false },
                { key: g.cnt, val: agg.Cnt, all: true },
                { key: g.avg, val: agg.Avg, all: false },
                { key: g.max, val: agg.Max, all: true },
                { key: g.min, val: agg.Min, all: true },
                { key: g.rng, val: agg.Rng, all: false },
                { key: g.std, val: agg.Std, all: false },
                { key: g.var, val: agg.Var, all: false },
                { key: g.stdp, val: agg.StdPop, all: false },
                { key: g.varp, val: agg.VarPop, all: false },
                { key: g.first, val: agg.First, all: true },
                { key: g.last, val: agg.Last, all: true },
            ];
        this._cmbAgg.itemsSource = list;
        this._cmbAgg.collectionView.filter = (item) => {
            if (item && item.all) { // all data types
                return true;
            }
            if (this._fld) { // numbers and Booleans (avg, range, stdev, etc)
                let dt = this._fld.dataType;
                return dt == wijmo.DataType.Number || dt == wijmo.DataType.Boolean;
            }
            return false; // strings, dates (count, min/max)
        };
        this._cmbAgg.initialize({
            displayMemberPath: 'key',
            selectedValuePath: 'val'
        });
    }

    // initialize showAs options
    _initShowAsOptions() {
        let g = wijmo.culture.olap.PivotFieldEditor.calcs,
            list = [
                { key: g.noCalc, val: ShowAs.NoCalculation },
                { key: g.dRow, val: ShowAs.DiffRow },
                { key: g.dRowPct, val: ShowAs.DiffRowPct },
                { key: g.dCol, val: ShowAs.DiffCol },
                { key: g.dColPct, val: ShowAs.DiffColPct },
                { key: g.dPctGrand, val: ShowAs.PctGrand },
                { key: g.dPctRow, val: ShowAs.PctRow },
                { key: g.dPrevRow, val: ShowAs.PctPrevRow },
                { key: g.dPctCol, val: ShowAs.PctCol },
                { key: g.dPrevCol, val: ShowAs.PctPrevCol },
                { key: g.dRunTot, val: ShowAs.RunTot },
                { key: g.dRunTotPct, val: ShowAs.RunTotPct }
            ];
        this._cmbShw.itemsSource = list;
        this._cmbShw.initialize({
            displayMemberPath: 'key',
            selectedValuePath: 'val'
        });
    }

    // initialize format options
    _initFormatOptions() {
        let ci = wijmo.culture.olap.PivotFieldEditor.formats,
            list = [

                // numbers (numeric dimensions and measures/aggregates)
                { key: ci.n0, val: 'n0', all: true },
                { key: ci.n2, val: 'n2', all: true },
                { key: ci.c, val: 'c', all: true },
                { key: ci.p0, val: 'p0', all: true },
                { key: ci.p2, val: 'p2', all: true },
                { key: ci.n2c, val: 'n2,', all: true },
                { key: ci.n2cc, val: 'n2,,', all: true },
                { key: ci.n2ccc, val: 'n2,,,', all: true },

                // dates (date dimensions)
                { key: ci.d, val: 'd', all: false },
                { key: ci.MMMMddyyyy, val: 'MMMM dd, yyyy', all: false },
                { key: ci.dMyy, val: 'd/M/yy', all: false },
                { key: ci.ddMyy, val: 'dd/M/yy', all: false },
                { key: ci.dMyyyy, val: 'dd/M/yyyy', all: false }, // key != fmt
                { key: ci.MMMyyyy, val: 'MMM yyyy', all: false },
                { key: ci.MMMMyyyy, val: 'MMMM yyyy', all: false },
                { key: ci.yyyy, val: 'yyyy', all: false },
                { key: ci.yyyyQq, val: 'yyyy "Q"q', all: false },
                { key: ci.FYEEEEQU, val: '"FY"EEEE "Q"U', all: false }
            ];
        this._cmbFmt.itemsSource = list;
        this._cmbFmt.isEditable = true;
        this._cmbFmt.isRequired = false;
        this._cmbFmt.collectionView.filter = (item) => {
            if (item && item.all) {
                return true;
            }
            if (this._fld) {
                return this._fld.dataType == wijmo.DataType.Date;
            }
            return false;
        };
        this._cmbFmt.initialize({
            displayMemberPath: 'key',
            selectedValuePath: 'val'
        });
    }

    // initialize weight by options/value
    _initWeighByOptions() {
        let fld = this._fld;
        if (fld) {
            let list = [
                { key: wijmo.culture.olap.PivotFieldEditor.none, val: null }
            ];
            let ng = fld.engine;
            ng.fields.forEach(wbf => {
                if (wbf != fld && wbf.dataType == wijmo.DataType.Number) {
                    list.push({ key: wbf.header, val: wbf });
                }
            });
            this._cmbWFl.initialize({
                displayMemberPath: 'key',
                selectedValuePath: 'val',
                itemsSource: list,
                selectedValue: fld.weightField
            });
        }
    }

    // initialize sort options
    _initSortOptions() {
        let g = wijmo.culture.olap.PivotFieldEditor.sorts,
            list = [
                { key: g.asc, val: false },
                { key: g.desc, val: true }
            ];
        this._cmbSrt.itemsSource = list;
        this._cmbSrt.initialize({
            displayMemberPath: 'key',
            selectedValuePath: 'val'
        });
    }

    // update the format to match the 'showAs' setting
    _updateFormat() {
        let showAsName = ShowAs[this._cmbShw.selectedValue];
        this._cmbFmt.selectedValue = showAsName.indexOf('Pct') > -1 // percentage (TFS 431804)
            ? 'p0'
            : 'n0';
    }

    // update the preview field to show the effect of the current settings
    _updatePreview() {
        let fmt = this._cmbFmt.selectedValue || this._cmbFmt.text,
            fmtFn = wijmo.Globalize.format,
            sample = '';
        if (fmt) {
            let ft = fmt[0].toLowerCase(),
                nf = 'nfgxc';
            if (nf.indexOf(ft) > -1) { // number
                sample = fmtFn(1234.5678, fmt);
            } else if (ft == 'p') { // percentage
                sample = fmtFn(0.12345678, fmt);
            } else { // date
                sample = fmtFn(this._pvDate, fmt);
            }
        }
        this._cmbSmp.text = sample;
    }

    // show the filter editor for this field
    _editFilter() {
        this._createFilterEditor();
        wijmo.showPopup(this._dFlt, this._btnFltEdt, false, false, false);
        wijmo.moveFocus(this._dFlt, 0);
    }

    // create filter editor
    _createFilterEditor() {
        if (!this._dFlt) {

            // create filter
            this._dFlt = document.createElement('div');
            this._eFlt = new PivotFilterEditor(this._dFlt, this._fld);
            wijmo.addClass(this._dFlt, 'wj-dropdown-panel');

            // close filter editor when it loses focus (changes are not applied)
            this._eFlt.lostFocus.addHandler(() => {
                setTimeout(() => {
                    let ctl = wijmo.Control.getControl(this._dFlt);
                    if (ctl && !ctl.containsFocus()) {
                        this._closeFilter();
                    }
                }, 10);
            });

            // close the filter when the user finishes editing
            this._eFlt.finishEditing.addHandler(() => {
                this._closeFilter();
                wijmo.enable(this._btnFltClr, !this._eFlt.isEditorClear); // TFS 213762
            });
        }
    }

    // close filter editor
    _closeFilter() {
        if (this._dFlt) {
            wijmo.hidePopup(this._dFlt, true);
            this.focus();
        }
    }
}

    }
    


    module wijmo.olap {
    // Entry file. All real code files should be re-exported from here.


wijmo._registerModule('wijmo.olap', wijmo.olap);
















    }
    