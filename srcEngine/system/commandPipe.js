

/**
 * This constant can be overwritten for a custom size, but this must be done
 * before the engine will be initialized.
 *
 * @constant
 */
cwt.MAX_BUFFER_SIZE = 200,

/** @private */
cwt._bufferReadIndex = 0;

/** @private */
cwt._bufferWriteIndex = 0;

/** @private */
cwt._bufferData = null;

/**
 * Pushes a message into the message bugger.
 *
 * @param msg message content as js object
 * @throws error if buffer is full
 */
cwt.pushMsgToBuffer = function( msg ){
  if( cwt._bufferData[ cwt._bufferWriteIndex ] !== null ){
    cwt.error("message buffer is full");
  }

  if( cwt.DEBUG ) cwt.info( "adding message '{0}‘ to buffer", msg );

  cwt._bufferData[ cwt._bufferWriteIndex ] = msg;
  cwt._bufferWriteIndex++;
  if( cwt._bufferWriteIndex === cwt.MAX_BUFFER_SIZE ){
    cwt._bufferWriteIndex = 0;
  }
};

/**
 * Returns true if the buffer is not empty else false.
 */
cwt.isMsgInBuffer = function(){
  return ( cwt._bufferData[ cwt._bufferReadIndex ] !== null );
};

/**
 * Pops a message from the message buffer and returns its content.
 *
 * @return message content
 * @throws error if buffer is empty
 */
cwt.popMsgFromBuffer = function(){
  if( cwt._bufferData[ cwt._bufferReadIndex ] === null ){
    cwt.error("message buffer is empty");
  }
  var msg = cwt._bufferData[ cwt._bufferReadIndex ];

  // increase counter and free space
  cwt._bufferData[ cwt._bufferReadIndex ] = null;
  cwt._bufferReadIndex++;
  if( cwt._bufferReadIndex === cwt.MAX_BUFFER_SIZE ) cwt._bufferReadIndex = 0;

  return msg;
};

// init loader
cwt.onInit( "command pipeline", function(){
  cwt._bufferData = cwt.util.list( cwt.MAX_BUFFER_SIZE, null );
});