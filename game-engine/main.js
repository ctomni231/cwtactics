/**
 * @namespace
 */
var cwt = {

  util:{

    each: function( obj, callback ){
      var keys = Object.keys(obj);
      for(var i = 0, e = keys.length; i < e; i++){
        callback( obj[keys[i]], keys[i] );
      }
    },

    subscribe: function(){
			
    },

    publish: function( topic ){
			
    }
  }
};

/*
 // Initialise the EventEmitter
 var ee = new EventEmitter();

 // Initialise the listener function
 function myListener() {
 console.log('The foo event was emitted.');
 }

 // Add the listener
 ee.addListener('foo', myListener);

 // Emit the foo event
 ee.emit('foo'); // The listener function is now called

 // Remove the listener
 ee.removeListener('foo', myListener);

 // Log the array of listeners to show that it has been removed
 console.log(ee.listeners('foo'));
  */