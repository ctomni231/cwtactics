//
// Core file contains extensions for RamdaJS. All extensions will be stored in the 
// object RExt.
//

var RExt = window.RExt || (window.RExt = {});

// notEquals a -> b -> Boolean
RExt.notEquals = R.complement(R.equals);

// Maybe:: a -> Just a | Nothing
RExt.Maybe = (value) => value == null || value == undefined ? RExt.Nothing() : RExt.Just(value);

RExt.Just = (value) => ({
  map: (f) => RExt.Maybe(f(value)),
  chain: (f) => f(value),
  filter: (f) => f(value) ? RExt.Just(value) : RExt.Nothing(),
  isPresent: () => true,
  ifPresent: (f) => f(value),
  orElse: (v) => value,
  fold: (presentF, notPresentF) => presentF(value),
  toString: () => "Just(" + value + ")"
});

RExt._nothing = Object.freeze({
  map: (f) => RExt._nothing,
  chain: (f) => RExt._nothing,
  filter: (f) => RExt._nothing,
  isPresent: () => false,
  ifPresent: (f) => RExt._nothing,
  orElse: (v) => v,
  fold: (presentF, notPresentF) => notPresentF(value),
  toString: () => "Nothing"
});

RExt.Nothing = () => RExt._nothing;

RExt.Either = {};

// (() -> a) -> Either error, a
RExt.Either.tryIt = (f) => {
  try {
    return RExt.Either.Right(f())
  } catch (e) {
    return RExt.Either.Left(e)
  }
};

RExt.Either.Left = function(value) {
  return {
    map: f => RExt.Either.Left(value),
    mapLeft: f => RExt.Either.Left(f(value)),
    biMap: (fLeft, fRight) => RExt.Either.Left(fLeft(value)),
    bind: f => RExt.Either.Left(value),
    chain: f => RExt.Either.Left(value),
    bindLeft: f => f(value),
    swap: () => RExt.Either.Right(value),
    isLeft: () => true,
    isRight: () => false,
    fold: (leftHandle, rightHandle) => leftHandle(value),
  };
};

RExt.Either.Right = function(value) {
  return {
    map: f => RExt.Either.Right(f(value)),
    mapLeft: f => RExt.Either.Right(value),
    biMap: (fLeft, fRight) => RExt.Either.Right(fRight(value)),
    bind: f => f(value),
    chain: f => f(value),
    bindLeft: f => RExt.Either.Right(value),
    swap: () => RExt.Either.Left(value),
    isLeft: () => false,
    isRight: () => true,
    fold: (leftHandle, rightHandle) => rightHandle(value)
  };
};

// (() -> a) -> IO a
RExt.IO = sideEffectFn => ({
  chain: sideEffectFnB => RExt.IO(() => sideEffectFnB(sideEffectFn()).run()),
  map: f => RExt.IO(() => f(sideEffectFn())),
  run: () => sideEffectFn()
});

// nestedPath:: [NumberOrInt] -> Lens 
RExt.nestedPath = R.pipe(
  R.map(R.ifElse(R.is(Number), R.lensIndex, R.lensProp)),
  R.apply(R.compose));

// tapLogger:: a -> a  
RExt.tapLogger = R.tap(x => console.log(x));

// mapTapLogger:: a -> a
RExt.mapTapLogger = R.map(RExt.tapLogger);

// Converts an string into a string with a fixed length by either extending it 
// with spaces until it reaches the given length or cutting at the given length.
// When the string will be cutted, then ... will be appended to the rest, means 
// string that are too long will be cut down to the wanted length - 3 and appended
// with the string "..."
//
// mapToFixedLength :: String -> String
RExt.mapToFixedLength = R.curry((wantedLength, s) => R.cond([
  [R.propSatisfies(R.gt(R.__, wantedLength), "length"), R.pipe(R.take(wantedLength - 3), R.append("..."), R.join(""))],
  [R.propSatisfies(R.lt(R.__, wantedLength), "length"), s => {
    const rest = wantedLength - s.length;
    return R.join("", R.times(R.always(" "), rest)) + s;
  }],
  [R.T, R.identity]
])(s));

RExt.raiseError = error => {
  throw new Error(error);
};

// ---------------------------------------------------------

// propertyPath:: [NumberOrInt] -> Lens 
R.propertyPath = RExt.nestedPath;

R.tapLog = R.tap(x => console.log(x));

(function(exports) {
  "use strict";

  const compose = function() {
    switch (arguments.length) {
      case 2:
        return compose2.apply(this, arguments);
      case 3:
        return compose3.apply(this, arguments);
      case 4:
        return compose4.apply(this, arguments);
      case 5:
        return compose5.apply(this, arguments);
      case 6:
        return compose6.apply(this, arguments);
      case 7:
        return compose7.apply(this, arguments);
      case 8:
        return compose8.apply(this, arguments);
      case 9:
        return compose9.apply(this, arguments);
      default:
        throw new Error("Unsupported arity");
    }
  };

  const compose2 = (f, g) => (value) => f(g(value));
  const compose3 = (f, g, h) => (value) => h(f(g(value)));
  const compose4 = (f, g, h, i) => (value) => i(h(f(g(value))));
  const compose5 = (f, g, h, i, j) => (value) => j(i(h(f(g(value)))));
  const compose6 = (f, g, h, i, j, k) => (value) => k(j(i(h(f(g(value))))));
  const compose7 = (f, g, h, i, j, k, l) => (value) => l(k(j(i(h(f(g(value)))))));
  const compose8 = (f, g, h, i, j, k, l, m) => (value) => m(l(k(j(i(h(f(g(value))))))));
  const compose9 = (f, g, h, i, j, k, l, m, n) => (value) => n(m(l(k(j(i(h(f(g(value)))))))));

  // (Map) => Map
  const immutable = (obj) => Object.freeze(obj);

  // (Map, Map ?= {}) => Map
  const flyweight = (prototype, data = {}) => Object.assign(Object.create(prototype), data);

  // (Map, Map ?= {}) => Map
  const createCopy = (source, data = null) =>
    Object.assign(
      Object.keys(source).reduce((obj, key) => {
        obj[key] = source[key];
        return obj;
      }, {}), data);

  // (Int, Int) => [Int]
  const intRange = (from, to) => {
    var arr = [];
    for (; from <= to; from++) {
      arr.push(from);
    }
    return arr;
  };

  // (any) => boolean
  const isInteger = (value) => typeof value === 'number' && value % 1 === 0;

  // (any) => boolean
  const isNumber = (value) => typeof value === 'number';

  // (any) => boolean
  const isString = (value) => typeof value === 'string';

  // (any) => boolean
  const isFunction = (value) => typeof value === 'function';

  // (any) => boolean
  const isBoolean = (value) => value === true || value === false;

  // (any) => boolean
  const isSomething = (value) => value !== null && value !== undefined;

  // (list<any>, (any) => boolean) => boolean
  const isListOf = (value, valueTypeCheck) => value.every(element => valueTypeCheck(element));

  // (map<any>, (any) => boolean) => boolean
  const isMapOf = (value, valueTypeCheck) => Object.keys(value).every(key => valueTypeCheck(value[key]));

  // (Int, (Int, a) => a', a) => nothing
  const nTimes = (n, fn, argument = nothing()) => n > 0 ? nTimes(n - 1, fn, fn(n, argument)) : argument;

  // ([a], (a) => Int) => Int
  const listSumUp = (list, fn) => list.reduce((sum, obj) => sum + fn(obj), 0);

  // ([a], Int) => [a]
  const rotate = function(arr, count) {
    arr = arr.map(el => el);
    count = count % arr.length;
    if (count < 0) {
      arr.unshift.apply(arr, arr.splice(count))
    } else {
      arr.push.apply(arr, arr.splice(0, count))
    }
    return arr;
  };

  const id = a => a;

  const identity = function(value) {
    return {
      map: f => identity(f(value)),
      bind: f => f(value),
      get: () => value
    };
  };

  /** @signature (Int ?= 0, Int ?= 10) => just Int */
  const random = (from = 0, to = 10) => just(from + parseInt(Math.random() * to, 10));

  const either = {

    // (a) => left String | right a (same as either String, a)
    fromNullable: value => value === null || value === undefined ?
      left("ValueIsNotDefined") : right(value),

    expectTrue: value => value === true ? left(value) : right(value),

    // (() => a) => left Error | right a (same as either Error, a)
    tryIt: (f) => {
      try {
        return right(f())
      } catch (e) {
        return left(e)
      }
    }
  };

  const left = function(value) {
    return {
      map: f => left(value),
      mapLeft: f => left(f(value)),
      biMap: (fLeft, fRight) => left(fLeft(value)),
      bind: f => left(value),
      chain: f => left(value),
      bindLeft: f => f(value),
      swap: () => right(value),
      isLeft: () => true,
      isRight: () => false,
      fold: (leftHandle, rightHandle) => leftHandle(value),
    };
  };

  const right = function(value) {
    return {
      map: f => right(f(value)),
      mapLeft: f => right(value),
      biMap: (fLeft, fRight) => right(fRight(value)),
      bind: f => f(value),
      chain: f => f(value),
      bindLeft: f => right(value),
      swap: () => left(value),
      isLeft: () => false,
      isRight: () => true,
      fold: (leftHandle, rightHandle) => rightHandle(value)
    };
  };

  const validation = (expression) => expression ? right("PASSED") : left("FAILED");

  // () => Int
  const randomInt = (from, to) => just(from + parseInt(Math.random() * (to - from), 10));

  // a => just a | nothing
  const maybe = (value) => value == null || value == undefined ? nothing() : just(value);

  const just = (value) => ({
    map: (f) => maybe(f(value)),
    elseMap: f => just(value),
    biMap: (fPresent, fNotPresent) => maybe(fPresent(value)),
    bind: (f) => f(value),
    filter: (f) => f(value) ? just(value) : nothing(),
    isPresent: () => true,
    ifPresent: (f) => f(value),
    orElse: (v) => value,
    get: () => value,
    toString: () => "just(" + value + ")"
  });

  const _nothing = immutable({
    map: (f) => _nothing,
    elseMap: (f) => maybe(f()),
    biMap: (fPresent, fNotPresent) => maybe(fNotPresent()),
    bind: (f) => _nothing,
    filter: (f) => _nothing,
    isPresent: () => false,
    ifPresent: (f) => _nothing,
    orElse: (v) => v,
    get() {
      throw new Error("Nothing");
    },
    toString: () => "nothing"
  });

  const nothing = () => _nothing;

  exports.compose = compose;
  exports.immutable = immutable;
  exports.flyweight = flyweight;
  exports.createCopy = createCopy;
  exports.intRange = intRange;
  exports.isInteger = isInteger;
  exports.isNumber = isNumber;
  exports.isString = isString;
  exports.isFunction = isFunction;
  exports.isBoolean = isBoolean;
  exports.isSomething = isSomething;
  exports.isListOf = isListOf;
  exports.isMapOf = isMapOf;
  exports.nTimes = nTimes;
  exports.listSumUp = listSumUp;
  exports.rotate = rotate;
  exports.random = random;
  exports.either = either;
  exports.eitherLeft = left;
  exports.eitherRight = right;
  exports.validation = validation;
  exports.randomInt = randomInt;
  exports.maybe = maybe;

  // (a) => identity a
  exports.identity = identity;

  exports.id = id;

  // a => just a
  exports.just = just;

  // () => nothing
  exports.nothing = nothing;

})(window.cwtCore || (window.cwtCore = {}));

// freeze API
window.cwtCore = cwtCore.immutable(cwtCore);