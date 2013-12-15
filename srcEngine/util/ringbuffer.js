/**
 * Creates a ring buffer with a fixed size.
 */
util.createRingBuffer = function( size, initFn ){

  var buffer = /** @lends util.RingBuffer */ {

    /**
     * Pushes an element into the buffer
     *
     * @param msg object that will be pushed into the buffer
     */
    push: function (msg){
      if ( this._data[ this._wInd ] !== null) {
        throw Error("message buffer is full");
      }

      // WRITE MSG AND INCREASE COUNTER
      this._data[ this._wInd ] = msg;
      this._wInd++;
      if ( this._wInd === this._size ) {
        this._wInd = 0;
      }
    },

    /**
     * Returns true if the ring buffer is empty else false.
     */
    isEmpty: function () {
      return ( this._data[ this._rInd ] === null );
    },

    /**
     * Returns the next available entry from the buffer (FIFO).
     */
    pop: function () {
      if( this._data[ this._rInd ] === null) {
        throw Error("message buffer is empty");
      }
      var msg = this._data[ this._rInd ];

      // INCREASE COUNTER AND FREE SPACE
      this._data[ this._rInd ] = null;
      this._rInd++;
      if (this._rInd === this._size ) {
        this._rInd = 0;
      }

      return msg;
    },

    /**
     * Clears the buffer.
     */
    clear: function(){
      this._rInd = 0;
      this._wInd = 0;
      for( var i=0; i<size; i++ ){
        this._data[i] = null;
      }
    }
  };

  buffer._rInd = 0;
  buffer._wInd = 0;
  buffer._data = util.list( size, (initFn)? initFn : null );
  buffer._size = size;

  return buffer;
};
