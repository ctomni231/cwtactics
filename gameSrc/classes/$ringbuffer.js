/**
 *
 * @class
 * @template T
 */
cwt.RingBuffer = my.Class({

  constructor: function (size, initFn) {
    this.readPos = 0;
    this.writePos = 0;
    this.data = [];
    this.size = size;
    this.initFn = initFn;

    this.clear();
  },

  /**
   * Pushes an element into the buffer
   *
   * @param {T} msg object that will be pushed into the buffer
   */
  push: function (msg){
    cwt.assert(this.data[ this.writePos ] === null,"ringbuffer is full, cannot add content");

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
   * Returns true if the ring buffer is full else false.
   */
  isFull: function () {
    return ( this.data[ this.writePos ] !== null );
  },

  /**
   * Returns the next available entry from the buffer (FIFO).
   *
   * @return T
   */
  pop: function () {
    cwt.assert(this.data[ this.readPos ] !== null,"ringbuffer is empty, cannot read item");

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
      this.data[i] = (this.initFn)? this.initFn(i) : null;
    }
  }
});