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
  },

  peek(peekFn) {
    this.ifPresent(peekFn);
    return this;
  },

  map(mapper) {
    if (this._valueExists()) {
      return cwt.produceInstance(optionalValue, {
        value: mapper(this.value)
      });
    }
    return this;
  },

  filter(filter) {
    if (this._valueExists()) {
      return filter(this.value) ? this : cwt.produceInstance(optionalValue, {
        value: null
      });
    }
    return this;
  }
};

/**
  @param fn
          function that will be used for the partial application
  @param varargs<any>
          the rest arguments will be used as fixed arguments for
          the returned function
  @return partial applicated function which uses the rest arguments
          as fixed parameters from the left side of the arguments of fn
 */
cwt.partialApplyLeft = function(fn) {
  var slice = Array.prototype.slice;
  var args = slice.call(arguments, 1);

  return fn.bind.apply(fn, [null].concat(args));
};

/**
  @param fn
          function that will be used for the partial application
  @param varargs<any>
          the rest arguments will be used as fixed arguments for
          the returned function
  @return partial applicated function which uses the rest arguments
          as fixed parameters from the right side of the arguments of fn
 */
cwt.partialApplyRight = function(fn) {
  var slice = Array.prototype.slice;
  var args = slice.call(arguments, 1);

  return function() {
    return fn.apply(this, slice.call(arguments, 0).concat(args));
  };
};

/**
   @param n integer
          number of times fn will be called
   @param fn function(iteration:int)
          will be called with the current iteration number as
          first argument each time
 */
cwt.nTimes = function(n, fn) {
  let i = 1;
  while (i <= n) {
    fn(i);
    i++;
  }
};

/**
  @param value
          value that is set or maybe null
  @return {
    ifPresend(callback:function(value))
          callback will be called if the value of the optional
          is not null nor undefined
    orElse(else-value:any)
          returns the else-value if the value of the optional
          is null or undefined
  }
 */
cwt.optional = function(value) {
  return cwt.produceInstance(optionalValue, {
    value
  });
};

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

// FIXME: too much ?
cwt.isTrue = function(expected, error, value) {
  if (expected !== value) {
    cwt.raiseError(error);
  }
};

cwt.untilFalse = function(fn) {
  while (fn()) {

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