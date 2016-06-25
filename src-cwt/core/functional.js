// (Map) -> Map
cwt.immutable = (obj) => Object.freeze(obj);

// (Map, Map ?= {}) -> Map
cwt.flyweight = (prototype, data = {}) => Object.assign(Object.create(prototype), data);

// (Map, Map ?= {}) -> Map
cwt.cloneMap = (source, data = null) =>
  Object.assign(
    Object.keys(source).reduce((obj, key) => {
      obj[key] = source[key];
      return obj;
    }, {}), data);

// (Int, Int) -> [Int]
cwt.intRange = (from, to) => {
  var arr = [];
  for (; from <= to; from++) {
    arr.push(from);
  }
  return arr;
};



cwt.either = function(left, right) {
  return {
    bind: function(f) {
      return (left.get() != null ? left.bind(f) : right.bind(f));
    },
    get: () => (left.get() != null ? left.get() : right.get())
  };
};
