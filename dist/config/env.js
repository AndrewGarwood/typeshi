"use strict";
/**
 * @file src/config/env.ts
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DELAY = exports.STOP_RUNNING = void 0;
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
