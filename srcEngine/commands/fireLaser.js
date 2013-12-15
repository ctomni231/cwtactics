controller.action_unitAction({

  key:"fireLaser",

  relation:[
    "S","T",
    model.player_RELATION_MODES.SAME_OBJECT
  ],

  condition: function( data ){
    return model.events.fireLaser_check( data.target.unitId );
  },

  invoke: function( data ){
    controller.commandStack_sharedInvokement(
      "bombs_fireLaser",
      data.target.x,
      data.target.y
    );
  }

});
