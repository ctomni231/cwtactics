view.registerCommandHook({

  key: "attack",

  prepare: function( data ){
    controller.updateUnitStats( data.getSourceUnit() );
    controller.updateUnitStats( data.getTargetUnit() );
  },

  render: function(){},
  update: function(){},

  isDone: function(){
    return true;
  }

});