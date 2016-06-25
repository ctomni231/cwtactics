// (Int, (Int, a) -> nothing, a) -> nothing
cwt.nTimes = (n, fn, argument = cwt.nothing()) => n > 0 ? cwt.nTimes(n - 1, fn, fn(n, argument)) : argument;

cwt.makeArray = function(n, supplier) {
  var list = [];
  for (var i = 0; i < n; i++) {
    list[i] = supplier(i);
  };
  return list;
};

cwt.listToObject = function(list, keySupplier = (k) => k, valueSupplier = (v) => v) {
  return list.reduce((object, value) => {
    object[keySupplier(value)] = valueSupplier(value);
    return object;
  }, {});
};

/**
  @param value:string
          string under test
  @param length:integer
          maximum length of the returned string (without appendix)
  @param appendix:string (default="...")
          the appendix will be appended to the returned string if
          the length of the value is greater then length
  @return a string with limited length and appended appendix
          when the value is longer than length
 */
cwt.stringWithLimitedLength = function(value, length, appendix = "...") {
  if (value.length > length) {
    value = value.substring(0, length) + appendix;
  }
  return value;
};

/**
  @param list<boolean>
  @return true if all arguments are true, else false
 */
cwt.all = function(list) {
  for (var i = 0, e = list.length; i < e; i++) {
    if (list[i] !== true) {
      return false;
    }
  }
  return true;
};
