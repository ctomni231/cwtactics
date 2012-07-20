cwt.message = {

	MAX_SIZE: 50,

	_rInd: 0,
	_wInd: 0,
	_buffer: [],

	init: function(){

		// clear buffer
		for(var i=0,e=this.MAX_SIZE; i<e; i++){
			this._buffer[i] = null;
		}
	},

	/**
	 * Pushes a message into the message bugger.
	 *
	 * @param msg
	 */
	_pushMessage: function( msg ){
		if( this._buffer[ this._wInd ] !== null ){ throw Error("message buffer is full"); }

		this._buffer[ this._wInd ] = msg;
		this._wInd++;
		if( this._wInd === this.MAX_SIZE ) this._wInd = 0;
	},

	/**
	 * Pops a message from the buffer.
	 */
	_popMessage: function(){
		if( this._buffer[ this._rInd ] === null ){ throw Error("message buffer is full"); }

		var msg = this._buffer[ this._rInd ];
		this._rInd++;
		if( this._rInd === this.MAX_SIZE ) this._rInd = 0;

    return msg;
	},

  isEmpty: function(){
    return ( this._buffer[ this._rInd ] === null );
  },

  evalNextMessage: function(){
    if( this.isEmpty() ) return;

    var msg = this._popMessage();

    // evaluate message
    // TODO
  }

  /**
   * DIFFERENT MESSAGE FUNCTIONS
   */
};