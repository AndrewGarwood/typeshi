/**
 * @file src/config/setupLog.ts
 * @reference https://tslog.js.org/#/?id=pretty-templates-and-styles-color-settings
 */
import { Logger, ILogObj, ILogObjMeta } from 'tslog';
/**
 * `TAB = INDENT_LOG_LINE =  '\n\t• '` = newLine + tab + bullet + space
 * - log.debug(s1, INDENT_LOG_LINE + s2, INDENT_LOG_LINE + s3,...)
 * */
export declare const INDENT_LOG_LINE: string;
/**
 * `NL = NEW_LINE =  '\n > '` = newLine + space + > + space
 * */
export declare const NEW_LINE: string;
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
/**
 * compress metadata into `logObj['-1']` then return stringified `logObj`
 * @param logObj {@link ILogObj}
 * @returns `string`
 */
export declare function formatLogObj(logObj: ILogObj | (ILogObj & ILogObjMeta)): string;
/**suppress logs by putting them here (do not print to console) */
export declare const SUPPRESSED_LOGS: any[];
export declare const INFO_LOGS: any[];
export declare const DEBUG_LOGS: any[];
