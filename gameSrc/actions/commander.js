"use strict";

require('../actions').mapAction({
  key: "activatePower",

  condition: function () {
    return cwt.CO.canActivatePower(cwt.Gameround.turnOwner, cwt.CO.POWER_LEVEL_COP);
  },

  hasSubMenu: true,
  prepareMenu: function (data) {

    data.menu.addEntry("cop");
    if (cwt.CO.canActivatePower(cwt.Gameround.turnOwner, cwt.CO.POWER_LEVEL_SCOP)) {
      data.menu.addEntry("scop");
    }
  },

  toDataBlock: function (data, dataBlock) {
    dataBlock.p1 = (data.action.selectedSubEntry === "cop" ? cwt.CO.POWER_LEVEL_COP : -1);
    dataBlock.p1 = (data.action.selectedSubEntry === "scop" ? cwt.CO.POWER_LEVEL_SCOP : -1);
  },

  parseDataBlock: function (dataBlock) {
    cwt.CO.activatePower(cwt.Gameround.turnOwner,dataBlock.p1);
  }
});

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
