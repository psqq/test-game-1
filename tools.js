import config from "./config.js";

/**
 * @param {new (...arg: any) => T} Class
 * @param {(obj: T) => any} cb
 * @template T
 */
export function make(Class, cb) {
  let obj = new Class();
  cb(obj);
  return obj;
}

/**
 * @param {KeyboardEvent} event
 * @returns {Victor}
 */
export function getDirectionByKeyboardEvent(event) {
  return config.directionByKeyCode[event.code];
}
