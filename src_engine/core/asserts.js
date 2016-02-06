cwt.assertTrue = function (expr, msg) {
  if (!expr) {
    throw new Error(msg || "AssertionFailed: expression is not true");
  }
};
