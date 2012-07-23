/**
 * Module that holds created game commands in a ring buffer.
 */
cwt.message = {

  TYPE_CALL_CHAIN: 0,
  TYPE_CALL_SERVICE: 1,

  MAX_SIZE: 200,

  _rInd: 0,
  _wInd: 0,
  _buffer: [],

  init: function(){

    // clear buffer
    for(var i=0,e=this.MAX_SIZE; i<e; i++){ this._buffer[i] = null; }
  },

  /**
   * Pushes a message into the message bugger.
   *
   * @param msg
   */
  push: function( msg ){
    if( this._buffer[ this._wInd ] !== null ){ throw Error("message buffer is full"); }

    this._buffer[ this._wInd ] = msg;
    this._wInd++;
    if( this._wInd === this.MAX_SIZE ) this._wInd = 0;
  },

  isEmpty: function(){
    return ( this._buffer[ this._rInd ] === null );
  },

  evalNext: function(){
    if( this._buffer[ this._rInd ] === null ){ throw Error("message buffer is full"); }
    var msg = this._buffer[ this._rInd ];

    // call service by the given signature
    var res = cwt[ msg.modK ][ msg.servK ]( msg );

    // if service makes a return false, the pipe will not release the message
    // generally this means the message has a more than one step live time
    if( res === false ){ return; }

    // increase counter and free space
    this._buffer[ this._rInd ] = null;
    this._rInd++;
    if( this._rInd === this.MAX_SIZE ) this._rInd = 0;
  }
};