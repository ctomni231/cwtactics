controller.activeMapping = null;

controller._state_remapKeys_message = document.getElementById("keyMappingText");

controller._state_remapKeys_step = 0;

controller._state_remapKeys_steps = [ "left","up","down","right","action","cancel" ];

// ---------------------------------------------------------------------------------------

controller.screenStateMachine.structure.REMAP_KEYS = Object.create(controller.stateParent);

controller.screenStateMachine.structure.REMAP_KEYS.section = "cwt_keyMapping_screen";

controller.screenStateMachine.structure.REMAP_KEYS.enterState = function(){
  switch( controller.activeMapping ){
    case controller.KEY_MAPPINGS.KEYBOARD:
      controller._state_remapKeys_step = 0;
      break;

    case controller.KEY_MAPPINGS.GAMEPAD:
      controller._state_remapKeys_step = 4;
      break;
  }

  controller._state_remapKeys_message.innerHTML = model.localized(
    controller._state_remapKeys_steps[controller._state_remapKeys_step]
  );
};

controller.screenStateMachine.structure.REMAP_KEYS.INPUT_SET = function( ev, keyId ){
  var keySet = null;

  // grab correct keyset
  switch( controller.activeMapping ){
    case controller.KEY_MAPPINGS.KEYBOARD:
      keySet = controller.keyMaps.KEYBOARD;
      break;

    case controller.KEY_MAPPINGS.GAMEPAD:
      keySet = controller.keyMaps.GAMEPAD;
      break;
  }

  // grab current wanted key type
  switch( controller._state_remapKeys_step ){

      // d-pad
      case 0: keySet.LEFT   = keyId; break;
      case 1: keySet.UP     = keyId; break;
      case 2: keySet.DOWN   = keyId; break;
      case 3: keySet.RIGHT  = keyId; break;

      // actions
      case 4: keySet.ACTION = keyId; break;
      case 5: keySet.CANCEL = keyId; break;
  }

  // goto next key, except this is already the last key
  controller._state_remapKeys_step++;
  if( controller._state_remapKeys_step === controller._state_remapKeys_steps.length ){
    controller.activeMapping = null;
    controller.saveKeyMapping();
    // then go back to options screen
    return "OPTIONS";
  }
  else{
    controller._state_remapKeys_message.innerHTML = model.localized(
      controller._state_remapKeys_steps[controller._state_remapKeys_step]
    );

    return this.breakTransition();
  }
};
