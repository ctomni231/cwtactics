var optionalValue = {

  _valueExists() {
    return this.value !== null && this.value !== undefined;
  },

  ifPresent(cb) {
    if (this._valueExists()) {
      cb(this.value);
    }
  },

  orElseGet(cb) {
    if (!this._valueExists()) {
      return cb();
    }
    return this.value;
  },

  orElse(fallback) {
    return this._valueExists() ? this.value : fallback;
  }
};

exports.optional = function(value) {
  return Object.assign(Object.create(optionalValue), {
    value
  });
};