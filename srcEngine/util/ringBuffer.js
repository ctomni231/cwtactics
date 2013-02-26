/** 
 * Creates a ring buffer with a fixed size.
 */
util.createRingBuffer = function( size ){

  var buffer = {

    push: function (msg){
      if ( this._data[ this._wInd ] !== null) {
        throw Error("message buffer is full");
      }

      /*
       if (util.DEBUG) {
       util.logInfo("adding message (", util.objectToJSON(msg), ") to buffer");
       }
       */

      // WRITE MSG AND INCREASE COUNTER
      this._data[ this._wInd ] = msg;
      this._wInd++;
      if ( this._wInd === this._size ) {
        this._wInd = 0;
      }
    },

    /**
     * Returns true if the ring buffer is empty else false.
     *
     */
    isEmpty: function () {
      return ( this._data[ this._rInd ] === null );
    },

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
  buffer._data = util.list( size, null );
  buffer._size = size;

  return buffer;
};