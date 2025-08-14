"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DELAY = exports.STOP_RUNNING = exports.DATA_DIR = exports.SRC_DIR = exports.NODE_HOME_DIR = void 0;
/**
 * @file src/config/env.ts
 */
const node_path_1 = __importDefault(require("node:path"));
/** = `process.cwd()` */
exports.NODE_HOME_DIR = process.cwd();
/** = {@link NODE_HOME_DIR}`/src` = `process.cwd()/src`*/
exports.SRC_DIR = node_path_1.default.join(exports.NODE_HOME_DIR, 'node_modules', 'typeshi', 'dist');
/** = `typeshi/src/data` */
exports.DATA_DIR = node_path_1.default.join(exports.SRC_DIR, 'data');
/**
 * @description Exit the program/script for debugging purposes
 * @param exitCode `number` - The exit code to use when exiting the program. Default is `0`. Use `1` for error.
 * @param msg `any[]` `(optional)` - The message to log before exiting.
 * @returns {void}
 * */
const STOP_RUNNING = (exitCode = 0, ...msg) => {
    console.log(` > STOP_RUNNING() called with exitCode ${exitCode} at (${new Date().toLocaleString()}).`, ...(msg || []));
    process.exit(exitCode);
};
exports.STOP_RUNNING = STOP_RUNNING;
/**
 * @description `async` func to pause execution for specified amount of milliseconds
 * - default message =  `'> Pausing for ${ms} milliseconds.'`
 * - `if` pass in `null` as second argument, no message will be logged
 * @param ms `number` - milliseconds to pause execution for.
 * @param msg `any[]` `(optional)` The message to log before pausing.
 * @returns {Promise<void>}
 * @example DELAY(1000) // pauses for 1 second
 * */
const DELAY = async (ms, ...msg) => {
    let pauseMsg = ` > Pausing for ${ms} milliseconds.`;
    let msgArr = Array.isArray(msg) && msg.length > 0 ? msg : [pauseMsg];
    if (msgArr[0] !== null) {
        console.log(...msgArr);
    }
    return new Promise(resolve => setTimeout(resolve, ms));
};
exports.DELAY = DELAY;
// const envSummary: {
//     pathLabel: string,
//     pathValue: string,
//     exists: boolean
// }[] = [];
// console.log(` > [@typeshi.env.ts] Loading env variables...`)
// for (let [pName, p] of Object.entries({NODE_HOME_DIR, SRC_DIR, DATA_DIR})) {
//     envSummary.push({pathLabel: pName, pathValue: p, exists: fs.existsSync(p)})
// }
// console.table(envSummary);
