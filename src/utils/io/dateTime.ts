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
export const DateFormatEnum = {
    /**ISO format (e.g., "2025-04-16T00:00:00.000Z") */
    ISO: 'ISO',
    /**UTC format (e.g., "Sun, 31 Dec 1899 00:00:00 GMT") */
    UTC: 'UTC',
    /**Locale format (e.g., "4/21/2025, 4:22:45 PM") */
    LOCALE: 'LOCALE',
    /** ```/\d{13}/``` if milliseconds, ```/\d{10}/``` if seconds */
    UNIX: 'UNIX'
} as const;
export type DateFormatEnum = (typeof DateFormatEnum)[keyof typeof DateFormatEnum];

/**
 * @enum {string} **`TimeUnitEnum`**
 * @property {string} MILLISECONDS - milliseconds
 * @property {string} SECONDS - seconds
 * @property {string} MINUTES - minutes
 * @property {string} HOURS - hours
 * @property {string} DAYS - days
 */
export const TimeUnitEnum = {
    MILLISECONDS: 'milliseconds',
    SECONDS: 'seconds',
    MINUTES: 'minutes',
    HOURS: 'hours',
    DAYS: 'days'
} as const;
export type TimeUnitEnum = (typeof TimeUnitEnum)[keyof typeof TimeUnitEnum];


/** 
 * `re = /\d{4}(-|\/)\d{2}(-|\/)\d{2}(T\d{2}:\d{2}:\d{2}(.\d{3})Z)?/`
 * @description Regular expression pattern for ISO date format (YYYY-MM-DD or YYYY/MM/DD) + optional time (THH:mm:ss.sssZ) 
 * @example "2025-04-16"
 * */
export const ISO_PATTERN = /\d{4}[-/]\d{2}[-/]\d{2}(T\d{2}:\d{2}:\d{2}(.\d{3})Z)?/;
/**
 * `re = /(Mon|Tue|Wed|Thu|Fri|Sat|Sun), \d{2} (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) \d{4}( \d{2}:\d{2}:\d{2} GMT)?/`
 * @description Regular expression pattern for UTC date format (e.g., "Sun, 31 Dec 1899 00:00:00 GMT")
 */
export const UTC_PATTERN = /(Mon|Tue|Wed|Thu|Fri|Sat|Sun), \d{2} (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) \d{4}( \d{2}:\d{2}:\d{2} GMT)?/;

/**
 * `re = /\d{1,2}[-/]\d{1,2}[-/]\d{4}(, \d{1,2}:\d{2}:\d{2} (AM|PM))?/`
 * @description Regular expression pattern for Locale date format (M/D/YYYY or M-D-YYYY) + optional time (hh:mm:ss AM/PM)
 * @example "4/21/2025, 4:22:45 PM"
 */
export const LOCALE_PATTERN = /\d{1,2}[-/]\d{1,2}[-/]\d{4}(, \d{1,2}:\d{2}:\d{2} (AM|PM))?/; // e.g., 4/21/2025, 4:22:45 PM


/**
 * - defaultValue: string = `"en-US"`
 * @description set as first param, locales, in {@link Date}`.toLocaleString(locales?: Intl.LocalesArgument, options?: Intl.DateTimeFormatOptions)`
 * @reference ~\node_modules\typescript\lib\lib.es2020.date.d.ts @see {@link Date}
 */
export const DEFAULT_LOCALE = 'en-US';
/**
 * - defaultValue: string = `"America/Los_Angeles"`
 * @description set as second param, options, in {@link Date}`.toLocaleString(locales?: Intl.LocalesArgument, options?: Intl.DateTimeFormatOptions)`
 * @reference ~\node_modules\typescript\lib\lib.es2020.date.d.ts @see {@link Date}
 */
export const DEFAULT_TIMEZONE = 'America/Los_Angeles';

/**
 * @description Converts a Unix timestamp to a date string in the specified format
 * @param unixTimestamp `number` - The unix timestamp in milliseconds or seconds to convert
 * @param dateFormat {@link DateFormatEnum} - The format to return the date in
 * @returns {string|null} The date string in the specified format
 * @example "2025-04-16T00:00:00.000Z"
 * @note dateFormat === DateFormatEnum.LOCALE -> use {@link DEFAULT_LOCALE} and {@link DEFAULT_TIMEZONE}
 */
export function getDateStringFromUnixTimestamp(unixTimestamp: number, dateFormat: DateFormatEnum): string | null {
    if (!unixTimestamp) {
        console.error('No unixTimestamp provided');
        return null;
    }
    if (typeof unixTimestamp !== 'number') {
        console.error('unixTimestamp must be a number');
        return null;
    }
    if (String(unixTimestamp).length === 10) {
        unixTimestamp = unixTimestamp * 1000; // Convert to milliseconds if in seconds
    }
    if (String(unixTimestamp).length > 13) {
        console.error('unixTimestamp must be in milliseconds or seconds');
        return null;
    }
    const date = new Date(unixTimestamp);
    if (dateFormat === DateFormatEnum.ISO) {
        return date.toISOString();
    } else if (dateFormat === DateFormatEnum.UTC) {
        return date.toUTCString();
    } else if (dateFormat === DateFormatEnum.LOCALE) {
        return date.toLocaleString(DEFAULT_LOCALE, {timeZone: DEFAULT_TIMEZONE});
    }
    console.error('Invalid date format specified. Use DateFormatEnum.ISO, DateFormatEnum.UTC, or DateFormatEnum.LOCALE');
    return null;
}

/**
 * @param ds1 first date `string` `(required)` - must be in {@link DateFormatEnum.ISO} format or {@link DateFormatEnum.LOCALE} format. @TODO test other formats
 * @param ds2 second date `string` `(optional)` - defaults to current date and time in Pacific Time
 * @param unit {@link TimeUnitEnum} - The unit of time to return the difference in
 * @param absoluteDifference `boolean` `(optional) default = true`
 * -  Whether to return the absolute difference (true) or the signed difference (false)
 * @description Calculates the difference between two date strings in the specified unit of time. Subtracts ds1 from ds2.
 * @returns **`difference`** `number | null` The difference between the two date strings in the specified {@link TimeUnitEnum} unit, or `null` if an error occurs
 */
export function calculateDifferenceOfDateStrings(
    ds1: string, 
    ds2: string = getCurrentPacificTime(),
    unit: TimeUnitEnum = TimeUnitEnum.MILLISECONDS,
    absoluteDifference: boolean = true
): number | null {
    const date1 = new Date(ds1);
    const date2 = new Date(ds2);
    const diffInMs = absoluteDifference 
        ? Math.abs(date2.getTime() - date1.getTime()) 
        : date2.getTime() - date1.getTime();
    switch (unit) {
        case TimeUnitEnum.MILLISECONDS:
            return diffInMs;
        case TimeUnitEnum.SECONDS:
            return Milliseconds.from.seconds(diffInMs);
        case TimeUnitEnum.MINUTES:
            return Milliseconds.from.minutes(diffInMs);
        case TimeUnitEnum.HOURS:
            return Milliseconds.from.hours(diffInMs);
        case TimeUnitEnum.DAYS:
            return Milliseconds.from.days(diffInMs);
        default:
            console.error('Invalid time unit specified. Use TimeUnitEnum.MILLISECONDS, TimeUnitEnum.SECONDS, TimeUnitEnum.MINUTES, TimeUnitEnum.HOURS, or TimeUnitEnum.DAYS');
            return null;
    }
}

/**
 * @description Converts a date string in ISO format (YYYY-MM-DD) to a Unix timestamp in milliseconds
 * @param dateString `string` to convert
 * @returns **`timestamp`** `date.getTime() | null` The Unix timestamp in milliseconds
 */
export function getUnixTimestampFromISO(dateString: string): number | null {
    if (!dateString) {
        console.error('No date string provided');
        return null;
    }
    if (typeof dateString !== 'string') {
        console.error('Date string must be a string');
        return null;
    }
    if (dateString.length > 10) {
        dateString = dateString.substring(0, 10);
    }
    if (!ISO_PATTERN.test(dateString)) {
        console.error('Date string must be in ISO format (YYYY-MM-DD)');
        return null;
    }
    const date = new Date(dateString);
    return date.getTime();
}

/**
 * Parses a locale string into a Date object
 * @param dateStr Date string in locale format (e.g., '4/21/2025, 4:22:45 PM')
 * @returns {Date} **`date`** {@link Date} object
 */
export function localeStringToDate(dateStr: string): Date {
    try {
        const [datePart, timeWithPeriod] = dateStr.split(', ');
        const [month, day, year] = datePart.split('/').map(Number);
        
        const [timePart, period] = timeWithPeriod.split(' ');
        let [hours, minutes, seconds] = timePart.split(':').map(Number);
        
        // Convert to 24-hour format if needed
        if (period.toUpperCase() === 'PM' && hours < 12) {
            hours += 12;
        } else if (period.toUpperCase() === 'AM' && hours === 12) {
            hours = 0;
        }
        
        // Create the Date object (month is 0-based in JavaScript)
        return new Date(year, month - 1, day, hours, minutes, seconds);
    } catch (error) {
        throw new Error(`Failed to parse date string: '${dateStr}'. Expected format: 'MM/DD/YYYY, hh:mm:ss AM/PM'`);
    }
}

/**
 * @description Gets the current date and time in Pacific Time in Locale format
 * @returns {string} The current date and time in Pacific Time in Locale format
 * @example "4/16/2025, 9:00:15 AM"
 */
export function getCurrentPacificTime(): string {
    const currentDate = new Date();
    const pacificTime = currentDate.toLocaleString(DEFAULT_LOCALE, {timeZone: DEFAULT_TIMEZONE});
    return pacificTime;
}

/**
 * @description Converts a date string to Pacific Time
 * @param {string} initialDateString The date string to convert
 * @returns {string} The date string in Pacific Time
 */
export function toPacificTime(initialDateString: string): string {
    const initialDate = new Date(initialDateString);
    const pacificTime = initialDate.toLocaleString(DEFAULT_LOCALE, {timeZone: DEFAULT_TIMEZONE});
    return pacificTime
}

export const Milliseconds = {
    from: {
        /**
         * @param n `number`
         * @returns `n * (1000 * 60 * 60 * 24)` number of milliseconds in `n` days
         */
        days: (n: number): number => { 
            return n * (1000 * 60 * 60 * 24); 
        },
        /**
         * @param n `number`
         * @returns `n * (1000 * 60 * 60)` number of milliseconds in `n` hours
         */
        hours: (n: number): number => { 
            return n * (1000 * 60 * 60); 
        },
        /**
         * @param n `number`
         * @returns `n * (1000 * 60)` number of milliseconds in `n` minutes
         */
        minutes: (n: number): number => {
            return n * (1000 * 60);
        },
        /**
         * @param n `number`
         * @returns `n * (1000)` number of milliseconds in `n` seconds
         */
        seconds: (n: number): number => {
            return n * (1000);
        },
        /**
         * @param d `Date` object
         * @returns `number` = `d.getTime()` = milliseconds since epoch
         */
        date: (d: Date): number => {
            return d.getTime();
        },
        /**
         * @param s `string` date string to pass into Date Constructor (e.g. ISO, UTC, Locale, etc.)
         * @returns `number` milliseconds since epoch or `null` if invalid (i.e. Date constructor can't parse it)
         */
        string: (s: string): number | null => {
            try {
                const date = new Date(s);
                if (isNaN(date.getTime())) {
                    throw new Error(`Invalid date string: '${s}'`);
                }
                return date.getTime();
            } catch (error) {
                console.error(`Failed to parse date string: '${s}'`, error);
                return null;
            }
        },
    },
    to: {
        /**
         * @param n `number`
         * @returns `number` days in `n` milliseconds
         */
        days: (n: number): number => {
            return n / (1000 * 60 * 60 * 24);
        },
        /**
         * @param n `number`
         * @returns `number` hours in `n` milliseconds
         */
        hours: (n: number): number => {
            return n / (1000 * 60 * 60);
        },
        /**
         * @param n `number`
         * @returns `number` minutes in `n` milliseconds
         */
        minutes: (n: number): number => {
            return n / (1000 * 60);
        },
        /**
         * @param n `number`
         * @returns `number` seconds in `n` milliseconds
         */
        seconds: (n: number): number => {
            return n / (1000);
        },
        /**
         * interprets `n` as milliseconds since epoch
         * @param n `number` milliseconds
         * @returns `Date` object
         */
        date: (n: number): Date => {
            return new Date(n);
        },
        /**
         * @param n `number`
         * @param format {@link DateFormatEnum} default = {@link DateFormatEnum.ISO}
         * @param locale `string` default = `'en-US'` (only used if format = {@link DateFormatEnum.LOCALE})
         * @param timeZone `string` default = `'America/Los_Angeles'` (only used if format = {@link DateFormatEnum.LOCALE})
         * @returns `string` formatted date string or empty string if error
         */
        string: (
            n: number, 
            format: DateFormatEnum = DateFormatEnum.ISO, 
            locale: string = DEFAULT_LOCALE, 
            timeZone: string = DEFAULT_TIMEZONE
        ): string => {
            const date = new Date(n);
            if (isNaN(date.getTime())) {
                console.error(`Invalid milliseconds value: '${n}'`);
                return ``;
            }
            switch (format) {
                case DateFormatEnum.ISO:
                    return date.toISOString();
                case DateFormatEnum.UTC:
                    return date.toUTCString();
                case DateFormatEnum.LOCALE:
                    return date.toLocaleString(locale, {timeZone});
                default:
                    console.error(`Invalid date format specified: '${format}'.`,
                        `Use DateFormatEnum.ISO, DateFormatEnum.UTC, or DateFormatEnum.LOCALE`
                    );
                    return ``;
            }
        },
    },
} as const;
