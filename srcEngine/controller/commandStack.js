// Current read position.
//
controller.commandStack_curReadPos = -1;

// Current write position.
//
controller.commandStack_curWritePos = -1;

// Command buffer.
//
controller.commandStack_buffer_ = util.list(
  (1+6)*ACTIONS_BUFFER_SIZE,
  INACTIVE_ID
);

//
//
controller.commandStack_resetData       = function(){
  controller.commandStack_buffer_.resetValues(INACTIVE_ID);
};

//
//
controller.commandStack_hasData         = function(){
  return controller.commandStack_curReadPos !== controller.commandStack_curWritePos;
};

//
//
controller.commandStack_invokeNext      = function(){
  assert(controller.commandStack_hasData());

  // write content
  var i = controller.commandStack_curReadPos*(6+1);
  var e = i + 6 + 1;
  var data  = controller.commandStack_buffer_;
  var event = model.event_eventName[ model.event_eventIndex[ data[i] ]];

  // invoke event with given data
  model.events[event](
    data[i+1],
    data[i+2],
    data[i+3],
    data[i+4],
    data[i+5],
    data[i+6]
  );

  // free slot
  data[i] = INACTIVE_ID;

  // increase writing index
  controller.commandStack_curReadPos++;
  if( controller.commandStack_curReadPos >= ACTIONS_BUFFER_SIZE ){
    controller.commandStack_curReadPos=0;
  }
};

// Adds a command to the command pool. Every parameter of the call will be
// submitted beginning from index 1 of the arguments. The maximum amount
// of parameters are controlled by the controller.commandStack_MAX_PARAMETERS
// property. Anyway every parameter should be an integer to support intelligent
// JIT compiling. The function throws a warning if a parameter type does not
// match, but it will be accepted anyway ** ( for now! ) **.
//
controller.commandStack_localInvokement = function( cmd ){
  assertStr( cmd );
  assert( controller.commandStack_curWritePos !== controller.commandStack_curReadPos );
  assertIntRange( arguments.length, 1, 7 );

  // write content
  var i = controller.commandStack_curWritePos*(6+1);
  var e = i + 6 + 1;

  controller.commandStack_buffer_[i] = cmd; //TODO to number
  i++;

  while( i < e ){
    if( DEBUG && arguments.length > i && typeof arguments[i] !== "number" ){
      util.log("!! warning !! used a command invocation with non numeric types on command",cmd);
    }

    controller.commandStack_buffer_[i] = (arguments.length > i )? arguments[i] : INACTIVE_ID;
    i++;
  }

  // increase writing index
  controller.commandStack_curWritePos++;
  if( controller.commandStack_curWritePos >= ACTIONS_BUFFER_SIZE ){
    controller.commandStack_curWritePos=0;
  }
};

// Invokes a shared command call. All clients gets a notification of this
// call and doing the same locally. This invokes a local call too, to realize
// the activation of the action.
//
controller.commandStack_sharedInvokement = function( cmd ){
  if( controller.isNetworkGame() ) {
    controller.sendNetworkMessage( JSON.stringify( arguments ) );
  }

  controller.commandStack_localInvokement.apply(this,arguments);
};
