view.registerCommandHook({

  key: "BDUN",

  prepare: function(  ){
    view.completeRedraw();
  },

  render: function(){},
  update: function(){},

  isDone: function(){
    return true;
  }

});