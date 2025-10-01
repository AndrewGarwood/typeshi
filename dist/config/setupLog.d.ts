/**
 * @file src/config/setupLog.ts
 * @reference https://tslog.js.org/#/?id=pretty-templates-and-styles-color-settings
 */
import { Logger, ISettingsParam, ILogObj, IPrettyLogStyles } from "tslog";
/**
 * `TAB = INDENT_LOG_LINE =  '\n\t• '` = newLine + tab + bullet + space
 * - log.debug(s1, INDENT_LOG_LINE + s2, INDENT_LOG_LINE + s3,...)
 * */
export declare const INDENT_LOG_LINE: string;
/**
 * `NL = NEW_LINE =  '\n > '` = newLine + space + > + space
 * */
export declare const NEW_LINE: string;
export declare const logTemplates: {
    /**= {@link timestampTemplate} + {@link logNameTemplate} + {@link logLevelTemplate} + {@link fileInfoTemplate} + `\n\t{{logObjMeta}}` */
    DEFAULT_LOG_TEMPLATE: string;
    /** `"{{errorName}}: {{errorMessage}}{INDENT_LOG_LINE}{{errorStack}}"` */
    DEFAULT_ERROR_TEMPLATE: string;
    /**`"${fileInfoTemplate}:{{method}} {{stack}}"` */
    errorStackTemplate: string;
    /** `"{{yyyy}}-{{mm}}-{{dd}}"` */
    dateTemplate: string;
    /** `"{{hh}}:{{MM}}:{{ss}}"` */
    timeTemplate: string;
    /** `"{{hh}}:{{MM}}:{{ss}}.{{ms}}"` */
    msTimeTemplate: string;
    /** `"(${dateTemplate} ${timeTemplate})"` */
    timestampTemplate: string;
    /** `"[{{name}}]"` */
    logNameTemplate: string;
    /** `"[{{logLevelName}}]"` */
    logLevelTemplate: string;
    /** `"{{filePathWithLine}}"` */
    fileInfoTemplate: string;
};
export declare const PRETTY_LOG_STYLES: IPrettyLogStyles;
export declare const MAIN_LOGGER_SETTINGS: ISettingsParam<ILogObj>;
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
export declare const typeshiLogger: Logger<ILogObj>;
export declare const SIMPLE_LOG_TEMPLATE = " > ";
/** `type: "pretty"`, `template` = `" > {{logObjMeta}}"` */
export declare const SIMPLE_LOGGER_SETTINGS: ISettingsParam<ILogObj>;
export declare const typeshiSimpleLogger: Logger<ILogObj>;
export declare const HIDDEN_LOGGER_SETTINGS: ISettingsParam<ILogObj>;
export declare const typeshiHiddenLogger: Logger<ILogObj>;
