"use strict";

var actions = require("./actions");
var ai = require("./system/behaviourTree");

exports.data = ai.Sequence([

    // lookup for visible enemy captures
    ai.Task(function () {

    }),

    // make decision on capture type (neutral/own stuff?)
    ai.Task(function () {

    }),

    // lookup for possible attacking unit
    ai.Task(function () {

    }),

    // make attack
    ai.Task(function () {

    })
]);