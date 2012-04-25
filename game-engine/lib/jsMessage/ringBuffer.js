/**
 * Ring storage filter that buffers incoming messages in a ring based storage with a fixed size.
 *
 * @since 21.04.2012
 * @author BlackCat (blackcat.myako@gmail.com)
 * @param {{size}} flags
 */
jsMessage.filter.ringStorage = function( flags ){

  var size = flags.size;

  // object variables
  var ring = [];
  var iPt, rPt;

  return{

    // is the queue empty?
    isEmpty: function(){
      return ring[rPt] === null;
    },

    // clear all stored messages
    clear: function(){
      for( var i=0;i<size;i++ ) ring[i] = null;
      iPt = 0;
      rPt = 0;
    },

    // pop message
    pop: function( ){
      var msg = ring[rPt];
      if( msg === null ) throw Error('queue is empty');

      ( rPt === size-1 )? rPt = 0 : rPt++;
      return msg;
    },

    // connects to the message context, all incoming messages will be cached and can be invoked later
    filter: function( msg ){
      if( ring[iPt] !== null ) throw Error('queue is full');

      // set msg to field at inserting pointer and increase it afterwards
      ring[iPt] = msg;
      ( iPt === size-1 )? iPt = 0 : iPt++;
    }
  }
};