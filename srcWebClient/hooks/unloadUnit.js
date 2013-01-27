view.registerCommandHook({

  key: "unloadUnit",

  prepare: function( data ){
    controller.updateUnitStats( data.getSourceUnit() );
  },

  render: function(){},
  update: function(){},

  isDone: function(){
    return true;
  }

});