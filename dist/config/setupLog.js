"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeshiHiddenLogger = exports.HIDDEN_LOGGER_SETTINGS = exports.typeshiSimpleLogger = exports.SIMPLE_LOGGER_SETTINGS = exports.SIMPLE_LOG_TEMPLATE = exports.typeshiLogger = exports.MAIN_LOGGER_SETTINGS = exports.PRETTY_LOG_STYLES = exports.logTemplates = exports.NEW_LINE = exports.INDENT_LOG_LINE = void 0;
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
/** `"{{hh}}:{{MM}}:{{ss}}.{{ms}}"` */
const msTimeTemplate = `${timeTemplate}.{{ms}}`;
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
 * - {@link logLevelTemplate} = `{{logLevelName}}:`
 * - {@link fileInfoTemplate} = `{{fileName}}:{{fileLine}}`
 * */
const DEFAULT_LOG_TEMPLATE = [
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
const DEFAULT_ERROR_TEMPLATE = `${errorInfoTemplate}`; //`${timestampTemplate} ${logNameTemplate} ${logLevelTemplate} ${fileInfoTemplate}\n${errorInfoTemplate}`;
/**
 * use as value for {@link ISettingsParam.prettyErrorStackTemplate}.
 * @description template string for error stack trace lines.
 * */
const errorStackTemplate = `${fileInfoTemplate}:{{method}} {{stack}}`;
exports.logTemplates = {
    /**= {@link timestampTemplate} + {@link logNameTemplate} + {@link logLevelTemplate} + {@link fileInfoTemplate} + `\n\t{{logObjMeta}}` */
    DEFAULT_LOG_TEMPLATE,
    /** `"{{errorName}}: {{errorMessage}}{INDENT_LOG_LINE}{{errorStack}}"` */
    DEFAULT_ERROR_TEMPLATE,
    /**`"${fileInfoTemplate}:{{method}} {{stack}}"` */
    errorStackTemplate,
    /** `"{{yyyy}}-{{mm}}-{{dd}}"` */
    dateTemplate,
    /** `"{{hh}}:{{MM}}:{{ss}}"` */
    timeTemplate,
    /** `"{{hh}}:{{MM}}:{{ss}}.{{ms}}"` */
    msTimeTemplate,
    /** `"(${dateTemplate} ${timeTemplate})"` */
    timestampTemplate,
    /** `"[{{name}}]"` */
    logNameTemplate,
    /** `"[{{logLevelName}}]"` */
    logLevelTemplate,
    /** `"{{filePathWithLine}}"` */
    fileInfoTemplate
};
exports.PRETTY_LOG_STYLES = {
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
    errorMessage: "redBright",
};
exports.MAIN_LOGGER_SETTINGS = {
    type: "pretty",
    name: "typeshi_main",
    minLevel: 0,
    prettyLogTemplate: DEFAULT_LOG_TEMPLATE,
    prettyErrorTemplate: DEFAULT_ERROR_TEMPLATE,
    prettyErrorStackTemplate: errorStackTemplate,
    stylePrettyLogs: true,
    prettyLogTimeZone: "local",
    prettyLogStyles: exports.PRETTY_LOG_STYLES,
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
exports.typeshiLogger = new tslog_1.Logger(exports.MAIN_LOGGER_SETTINGS);
exports.SIMPLE_LOG_TEMPLATE = ` > `;
/** `type: "pretty"`, `template` = `" > {{logObjMeta}}"` */
exports.SIMPLE_LOGGER_SETTINGS = {
    type: "pretty",
    name: "typeshi_simple",
    minLevel: 0,
    prettyLogTemplate: exports.SIMPLE_LOG_TEMPLATE,
    prettyErrorTemplate: DEFAULT_ERROR_TEMPLATE,
    prettyErrorStackTemplate: errorStackTemplate,
    stylePrettyLogs: true,
    prettyLogTimeZone: "local",
    prettyLogStyles: exports.PRETTY_LOG_STYLES,
};
exports.typeshiSimpleLogger = new tslog_1.Logger(exports.SIMPLE_LOGGER_SETTINGS);
exports.HIDDEN_LOGGER_SETTINGS = {
    type: "hidden",
    name: "typeshi_hidden",
    minLevel: 0,
    prettyLogTemplate: exports.SIMPLE_LOG_TEMPLATE,
    prettyErrorTemplate: DEFAULT_ERROR_TEMPLATE,
    prettyErrorStackTemplate: errorStackTemplate,
    stylePrettyLogs: true,
    prettyLogTimeZone: "local",
    prettyLogStyles: exports.PRETTY_LOG_STYLES,
};
exports.typeshiHiddenLogger = new tslog_1.Logger(exports.HIDDEN_LOGGER_SETTINGS);
