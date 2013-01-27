view.registerCommandHook({

  key: "loadUnit",

  prepare: function( data ){
    controller.updateUnitStats( data.getTargetUnit() );
  },

  render: function(){},
  update: function(){},

  isDone: function(){
    return true;
  }

});