view.registerCommandHook({

  key: "invokeMultiStepAction",

  prepare: function( data ){
    var state = controller.input.state();
    if( state === "ACTION_MENU" || state === "ACTION_SUBMENU" ){

      var menu = controller.input.menu;
      if( controller.input.actionData.getAction() === 'unloadUnit' ){
        var old = menu;
        menu = [];
        for( var i=0, e=controller.input.menuSize-1; i<e; i++ ){
          menu[i] = model.units[ old[i] ].type;
        }
        menu[controller.input.menuSize-1] = old[ controller.input.menuSize-1 ];
      }

      controller.showMenu(
        menu, controller.input.menuSize,
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