cwt.assertTrue = function (expr, msg) {
  if (!expr) {
    throw new Error(msg || "AssertionFailed: expression is not true");
  }
};

cwt.assertFails = function (callback, msg) {
  try {
    callback();
    throw new Error(msg || "AssertionFailed: callback does not thrown an error");
  } catch (ignore) {}
};
