controller.action_unitAction({

  key:"unloadUnit",
  multiStepAction: true,

  relation:[
    "S","T",
    model.player_RELATION_MODES.SAME_OBJECT,
    model.player_RELATION_MODES.NONE
  ],

  condition: function( data ){
    return model.events.unloadUnit_check(

      data.source.unitId,
      data.target.x,
      data.target.y
    );
  },

  prepareMenu: function( data ){
    model.events.unloadUnit_addUnloadTargetsToMenu(
      data.source.unitId,
      data.target.x,
      data.target.y,
      data.menu
    );
  },

  targetSelectionType: "B",
  prepareTargets: function( data ){
    model.events.unloadUnit_addUnloadTargetsToSelection(
      data.source.unitId,
      data.target.x,
      data.target.y,
      data.action.selectedSubEntry,
      data.selection
    );
  },

  invoke: function( data ){
    controller.commandStack_sharedInvokement(
      "unloadUnit_invoked",
      data.source.unitId,
      data.target.x,
      data.target.y,
      data.action.selectedSubEntry,
      data.targetselection.x,
      data.targetselection.y
    );
  }

});
