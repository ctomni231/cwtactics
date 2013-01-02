view.registerCommandHook({

  key: "invokeMultiStepAction",

  prepare: function( data ){
    var state = controller.input.state();
    if( state === "ACTION_MENU" || state === "ACTION_SUBMENU" ){
      controller.showMenu(
        controller.input.menu, controller.input.menuSize,
        controller.mapCursorX, controller.mapCursorY
      );
    }
  },

  render: function(){},
  update: function(){},

  isDone: function(){
    return true;
  }

});