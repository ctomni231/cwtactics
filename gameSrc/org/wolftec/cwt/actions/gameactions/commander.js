"use strict";

var relation = require("../logic/relationship");
var model = require("../model");
var co = require("../logic/co");

exports.actionActivate = {

  condition: function (player) {
    return co.canActivatePower(player, co.POWER_LEVEL_COP);
  },

  hasSubMenu: true,
  prepareMenu: function (player, menu) {
    menu.addEntry("cop");
    if (co.canActivatePower(player, co.POWER_LEVEL_SCOP)) {
      menu.addEntry("scop");
    }
  },

  invoke: function (playerId, powerLevel) {
    co.activatePower(model.getPlayer(playerId), powerLevel);
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
*/
