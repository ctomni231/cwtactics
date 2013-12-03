util.scoped(function(){

  var toolTipId;
  var toolTipElement  = document.getElementById("startScreen_toolTip");

  function updateTooltip(){
    if( model.data_tips.length > 0 ) toolTipElement.innerHTML = model.data_tips[toolTipId];
  }

  controller.screenStateMachine.structure.MOBILE = Object.create(controller.stateParent);

  controller.screenStateMachine.structure.MOBILE.timer = 0;

  controller.screenStateMachine.structure.MOBILE.section = "cwt_mobileSound_screen";

  controller.screenStateMachine.structure.MOBILE.enterState = function(){
    toolTipId = parseInt( Math.random()*model.data_tips.length, 10);
    updateTooltip();
    controller.screenStateMachine.structure.MOBILE.timer = 3500;
  };

  controller.screenStateMachine.structure.MOBILE.decreaseTimer = function( _,delta ){
    controller.screenStateMachine.structure.MOBILE.timer -= delta;
    if( controller.screenStateMachine.structure.MOBILE.timer <= 0 ){
      controller.screenStateMachine.structure.MOBILE.timer = 3500;
      
      toolTipId++;
      if( toolTipId >= model.data_tips.length ) toolTipId = 0;
      
      updateTooltip();
    }
    return this.breakTransition();
  };

  controller.screenStateMachine.structure.MOBILE.ACTION = function(){
    controller.stateMachine.event("start");
    return "MAIN";
  };

// Decreases the id of the current active tooltip. The list of available tooltips are available
// in the modification file.
//
  controller.screenStateMachine.structure.MOBILE.LEFT = function(){
    toolTipId--;
    if( toolTipId < 0 ) toolTipId = model.data_tips.length-1;
    controller.screenStateMachine.structure.MOBILE.timer = 3500;

    updateTooltip();

    return this.breakTransition();
  };

// Increases the id of the current active tooltip. The list of available tooltips are available
// in the modification file.
//
  controller.screenStateMachine.structure.MOBILE.RIGHT = function(){
    toolTipId++;
    if( toolTipId >= model.data_tips.length ) toolTipId = 0;
    controller.screenStateMachine.structure.MOBILE.timer = 3500;

    updateTooltip();

    return this.breakTransition();
  };

});