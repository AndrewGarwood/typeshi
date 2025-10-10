/**
 * @file src/utils/io/dateTime.ts
 */
/**
 * @enum {string} **`DateFormatEnum`**
 * @property {string} ISO - ISO format (YYYY-MM-DDTHH:mm:ss.sssZ)
 * @property {string} UTC - UTC format (YYYY-MM-DDTHH:mm:ss.sssZ)
 * @property {string} LOCALE - Local format (YYYY-MM-DDTHH:mm:ss.sssZ)
 * @property {string} UNIX - Unix format (milliseconds since epoch)
 */
export declare enum DateFormatEnum {
    /**ISO format (e.g., "2025-04-16T00:00:00.000Z") */
    ISO = "ISO",
    /**UTC format (e.g., "Sun, 31 Dec 1899 00:00:00 GMT") */
    UTC = "UTC",
    /**Locale format (e.g., "4/21/2025, 4:22:45 PM") */
    LOCALE = "LOCALE",
    /** ```/\d{13}/``` if milliseconds, ```/\d{10}/``` if seconds */
    UNIX = "UNIX"
}
/**
 * @enum {string} **`TimeUnitEnum`**
 * @property {string} MILLISECONDS - milliseconds
 * @property {string} SECONDS - seconds
 * @property {string} MINUTES - minutes
 * @property {string} HOURS - hours
 * @property {string} DAYS - days
 */
export declare enum TimeUnitEnum {
    MILLISECONDS = "milliseconds",
    SECONDS = "seconds",
    MINUTES = "minutes",
    HOURS = "hours",
    DAYS = "days"
}
/**
 * `re = /\d{4}(-|\/)\d{2}(-|\/)\d{2}(T\d{2}:\d{2}:\d{2}(.\d{3})Z)?/`
 * @description Regular expression pattern for ISO date format (YYYY-MM-DD or YYYY/MM/DD) + optional time (THH:mm:ss.sssZ)
 * @example "2025-04-16"
 * */
export declare const ISO_PATTERN: RegExp;
/**
 * `re = /(Mon|Tue|Wed|Thu|Fri|Sat|Sun), \d{2} (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) \d{4}( \d{2}:\d{2}:\d{2} GMT)?/`
 * @description Regular expression pattern for UTC date format (e.g., "Sun, 31 Dec 1899 00:00:00 GMT")
 */
export declare const UTC_PATTERN: RegExp;
/**
 * `re = /\d{1,2}[-/]\d{1,2}[-/]\d{4}(, \d{1,2}:\d{2}:\d{2} (AM|PM))?/`
 * @description Regular expression pattern for Locale date format (M/D/YYYY or M-D-YYYY) + optional time (hh:mm:ss AM/PM)
 * @example "4/21/2025, 4:22:45 PM"
 */
export declare const LOCALE_PATTERN: RegExp;
/**
 * - defaultValue: string = `"en-US"`
 * @description set as first param, locales, in {@link Date}`.toLocaleString(locales?: Intl.LocalesArgument, options?: Intl.DateTimeFormatOptions)`
 * @reference ~\node_modules\typescript\lib\lib.es2020.date.d.ts @see {@link Date}
 */
export declare const DEFAULT_LOCALE = "en-US";
/**
 * - defaultValue: string = `"America/Los_Angeles"`
 * @description set as second param, options, in {@link Date}`.toLocaleString(locales?: Intl.LocalesArgument, options?: Intl.DateTimeFormatOptions)`
 * @reference ~\node_modules\typescript\lib\lib.es2020.date.d.ts @see {@link Date}
 */
export declare const DEFAULT_TIMEZONE = "America/Los_Angeles";
/**
 * @description Converts a Unix timestamp to a date string in the specified format
 * @param unixTimestamp `number` - The unix timestamp in milliseconds or seconds to convert
 * @param dateFormat {@link DateFormatEnum} - The format to return the date in
 * @returns {string|null} The date string in the specified format
 * @example "2025-04-16T00:00:00.000Z"
 * @note dateFormat === DateFormatEnum.LOCALE -> use {@link DEFAULT_LOCALE} and {@link DEFAULT_TIMEZONE}
 */
export declare function getDateFromUnixTimestamp(unixTimestamp: number, dateFormat: DateFormatEnum): string | null;
/**
 * @param ds1 first date `string` `(required)` - must be in {@link DateFormatEnum.ISO} format or {@link DateFormatEnum.LOCALE} format. @TODO test other formats
 * @param ds2 second date `string` `(optional)` - defaults to current date and time in Pacific Time
 * @param unit {@link TimeUnitEnum} - The unit of time to return the difference in
 * @param absoluteDifference `boolean` `(optional) default = true`
 * -  Whether to return the absolute difference (true) or the signed difference (false)
 * @description Calculates the difference between two date strings in the specified unit of time. Subtracts ds1 from ds2.
 * @returns **`difference`** `number | null` The difference between the two date strings in the specified {@link TimeUnitEnum} unit, or `null` if an error occurs
 */
export declare function calculateDifferenceOfDateStrings(ds1: string, ds2?: string, unit?: TimeUnitEnum, absoluteDifference?: boolean): number | null;
/**
 * @description Converts a date string in ISO format (YYYY-MM-DD) to a Unix timestamp in milliseconds
 * @param dateString `string` to convert
 * @returns **`timestamp`** `date.getTime() | null` The Unix timestamp in milliseconds
 */
export declare function getUnixTimestampFromISO(dateString: string): number | null;
/**
 * Parses a locale string into a Date object
 * @param dateStr Date string in locale format (e.g., '4/21/2025, 4:22:45 PM')
 * @returns {Date} **`date`** {@link Date} object
 */
export declare function localeStringToDate(dateStr: string): Date;
/**
 * @description Gets the current date and time in Pacific Time in Locale format
 * @returns {string} The current date and time in Pacific Time in Locale format
 * @example "4/16/2025, 9:00:15 AM"
 */
export declare function getCurrentPacificTime(): string;
/**
 * @description Converts a date string to Pacific Time
 * @param {string} initialDateString The date string to convert
 * @returns {string} The date string in Pacific Time
 */
export declare function toPacificTime(initialDateString: string): string;
export declare const Milliseconds: {
    readonly from: {
        /**
         * @param n `number`
         * @returns `n * (1000 * 60 * 60 * 24)` number of milliseconds in `n` days
         */
        readonly days: (n: number) => number;
        /**
         * @param n `number`
         * @returns `n * (1000 * 60 * 60)` number of milliseconds in `n` hours
         */
        readonly hours: (n: number) => number;
        /**
         * @param n `number`
         * @returns `n * (1000 * 60)` number of milliseconds in `n` minutes
         */
        readonly minutes: (n: number) => number;
        /**
         * @param n `number`
         * @returns `n * (1000)` number of milliseconds in `n` seconds
         */
        readonly seconds: (n: number) => number;
        /**
         * @param d `Date` object
         * @returns `number` = `d.getTime()` = milliseconds since epoch
         */
        readonly date: (d: Date) => number;
        /**
         * @param s `string` date string to pass into Date Constructor (e.g. ISO, UTC, Locale, etc.)
         * @returns `number` milliseconds since epoch or `null` if invalid (i.e. Date constructor can't parse it)
         */
        readonly string: (s: string) => number | null;
    };
    readonly to: {
        /**
         * @param n `number`
         * @returns `number` days in `n` milliseconds
         */
        readonly days: (n: number) => number;
        /**
         * @param n `number`
         * @returns `number` hours in `n` milliseconds
         */
        readonly hours: (n: number) => number;
        /**
         * @param n `number`
         * @returns `number` minutes in `n` milliseconds
         */
        readonly minutes: (n: number) => number;
        /**
         * @param n `number`
         * @returns `number` seconds in `n` milliseconds
         */
        readonly seconds: (n: number) => number;
        /**
         * interprets `n` as milliseconds since epoch
         * @param n `number` milliseconds
         * @returns `Date` object
         */
        readonly date: (n: number) => Date;
        /**
         * @param n `number`
         * @param format {@link DateFormatEnum} default = {@link DateFormatEnum.ISO}
         * @param locale `string` default = `'en-US'` (only used if format = {@link DateFormatEnum.LOCALE})
         * @param timeZone `string` default = `'America/Los_Angeles'` (only used if format = {@link DateFormatEnum.LOCALE})
         * @returns `string` formatted date string or empty string if error
         */
        readonly string: (n: number, format?: DateFormatEnum, locale?: string, timeZone?: string) => string;
    };
};
