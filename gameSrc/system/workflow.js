"use strict";

/**
 * Calls functions in a sequence. The execution of the functions will be stopped when one of the functions
 * throws an error.
 *
 * @param functionList list of functions that will be called in a sequence
 * @param callback callback that will be called after every function in the list has been called
 * @return {*}
 */
exports.sequence = function (functionList, callback) {
  if (functionList.length === 0) {
    throw new Error("IllegalArgumentException: function list cannot be empty");
  }
  
  var completed = 0;
  
  /**
   * Evaluates the current (completed acts as pointer) function in the function list
   */
  var iterate = function (nextCallback) {
    functionList[completed](nextCallback);
  };
  
  var callbackFunction = function () {
    completed++;
    if (completed === functionList.length) {
      if (callback) {
        callback();
      }
    } else {
      iterate(callbackFunction);
    }
  };

  iterate();
};