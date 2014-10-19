"use strict";

var actions = require("./actions");
var ai = require("./system/behaviourTree");

exports.data = ai.Sequence([

    // is power available for activation?
    ai.Task(function (model){
        return (co.canActivatePower(model.turnOwner, co.POWER_LEVEL_COP)? ai.Node.SUCCESS : ai.Node.FAILURE);
    }),

    // when super power is not far away and the battlefield situation equal or in win situation
    // then try to save for the super co power
    ai.Task(function (){

    }),

    // activate power
    ai.Task(function (){
        actions.sharedAction("activatePower", model.turnOwner.id, co.POWER_LEVEL_COP);
    })
]);