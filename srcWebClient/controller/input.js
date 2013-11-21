controller.KEY_MAPPINGS = {
  KEYBOARD:0,
  GAMEPAD:1
};

controller.DEFAULT_KEY_MAP = {

  KEYBOARD:{
        UP:38,
      DOWN:40,
      LEFT:37,
     RIGHT:39,
    ACTION:13,  // enter
    CANCEL:8    // backspace
  },

  GAMEPAD:{
    ACTION:0,
    CANCEL:1
  }

};

controller.KEYMAP_STORAGE_KEY = "__user_key_map__";

controller.keyMaps = {
  KEYBOARD: util.copy( controller.DEFAULT_KEY_MAP.KEYBOARD ),
  GAMEPAD:  util.copy( controller.DEFAULT_KEY_MAP.GAMEPAD  )
};

controller.saveKeyMapping = function(){
  controller.storage.set( controller.KEYMAP_STORAGE_KEY, controller.keyMaps );
};

controller.loadKeyMapping = function( cb ){
  controller.storage.get( controller.KEYMAP_STORAGE_KEY , function( obj ){
    if( obj ){
      if( DEBUG ) util.log("loading custom key configuration");
      controller.keyMaps = obj.value;
    }
    else if( DEBUG ) util.log("loading default key configuration");

    if( cb ) cb();
  });
};

controller.inputCoolDown = 0;

controller.updateInputCoolDown = function( delta ){
  controller.inputCoolDown -= delta;
  if( controller.inputCoolDown < 0 ) controller.inputCoolDown = 0;
};
