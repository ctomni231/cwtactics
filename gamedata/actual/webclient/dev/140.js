util.scoped(function(){
  
  var btn = controller.generateButtonGroup( document.getElementById("cwt_player_setup_screen") );
  
  var prepare = function( obj ){
    var map = obj.value;
    var players = map.players.length;
    
    if( constants.DEBUG ) util.log("map is for "+players+" player");
  }
  
  // ----------------------------------------------------------------------------------------
  
  controller.screenStateMachine.structure.PLAYER_SETUP = Object.create(controller.stateParent);
  
	controller.screenStateMachine.structure.PLAYER_SETUP.section = "cwt_player_setup_screen";
	
  controller.screenStateMachine.structure.PLAYER_SETUP.enterState = function( map ){
    controller.storage.get( this.data.mapToLoad, prepare );
  };
  
  controller.screenStateMachine.structure.PLAYER_SETUP.UP = function(){
    btn.decreaseIndex();
    return this.breakTransition();
  };
  
  controller.screenStateMachine.structure.PLAYER_SETUP.DOWN = function(){
    btn.increaseIndex();
    return this.breakTransition();
  };
  
  controller.screenStateMachine.structure.PLAYER_SETUP.LEFT = function(){
    switch( btn.getActiveKey() ){
        
      case "P1_TYPE":  
        if( constants.DEBUG ) util.log("player 1 will be controlled by player");
        model.clientInstances[0] = true;
        controller.activeAIs[0].ai = null;
        break;
        
      case "P2_TYPE":  
        if( constants.DEBUG ) util.log("player 2 will be controlled by player");
        model.clientInstances[1] = true;
        controller.activeAIs[1].ai = null;
        break;
        
      case "P3_TYPE":  
        if( constants.DEBUG ) util.log("player 3 will be controlled by player");
        model.clientInstances[2] = true;
        controller.activeAIs[2].ai = null;
        break;
        
      case "P4_TYPE":  
        if( constants.DEBUG ) util.log("player 4 will be controlled by player");
        model.clientInstances[3] = true;
        controller.activeAIs[3].ai = null;
        break;
        
    }    
    return this.breakTransition();
  };
  
  controller.screenStateMachine.structure.PLAYER_SETUP.RIGHT = function(){
    
    switch( btn.getActiveKey() ){
        
      case "P1_TYPE":  
        if( constants.DEBUG ) util.log("player 1 will be controlled by AI");
        model.clientInstances[0] = true;
        controller.activeAIs[0].ai = controller.aiImpls.dumbBoy;
        break;
        
      case "P2_TYPE":  
        if( constants.DEBUG ) util.log("player 2 will be controlled by AI");
        model.clientInstances[1] = true;
        controller.activeAIs[1].ai = controller.aiImpls.dumbBoy;
        break;
        
      case "P3_TYPE":  
        if( constants.DEBUG ) util.log("player 3 will be controlled by AI");
        model.clientInstances[2] = true;
        controller.activeAIs[2].ai = controller.aiImpls.dumbBoy;
        break;
        
      case "P4_TYPE":  
        if( constants.DEBUG ) util.log("player 4 will be controlled by AI");
        model.clientInstances[3] = true;
        controller.activeAIs[3].ai = controller.aiImpls.dumbBoy;
        break;
        
    }    
    return this.breakTransition();
  };
  
  controller.screenStateMachine.structure.PLAYER_SETUP.CANCEL = function(){
    return "VERSUS";
  };
  
  controller.screenStateMachine.structure.PLAYER_SETUP.ACTION = function(){
    return "GAMEROUND";
  };
});