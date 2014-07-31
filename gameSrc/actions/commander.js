"use strict";

var relation = require("../logic/relationship");
var model = require("../model");
var co = require("../logic/co");

exports.actionActivate = {
  condition: function () {
    return co.canActivatePower(model.turnOwner, co.POWER_LEVEL_COP);
  },

  hasSubMenu: true,
  prepareMenu: function (data) {

    data.menu.addEntry("cop");
    if (co.canActivatePower(model.turnOwner, co.POWER_LEVEL_SCOP)) {
      data.menu.addEntry("scop");
    }
  },

  toDataBlock: function (data, dataBlock) {
    dataBlock.p1 = (data.action.selectedSubEntry === "cop" ? co.POWER_LEVEL_COP : -1);
    dataBlock.p1 = (data.action.selectedSubEntry === "scop" ? co.POWER_LEVEL_SCOP : -1);
  },

  parseDataBlock: function (dataBlock) {
    co.activatePower(model.turnOwner, dataBlock.p1);
  }
};

/*
 cwt.Action.unitAction({
 key:"attachCommander",

 condition: function(data){
 return model.events.attachCommander_check(

 model.round_turnOwner
 );
 },

 invoke: function( data ){
 controller.commandStack_sharedInvokement(
 "co_attachCommander",
 model.round_turnOwner,
 data.source.unitId
 );
 }
 });
 */

/*
 cwt.Action.unitAction({
 key:"detachCommander",

 condition: function(data){
 return model.events.detachCommander_check(

 model.round_turnOwner
 );
 },

 invoke: function( data ){
 controller.commandStack_sharedInvokement(
 "detachCommander_invoked",
 model.round_turnOwner,
 data.target.x,
 data.target.y
 );
 }
 });
 //
