cwt.Action.unitAction({
  key:"fireLaser",

  relation:[
    "S","T",
    cwt.Player.RELATION_SAMETHING
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
