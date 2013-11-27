util.scoped(function(){
  
  var mapElement = document.getElementById("map_selection");
  var startButton = document.getElementById("versus_start_btn");
  var mapIndex;
  
  var btn = controller.generateButtonGroup( 
    document.getElementById("cwt_versus_screen"),
    "cwt_panel_header_big cwt_page_button w_400 cwt_panel_button",
    "cwt_panel_header_big cwt_page_button w_400 cwt_panel_button button_active",
    "cwt_panel_header_big cwt_page_button w_400 cwt_panel_button button_inactive"
  );

  function updateMapElement(){
    mapElement.innerHTML = model.data_maps[ mapIndex ];
  }
  
  // ----------------------------------------------------------------------------------------
  
  controller.screenStateMachine.structure.VERSUS = Object.create(controller.stateParent);
  
	controller.screenStateMachine.structure.VERSUS.section = "cwt_versus_screen";
	
  controller.screenStateMachine.structure.VERSUS.enterState = function(){
    mapIndex = 0;
    this.data.isSinglePlayer = true;
    updateMapElement();
  };
  
  controller.screenStateMachine.structure.VERSUS.UP = function(){
    switch( btn.getActiveKey() ){
      case "versus.nextMap":
        btn.decreaseIndex();
        break;
    }

    btn.decreaseIndex();
    return this.breakTransition();
  };
  
  controller.screenStateMachine.structure.VERSUS.DOWN = function(){
    switch( btn.getActiveKey() ){
      case "versus.prevMap":
        btn.increaseIndex();
        break;
    }

    btn.increaseIndex();
    return this.breakTransition();
  };

  controller.screenStateMachine.structure.VERSUS.LEFT = function(){
    switch( btn.getActiveKey() ){
      case "versus.nextMap":
        btn.decreaseIndex();
        break;
    }

    return this.breakTransition();
  };

  controller.screenStateMachine.structure.VERSUS.RIGHT = function(){
    switch( btn.getActiveKey() ){
      case "versus.prevMap":
        btn.increaseIndex();
        break;
    }
    
    return this.breakTransition();
  };
    
  controller.screenStateMachine.structure.VERSUS.CANCEL = function(){
    return "MAIN";
  };
  
  controller.screenStateMachine.structure.VERSUS.ACTION = function(){
    switch( btn.getActiveKey() ){
      case "versus.prevMap":
        if( mapIndex > 0 ) mapIndex--;
        else mapIndex = model.data_maps.length-1;
        updateMapElement();
        break;

      case "versus.nextMap":
        if( mapIndex < model.data_maps.length-1 ) mapIndex++;
        else mapIndex = 0;
        updateMapElement();
        break;

      case "versus.next":
        this.data.mapToLoad = model.data_maps[ mapIndex ];
        return "PLAYER_SETUP";
    }
    
    return this.breakTransition();
  };
});