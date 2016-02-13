cwt.require_function = function (value) {
  cwt.assert_true(cwt.type_is_function(value));
  return value;
};

cwt.type_is_function = function (value) {
  return typeof value === "function";
};

cwt.require_string = function (value) {
  cwt.assert_true(cwt.type_is_string(value));
  return value;
};

cwt.type_is_string = function (value) {
  return typeof value === "string";
};

cwt.require_integer = function (value) {
  cwt.assert_true(cwt.type_is_integer(value));
  return value;
};

cwt.type_is_integer = function (value) {
  return typeof value === "number" && value % 1 === 0;
};

cwt.require_number = function (value) {
  cwt.assert_true(cwt.type_is_number(value));
  return value;
};

cwt.type_is_number = function (value) {
  return typeof value === "number";
};

cwt.require_non_null = function (value) {
  cwt.assert_true(cwt.isNonNull(value));
  return value;
};

cwt.isNonNull = function (value) {
  return value !== null;
};

cwt.requireNull = function (value) {
  cwt.assert_true(!cwt.isNonNull(value));
  return value;
};

cwt.isNull = function (value) {
  return !cwt.isNonNull(value);
};

cwt.requireNothing = function (value) {
  cwt.assert_true(cwt.isNothing(value));
  return value;
};

cwt.isNothing = function (value) {
  return value === undefined;
};
