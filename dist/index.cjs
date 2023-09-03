"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.asyncContext = exports.Context = void 0;
/* global StopIteration:false */
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

/**
 * An iteration return
 * @typedef { JSON } iteration
 * @typedef { function } iteration.next
 */

/**
 * Creates a new Context, which is directly Proxy consumable.
 * @class
 */
const Context = function (obj) {
  this.target = obj;
  this.work = null;
};
exports.Context = Context;
Context.prototype = {
  /**
   * @function has
   * Does the context contain this key?
   * @argument {string} key The key being tested.
   * @return {boolean} return true if the key is present.
   */
  has: function (name) {
    return name in this.target;
  },
  /**
   * @function get
   * Get the value associated with the key 
   * @argument {string} key The key being retrieved.
   * @argument {string} mode The type of return context [promise, complete, callback].
   * @argument {string} receiver Receiver object.
   * @return {boolean} return true if the key is present.
   */
  get: function (target, name, receiver) {
    let ob = this;
    let value = this.target[name];
    if (name === 'promise' || name === 'complete') {
      let reject = null;
      let resolve = null;
      let promise = new Promise((rslv, rjct) => {
        reject = rjct;
        resolve = rslv;
      });
      ob.work.push((err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
      return promise;
    }
    if (typeof value === 'function') {
      return function () {
        let args = Array.prototype.slice.call(arguments);
        let accumulateWork = (err, result) => {
          if (ob.work.length) {
            ob.work.shift()(err, result);
          }
        };
        let addWork = (value, args) => {
          if (ob.work) {
            ob.work.push((err, result) => {
              value.apply(value, args);
            });
          } else {
            //todo: maybe detach?
            value.apply(value, args);
            ob.work = [];
          }
        };
        if (
        //is it a callback?
        typeof args[args.length - 1] === 'function') {
          let cb = args[args.length - 1];
          args[args.length - 1] = accumulateWork;
          addWork(value, args);
          ob.work.push(cb);
        } else {
          args.push(accumulateWork);
          addWork(value, args);
        }
        return receiver;
      };
    }
    return value;
  },
  /**
   * @function get
   * Get the value associated with the key 
   * @argument {string} key The key being set.
   * @argument {string} receiver Receiver object.
   * @argument {*} mode The value being set.
   * @return {boolean} return true if the key is present.
   */
  set: function (rcvr, name, val) {
    //context is emergent, not something you can set
    return true;
  },
  /**
   * @function delete
   * Delete the value associated with the key 
   * @argument {string} key The key being deleted.
   */
  'delete': function (name) {
    //context is emergent, not something you can delete
  },
  /**
   * @function enumerate
   * Get an enumerated list.
   * @return {Array} return true if the key is present.
   */
  enumerate: function () {
    var res = [];
    for (var key in this.target.ordering) res.push(key);
    return res;
  },
  /**
    * @function iterate
    * Iterate through the keys and values in the context
    * @return {iteration} return The iterator.
    */
  iterate: function () {
    var props = this.enumerate(),
      i = 0;
    return {
      next: function () {
        if (i === props.length) throw StopIteration;
        return props[i++];
      }
    };
  },
  /**
    * @function keys
    * Get the list of all present keys
    * @return {Array} return true if the key is present.
    */
  keys: function () {
    return Object.keys(this.target);
  }
};

/**
  * @function wrap
  * @static
  * Wrap an object to be able to chain it's members using callbacks or promises
  * @return {Proxy} return the wrapped object.
  */
Context.wrap = function (obj) {
  return new Proxy(Object.getPrototypeOf(obj), new Context(obj));
};

/**
  * @function asyncContext
  * create a context to be able to chain it's members using callbacks or promises
  * @return {Proxy} return the context.
  */
const asyncContext = ob => {
  return Context.wrap(ob);
};
exports.asyncContext = asyncContext;