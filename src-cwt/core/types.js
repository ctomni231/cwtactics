var typeCheck = {

  isInteger(value) {
    return typeof value === 'number' && value % 1 === 0;
  },

  isNumber(value) {
    return typeof value === 'number';
  },

  isString(value) {
    return typeof value === 'string';
  },

  isFunction(value) {
    return typeof value === 'function';
  },

  isBoolean(value) {
    return value === true || value === false;
  },

  isSomething(value) {
    return value !== null && value !== undefined;
  },

  isListOf(value, valueTypeCheck) {
    return value.every(element => valueTypeCheck(element));
  },

  isMapOf(value, valueTypeCheck) {
    return Object.keys(value).every(key => valueTypeCheck(value[key]));
  }
};

var typeAssert = (function() {
  var buildRequirer = function(fn) {
    return function(value) {
      if (!fn.apply(null, arguments)) throw new Error('TypeAssertionFailed');
      return value;
    };
  };

  var checker = Object.create(typeCheck);
  Object.keys(typeCheck).forEach(key => checker[key] = buildRequirer(typeCheck[key]));

  return checker;
}());

cwt.types = typeCheck;

cwt.raiseError = (error) =>  {
  throw new Error("failed");
};

cwt.visit = (value, visitor) => {
  visitor(value);
  return value;
};

cwt.expect = (value, toFullfill) => cwt.visit(value, value => toFullfill(value) || cwt.raiseError("failed"));

// @return { is[Integer|Number|String|Something|Function|Boolean](value): boolean }
cwt.produceTypeChecker = function() {
  return typeCheck;
};

// @return { is[Integer|Number|String|Something|Function|Boolean](value): boolean }
cwt.getTypeCheckAPI = function() {
  return typeCheck;
};

// @return { is[Integer|Number|String|Something|Function|Boolean](value): value }
cwt.produceTypeAsserter = function() {
  return typeAssert;
};
