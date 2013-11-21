controller.action_unitAction({

  key:"detachCommander",

  condition: function(){
		return model.co_activeMode === model.co_MODES.AWDR;
  },

  invoke: function( data ){
    controller.action_sharedInvoke("detachCommander",[
    	model.round_turnOwner,
    	data.target.x,
    	data.target.y
    ]);
  }

});
