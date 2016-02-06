util.oneTimeCallable = function (callback) {
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

util.logCallback = function(msg) {
  return function () {
    util.log(msg);
  };
};