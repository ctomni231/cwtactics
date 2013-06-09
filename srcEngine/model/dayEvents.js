/** @private */
model.turnTimedEvents_time_ = util.list( 50, null );

/** @private */
model.turnTimedEvents_data_ = util.list( 50, null );

/**
 * 
 * @param {Number} turn time in turns when the action will be fired
 * @param {String} action data
 */
model.pushTimedEvent = function( turn, action, args ){
  var list = model.turnTimedEvents_time_;
  for( var i=0,e=list.length; i<e; i++ ){
    if( model.turnTimedEvents_time_[i] === null ){
      model.turnTimedEvents_time_[i] = turn;
      model.turnTimedEvents_data_[i] = action;
      return;
    }
  }
  
  util.reaiseError("no free slot");
};

/**
 * Ticks a turn.
 *
 * @TODO: should be in the controller
 */
model.tickTimedEvents = function(){
  
  // CHECK ALL
  var list = model.turnTimedEvents_time_;
  for( var i=0,e=list.length; i<e; i++ ){
    if( list[i] === null ) continue;
    
    list[i]--;
    
    // ACTIVATE IF DAY IS ZERO
    if( list[i] === 0 ){
      
      list[i] = null;
      var args = model.turnTimedEvents_data_[i];
      model.turnTimedEvents_data_[i] = null;
      
      // SEND COMMAND
      if( controller.isNetworkGame() ) controller.sendNetworkMessage( JSON.stringify(args) );
      
      // REGISTER COMMAND
      controller.actionBuffer_.push( args );
    }
  }
};