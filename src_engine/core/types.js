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

cwt.requireNonNull = function (value) {
  cwt.assertTrue(cwt.isNonNull(value));
  return value;
};

cwt.isNonNull = function (value) {
  return value !== null;
};

cwt.requireNull = function (value) {
  cwt.assertTrue(!cwt.isNonNull(value));
  return value;
};

cwt.isNull = function (value) {
  return !cwt.isNonNull(value);
};

cwt.requireNothing = function (value) {
  cwt.assertTrue(cwt.isNothing(value));
  return value;
};

cwt.isNothing = function (value) {
  return value === undefined;
};
