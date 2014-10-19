"use strict";

var actions = require("./actions");
var ai = require("./system/behaviourTree");

exports.data = ai.Task(function () {
    // there is nothing to do for dumbBoy when a tick reaches this leaf
    //  -> invoke next turn to end the turn for the current active ai instance.

    actions.sharedAction("nextTurn");
    return ai.Node.SUCCESS;
});