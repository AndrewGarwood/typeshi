"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEBUG_LOGS = exports.INFO_LOGS = exports.SUPPRESSED_LOGS = exports.mainLogger = exports.NEW_LINE = exports.INDENT_LOG_LINE = void 0;
exports.formatLogObj = formatLogObj;
/**
 * @file src/config/setupLog.ts
 * @reference https://tslog.js.org/#/?id=pretty-templates-and-styles-color-settings
 */
const tslog_1 = require("tslog");
/**
 * `TAB = INDENT_LOG_LINE =  '\n\t• '` = newLine + tab + bullet + space
 * - log.debug(s1, INDENT_LOG_LINE + s2, INDENT_LOG_LINE + s3,...)
 * */
exports.INDENT_LOG_LINE = '\n\t• ';
/**
 * `NL = NEW_LINE =  '\n > '` = newLine + space + > + space
 * */
exports.NEW_LINE = '\n > ';
const dateTemplate = "{{yyyy}}-{{mm}}-{{dd}}";
const timeTemplate = "{{hh}}:{{MM}}:{{ss}}"; //.{{ms}}";
const timestampTemplate = `(${dateTemplate} ${timeTemplate})`;
/**not included for now */
const logNameTemplate = "[{{name}}]"; //"[{{nameWithDelimiterPrefix}}{{name}}{{nameWithDelimiterSuffix}}]";
/** e.g. [INFO] */
const logLevelTemplate = "[{{logLevelName}}]";
const fileInfoTemplate = "{{filePathWithLine}}";
//:{{fileColumn}} {{method}}";
// "{{fileName}}:{{fileLine}}";
/**
 * use as value for {@link ISettingsParam.prettyLogTemplate}
 * = {@link timestampTemplate} + {@link logNameTemplate} + {@link logLevelTemplate} + {@link fileInfoTemplate} + `\n\t{{logObjMeta}}`
 * - {@link timestampTemplate} = `({{yyyy}}-{{mm}}-{{dd}} {{hh}}:{{MM}}:{{ss}}.{{ms}})`
 * - {@link logNameTemplate} = `"[{{name}}]"`
 * - {@link logLevelTemplate} = `{{logLevelName}}:`
 * - {@link fileInfoTemplate} = `{{fileName}}:{{fileLine}}`
 * */
const LOG_TEMPLATE = [
    logLevelTemplate,
    timestampTemplate,
    // logNameTemplate, 
    fileInfoTemplate,
].join(' ') + exports.NEW_LINE;
/** `"{{errorName}}: {{errorMessage}}{INDENT_LOG_LINE}{{errorStack}}"` */
const errorInfoTemplate = [
    "{{errorName}}: {{errorMessage}}", "{{errorStack}}"
].join(exports.INDENT_LOG_LINE);
/**
 * use as value for {@link ISettingsParam.prettyErrorTemplate}
 * @description template string for error message.
 * */
const ERROR_TEMPLATE = `${errorInfoTemplate}`; //`${timestampTemplate} ${logNameTemplate} ${logLevelTemplate} ${fileInfoTemplate}\n${errorInfoTemplate}`;
/**
 * use as value for {@link ISettingsParam.prettyErrorStackTemplate}.
 * @description template string for error stack trace lines.
 * */
const ERROR_STACK_TEMPLATE = `${fileInfoTemplate}:{{method}} {{stack}}`;
const PRETTY_LOG_STYLES = {
    yyyy: "green",
    mm: "green",
    dd: "green",
    hh: "greenBright",
    MM: "greenBright",
    ss: "greenBright",
    ms: "greenBright",
    dateIsoStr: ["redBright", "italic"], //dateIsoStr is = Shortcut for {{yyyy}}.{{mm}}.{{dd}} {{hh}}:{{MM}}:{{ss}}:{{ms}}
    logLevelName: {
        "*": ["bold", "black", "bgWhiteBright", "dim"],
        SILLY: ["bold", "white"],
        TRACE: ["bold", "whiteBright"],
        DEBUG: ["bold", "green"],
        INFO: ["bold", "cyan"],
        WARN: ["bold", "yellow"],
        ERROR: ["bold", "red"],
        FATAL: ["bold", "redBright"],
    },
    fileName: "cyan",
    filePath: "blue",
    fileLine: ["cyanBright", "bold"],
    filePathWithLine: ["blueBright", "italic"],
    name: "blue",
    nameWithDelimiterPrefix: ["whiteBright", "bold", "bgBlackBright"],
    nameWithDelimiterSuffix: ["whiteBright", "bold", "bgBlack"],
    errorName: ["red", "bold"],
    errorMessage: ["red", "bgBlackBright"],
};
const MAIN_LOGGER_SETTINGS = {
    type: "pretty",
    name: "typeshi_main",
    minLevel: 0,
    prettyLogTemplate: LOG_TEMPLATE,
    prettyErrorTemplate: ERROR_TEMPLATE,
    prettyErrorStackTemplate: ERROR_STACK_TEMPLATE,
    stylePrettyLogs: true,
    prettyLogTimeZone: "local",
    prettyLogStyles: PRETTY_LOG_STYLES,
};
/**
 * `type: "pretty"`
 * @example
 *
 * mainLogger.attachTransport((logObj: ILogObj & ILogObjMeta) => {
 *  appendFileSync(
 *      DEFAULT_LOG_FILEPATH,
 *      JSON.stringify(formatLogObj(logObj)) + "\n",
 *      { encoding: "utf-8" }
 *  );
 * });
 *
 * */
exports.mainLogger = new tslog_1.Logger(MAIN_LOGGER_SETTINGS);
/**
 * compress metadata into `logObj['-1']` then return stringified `logObj`
 * @param logObj {@link ILogObj}
 * @returns `string`
 */
function formatLogObj(logObj) {
    const meta = logObj['_meta'];
    const { logLevelName, date, path } = meta;
    const timestamp = date ? date.toLocaleString() : '';
    const fileInfo = `${path?.filePathWithLine}:${path?.fileColumn}`;
    const methodInfo = `${path?.method ? path.method + '()' : ''}`;
    delete logObj['_meta'];
    logObj['meta0'] = `[${logLevelName}] (${timestamp})`;
    logObj['meta1'] = `${fileInfo} @ ${methodInfo}`;
    return JSON.stringify(logObj, null, 4) + "\n";
}
/**suppress logs by putting them here (do not print to console) */
exports.SUPPRESSED_LOGS = [];
exports.INFO_LOGS = [];
exports.DEBUG_LOGS = [];
