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
 * ATTENTION: implementation is not very fast nor cpu friendly!
 *
 * @throws {Error} [[Description]]
 * @param {[[Type]]} function_in_cwt_namespace [[Description]]
 */
cwt.make_only_callable_once = function (function_in_cwt_namespace) {
  var found_it;

  found_it = false;
  cwt.map_for_each_property(cwt, function (key, value) {
    if (value === function_in_cwt_namespace) {
      cwt[key] = cwt.oneTimeCallable(function_in_cwt_namespace);
      cwt.log_info("make 'cwt." + key + "' only callable one time");
      found_it = true;
      return;
    }
  });
  if (!found_it) {
    throw new Error("did not found function in cwt namespace");
  }
};

/**
 * Creates a function which prints the given message.
 *
 * @param   {string}   msg message
 * @returns {function} callback that prints the message on invocation
 */
cwt.logCallback = function (msg) {
  return function () {
    cwt.log_info(msg);
  };
};
