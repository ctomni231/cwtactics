controller.action_unitAction({

  key:"silofire",

  relation:[
    "S","T",
    model.player_RELATION_MODES.SAME_OBJECT,
    model.player_RELATION_MODES.NONE
  ],

  relationToProp:[
    "S","T",
    model.player_RELATION_MODES.NONE
  ],

  prepareSelection: function( data ){
    data.selectionRange = data.target.property.type.rocketsilo.range;
  },

  isTargetValid: function( data, x,y ){
    return model.events.silofire_validPos( x,y );
  },

  condition: function( data ){
    return model.events.silofire_check( data.target.propertyId, data.source.unitId );
  },

  invoke: function( data ){
    controller.commandStack_sharedInvokement(
      "silofire_invoked",
      data.target.x,
      data.target.y,
      data.targetselection.x,
      data.targetselection.y,
      data.source.unit.owner
    );
  }
});
