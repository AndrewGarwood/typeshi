"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.COMPANY_ABBREVIATION_PATTERN = exports.COMPANY_KEYWORDS_PATTERN = exports.CLEAN_NAME_REPLACE_OPTIONS = exports.REMOVE_JOB_TITLE_SUFFIX = exports.JOB_TITLE_SUFFIX_PATTERN = exports.REMOVE_ATTN_SALUTATION_PREFIX = exports.LAST_NAME_COMMA_FIRST_NAME_PATTERN = exports.CREDENTIAL_PATTERN = exports.MIDDLE_INITIAL_REGEX = exports.SALUTATION_REGEX = exports.ATTN_SALUTATION_PREFIX_PATTERN = void 0;
exports.extractName = extractName;
exports.extractJobTitleSuffix = extractJobTitleSuffix;
/**
 * @file src/utils/regex/entity.ts
 */
const config_1 = require("../../config");
const _1 = require(".");
const StringOptions_1 = require("./types/StringOptions");
const cleaning_1 = require("./cleaning");
const stringOperations_1 = require("./stringOperations");
/** `re` = /`^\s*((attention|attn|atn):)?\s*((Mr|Ms|Mrs|Dr|Prof)\.?)*\s*`/`i` */
exports.ATTN_SALUTATION_PREFIX_PATTERN = new RegExp(/^\s*((attention|attn|atn):)?\s*((Mr|Ms|Mrs|Dr|Prof)\.?)*\s*/, StringOptions_1.RegExpFlagsEnum.IGNORE_CASE);
/** `re` = /`^(Mr\.|Ms\.|Mrs\.|Dr\.|Mx\.)`/`i` */
exports.SALUTATION_REGEX = new RegExp(/^(Mr\.|Ms\.|Mrs\.|Dr\.|Mx\.|Prof\.)/, StringOptions_1.RegExpFlagsEnum.IGNORE_CASE);
/** `re` = /`^[A-Z]{1}\.?$`/i */
exports.MIDDLE_INITIAL_REGEX = new RegExp(/^[A-Z]{1}\.?$/, StringOptions_1.RegExpFlagsEnum.IGNORE_CASE);
/** `re` = `/((([A-Z]\.){1})*|([A-Z]{1,4}(\.|-)?)){asterisk}/` */
exports.CREDENTIAL_PATTERN = /((([A-Z]\.){1})*|([A-Z]{1,4}(\.|-)?))*/;
/**
 * `re` = `/^\s*([A-Za-z'-]{2,})\s*,\s*(?:(?:[A-Z]{1,4}\.?\,?\s*)+)?([A-Za-z'-]+(?:\s+[A-Za-z.'-]+)*)\s*$/`
 */
exports.LAST_NAME_COMMA_FIRST_NAME_PATTERN = new RegExp(/^\s*([A-Za-z'-]{2,})\s*,\s*(?:(?:[A-Z]{1,4}\.?,?\s*)+)?([A-Za-z'-]+(?:\s+[A-Za-z.'-]+)*)\s*$/, StringOptions_1.RegExpFlagsEnum.IGNORE_CASE);
exports.REMOVE_ATTN_SALUTATION_PREFIX = {
    searchValue: exports.ATTN_SALUTATION_PREFIX_PATTERN, replaceValue: ''
};
/**
 * `re` = `/((, ?| )(MSPA|APRN|BSN|FNP-C|LME|DDS|DOO|Ph\.?D\.|MSN-RN|R\.?N|N\.?P|CRNA|FAAD|FNP|P.?A.?C|PA-C|PA|DMD|NMD|MD|M\.D|DO|L\.?E\.?|CMA|CANS|O.?M|Frcs|FRCS|FACS|FAC)\.?,?)+/g`
 * */
exports.JOB_TITLE_SUFFIX_PATTERN = new RegExp(/((, ?| )(MSPA|APRN|ARNP|BSN|FNP-C|LME|DDS|MD|DO|DOO|Ph\.?D\.|MSN|MSN-RN|R\.?N|N\.?P|CRNA|FAAD|FNP|P.?A.?C|PA-C|PA|DMD|NMD|MD|M\.D|DO|L\.?E\.?|CMA|CANS|O.?M|Frcs|FRCS|FACS|FAC)\.?)+/, StringOptions_1.RegExpFlagsEnum.GLOBAL);
exports.REMOVE_JOB_TITLE_SUFFIX = {
    searchValue: exports.JOB_TITLE_SUFFIX_PATTERN, replaceValue: ''
};
// {searchValue: getJobTitleSuffixPattern(), replaceValue: ''}
/**
 * - {@link REMOVE_ATTN_SALUTATION_PREFIX}
 * - {@link REMOVE_JOB_TITLE_SUFFIX}
 * - remove trailing comma
 */
exports.CLEAN_NAME_REPLACE_OPTIONS = [
    exports.REMOVE_ATTN_SALUTATION_PREFIX,
    exports.REMOVE_JOB_TITLE_SUFFIX,
    { searchValue: /,$/g, replaceValue: '' }, // remove trailing comma
];
/**
 * **if** `name` contains a digit or contains any of {@link COMPANY_KEYWORDS_PATTERN} or `/[0-9!#&@]/`,
 * - `then` do not attempt to extract name and return empty strings
 * @param name `string` - the full name from which to extract 3 parts: the first, middle, and last names
 * @returns `{first: string, middle?: string, last?: string}` - the first, middle, and last names
 * @example
 * let name = 'John Doe';
 * console.log(extractName(name)); // { first: 'John', middle: '', last: 'Doe' }
 * name = 'John A. Doe';
 * console.log(extractName(name)); // { first: 'John', middle: 'A.', last: 'Doe' }
 */
function extractName(name, includeJobTitleSuffix = true) {
    if (!name || typeof name !== 'string')
        return { first: '', middle: '', last: '' };
    const originalName = name;
    const jobTitleSuffix = extractJobTitleSuffix(name);
    name = (0, cleaning_1.clean)(name, { replace: exports.CLEAN_NAME_REPLACE_OPTIONS })
        .replace(exports.JOB_TITLE_SUFFIX_PATTERN, ''); // redundant
    const containsInvalidCharsOrCompanyKeywords = ((0, stringOperations_1.stringContainsAnyOf)(name, /[0-9!#&@]/)
        || (0, stringOperations_1.stringContainsAnyOf)(name, exports.COMPANY_KEYWORDS_PATTERN, StringOptions_1.RegExpFlagsEnum.IGNORE_CASE));
    if (containsInvalidCharsOrCompanyKeywords
        || _1.KOREA_ADDRESS_LATIN_TEXT_PATTERN.test(name)) {
        return { first: '', middle: '', last: '' };
    }
    config_1.typeshiHiddenLogger.debug([`extractName()`,
        `  originalName = "${originalName}"`,
        `  cleaned name = "${name}"`,
        `jobTitleSuffix = "${jobTitleSuffix}"`
    ].join(config_1.INDENT_LOG_LINE));
    let nameSplit = name.split(/(?<!,)\s+/);
    if (nameSplit.length === 0) {
        return { first: '', middle: '', last: '' };
    }
    if (exports.LAST_NAME_COMMA_FIRST_NAME_PATTERN.test(originalName)) {
        // move last name to the end
        nameSplit.push(nameSplit.shift() || '');
    }
    nameSplit.map((namePart) => (0, cleaning_1.clean)(namePart, {
        strip: _1.STRIP_DOT_IF_NOT_END_WITH_ABBREVIATION,
        replace: [{ searchValue: /(^[-+])*/g, replaceValue: '' }]
    }));
    config_1.typeshiHiddenLogger.debug([`nameSplit.length === ${nameSplit.length},`,
        `nameSplit: ${JSON.stringify(nameSplit)}`
    ].join(config_1.INDENT_LOG_LINE));
    if (nameSplit.length == 1) {
        return {
            first: nameSplit[0].replace(/(,|\.)$/g, ''),
            middle: '',
            last: ''
        };
    }
    const firstName = nameSplit[0].replace(/(,|\.)$/g, '');
    if (nameSplit.length == 2) {
        let initialLastName = nameSplit[1];
        let alreadyHasJobTitleSuffix = ((0, stringOperations_1.stringEndsWithAnyOf)(initialLastName, new RegExp(`,? ?${jobTitleSuffix}`))
            ||
                (0, stringOperations_1.stringEndsWithAnyOf)(initialLastName.replace(/\./, ''), new RegExp(`,? ?${jobTitleSuffix}`)));
        const lastName = (jobTitleSuffix && includeJobTitleSuffix
            && !alreadyHasJobTitleSuffix
            ? initialLastName.replace(/,$/g, '') + `, ${jobTitleSuffix}`
            : initialLastName.replace(/,$/g, '')).replace(/,\s*$/g, '');
        return {
            first: firstName,
            middle: '',
            last: lastName
        };
    }
    else if (nameSplit.length > 2) {
        const middleName = nameSplit[1].replace(/,$/g, '');
        let initialLastName = nameSplit.slice(2).join(' ');
        let alreadyHasJobTitleSuffix = ((0, stringOperations_1.stringEndsWithAnyOf)(initialLastName, new RegExp(`,? ?${jobTitleSuffix}`))
            ||
                (0, stringOperations_1.stringEndsWithAnyOf)(initialLastName.replace(/\./, ''), new RegExp(`,? ?${jobTitleSuffix}`)));
        const lastName = (jobTitleSuffix && includeJobTitleSuffix
            && !alreadyHasJobTitleSuffix
            ? initialLastName + `, ${jobTitleSuffix}`
            : initialLastName).replace(/,\s*$/g, '');
        return {
            first: firstName,
            middle: middleName,
            last: lastName
            // redundant but trying to make sure the suffix is removed
            // .replace(JOB_TITLE_SUFFIX_PATTERN, '')
            // .replace(getJobTitleSuffixPattern(), '')
            // .replace(/(,|\.)$/g, '') 
        };
    }
    config_1.typeshiHiddenLogger.debug(config_1.NEW_LINE + `extractName() - no valid name parts found, returning empty strings`);
    return { first: '', middle: '', last: '' };
}
/**
 * - {@link JOB_TITLE_SUFFIX_PATTERN}
 *
 * Cases to consider for input param `s`: (want to extract JOB_TITLE)
 * - `s` = `"lastName, {JOB_TITLE}"`
 * - `s` = `"firstName lastName, {JOB_TITLE}"`
 * - `s` = `"firstName middleName lastName, {JOB_TITLE}"`
 * - `s` = `"firstName middleInitial lastName, {JOB_TITLE}"`
 * - `s` = `"lastName, {JOB_TITLE}, firstName"` // matches {@link LAST_NAME_COMMA_FIRST_NAME_PATTERN}
 * @param s `string`
 * @returns **`jobTitle`** `string` - the job title, if it exists
 */
function extractJobTitleSuffix(s) {
    if (!s || typeof s !== 'string')
        return '';
    s = (0, cleaning_1.clean)(s, { replace: [
            exports.REMOVE_ATTN_SALUTATION_PREFIX,
            { searchValue: /,$/g, replaceValue: '' }
        ] });
    if (exports.JOB_TITLE_SUFFIX_PATTERN.test(s)) {
        config_1.typeshiHiddenLogger.debug(config_1.NEW_LINE + `[regex/entity.extractJobTitleSuffix()]`, `s = "${s}"`);
        const jobTitleMatch = s.match(exports.JOB_TITLE_SUFFIX_PATTERN);
        if (jobTitleMatch && jobTitleMatch.length > 0) {
            let jobTitle = jobTitleMatch[0].replace(/^\s*,\s*/g, '').trim();
            config_1.typeshiHiddenLogger.debug(`jobTitleMatch[0] = "${jobTitleMatch[0]}" -> trim and return "${jobTitle}"`);
            return jobTitle;
        }
    }
    return '';
}
/**
 * - `re` = `/\b(?:company|corp|inc|co\.?,? ltd\.?|ltd|\.?l\.?lc|plc . . .)\b/` `i`
 * */
// export const COMPANY_KEYWORDS_PATTERN = new RegExp(
//     `\\b(?:` + getCompanyKeywordList().join('|') + `)\\b`, RegExpFlagsEnum.IGNORE_CASE
// );
exports.COMPANY_KEYWORDS_PATTERN = /\b(?:compan(y|ies)|[+@&]+|corporation|corporate|(drop)?box|corp|inc|co\.|co\.?,? ltd\.?|ltd|(p\.)?l\.?l\.?c|plc|llp|(un)?limited|nys|oc|mc|pr|local|group|consulting|consultant(s)?|vcc|bcp|center|(in)?pack(aging|age)?|electric|chemical|Exhibit(s)?|business|Factory|employee|print(s|ing)?|Pharmaceutical(s)?|vista ?print|associates|association|account(s)?|art(s)?|AMZ|independent|beauty|beautiful(ly)?|meditech|medaesthetic|partners|Acupuncture|Affiliate(s)?|telecom|maps|cosmetic(s)?|connections|practice|computer|service(s)?|skincare|skin|face|facial|body|artisan(s)?|Alchemy|plastic|advanced|surgical|surgery|surgeons|administrators|laser|practice|scientific|science|health|healthcare|medical|med|med( |i)?spa|spa|SpaMedica|perfect|surgeons|(med)?(a)?esthetic(s|a)?|salon|lounge|studio|wellness|courier|capital|financ(e|ing)|collector|dept(\.)?|HVAC|insurance|ins|surety|freight|fine art|solution(s)?|trad(e|ing)|renewal|department|inst\.|institute|instant|university|college|America(n)?|US(A)?|global|digital|virtual|orange|coast(al)?|tree|franchise|orthopedic(s)?|academy|advertising|travel|technologies|flash|international|tech|clinic(s|al)?|Exterminator|Nightclub|management|foundation|aid|product(ions|ion|s)?|industr(y|ies|ial)|biomed|bio|bio-chem|lubian|technology|technical|special(ist(s)?|ities)?|support|innovat(e|ive|ion(s)?)|county|united|state(s)?|the|one|of|for|by|and|on|or|at|it|the|about|plan|legal|valley|republic|recruit(ing)?|media|southern|office|post office|clean(er|ers)|transport|law|contract|high|food|meal|therapy|therapeutic(s)?|dental|laboratory|instrument|southwest|ingredient(s)?|commerce|city|Laboratories|lab|logistics|newport|radio|video|photo(graphy)?|korea|communication(s)|derm(atology|atologist(s)?)|new|express|goods|mission|depot|treasur(e|er|y)|revenue|biolab|Orders|staff(ing|ed)?|investors|envelope|refresh|Anti|AgingMajestic|motors|museum|event|Kaiser|pacific|visa|platinum|level|Rejuvenation|bespoke|Cardio|speed|pro|tax|firm|DC|square|store|weight|group|Buy|balance(d)?|buckhead|market(s)?|Bulk|perks|GPT|Boutique|supplement(s)?|vitamin(s)?|plus|sales|salesforce|precision|fitness|image|premier|Fulfillment|final|elite|elase|sculpt(ing)?|botox|south|Hills|symposium|wifi|online|worldwide|tv|derm([a-z]+)|wine|rent(al(s)?)?|mail|plumber(s)?|Sociedade|card|\.com)\b/i;
exports.COMPANY_ABBREVIATION_PATTERN = /\b(?:corp|inc|co\.?,? ltd\.?|ltd|(p\.)?l\.?l\.?c|p\.?c|plc|llp|s\.c)\.?\s*$/i;
