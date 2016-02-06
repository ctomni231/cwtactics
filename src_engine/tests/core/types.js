cwt.synchronTest("core-types", "isType-checks", function () {

  cwt.assertTrue(cwt.isFunction(function () {}));
  cwt.assertTrue(!cwt.isFunction(null));
  cwt.assertTrue(!cwt.isFunction(undefined));
  cwt.assertTrue(!cwt.isFunction("function () {}"));

  cwt.assertTrue(cwt.isInteger(1));
  cwt.assertTrue(!cwt.isInteger(1.5));
  cwt.assertTrue(!cwt.isInteger("1"));
  cwt.assertTrue(!cwt.isInteger("abc"));
  cwt.assertTrue(!cwt.isInteger(null));
  cwt.assertTrue(!cwt.isInteger(undefined));

  cwt.assertTrue(cwt.isString("abc"));
  cwt.assertTrue(!cwt.isString(1));
  cwt.assertTrue(!cwt.isString(null));
  cwt.assertTrue(!cwt.isString(undefined));

  cwt.assertTrue(cwt.isNumber(1));
  cwt.assertTrue(cwt.isNumber(1.5));
  cwt.assertTrue(!cwt.isNumber("1"));
  cwt.assertTrue(!cwt.isNumber(null));
  cwt.assertTrue(!cwt.isNumber(undefined));
});

cwt.synchronTest("core-types", "requireType-checks", function () {

  cwt.requireFunction(function () {});
  cwt.requireInteger(1);
  cwt.requireNumber(1.5);
  cwt.requireString("abs");

  function callWithNull(fn) {
    return function() {
      fn(null);
    };
  }

  cwt.assertFails(callWithNull(cwt.requireFunction));
  cwt.assertFails(callWithNull(cwt.requireInteger));
  cwt.assertFails(callWithNull(cwt.requireNumber));
  cwt.assertFails(callWithNull(cwt.requireString));
});
