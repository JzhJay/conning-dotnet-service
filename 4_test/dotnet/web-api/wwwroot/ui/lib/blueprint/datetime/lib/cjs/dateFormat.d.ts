import { IDatePickerBaseProps } from "./datePickerCore";
export declare type DateFormatProps = IDateFormatProps;
/** @deprecated use DateFormatProps */
export interface IDateFormatProps {
    /**
     * The error message to display when the date selected is invalid.
     *
     * @default "Invalid date"
     */
    invalidDateMessage?: string;
    /**
     * The locale name, which is passed to `formatDate`, `parseDate`, and the functions in `localeUtils`.
     */
    locale?: string;
    /**
     * The error message to display when the date selected is out of range.
     *
     * @default "Out of range"
     */
    outOfRangeMessage?: string;
    /**
     * Placeholder text to display in empty input fields.
     * Recommended practice is to indicate the expected date format.
     */
    placeholder?: string;
    /**
     * Function to render a JavaScript `Date` to a string.
     * Optional `locale` argument comes directly from the prop on this component:
     * if the prop is defined, then the argument will be too.
     */
    formatDate(date: Date, locale?: string): string;
    /**
     * Function to deserialize user input text to a JavaScript `Date` object.
     * Return `false` if the string is an invalid date.
     * Return `null` to represent the absence of a date.
     * Optional `locale` argument comes directly from the prop on this component.
     */
    parseDate(str: string, locale?: string): Date | false | null;
}
export declare function getFormattedDateString(date: Date | false | null, props: DateFormatProps & IDatePickerBaseProps, ignoreRange?: boolean): string;
