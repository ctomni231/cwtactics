"use strict";

// Asserts that `expr` is true. If `expr` is false then an Error will be thrown.
//
var assert = exports.assert = function (expr, msgA) {
  if (!expr) {
    if (typeof msgA === "undefined") {
      msgA = "FAIL";
    }

    if (console.error) {
      console.error(msgA);
    }

    // raise error
    throw msgA;
  }
};

exports.emptyFunction = function () {
};

exports.trueReturner = function () {
  return true;
};


// Calls a function lazy. This means the factory function fn will be called when the curried function (return
// value) will be called the first time. The factory function needs to return the value that should be returned
// by the curried function in future.
//
// @param {Function} fn factory function
// @return {Function} curried function which returns the returned value of the factory function
//
exports.lazy = function (fn) {
  var value = undefined;
  return function () {
    if (value === undefined) {
      value = fn();
    }

    return value;
  }
};

// Repeats a given function **f** for **n** times.
//
exports.repeat = function (n, f) {
  for (var i = 0; i < n; i++) {
    f.call(this, i);
  }
  return this;
};

// Selects a **random element** from a given **list** and returns it. It's possible to give a **forbiddenElement**
// that won't be selected from the list.
//
exports.selectRandomListElement = function (list, forbiddenElement) {
  var e = list.length;

  assert(e > 1 || (e > 0 && list[0] !== forbiddenElement));

  var r = parseInt(Math.random() * e, 10);
  var selected = list[r];
  if (selected === forbiddenElement) {
    selected = (r < e - 1 ? list[r + 1] : list[r - 1]);
  }

  return selected;
};

exports.createListByClass = function (clazz, size) {
  var list = [];

  while (size > 0) {
    list.push(new clazz());
    size--;
  }

  return list;
};