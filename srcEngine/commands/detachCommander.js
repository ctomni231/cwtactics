controller.unitAction({

  key:"detachCommander",

  condition: function(){
		return model.coMode === model.CO_MODES.AWDR;
  },

  invoke: function( data ){
    controller.sharedInvokement("detachCommander",[
    	model.turnOwner,
    	data.target.x,
    	data.target.y
    ]);
  }

});
