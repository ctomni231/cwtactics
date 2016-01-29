util.scoped(function(){

  var TIMEOUT_TIPS = 10000;

  var toolTipId;
  var toolTipElement  = document.getElementById("startScreen_toolTip");

  var pageEl = document.getElementById("cwt_mobileSound_screen");

  var btn = controller.generateButtonGroup(
    pageEl,
    "cwt_panel_header_big cwt_page_button w_400 cwt_panel_button",
    "cwt_panel_header_big cwt_page_button w_400 cwt_panel_button button_active",
    "cwt_panel_header_big cwt_page_button w_400 cwt_panel_button button_inactive"
  );

  function updateTooltip(){
    if( model.data_tips.length > 0 ) toolTipElement.innerHTML = model.data_tips[toolTipId];
  }

  controller.screenStateMachine.structure.MOBILE = Object.create(controller.stateParent);

  controller.screenStateMachine.structure.MOBILE.timer = 0;

  controller.screenStateMachine.structure.MOBILE.section = "cwt_mobileSound_screen";

  controller.screenStateMachine.structure.MOBILE.enterState = function(){
    toolTipId = parseInt( Math.random()*model.data_tips.length, 10);
    updateTooltip();
    controller.screenStateMachine.structure.MOBILE.timer = TIMEOUT_TIPS;
  };

  controller.screenStateMachine.structure.MOBILE.decreaseTimer = function( _,delta ){
    controller.screenStateMachine.structure.MOBILE.timer -= delta;
    if( controller.screenStateMachine.structure.MOBILE.timer <= 0 ){
      controller.screenStateMachine.structure.MOBILE.timer = TIMEOUT_TIPS;

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
    controller.screenStateMachine.structure.MOBILE.timer = TIMEOUT_TIPS;

    updateTooltip();

    return this.breakTransition();
  };

// Increases the id of the current active tooltip. The list of available tooltips are available
// in the modification file.
//
  controller.screenStateMachine.structure.MOBILE.RIGHT = function(){
    toolTipId++;
    if( toolTipId >= model.data_tips.length ) toolTipId = 0;
    controller.screenStateMachine.structure.MOBILE.timer = TIMEOUT_TIPS;

    updateTooltip();

    return this.breakTransition();
  };

});
