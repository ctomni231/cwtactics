"use strict";

var assert = require("./functions").assert;
var constants = require("../constants");

//
// An implementation of the concept of a circular buffer. Internally a circular buffer has a fixed size that makes the
// whole object very memory constant.
//
// @class
// @template T
//
exports.CircularBuffer = my.Class({

  //
  // @param {number?} size the maximum size of the buffer (default 32)
  //
  constructor: function (size) {
    if (arguments.length === 0) {
      size = 32;
    } else if (size <= 0) {
      throw Error("size cannot be 0 or lower");
    }

    this.index = 0;
    this.size = 0;
    this.data = [];
    this.maxSize = size;
  },

  //
  // @return {boolean} true when no entries are in the buffer, else false
  //
  isEmpty: function () {
    return this.size === 0;
  },

  //
  // @return {boolean} true when buffer is full, else false
  //
  isFull: function () {
    return this.size === this.maxSize;
  },

  //
  // Returns an element at a given index. The element won't be returned.
  //
  // @param {number} index
  // @return {T}
  //
  get: function (index) {
    if (index < 0 || index >= this.size) {
      throw Error("illegal index");
    }

    return this.data[(this.index + index) % this.maxSize];
  },

  //
  // Returns the oldest object from the buffer. The element will be removed from the buffer.
  //
  // @return {T} oldest object in the buffer
  //
  popFirst: function () {
    if (this.size === 0) {
      throw Error("buffer is empty");
    }

    var obj = this.data[this.index];

    // remove entry to prevent memory leaks
    this.data[this.index] = null;

    this.size--;
    this.index++;
    if (this.index === this.maxSize) {
      this.index = 0;
    }

    return obj;
  },

  //
  // Returns the youngest object from the buffer. The element will be removed from the buffer.
  //
  // @return {T} youngest object in the buffer
  //
  popLast: function () {
    if (this.size === 0) {
      throw Error("buffer is empty");
    }

    var index = (this.index + this.size - 1) % this.maxSize;
    var obj = this.data[index];

    // remove entry to prevent memory leaks
    this.data[index] = null;
    this.size--;

    return obj;
  },

  forEach: function (fn) {
    this.data.forEach(fn);
  },

  //
  // Pushes an object into the buffer.
  //
  // @param {T} el object that will be pushed into the buffer
  //
  push: function (el) {
    if (this.size === this.maxSize) {
      throw Error("buffer is full");
    }

    this.data[(this.index + this.size) % this.maxSize] = el;
    this.size++;
  },

  //
  // Removes everything from the buffer. After that the buffer will be empty.
  //
  clear: function () {
    this.index = 0;
    this.size = 0;

    // remove references from list to prevent memory leaks
    for (var i = 0, e = this.data.length; i < e; i++) {
      this.data[i] = null;
    }
  }
});

exports.copyBuffer = function (from, to) {
  if (constants.DEBUG) {
    assert(from instanceof exports.CircularBuffer && to instanceof exports.CircularBuffer);
    assert(from.size <= to.maxSize);
  }

  to.clear();
  for (var i = 0, e = from.size; i < e; i++) {
    to.push(from.get(i));
  }
};

// Creates a **CircularBuffer** with a given **size**. All slots will be filled with objects of the given **clazz**.
// The constructor of the given **clazz** will be called with zero arguments.
//
exports.createBufferByClass = function (clazz, size) {
  var list = new exports.CircularBuffer(size);

  while (size > 0) {
    list.push(new clazz());
    size--;
  }

  return list;
};