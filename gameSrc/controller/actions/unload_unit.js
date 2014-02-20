cwt.Action.unitAction({
  key:"unloadUnit",
  multiStepAction: true,

  relation:[
    "S","T",
    cwt.Relationship.RELATION_SAMETHING,
    cwt.Relationship.RELATION_NONE
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
