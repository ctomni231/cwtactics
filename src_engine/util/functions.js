/**
 * Creates a function which can be called only once.
 * Further invocations throws an error.
 *
 * @throws {Error} thrown when function already called
 * @param   {function} callback function that should be called only once
 * @returns {function} wrapped function which calls the callback on invocation
 */
cwt.oneTimeCallable = function (callback) {
  var called;

  called = false;
  return function () {
    if (called) {
      throw new Error("CalledSingleExecutionFunctionTwice");
    }
    called = true;
    callback.apply(this, arguments);
  };
};

/**
 * Creates a function which prints the given message.
 *
 * @param   {string}   msg message
 * @returns {function} callback that prints the message on invocation
 */
cwt.logCallback = function (msg) {
  return function () {
    util.log(msg);
  };
};
