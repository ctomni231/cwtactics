// Current read position.
//
controller.commandStack_curReadPos = 0;

// Current write position.
//
controller.commandStack_curWritePos = 0;

// Command buffer.
//
controller.commandStack_buffer_ = util.list(
  (1+6)*ACTIONS_BUFFER_SIZE,
  INACTIVE_ID
);

//
//
controller.commandStack_resetData       = function(){
  controller.commandStack_buffer_.resetValues();
  controller.commandStack_curReadPos  = 0;
  controller.commandStack_curWritePos = 0;
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
  var event = model.event_eventName[ data[i] ];

  if( DEBUG ){
    util.log(
      "invoke",event,"with arguments",
      data[i+1],
      data[i+2],
      data[i+3],
      data[i+4],
      data[i+5],
      data[i+6]
    );
  }

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
  assertIntRange( arguments.length, 1, 7 );

  // write content
  var offset = controller.commandStack_curWritePos*(6+1);
  var i = 0;
  var e = 7;

  assert( controller.commandStack_buffer_[i+offset] === INACTIVE_ID );
  controller.commandStack_buffer_[i+offset] = model.event_eventIndex[cmd]; //TODO to number
  i++;

  while( i < e ){
    if( DEBUG && arguments.length > i && typeof arguments[i] !== "number" ){
      util.log("!! warning !! used a command invocation with non numeric types on command",cmd);
    }

    controller.commandStack_buffer_[i+offset] = (arguments.length > i )?
      arguments[i] : INACTIVE_ID;

    i++;
  }

  if( DEBUG ){
    util.log("adding",JSON.stringify(arguments),"to the command stack");
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
  if( controller.network_isActive() ) {
    controller.network_sendMessage( JSON.stringify( arguments ) );
  }

  controller.commandStack_localInvokement.apply(this,arguments);
};
