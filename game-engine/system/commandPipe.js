/**
 * Module that holds messages in a ring buffer. Primary used to store game transactions to make them asynchron call
 * able. The game engine puts commands into this buffer, but does not evaluate them itself. This process must be
 * triggered by the game client.
 *
 * @namespace
 */
cwt.messageBuffer = {

  /**
   * This constant can be overwritten for a custom size, but this must be done before the engine will be initialized.
   *
   * @constant
   */
  MAX_SIZE: 200,

  /** @private */
  _rInd: 0,

  /** @private */
  _wInd: 0,

  /** @private */
  _buffer: [],

  init: function(){

    // clear buffer
    for(var i=0,e=this.MAX_SIZE; i<e; i++){ this._buffer[i] = null; }
  },

  /**
   * Pushes a message into the message bugger.
   *
   * @param msg message content as js object
   * @throws error if buffer is full
   */
  pushMsg: function( msg ){
    if( this._buffer[ this._wInd ] !== null ) cwt.log.error("message buffer is full");

    if( cwt.DEBUG ) cwt.log.info( "adding message '{0}‘ to buffer", msg );

    this._buffer[ this._wInd ] = msg;
    this._wInd++;
    if( this._wInd === this.MAX_SIZE ) this._wInd = 0;
  },

  /**
   * Returns true if the buffer is not empty else false.
   */
  hasMsg: function(){
    return ( this._buffer[ this._rInd ] !== null );
  },

  /**
   * Pops a message from the message buffer and returns its content.
   *
   * @return message content
   * @throws error if buffer is empty
   */
  popMsg: function(){
    if( this._buffer[ this._rInd ] === null ) cwt.log.error("message buffer is empty");
    var msg = this._buffer[ this._rInd ];

    // increase counter and free space
    this._buffer[ this._rInd ] = null;
    this._rInd++;
    if( this._rInd === this.MAX_SIZE ) this._rInd = 0;

    return msg;
  }
};