util.scoped(function(){
  
  function generateHandler( origName ){   
    return function(){
      
      // error handling if error panel is visible
      if( controller.errorPanelVisible ){
        if( origName === "LEFT" ) controller.errorButtons.decreaseIndex();
        else if( origName === "RIGHT" ) controller.errorButtons.increaseIndex();
          else if( origName === "ACTION" ){
            var key = controller.errorButtons.getActiveKey();
            if( key === "error.panel.yes" ){

              // NUKE STORAGE
              controller.storage_general.clear( function(){
                controller.storage_assets.clear( function(){
                  controller.storage_maps.clear( function(){
                    window.location.reload();
                  });
                });
              });

            }
            else window.location.reload();
          }
          return this.breakTransition();
      }
      
      // else doing normal actions if defined
      var fn = this.structure[this.state][origName];
      if( fn ) return fn.apply( this, arguments );
      else return this.breakTransition();
    };
  };
  
  controller.stateParent = {
    
    onenter: function(){
      controller.openSection( this.structure[this.state].section );
      if( this.structure[this.state].enterState ){
        return this.structure[this.state].enterState.apply( this, arguments );
      }
    },
    
    // MOVEMENT
    INP_UP:        generateHandler("UP"),
    INP_LEFT:      generateHandler("LEFT"),
    INP_RIGHT:     generateHandler("RIGHT"),
    INP_DOWN:      generateHandler("DOWN"),

    // BASIC ACTIONS
    INP_ACTION:    generateHandler("ACTION"),
    INP_CANCEL:    generateHandler("CANCEL"),
    INP_HOVER:     generateHandler("HOVER"),
    
    onerror: controller.haltEngine
  };
});
