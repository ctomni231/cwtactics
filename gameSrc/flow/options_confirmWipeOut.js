cwt.Gameflow.addState({
  id: "CONFIRM_WIPE_OUT_SCREEN",

  init: function () {
    this.buttons = new cwt.ButtonGroup(10,6);

    this.buttons.addButton(1,1,8,1,"OPTIONS_WIPE_OUT_TEXT",8);

    this.buttons.addButton(1,4,3,1,"OPTIONS_WIPE_OUT_NO",8);
    this.buttons.addButton(6,4,3,1,"OPTIONS_WIPE_OUT_YES",8);
  },

  enter: function () {
    cwt.Screen.layerUI.clear();
    this.rendered = false;
  },

  update: function (delta, lastInput) {

  },

  render: function (delta) {
    if (!this.rendered) {
      var ctx = cwt.Screen.layerUI.getContext();
      this.buttons.draw(ctx);
      this.rendered = true;
    }
  }
});

/*
util.scoped(function(){
  function wipeComplete(){
    document.location.reload();
  }

  var btn = controller.generateButtonGroup(
    document.getElementById("cwt_confirmWipeOut_screen"),
    "cwt_panel_header_small cwt_page_button w_400 cwt_panel_button",
    "cwt_panel_header_small cwt_page_button w_400 cwt_panel_button button_active",
    "cwt_panel_header_small cwt_page_button w_400 cwt_panel_button button_inactive"
  );
  
  // ------------------------------------------------------------------------------------------

  controller.screenStateMachine.structure.WIPEOUT = Object.create(controller.stateParent);

  controller.screenStateMachine.structure.WIPEOUT.section = "cwt_confirmWipeOut_screen";

  controller.screenStateMachine.structure.WIPEOUT.enterState = function(){};

  controller.screenStateMachine.structure.WIPEOUT.UP = function(){
    return this.breakTransition();
  };

  controller.screenStateMachine.structure.WIPEOUT.DOWN = function(){
    return this.breakTransition();
  };

  controller.screenStateMachine.structure.WIPEOUT.LEFT = function(){
    if( btn.getActiveKey() === "options.doit" ) btn.decreaseIndex();
    return this.breakTransition();
  };


  controller.screenStateMachine.structure.WIPEOUT.RIGHT = function(){
    if( btn.getActiveKey() === "options.goBack" ) btn.increaseIndex();
    return this.breakTransition();
  };

  controller.screenStateMachine.structure.WIPEOUT.ACTION = function(){
    switch( btn.getActiveKey() ){
      
      case "options.doit":
        controller.storage_general.set("cwt_resetData", true, wipeComplete);
        break;
        
      case "options.goBack": 
        return "OPTIONS";
    }
    return this.breakTransition();
  };

  controller.screenStateMachine.structure.WIPEOUT.CANCEL = function(){
    return "OPTIONS";
  };
});
 */
