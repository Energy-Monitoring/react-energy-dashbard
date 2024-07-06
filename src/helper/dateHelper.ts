import { parse, addDays, addHours, format } from 'date-fns';
import { fromZonedTime } from "date-fns-tz";

export const HOUR_00_00_00 = '00:00:00';

export const HOUR_12_00_00 = '12:00:00';

export const HOUR_23_59_59 = '23:59:59';

export const FORMAT_DATE_EN = 'yyyy-MM-dd';

export const FORMAT_DATE_TIME_EN = 'yyyy-MM-dd, HH:mm';

export const FORMAT_DATE_DE = 'dd.MM.yyyy';

export const FORMAT_DATE_TIME_DE = 'dd.MM.yyyy, HH:mm';

export const FORMAT_HOUR_MINUTE = 'HH:mm';

/**
 * Returns the date from now.
 */
export const dateNow = (): Date => {
    return new Date();
}

/**
 * Returns the given date with the given time string.
 */
export const dateSetTime = (date: Date, timeString: string = HOUR_00_00_00, fromUTC: boolean = false): Date => {
    const [time, modifier] = timeString.split(' ');
    let [hours, minutes, seconds] = time.split(':').map(Number);

    if (modifier === 'PM' && hours !== 12) {
        hours += 12;
    } else if (modifier === 'AM' && hours === 12) {
        hours = 0;
    }

    let dateObject = new Date(date.getFullYear(), date.getMonth(), date.getDate(), hours, minutes, seconds);

    if (fromUTC) {
        dateObject = fromZonedTime(dateObject, 'UTC');
    }

    return dateObject;
}

/**
 * Returns the date of today with the given time string.
 *
 * @param timeString
 */
export const dateToday = (timeString: string = HOUR_00_00_00): Date => {
    return dateSetTime(new Date(), timeString);
}

/**
 * Returns the date of today with the given time string.
 *
 * @param timeString
 */
export const dateYesterday = (timeString: string = HOUR_00_00_00): Date => {
    return dateAddDays(dateSetTime(new Date(), timeString), -1);
}

/**
 * Parses the given date string into a Date object.
 */
export const dateParseString = (date: string, formatString: string = FORMAT_DATE_EN): Date => {
    return parse(date, formatString, new Date());
};

/**
 * Parses the given date string into a Date object.
 */
export const dateFormat = (date: Date, formatString: string = FORMAT_DATE_EN): string => {
    return format(date, formatString);
};

/**
 * Adds days to the given date.
 */
export const dateAddDays = (date: Date, days: number = 1): Date => {
    return addDays(date, days);
};

/**
 * Adds hours to the given date.
 */
export const dateAddHours = (date: Date, hours: number = 1): Date => {
    return addHours(date, hours);
};

/**
 * Returns the date as UTC with timezone.
 */
export const dateISOWithTimeOffset = (date: Date): string => {
    return date.toISOString().split('.')[0] + 'Z';
}

/**
 * Returns if the given date is day light saving time or not.
 *
 * @param date
 */
export const isDaylightSaving = (date: Date): boolean => {
    const january = new Date(date.getFullYear(), 0, 1);
    const july = new Date(date.getFullYear(), 6, 1);
    const stdTimezoneOffset = Math.max(january.getTimezoneOffset(), july.getTimezoneOffset());

    return date.getTimezoneOffset() < stdTimezoneOffset;
}

/**
 * Round time to 15 minutes.
 */
export const dateRound15Minutes = (selectedDate: Date, timeString: string, fromUTC: boolean = false): string => {
    let date = dateSetTime(selectedDate, timeString, fromUTC);

    const roundedMinute = Math.round(date.getMinutes() / 15) * 15;

    if (roundedMinute === 60) {
        date.setHours(date.getHours() + 1);
        date.setMinutes(0);
        date.setSeconds(0);
    } else {
        date.setMinutes(roundedMinute);
        date.setSeconds(0);
    }

    return dateFormat(date, FORMAT_HOUR_MINUTE);
};

/**
 * Round time to 60 minutes.
 */
export const dateRound60Minutes = (selectedDate: Date, timeString: string, fromUTC: boolean = false): string => {
    let date = dateSetTime(selectedDate, timeString, fromUTC);

    const roundedMinute = Math.round(date.getMinutes() / 60) * 60;

    if (roundedMinute === 60) {
        date.setHours(date.getHours() + 1);
        date.setMinutes(0);
        date.setSeconds(0);
    } else {
        date.setMinutes(roundedMinute);
        date.setSeconds(0);
    }

    return dateFormat(date, FORMAT_HOUR_MINUTE);
};

export const dateUtc = (timeString: string, selectedDate: Date, fromUTC: boolean = false): string => {
    let date = dateSetTime(selectedDate, timeString, fromUTC);

    return dateFormat(date, FORMAT_HOUR_MINUTE);
};









/**
 * Parses the given date string to a german format.
 *
 * @param dateStr
 */
export const convertDateEnToDe = (dateStr: string): string => {
    const [year, month, day] = dateStr.split('-');
    return `${day}.${month}.${year}`;
};

/**
 * Returns the current time zone offset (from browser).
 */
export const getCurrentTimeZoneOffset = (): string => {
    const offset = new Date().getTimezoneOffset();
    const hours = Math.floor(Math.abs(offset) / 60).toString().padStart(2, '0');
    const minutes = (Math.abs(offset) % 60).toString().padStart(2, '0');
    const sign = offset <= 0 ? '+' : '-';
    return `${sign}${hours}:${minutes}`;
};

/**
 * Returns the current date and time with time zone offset (from browser).
 */
export const getCurrentDateTimeWithTimeZone = (): string => {
    const now = new Date();
    const offset = getCurrentTimeZoneOffset();
    const localDateTime = now.toISOString().split('.')[0];
    return `${localDateTime}${offset}`;
};
