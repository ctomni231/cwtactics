"use strict";

var assert = require("./system/functions").assert;

exports.AiAction = my.Class({

  constructor: function (ratingFn, evaluateFn) {
    assert(typeof evaluateFn === "function");
    assert(typeof ratingFn === "function");

    this.evaluate = evaluateFn;
    this.rating = ratingFn;
  },

  // Evaluates the action in a given **aiModel**.
  //
  evaluate: function (aiModel) {
    this.evaluate(aiModel);
  },

  // Generates the **rating value** for a given **aiModel**.
  //
  getRating: function (aiModel) {
    return this.rating(aiModel);
  }
});

var createAction = function (module) {
  return exports.AiAction(module.rating, module.invoke);
};

var actions = [
  createAction(require("./ai/endTurn"))
];