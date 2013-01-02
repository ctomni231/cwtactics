view.registerCommandHook({

  key: "join",

  prepare: function( data ){
    controller.updateUnitStats( data.getTargetUnit() );
  },

  render: function(){},
  update: function(){},

  isDone: function(){
    return true;
  }

});