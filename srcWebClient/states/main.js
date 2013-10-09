util.scoped(function(){
  
  var pageEl = document.getElementById("cwt_main_screen");

  var btn = controller.generateButtonGroup(
    pageEl,
    "cwt_panel_header_big cwt_page_button w_400 cwt_panel_button",
    "cwt_panel_header_big cwt_page_button w_400 cwt_panel_button button_active",
    "cwt_panel_header_big cwt_page_button w_400 cwt_panel_button button_inactive"
  );
  
  document.getElementById("mainScreen_version").innerHTML = constants.VERSION;

  // -------------------------------------------------------------------------------

  controller.screenStateMachine.structure.MAIN = Object.create(controller.stateParent);
  
	controller.screenStateMachine.structure.MAIN.section = "cwt_main_screen";
	
  controller.screenStateMachine.structure.MAIN.enterState = function(){
    controller.playEmptyAudio();
    controller.playMusic("BG");
    
    btn.setIndex(1);
  };
  
  controller.screenStateMachine.structure.MAIN.UP = function(){
    btn.decreaseIndex();
    return this.breakTransition();
  };
  
  controller.screenStateMachine.structure.MAIN.DOWN = function(){
    btn.increaseIndex();
    return this.breakTransition();
  };
  
  controller.screenStateMachine.structure.MAIN.ACTION = function(){
    if( btn.isIndexInactive() ){
      return this.breakTransition();
    }
    return btn.getActiveKey();
  };
});