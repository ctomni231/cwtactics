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

util.logCallback = function (msg) {
  return function () {
    util.log(msg);
  };
};

/**
 * 
 * @param {Array}                     list    list that will be iterated
 * @param {function(element)}         handler handler which does something with the list element
 * @param {function(element):boolean} filter  filter which prevents the evaluating of the handler for the
 *                                            checked element when return false
 */
util.forEachWithFilter = function (list, handler, filter) {
  var i, e, el;
  for (i = 0, e = list.length; i < e; i++) {
    el = list[i];
    if (!filter || filter(el)) {
      handler(el);
    }
  }
};
