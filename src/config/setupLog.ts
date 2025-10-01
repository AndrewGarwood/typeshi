/**
 * @file src/config/setupLog.ts
 * @reference https://tslog.js.org/#/?id=pretty-templates-and-styles-color-settings
 */
import { 
    Logger, ISettingsParam, ILogObj, IPrettyLogStyles,
} from "tslog";

/** 
 * `TAB = INDENT_LOG_LINE =  '\n\t• '` = newLine + tab + bullet + space
 * - log.debug(s1, INDENT_LOG_LINE + s2, INDENT_LOG_LINE + s3,...) 
 * */
export const INDENT_LOG_LINE: string = '\n\t• ';
/** 
 * `NL = NEW_LINE =  '\n > '` = newLine + space + > + space
 * */
export const NEW_LINE: string = '\n > ';

const dateTemplate = "{{yyyy}}-{{mm}}-{{dd}}";
const timeTemplate = "{{hh}}:{{MM}}:{{ss}}";//.{{ms}}";
/** `"{{hh}}:{{MM}}:{{ss}}.{{ms}}"` */
const msTimeTemplate = `${timeTemplate}.{{ms}}`
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
].join(' ') + NEW_LINE;

/** `"{{errorName}}: {{errorMessage}}{INDENT_LOG_LINE}{{errorStack}}"` */
const errorInfoTemplate = [
    "{{errorName}}: {{errorMessage}}", "{{errorStack}}"
].join(INDENT_LOG_LINE);
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

export const logTemplates = {
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
}


export const PRETTY_LOG_STYLES: IPrettyLogStyles = {
    yyyy: "green",
    mm: "green",
    dd: "green",
    hh: "greenBright",
    MM: "greenBright",
    ss: "greenBright",
    ms: "greenBright",
    dateIsoStr: ["redBright", "italic"], //dateIsoStr is = Shortcut for {{yyyy}}.{{mm}}.{{dd}} {{hh}}:{{MM}}:{{ss}}:{{ms}}
    logLevelName:  {
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

export const MAIN_LOGGER_SETTINGS: ISettingsParam<ILogObj> = {
    type: "pretty",
    name: "typeshi_main",
    minLevel: 0,
    prettyLogTemplate: DEFAULT_LOG_TEMPLATE,
    prettyErrorTemplate: DEFAULT_ERROR_TEMPLATE,
    prettyErrorStackTemplate: errorStackTemplate,
    stylePrettyLogs: true,
    prettyLogTimeZone: "local",
    prettyLogStyles: PRETTY_LOG_STYLES,
}

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
export const typeshiLogger = new Logger<ILogObj>(MAIN_LOGGER_SETTINGS);

export const SIMPLE_LOG_TEMPLATE = ` > `;
/** `type: "pretty"`, `template` = `" > {{logObjMeta}}"` */
export const SIMPLE_LOGGER_SETTINGS: ISettingsParam<ILogObj> = {
    type: "pretty",
    name: "typeshi_simple",
    minLevel: 0,
    prettyLogTemplate: SIMPLE_LOG_TEMPLATE,
    prettyErrorTemplate: DEFAULT_ERROR_TEMPLATE,
    prettyErrorStackTemplate: errorStackTemplate,
    stylePrettyLogs: true,
    prettyLogTimeZone: "local",
    prettyLogStyles: PRETTY_LOG_STYLES,
}
export const typeshiSimpleLogger = new Logger<ILogObj>(SIMPLE_LOGGER_SETTINGS);

export const HIDDEN_LOGGER_SETTINGS: ISettingsParam<ILogObj> = {
    type: "hidden",
    name: "typeshi_hidden",
    minLevel: 0,
    prettyLogTemplate: SIMPLE_LOG_TEMPLATE,
    prettyErrorTemplate: DEFAULT_ERROR_TEMPLATE,
    prettyErrorStackTemplate: errorStackTemplate,
    stylePrettyLogs: true,
    prettyLogTimeZone: "local",
    prettyLogStyles: PRETTY_LOG_STYLES,
}

export const typeshiHiddenLogger = new Logger<ILogObj>(HIDDEN_LOGGER_SETTINGS);