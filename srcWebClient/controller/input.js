//
//
controller.KEY_MAPPINGS = {
  KEYBOARD:0,
  GAMEPAD:1
};

//
//
controller.DEFAULT_KEY_MAP = {

  KEYBOARD:{
        UP:38,
      DOWN:40,
      LEFT:37,
     RIGHT:39,
    ACTION:13,  // enter
    CANCEL:8    // backspace
  },
  
  MOUSE:{
    HOVER:0
  },

  GAMEPAD:{
    ACTION:0,
    CANCEL:1
  }

};

//
//
controller.KEYMAP_STORAGE_KEY = "__user_key_map__";

//
//
controller.keyMaps = {
  KEYBOARD: util.copy( controller.DEFAULT_KEY_MAP.KEYBOARD ),
  GAMEPAD:  util.copy( controller.DEFAULT_KEY_MAP.GAMEPAD  )
};

//
//
controller.input_genericInputRequest = false;

//
//
controller.inputCoolDown = 0;

// If true, then all incoming input commands will be ignored.
//
controller.input_blocked = false;

// Input stack.
//
controller.input_stack = util.list(10,INACTIVE_ID);

// Input stack.
//
controller.input_data1 = util.list(10,INACTIVE_ID);

// Input stack.
//
controller.input_data2 = util.list(10,INACTIVE_ID);

// Read index of the input stack.
//
controller.input_stack_r_ = 0;

// Write index of the input stack.
//
controller.input_stack_w_ = 0;

// Pushes an input key into the input stack. The parameters d1 and d2
// has to be integers.
//
controller.input_pushKey = function( key,d1,d2 ){
  if( controller.input_blocked || controller.inputCoolDown > 0 ) return;
  
  // convert undefined / null to numbers
  if( d1 !== 0 && !d1 ) d1 = INACTIVE_ID;
  if( d2 !== 0 && !d2 ) d2 = INACTIVE_ID;
  
  if( controller.input_stack[controller.input_stack_w_] === INACTIVE_ID ){
    controller.input_stack[controller.input_stack_w_] = key;
    controller.input_data1[controller.input_stack_w_] = d1;
    controller.input_data2[controller.input_stack_w_] = d2;
    controller.input_stack_w_++;
    if( controller.input_stack_w_ === controller.input_stack.length ){
      controller.input_stack_w_ = 0;
    }
    
    controller.inputCoolDown = 50;
    return;
  }
};

// Grabs an input key from the input stack. -1 if no key is 
// in the stack.
//
controller.input_evalNextKey = function(){
  
  // grab value
  var ri = controller.input_stack_r_;
  var value =  controller.input_stack[controller.input_stack_r_];
  if( value === INACTIVE_ID ) return false;
  
  controller.input_stack[ri] = INACTIVE_ID;
  
  var d1 = controller.input_data1[ri];
  var d2 = controller.input_data2[ri];
  
  // eval value
  var keys = controller.DEFAULT_KEY_MAP.KEYBOARD;  
  var keysM = controller.DEFAULT_KEY_MAP.MOUSE;
  var event = null;
  switch( value ){
      
    case keys.UP:     event = (d1 > 1)? "SHIFT_UP": "INP_UP"; break;
    case keys.DOWN:   event = (d1 > 1)? "SHIFT_DOWN": "INP_DOWN"; break;
    case keys.LEFT:   event = (d1 > 1)? "SHIFT_LEFT": "INP_LEFT"; break;
    case keys.RIGHT:  event = (d1 > 1)? "SHIFT_RIGHT": "INP_RIGHT"; break;
    case keys.ACTION: event ="INP_ACTION"; break;
    case keys.CANCEL: event ="INP_CANCEL"; break;
    case keysM.HOVER: event ="INP_HOVER"; break;
      
    default:
      assert("false");
      return false;
  }
  
  if( d1 !== INACTIVE_ID && d2 !== INACTIVE_ID ){
    controller.screenStateMachine.event( event,d1,d2 );
  } else controller.screenStateMachine.event( event );
  
  // increase read index
  ri++;
  if( ri === controller.input_stack.length ) ri = 0;
  controller.input_stack_r_ = ri;
  
  return true;
};

//
//
controller.input_requestBlock = function(){
  assert(!controller.input_blocked);
  controller.input_blocked = true;
};

//
//
controller.input_releaseBlock = function(){
  controller.input_blocked = false;
};

//
//
controller.saveKeyMapping = function(){
  controller.storage_general.set( controller.KEYMAP_STORAGE_KEY, controller.keyMaps );
};

//
//
controller.loadKeyMapping = function( cb ){
  controller.storage_general.get( controller.KEYMAP_STORAGE_KEY , function( obj ){
    if( obj ){
      if( DEBUG ) util.log("loading custom key configuration");
      controller.keyMaps = obj.value;
    }
    else if( DEBUG ) util.log("loading default key configuration");

    if( cb ) cb();
  });
};

//
//
controller.updateInputCoolDown = function( delta ){
  controller.inputCoolDown -= delta;
  if( controller.inputCoolDown < 0 ) controller.inputCoolDown = 0;
};
