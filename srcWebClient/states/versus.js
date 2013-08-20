util.scoped(function(){
  
  var mapElement = document.getElementById("map_selection");
  var startButton = document.getElementById("versus_start_btn");
  var mapIndex;
  
  function updateMapElement(){
    mapElement.innerHTML = controller.mapList[ mapIndex ].name;
  }
  
  // ----------------------------------------------------------------------------------------
  
  controller.screenStateMachine.structure.VERSUS = Object.create(controller.stateParent);
  
	controller.screenStateMachine.structure.VERSUS.section = "cwt_versus_screen";
	
  controller.screenStateMachine.structure.VERSUS.enterState = function(){
    startButton.innerHTML = model.localized( startButton.attributes.key.value );
    
    mapIndex = 0;
    updateMapElement();
  };
  
  controller.screenStateMachine.structure.VERSUS.UP = function(){
    if( mapIndex > 0 ) mapIndex--;
    else mapIndex = controller.mapList.length-1;
    
    updateMapElement();
    return this.breakTransition();
  };
  
  controller.screenStateMachine.structure.VERSUS.DOWN = function(){
    if( mapIndex < controller.mapList.length-1 ) mapIndex++;
    else mapIndex = 0;
    
    updateMapElement();
    return this.breakTransition();
  };
  
  controller.screenStateMachine.structure.VERSUS.CANCEL = function(){
    return "MAIN";
  };
  
  controller.screenStateMachine.structure.VERSUS.ACTION = function(){
    if( !controller.mapList ) return this.breakTransition();
    this.data.mapToLoad = controller.mapList[ mapIndex ].key;
    
    // START GAME
    return "GAMEROUND";
  };
});