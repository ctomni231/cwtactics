cwt.assert_true = function(expr, msg) {
  if (!expr) {
    throw new Error(msg || "AssertionFailed: expression is not true");
  }
};

cwt.assert_fails = function(callback, msg) {
  try {
    callback();
    throw new Error(msg || "AssertionFailed: callback does not thrown an error");
  } catch (ignore) {}
};

cwt.assert_equals = function(actual, expected, msg) {
  if (actual !== expected) {
    throw new Error(msg || "AssertionFailed: actual and expected are not the same");
  }
};

cwt.assert_not_equals = function(actual, expected, msg) {
  if (actual === expected) {
    throw new Error(msg || "AssertionFailed: actual and expected are the same");
  }
};

/**
 * asserts that two arrays contains the same content.
 *
 * @throws {Error} when arrays are not equal
 * @param {Array}  actual_array            left array
 * @param {Array}  expected_array          right array
 * @param {string} [msg="AssertionFailed:] message that will be used as error
 */
cwt.assert_array_equals = function(actual_array, expected_array, msg) {
  var i, e;

  msg = msg || "AssertionFailed: arrays are not equal";

  if (actual_array.length !== expected_array.length) {
    throw new Error(msg);
  }

  for (i = 0, e = actual_array.length; i < e; i += 1) {
    cwt.assert_true(actual_array[i] === expected_array[i]);
  }
};