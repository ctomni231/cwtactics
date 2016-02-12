/*global cwt, console*/

cwt.model.tests = [];

cwt.test = {};

cwt.test.assertEquals = function (left, right, msg) {
  cwt.test.assertThat(left === right, msg);
};

cwt.test.assertThat = function (expression, msg) {
  if (!expression) {
    console.error(msg || "AssertionFailed");
  }
};

cwt.test.assertFails = function (cb, msg) {
  try {
    cb();
    cwt.test.assertThat(false, msg);
  } catch (ignore) {}
};

cwt.test.define = function (name, callback) {
  cwt.model.tests.push({
    name: name,
    cb: callback
  });
};

cwt.test.invokeAll = function (whenDone) {
  console.log("started tests");
  cwt.model.tests.forEach(function (test) {
    console.log("invoke test [" + test.name + "]");
    test.cb();
  });
  console.log("finished tests");
};
