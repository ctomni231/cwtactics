util.scoped(function(){
  
  var btn = controller.generateButtonGroup( 
    document.getElementById("cwt_player_setup_screen"),
    "cwt_panel_header_big cwt_page_button cwt_panel_button",
    "cwt_panel_header_big cwt_page_button cwt_panel_button button_active",
    "cwt_panel_header_big cwt_page_button cwt_panel_button button_inactive"
  );
  
  // masks for teams
  var teamIdentifiers = [ "A","B","C","D" ];
  
  // buttons
  var modeBtn = document.getElementById("options.playerConf.coMode");
  var selPlayerBtn = document.getElementById("options.playerConf.selectedSlot");
  var coModeBtn = document.getElementById("options.playerConf.coMode");
  var typeBtn = document.getElementById("options.playerConf.type");
  var teamBtn = document.getElementById("options.playerConf.team");
  var coABtn = document.getElementById("options.playerConf.coA");
  
  // current selected ids
  var selectedPid = INACTIVE_ID;
  
  function updateButtons( a,b,c ){
    typeBtn.innerHTML = model.data_localized(a);
    teamBtn.innerHTML = (c>= 0 && c<teamIdentifiers.length)? teamIdentifiers[c] : "&#160;";
    coABtn.innerHTML  = (b)? model.data_localized(b): b;
  }
  
  function updateGamemodeBtn(){
    var key = null;
    
    if( model.co_activeMode === model.co_MODES.AW1 ) key = "options.playerConf.mode.AW1";
    else if( model.co_activeMode === model.co_MODES.AW2 ) key = "options.playerConf.mode.AW2";
    //if( model.co_activeMode === model.co_MODES.NONE ) key = "options.playerConf.mode.NONE";
    
    modeBtn.innerHTML = model.data_localized(key);
  }
  
  function updateButtonsForPlayer( pid ){
    var type = controller.roundConfig_typeSelected[pid];
    if( type === INACTIVE_ID ) updateButtons("config.player.off", "&#160;", -1);
    else if( type === DESELECT_ID ) updateButtons("config.player.disabled", "&#160;", -1);
    else updateButtons(
      ( type === 0 )? "config.player.human" : "config.player.AI", 
      (controller.roundConfig_coSelected[pid] !== INACTIVE_ID)? 
        model.data_coSheets[ model.data_coTypes[ controller.roundConfig_coSelected[pid] ] ].ID : 
        "config.player.co.none", 
      controller.roundConfig_teamSelected[pid]
    );
    selPlayerBtn.innerHTML = pid+1;
  }
    
  // ----------------------------------------------------------------------------------------
  
  controller.screenStateMachine.structure.PLAYER_SETUP = Object.create(controller.stateParent);
  
  controller.screenStateMachine.structure.PLAYER_SETUP.section = "cwt_player_setup_screen";
	
  controller.screenStateMachine.structure.PLAYER_SETUP.enterState = function(){
    selectedPid = 0;
    updateButtonsForPlayer( selectedPid );
    updateGamemodeBtn();
  };
  
  // ***************** D-PAD *****************
  
  controller.screenStateMachine.structure.PLAYER_SETUP.UP = function(){
    var value = 0;
    switch( btn.getActiveKey() ){
        
      case "options.playerConf.p1":
      case "options.playerConf.gameMode.prev":
      case "options.goBack":
        value = 1;
        break;
        
      case "config.type.next":
      case "config.co.next":
      case "config.team.next":
      case "config.type.prev":
      case "config.co.prev":
      case "config.team.prev":
      case "options.playerConf.p2":
      case "options.playerConf.gameMode.next":
      case "options.next":
        value = 2;
        break;
        
      case "options.playerConf.p3":
        value = 3;
        break;
        
      case "options.playerConf.p4":
        value = 4;
        break;
    }
    
    if( value ) btn.decreaseIndex(value);
    return this.breakTransition();
  };
  
  controller.screenStateMachine.structure.PLAYER_SETUP.DOWN = function(){
    var value = 0;
    switch( btn.getActiveKey() ){
        
      case "options.playerConf.p1":
        value = 4;
        break;
        
      case "options.playerConf.p2":
        value = 3;
        break;
        
      case "config.type.prev":
      case "config.co.prev":
      case "config.team.prev":
      case "config.type.next":
      case "config.co.next":
      case "config.team.next":
      case "options.playerConf.p3":
      case "options.goBack":
      case "options.playerConf.gameMode.prev":
        value = 2;
        break;
        
      case "options.playerConf.p4":
      case "options.playerConf.gameMode.next":
      case "options.next":
        value = 1;
        break;
    }
    
    if( value ) btn.increaseIndex(value);
    
    return this.breakTransition();
  };
  
  controller.screenStateMachine.structure.PLAYER_SETUP.LEFT = function(){
    switch( btn.getActiveKey() ){        
      case "config.type.next":
      case "config.co.next":
      case "config.team.next":
      case "options.playerConf.p2":
      case "options.playerConf.p3":
      case "options.playerConf.p4":
      case "options.playerConf.gameMode.next":
      case "options.next":
        btn.decreaseIndex();
    }
    return this.breakTransition();
  };

  controller.screenStateMachine.structure.PLAYER_SETUP.RIGHT = function(){
    switch( btn.getActiveKey() ){
      case "config.type.prev":
      case "config.co.prev":
      case "config.team.prev":
      case "options.playerConf.p2":
      case "options.playerConf.p3":
      case "options.playerConf.p1":
      case "options.playerConf.gameMode.prev":
      case "options.goBack":
        btn.increaseIndex();
    }
    return this.breakTransition();
  };
  
  // ***************** ACTIONS *****************
  
  controller.screenStateMachine.structure.PLAYER_SETUP.CANCEL = function(){
    return "VERSUS";
  };
  
  controller.screenStateMachine.structure.PLAYER_SETUP.ACTION = function(){
    assert(selectedPid !== INACTIVE_ID);
    
    // skip changes when player slot is offline
    switch( btn.getActiveKey() ){
      case "config.co.prev":
      case "config.co.next":
      case "config.team.prev":        
      case "config.team.next":
        if( model.player_data[selectedPid].team === INACTIVE_ID ) return;
    }
    
    switch( btn.getActiveKey() ){

      case "config.type.prev":
        controller.roundConfig_changeConfig(selectedPid,controller.roundConfig_CHANGE_TYPE.PLAYER_TYPE,true);  
        break;
        
      case "config.type.next":  
        controller.roundConfig_changeConfig(selectedPid,controller.roundConfig_CHANGE_TYPE.PLAYER_TYPE,false);  
        break;
        
      case "config.co.prev":
        controller.roundConfig_changeConfig(selectedPid,controller.roundConfig_CHANGE_TYPE.CO_MAIN,true);  
        break;
        
      case "config.co.next":
        controller.roundConfig_changeConfig(selectedPid,controller.roundConfig_CHANGE_TYPE.CO_MAIN,false);  
        break;
        
      case "config.team.prev":
        controller.roundConfig_changeConfig(selectedPid,controller.roundConfig_CHANGE_TYPE.TEAM,true);  
        break;
        
      case "config.team.next":
        controller.roundConfig_changeConfig(selectedPid,controller.roundConfig_CHANGE_TYPE.TEAM,false);  
        break;
        
      case "options.playerConf.p1":
        selectedPid = 0;
        break;
        
      case "options.playerConf.p2":
        selectedPid = 1;
        break;
        
      case "options.playerConf.p3":
        selectedPid = 2;
        break;
        
      case "options.playerConf.p4":
        selectedPid = 3;
        break;
        
      case "options.playerConf.gameMode.prev":
        controller.roundConfig_changeConfig(selectedPid,controller.roundConfig_CHANGE_TYPE.GAME_TYPE,true);  
        updateGamemodeBtn();
        break;
        
      case "options.playerConf.gameMode.next":
        controller.roundConfig_changeConfig(selectedPid,controller.roundConfig_CHANGE_TYPE.GAME_TYPE,false); 
        updateGamemodeBtn();
        break;

      case "options.goBack":
        return "VERSUS";

      case "options.next":
        controller.roundConfig_evalAfterwards();
        return "PARAMETER_SETUP";
    }
    
    updateButtonsForPlayer(selectedPid);
    return this.breakTransition();
  };
    
});