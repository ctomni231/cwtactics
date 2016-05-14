cwt.partialApplyLeft = function(fn) {
  var slice = Array.prototype.slice;
  var args = slice.call(arguments, 1);

  return fn.bind.apply(fn, [null].concat(args));
};

cwt.partialApplyRight = function(fn) {
  var slice = Array.prototype.slice;
  var args = slice.call(arguments, 1);

  return function() {
    return fn.apply(this, slice.call(arguments, 0).concat(args));
  };
};

cwt.nTimes = function(n, fn) {
  let i = 1;
  while (i <= n) {
    fn(i);
    i++;
  }
};

cwt.raiseError = function(error) {
  throw new Error(error);
};

cwt.mustReturn = function(fn, expectedValue) {
  return function() {
    var returnValue = fn.apply(null, arguments);
    if (returnValue !== expectedValue) {
      cwt.raiseError("UnexpectedFunctionReturn");
    }
    return returnValue;
  }
};

var optionalValue = {

  _valueExists() {
    return this.value !== null && this.value !== undefined;
  },

  ifPresent(cb) {
    if (this._valueExists()) {
      cb(this.value);
    }
  },

  orElse(fallback) {
    return this._valueExists() ? this.value : fallback;
  }
};

cwt.optional = function(value) {
  return Object.assign(Object.create(optionalValue), {
    value
  });
};

cwt.stringWithLimitedLength = function(value, length, appendix = "...") {
  if (value.length > length) {
    value = value.substring(0, length) + appendix;
  }
  return value;
};