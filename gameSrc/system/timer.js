"use strict";

exports.Timer = function (steps, time) {
  this.time = 0;
  this.step = 0;
  this.maxTime = time;
  this.maxSteps = steps;
};

exports.Timer.prototype = {
  evalTime: function (time) {
    this.time += time;
    if (this.time > this.maxTime) {
      this.step += 1;
      this.time = 0;

      if (this.step === this.maxSteps) {
        this.step = 0;
      }
    }
  },

  reset: function () {
    this.time = 0;
    this.step = 0;
  }
};