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
              controller.storage.clear( function(){ 
                window.location.reload(); 
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
    
    // SPECIAL KEYS
    INP_SPECIAL_1: generateHandler("SPECIAL_1"),
    INP_SPECIAL_2: generateHandler("SPECIAL_2"),
    INP_SPECIAL_3: generateHandler("SPECIAL_3"),
    INP_SPECIAL_4: generateHandler("SPECIAL_4"),
    INP_SPECIAL_5: generateHandler("SPECIAL_5"),
    INP_SPECIAL_6: generateHandler("SPECIAL_6"),
    
    // BASIC ACTIONS
    INP_ACTION:    generateHandler("ACTION"),
    INP_CANCEL:    generateHandler("CANCEL"),
    INP_HOVER:     generateHandler("HOVER"),
    
    onerror: controller.haltEngine
  };
});