util.scoped(function(){
  
  var btn = controller.generateButtonGroup( 
    document.getElementById("cwt_player_setup_screen"),
    "cwt_panel_header_big cwt_page_button cwt_panel_button",
    "cwt_panel_header_big cwt_page_button cwt_panel_button button_active",
    "cwt_panel_header_big cwt_page_button cwt_panel_button button_inactive"
  );

  var buttons = [
    [
     document.getElementById("playerConfig_p1_type"),
     document.getElementById("playerConfig_p1_co"),
     document.getElementById("playerConfig_p1_team")
    ],[
     document.getElementById("playerConfig_p2_type"),
     document.getElementById("playerConfig_p2_co"),
     document.getElementById("playerConfig_p2_team")
    ],[
     document.getElementById("playerConfig_p3_type"),
     document.getElementById("playerConfig_p3_co"),
     document.getElementById("playerConfig_p3_team")
    ],[
     document.getElementById("playerConfig_p4_type"),
     document.getElementById("playerConfig_p4_co"),
     document.getElementById("playerConfig_p4_team")
    ]
  ];

  function update( playerId ){
    var btns   = buttons[playerId];
    var player = model.player_data[playerId];

    if( player.team === INACTIVE_ID ){
      btns[0].innerHTML = model.data_localized("config.player.off");
      btns[1].innerHTML = "";
      btns[2].innerHTML = "";
    }
    else if( player.team === DESELECT_ID ){
      btns[0].innerHTML = model.data_localized("config.player.disabled");
      btns[1].innerHTML = "";
      btns[2].innerHTML = "";
    }
    else{
      var sp = controller.screenStateMachine.data.isSinglePlayer;

      // update player type
      if( playerId === 0 || !sp ){
        btns[0].innerHTML = model.data_localized("config.player.human");
        model.client_registerPlayer(playerId);
      }
      else{
        btns[0].innerHTML = model.data_localized("config.player.AI");
        controller.ai_register( playerId, "dumbBoy");
      }
      
      // update player co
      var co = model.co_data[playerId].coA; 
      btns[1].innerHTML = (co !== null)? co.ID : model.data_localized("config.player.co.none");

      // update player team
      btns[2].innerHTML = player.team;
    }
  }

  function loadMap( obj ){
    var map = obj.value;

    // update model
    controller.persistence_loadModel(map);
    controller.roundConfig_prepare();

    // update UI
    for( var i= 0, e=MAX_PLAYER; i<e; i++ ) update(i);
  }
    
  // ----------------------------------------------------------------------------------------
  
  controller.screenStateMachine.structure.PLAYER_SETUP = Object.create(controller.stateParent);
  
	controller.screenStateMachine.structure.PLAYER_SETUP.section = "cwt_player_setup_screen";
	
  controller.screenStateMachine.structure.PLAYER_SETUP.enterState = function(){
    controller.storage_maps.get( this.data.mapToLoad, loadMap );
  };
  
  controller.screenStateMachine.structure.PLAYER_SETUP.UP = function(){
    switch( btn.getActiveKey() ){
      case "config.co.next":
      case "config.co.prev":
      case "config.team.next":
      case "config.team.prev":
        btn.decreaseIndex();
        btn.decreaseIndex();
        btn.decreaseIndex();
        btn.decreaseIndex(); 
        break;

      case "config.type.next":
        var data = btn.getActiveData();
        if( data == "1" ){
          btn.decreaseIndex();
          btn.decreaseIndex();
        }
        else if( data == "2" ){
          btn.decreaseIndex();
          btn.decreaseIndex();
          btn.decreaseIndex();
          btn.decreaseIndex();
        }
        else{
          btn.decreaseIndex();
          btn.decreaseIndex();
          btn.decreaseIndex();
          btn.decreaseIndex();          
        }
        break;

      case "config.type.prev":
        var data = btn.getActiveData();
        if( data == "1" ){
          btn.decreaseIndex();
        }
        else if( data == "2" ){
          btn.decreaseIndex();
          btn.decreaseIndex();
          btn.decreaseIndex();
        }
        else{
          btn.decreaseIndex();
          btn.decreaseIndex();
          btn.decreaseIndex();
          btn.decreaseIndex();          
        }
        break;

      case "config.next":
        btn.decreaseIndex();          
        break;
    }

    return this.breakTransition();
  };
  
  controller.screenStateMachine.structure.PLAYER_SETUP.DOWN = function(){
    switch( btn.getActiveKey() ){
      case "config.type.next":
      case "config.co.next":
      case "config.type.prev":
      case "config.co.prev":
        btn.increaseIndex();
        btn.increaseIndex();
        btn.increaseIndex();
        btn.increaseIndex(); 
        break;

      case "config.team.next":
        var data = btn.getActiveData();
        if( data == "3" ){
          btn.increaseIndex();
          btn.increaseIndex();
          btn.increaseIndex();
        }
        else if( data == "4" ){
          btn.increaseIndex();
        }
        else{
          btn.increaseIndex();
          btn.increaseIndex();
          btn.increaseIndex();
          btn.increaseIndex();      
        }
        break;

      case "config.team.prev":
        var data = btn.getActiveData();
        if( data == "3" ){
          btn.increaseIndex();
          btn.increaseIndex();
          btn.increaseIndex();
          btn.increaseIndex();
        }
        else if( data == "4" ){
          btn.increaseIndex();
          btn.increaseIndex();
        }
        else{
          btn.increaseIndex();
          btn.increaseIndex();
          btn.increaseIndex();
          btn.increaseIndex();      
        }
        break;

      case "config.next":
        btn.increaseIndex();          
        break;
    }

    return this.breakTransition();
  };
  
  controller.screenStateMachine.structure.PLAYER_SETUP.LEFT = function(){
    switch( btn.getActiveKey() ){
      case "config.type.prev":
      case "config.co.prev":
      case "config.team.prev":
        var data = btn.getActiveData();
        if( data == "2" || data == "4" ){
          btn.decreaseIndex();
        }
        break;

      case "config.type.next":
      case "config.co.next":
      case "config.team.next":
        btn.decreaseIndex();
        break;
    }

    return this.breakTransition();
  };

  controller.screenStateMachine.structure.PLAYER_SETUP.RIGHT = function(){
    switch( btn.getActiveKey() ){
      case "config.type.next":
      case "config.co.next":
      case "config.team.next":
        var data = btn.getActiveData();
        if( data == "1" || data == "3" ){
          btn.increaseIndex();
        }
        break;

      case "config.type.prev":
      case "config.co.prev":
      case "config.team.prev":
        btn.increaseIndex();
        break;
    }

    return this.breakTransition();
  };
  
  controller.screenStateMachine.structure.PLAYER_SETUP.CANCEL = function(){
    this.data.mapToLoad = null;
    return "VERSUS";
  };
  
  controller.screenStateMachine.structure.PLAYER_SETUP.ACTION = function(){
    switch( btn.getActiveKey() ){

      case "config.type.prev":
      case "config.type.next":
      case "config.co.prev":
      case "config.co.next":
      case "config.team.prev":
      case "config.team.next":
        var value;

        // grab action data
        switch( btn.getActiveData() ){
          case "1": value = 0; break;
          case "2": value = 1; break;
          case "3": value = 2; break;
          case "4": value = 3; break;
        }

        if( model.player_data[value].team === INACTIVE_ID ) break;
        
        // do correct action
        switch( btn.getActiveKey() ){
          case "config.type.prev": controller.roundConfig_changeConfig(value,
            controller.roundConfig_CHANGE_TYPE.PLAYER_TYPE,true);  break;
          case "config.type.next": controller.roundConfig_changeConfig(value,
            controller.roundConfig_CHANGE_TYPE.PLAYER_TYPE,false);  break;
          case "config.team.prev": controller.roundConfig_changeConfig(value,
            controller.roundConfig_CHANGE_TYPE.TEAM,true);  break;
          case "config.team.next": controller.roundConfig_changeConfig(value,
            controller.roundConfig_CHANGE_TYPE.TEAM,false);  break;
          case "config.co.prev"  : controller.roundConfig_changeConfig(value,
            controller.roundConfig_CHANGE_TYPE.CO_MAIN,false);  break;
          case "config.co.next"  : controller.roundConfig_changeConfig(value,
            controller.roundConfig_CHANGE_TYPE.CO_MAIN,false);  break;
        }

        update(value);

        break;

      case "config.next":
        return "GAMEROUND";
    }

    return this.breakTransition();
  };

});
