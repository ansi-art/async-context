"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.kitchenSync = void 0;
/*
import { isBrowser, isJsDom } from 'browser-or-node';
import * as mod from 'module';
import * as path from 'path';
let internalRequire = null;
if(typeof require !== 'undefined') internalRequire = require;
const ensureRequire = ()=> (!internalRequire) && (internalRequire = mod.createRequire(import.meta.url));
//*/

/**
* A JSON object
* @typedef { object } JSON
*/

const missingReturnErrorText = 'Neither an error nor result was returned';
/**
* @function kitchenSync
* Wrap callback oriented code that can be used as a promise, without 
*/
const kitchenSync = (cb, options = {}) => {
  let callback = cb;
  if (!callback) {
    let resolve = null;
    let reject = null;
    callback = (err, result) => {
      if (err) return reject && reject(err);
      if (result) return resolve && resolve(result);
      if (options.errorOnMissingReturn) {
        return reject(new Error(missingReturnErrorText));
      } else {
        (console.err || console.log)(new Error(missingReturnErrorText));
      }
    };
    callback.return = new Promise((rslv, rjct) => {
      resolve = rslv;
      reject = rjct;
    });
  }
  return callback;
};
exports.kitchenSync = kitchenSync;