cwt.test_synchron("core-types", "isType-checks", function () {

  cwt.assert_true(cwt.type_is_function(function () {}));
  cwt.assert_true(!cwt.type_is_function(null));
  cwt.assert_true(!cwt.type_is_function(undefined));
  cwt.assert_true(!cwt.type_is_function("function () {}"));

  cwt.assert_true(cwt.type_is_integer(1));
  cwt.assert_true(!cwt.type_is_integer(1.5));
  cwt.assert_true(!cwt.type_is_integer("1"));
  cwt.assert_true(!cwt.type_is_integer("abc"));
  cwt.assert_true(!cwt.type_is_integer(null));
  cwt.assert_true(!cwt.type_is_integer(undefined));

  cwt.assert_true(cwt.type_is_string("abc"));
  cwt.assert_true(!cwt.type_is_string(1));
  cwt.assert_true(!cwt.type_is_string(null));
  cwt.assert_true(!cwt.type_is_string(undefined));

  cwt.assert_true(cwt.type_is_number(1));
  cwt.assert_true(cwt.type_is_number(1.5));
  cwt.assert_true(!cwt.type_is_number("1"));
  cwt.assert_true(!cwt.type_is_number(null));
  cwt.assert_true(!cwt.type_is_number(undefined));
});

cwt.test_synchron("core-types", "requireType-checks", function () {

  cwt.require_function(function () {});
  cwt.require_integer(1);
  cwt.require_number(1.5);
  cwt.require_string("abs");

  function call_with_value_null(fn) {
    return function () {
      fn(null);
    };
  }

  cwt.assert_fails(call_with_value_null(cwt.require_function));
  cwt.assert_fails(call_with_value_null(cwt.require_integer));
  cwt.assert_fails(call_with_value_null(cwt.require_number));
  cwt.assert_fails(call_with_value_null(cwt.require_string));
});
