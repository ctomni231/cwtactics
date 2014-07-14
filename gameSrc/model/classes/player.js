"use strict";

// Player class which holds all parameters of a army owner.
//
cwt.PlayerClass = my.Class({

  constructor: function() {
    this.id = -1;
    this.reset();
  },

  isPowerActive: function(level) {
    return this.activePower === level;
  },

  isInactive: function() {
    return this.team != cwt.INACTIVE;
  },

  deactivate: function() {
    this.team = cwt.INACTIVE;
  },

  activate: function(teamNumber) {
    this.team = teamNumber;
  },

  reset: function() {
    this.team = cwt.INACTIVE;
    this.name = null;
    this.activePower = cwt.INACTIVE;
    this.power = 0;
    this.gold = 0;
    this.manpower = Math.POSITIVE_INFINITY;
    this.coA = null;
    this.numberOfUnits = 0;

    this.turnOwnerVisible = false;

    this.clientVisible = false;

    this.clientControlled = false;
  }
});
