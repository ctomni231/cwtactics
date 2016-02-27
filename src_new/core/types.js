cwt.require_function = function(value) {
  cwt.assert_true(cwt.type_is_function(value));
  return value;
};

cwt.type_is_function = function(value) {
  return typeof value === "function";
};

cwt.require_string = function(value) {
  cwt.assert_true(cwt.type_is_string(value));
  return value;
};

cwt.type_is_string = function(value) {
  return typeof value === "string";
};

cwt.require_integer = function(value) {
  cwt.assert_true(cwt.type_is_integer(value));
  return value;
};

cwt.type_is_integer = function(value) {
  return typeof value === "number" && value % 1 === 0;
};

cwt.require_number = function(value) {
  cwt.assert_true(cwt.type_is_number(value));
  return value;
};

cwt.type_is_number = function(value) {
  return typeof value === "number";
};

cwt.require_non_null = function(value) {
  cwt.assert_true(cwt.type_is_not_null(value));
  return value;
};

cwt.type_is_not_null = function(value) {
  return value !== null;
};

cwt.require_null = function(value) {
  cwt.assert_true(!cwt.type_is_not_null(value));
  return value;
};

cwt.type_is_null = function(value) {
  return !cwt.type_is_not_null(value);
};

cwt.require_nothing = function(value) {
  cwt.assert_true(cwt.type_is_nothing(value));
  return value;
};

cwt.type_is_nothing = function(value) {
  return value === undefined;
};

cwt.require_something = function(value) {
  cwt.assert_true(cwt.type_is_something(value));
  return value;
};

cwt.type_is_something = function(value) {
  return value !== undefined && value !== null;
};