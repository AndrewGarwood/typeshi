/**
 * @file src/config/setupLog.ts
 * @reference https://tslog.js.org/#/?id=pretty-templates-and-styles-color-settings
 */
import { 
    Logger, ISettingsParam, ILogObj, IPrettyLogStyles,
} from 'tslog';

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
].join(' ') + NEW_LINE;

/** `"{{errorName}}: {{errorMessage}}{INDENT_LOG_LINE}{{errorStack}}"` */
const errorInfoTemplate = [
    "{{errorName}}: {{errorMessage}}", "{{errorStack}}"
].join(INDENT_LOG_LINE);
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

const PRETTY_LOG_STYLES: IPrettyLogStyles = {
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

const MAIN_LOGGER_SETTINGS: ISettingsParam<ILogObj> = {
    type: "pretty",
    name: "typeshi_main",
    minLevel: 0,
    prettyLogTemplate: LOG_TEMPLATE,
    prettyErrorTemplate: ERROR_TEMPLATE,
    prettyErrorStackTemplate: ERROR_STACK_TEMPLATE,
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

const SIMPLE_LOG_TEMPLATE = ` > `
/** `type: "pretty"`, `template` = `" > {{logObjMeta}}"` */
const SIMPLE_LOGGER_SETTINGS: ISettingsParam<ILogObj> = {
    type: "pretty",
    name: "typeshi_simple",
    minLevel: 0,
    prettyLogTemplate: SIMPLE_LOG_TEMPLATE,
    prettyErrorTemplate: ERROR_TEMPLATE,
    prettyErrorStackTemplate: ERROR_STACK_TEMPLATE,
    stylePrettyLogs: true,
    prettyLogTimeZone: "local",
    prettyLogStyles: PRETTY_LOG_STYLES,
}
export const typeshiSimpleLogger = new Logger<ILogObj>(SIMPLE_LOGGER_SETTINGS);

const HIDDEN_LOGGER_SETTINGS: ISettingsParam<ILogObj> = {
    type: "hidden",
    name: "typeshi_hidden",
    minLevel: 0,
    prettyLogTemplate: SIMPLE_LOG_TEMPLATE,
    prettyErrorTemplate: ERROR_TEMPLATE,
    prettyErrorStackTemplate: ERROR_STACK_TEMPLATE,
    stylePrettyLogs: true,
    prettyLogTimeZone: "local",
    prettyLogStyles: PRETTY_LOG_STYLES,
}

export const typeshiHiddenLogger = new Logger<ILogObj>(HIDDEN_LOGGER_SETTINGS);