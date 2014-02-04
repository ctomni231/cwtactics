/**
 * 
 */
view.hooksBuffer = util.createRingBuffer(50);

/**
 * Contains all registered animation hacks.
 */
view.animationHooks = {};

//
//
view.registerAnimationHook = function( impl ){
  var key = impl.key;
  
  if( view.animationHooks.hasOwnProperty(key) ){
    assert(false,"animation algorithm for",key,"is already registered");
  }
  
  view.animationHooks[ key ] = impl;
  
  // REGISTER LISTENER
  model.event_on(key,function(){
    var data = [];
    
    for( var i=0,e=arguments.length; i<e; i++ ) data[i] = arguments[i];
    data[data.length] = key;

    view.hooksBuffer.push( data );
  });
  
  impl.isEnabled = true;
};