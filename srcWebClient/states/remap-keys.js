(function () {

  var curBtn;

  var btnVal = {
    LEFT: document.getElementById("options.remap.left"),
    DOWN: document.getElementById("options.remap.down"),
    UP: document.getElementById("options.remap.up"),
    RIGHT: document.getElementById("options.remap.right"),
    ACTION: document.getElementById("options.remap.action"),
    CANCEL: document.getElementById("options.remap.cancel")
  }

  var btn = controller.generateButtonGroup(
    document.getElementById("cwt_keyMapping_screen"),
    "cwt_panel_header_small cwt_page_button w_400 cwt_panel_button",
    "cwt_panel_header_small cwt_page_button w_400 cwt_panel_button button_active",
    "cwt_panel_header_small cwt_page_button w_400 cwt_panel_button button_inactive"
  );

  function codeToChar(bt,charCode,toChar) {
    if(charCode === -1 ){
      bt.innerHTML = "...";
      return;
    }
    
    if( !toChar ){
      bt.innerHTML = charCode;
      return;
    }
    
    var value = String.fromCharCode(charCode);
    switch (charCode) {
      case 6:
        value = "Mac";
        break;
      case 8:
        value = "Backspace";
        break;
      case 9:
        value = "Tab";
        break;
      case 13:
        value = "Enter";
        break;
      case 16:
        value = "Shift";
        break;
      case 17:
        value = "CTRL";
        break;
      case 18:
        value = "ALT";
        break;
      case 19:
        value = "Pause/Break";
        break;
      case 20:
        value = "Caps Lock";
        break;
      case 27:
        value = "ESC";
        break;
      case 32:
        value = "Space";
        break;
      case 33:
        value = "Page Up";
        break;
      case 34:
        value = "Page Down";
        break;
      case 35:
        value = "End";
        break;
      case 36:
        value = "Home";
        break;
      case 37:
        value = "Arrow Left";
        break;
      case 38:
        value = "Arrow Up";
        break;
      case 39:
        value = "Arrow Right";
        break;
      case 40:
        value = "Arrow Down";
        break;
      case 43:
        value = "Plus";
        break;
      case 45:
        value = "Insert";
        break;
      case 46:
        value = "Delete";
        break;
      case 91:
        value = "Left Window Key";
        break;
      case 92:
        value = "Right Window Key";
        break;
      case 93:
        value = "Select Key";
        break;
      case 96:
        value = "Numpad 0";
        break;
      case 97:
        value = "Numpad 1";
        break;
      case 98:
        value = "Numpad 2";
        break;
      case 99:
        value = "Numpad 3";
        break;
      case 100:
        value = "Numpad 4";
        break;
      case 101:
        value = "Numpad 5";
        break;
      case 102:
        value = "Numpad 6";
        break;
      case 103:
        value = "Numpad 7";
        break;
      case 104:
        value = "Numpad 8";
        break;
      case 105:
        value = "Numpad 9";
        break;
      case 106:
        value = "*";
        break;
      case 107:
        value = "+";
        break;
      case 109:
        value = "-";
        break;
      case 110:
        value = ";";
        break;
      case 111:
        value = "/";
        break;
      case 112:
        value = "F1";
        break;
      case 113:
        value = "F2";
        break;
      case 114:
        value = "F3";
        break;
      case 115:
        value = "F4";
        break;
      case 116:
        value = "F5";
        break;
      case 117:
        value = "F6";
        break;
      case 118:
        value = "F7";
        break;
      case 119:
        value = "F8";
        break;
      case 120:
        value = "F9";
        break;
      case 121:
        value = "F10";
        break;
      case 122:
        value = "F11";
        break;
      case 123:
        value = "F12";
        break;
      case 144:
        value = "Num Lock";
        break;
      case 145:
        value = "Scroll Lock";
        break;
      case 186:
        value = ";";
        break;
      case 187:
        value = "=";
        break;
      case 188:
        value = ",";
        break;
      case 189:
        value = "-";
        break;
      case 190:
        value = ".";
        break;
      case 191:
        value = "/";
        break;
      case 192:
        value = "`";
        break;
      case 219:
        value = "[";
        break;
      case 220:
        value = "\\";
        break;
      case 221:
        value = "]";
        break;
      case 222:
        value = "'";
        break;
    }
    
    bt.innerHTML = value;
  }

  function enterState(keySet,toChar) {
    curBtn = INACTIVE_ID;
    codeToChar(btnVal.LEFT,keySet.LEFT,toChar);
    codeToChar(btnVal.DOWN,keySet.DOWN,toChar);
    codeToChar(btnVal.UP,keySet.UP,toChar);
    codeToChar(btnVal.RIGHT,keySet.RIGHT,toChar);
    codeToChar(btnVal.ACTION,keySet.ACTION,toChar);
    codeToChar(btnVal.CANCEL,keySet.CANCEL,toChar);
  }

  function setInputKey(keySet,keyId,toChar) {
    
    // grab current wanted key type
    switch (curBtn) {

      case -1:
        assert(false);
  
      // d-pad
      case 0:
        keySet.LEFT = keyId;
        codeToChar( btnVal.LEFT, keyId, toChar );
        break;
        
      case 1:
        keySet.UP = keyId;
        codeToChar( btnVal.UP, keyId, toChar );
        break;
        
      case 2:
        keySet.DOWN = keyId;
        codeToChar( btnVal.DOWN, keyId, toChar );
        break;
        
      case 3:
        keySet.RIGHT = keyId;
        codeToChar( btnVal.RIGHT, keyId, toChar );
        break;
  
      // actions
      case 4:
        keySet.ACTION = keyId;
        codeToChar( btnVal.ACTION, keyId, toChar );
        break;
        
      case 5:
        keySet.CANCEL = keyId;
        codeToChar( btnVal.CANCEL, keyId, toChar );
        break;
    }

    curBtn = INACTIVE_ID;
    controller.input_genericInputRequest = false;
    return this.breakTransition();
  }

  function action() {
    switch (btn.getActiveKey()) {

    case "options.remap.right":
      curBtn = 3;
      codeToChar( btnVal.RIGHT, -1, true );
      break;

    case "options.remap.left":
      curBtn = 0;
      codeToChar( btnVal.LEFT, -1, true );
      break;

    case "options.remap.up":
      curBtn = 1;
      codeToChar( btnVal.UP, -1, true );
      break;

    case "options.remap.down":
      curBtn = 2;
      codeToChar( btnVal.DOWN, -1, true );
      break;

    case "options.remap.action":
      curBtn = 4;
      codeToChar( btnVal.ACTION, -1, true );
      break;

    case "options.remap.cancel":
      curBtn = 5;
      codeToChar( btnVal.CANCEL, -1, true );
      break;

    case "options.goBack":
      controller.saveKeyMapping();
      return "OPTIONS";
    }

    controller.input_genericInputRequest = true;
    return this.breakTransition();
  }

  function inputUp() {
    btn.decreaseIndex();
  }

  function inputDown() {
    btn.increaseIndex();
  }

  // ---------------------------------------------------------------------------------------

  controller.screenStateMachine.structure.REMAP_KEYBOARD = Object.create(controller.stateParent);
  controller.screenStateMachine.structure.REMAP_GAMEPAD = Object.create(controller.stateParent);

  controller.screenStateMachine.structure.REMAP_KEYBOARD.section = "cwt_keyMapping_screen";
  controller.screenStateMachine.structure.REMAP_GAMEPAD.section = "cwt_keyMapping_screen";

  controller.screenStateMachine.structure.REMAP_KEYBOARD.enterState = function (ev, keyId) {
    enterState.call(this, controller.keyMaps.KEYBOARD,true);
  };

  controller.screenStateMachine.structure.REMAP_GAMEPAD.enterState = function (ev, keyId) {
    enterState.call(this, controller.keyMaps.GAMEPAD,false);
  };

  controller.screenStateMachine.structure.REMAP_KEYBOARD.ACTION = action;
  controller.screenStateMachine.structure.REMAP_GAMEPAD.ACTION = action;

  controller.screenStateMachine.structure.REMAP_KEYBOARD.UP = inputUp;
  controller.screenStateMachine.structure.REMAP_GAMEPAD.UP = inputUp;

  controller.screenStateMachine.structure.REMAP_KEYBOARD.DOWN = inputDown;
  controller.screenStateMachine.structure.REMAP_GAMEPAD.DOWN = inputDown;

  controller.screenStateMachine.structure.REMAP_KEYBOARD.INPUT_SET = function (ev, keyId) {
    setInputKey.call(this, controller.keyMaps.KEYBOARD, keyId,true);
  };

  controller.screenStateMachine.structure.REMAP_GAMEPAD.INPUT_SET = function (ev, keyId) {
    setInputKey.call(this, controller.keyMaps.GAMEPAD, keyId,false);
  };


})();