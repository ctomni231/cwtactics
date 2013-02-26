view.registerCommandHook({

  key: "IVMS",

  prepare: function(){
    var state = controller.stateMachine.state;
    var data = controller.stateMachine.data;
    if( state === "ACTION_MENU" || state === "ACTION_SUBMENU" ){

      /*
      var menu = data.menu;
      if( data.action === 'unloadUnit' ){
        var old = menu;
        menu = [];
        for( var i=0, e=controller.input.menuSize-1; i<e; i++ ){
          menu[i] = model.units[ old[i] ].type;
        }
        menu[controller.input.menuSize-1] = old[ controller.input.menuSize-1 ];
      }
      */

      controller.showMenu( data.menu, data.menuSize, controller.mapCursorX, controller.mapCursorY );
    }
  },

  render: function(){},
  update: function(){},

  isDone: function(){
    return true;
  }

});