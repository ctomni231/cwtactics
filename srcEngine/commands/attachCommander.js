controller.action_unitAction({

  key:"attachCommander",

  condition: function(){
		if( model.co_activeMode !== model.co_MODES.AWDR ) return false;

  },

  invoke: function( data ){
    controller.action_sharedInvoke("co_attachCommander",[
    	model.round_turnOwner,
    	data.source.unitId
    ]);
  }

});
