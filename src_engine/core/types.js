cwt.requireFunction = function (value) {
  cwt.assertTrue(cwt.isFunction(value));
  return value;
};

cwt.isFunction = function (value) {
  return typeof value === "function";
};

cwt.requireString = function (value) {
  cwt.assertTrue(cwt.isString(value));
  return value;
};

cwt.isString = function (value) {
  return typeof value === "string";
};

cwt.requireInteger = function (value) {
  cwt.assertTrue(cwt.isInteger(value));
  return value;
};

cwt.isInteger = function (value) {
  return typeof value === "number" && value % 1 === 0;
};

cwt.requireNumber = function (value) {
  cwt.assertTrue(cwt.isNumber(value));
  return value;
};

cwt.isNumber = function (value) {
  return typeof value === "number";
};
