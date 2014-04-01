/**
 *
 * @class
 */
cwt.RingBuffer = my.Class({

  constructor: function (size, initFn) {
    this.readPos = 0;
    this.writePos = 0;
    this.data = new cwt.List( size, (initFn)? initFn : null );
    this.size = size;
  },

  /**
   * Pushes an element into the buffer
   *
   * @param msg object that will be pushed into the buffer
   */
  push: function (msg){
    cwt.assert(this.data[ this.writePos ] === null);

    // WRITE MSG AND INCREASE COUNTER
    this.data[ this.writePos ] = msg;
    this.writePos++;
    if ( this.writePos === this.size ) {
      this.writePos = 0;
    }
  },

  /**
   * Returns true if the ring buffer is empty else false.
   */
  isEmpty: function () {
    return ( this.data[ this.readPos ] === null );
  },

  /**
   * Returns the next available entry from the buffer (FIFO).
   */
  pop: function () {
    cwt.assert(this.data[ this.writePos ] !== null);

    var msg = this.data[ this.readPos ];

    // INCREASE COUNTER AND FREE SPACE
    this.data[ this.readPos ] = null;
    this.readPos++;
    if (this.readPos === this.size ) {
      this.readPos = 0;
    }

    return msg;
  },

  /**
   * Clears the buffer.
   */
  clear: function(){
    this.readPos = 0;
    this.writePos = 0;
    for( var i=0; i<this.size; i++ ){
      this.data[i] = null;
    }
  }
});