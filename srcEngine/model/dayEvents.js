// Holds all connected day/turn events.
//
model.dayEvents_data = util.list( 50, function(){
  return [ null, null, null ];
});

// Adds a timed event to the engine. The action will be invoked in `turn` turns.
//
model.dayEvents_push = function( turn, action, args ){
  var list = model.dayEvents_data;
  
  for( var i=0,e=list.length; i<e; i++ ){
    if( list[i][0] === null ){
      
      // activate slot
      list[i][0] = turn;
      list[i][1] = action;
      list[i][2] = args;
      return;
    }
  }

  assert(false,"day event buffer overflow");
};

// Ticks a turn.
//
model.dayEvents_tick = function(){
  var list = model.dayEvents_data;
  for( var i=0,e=list.length; i<e; i++ ){
    
    // if timer entry is null then no event is defined
    if( list[i][0] === null ) continue;
    
    // decrease timer
    list[i][0]--;
    
    // activate event when 
    // timer reaches zero
    if( list[i][0] === 0 ){
      var key = list[i][1];
      var args = list[i][2];
      
      // deactivate slot
      list[i][0] = null;
      list[i][1] = null;
      list[i][2] = null;

      controller.action_localInvoke( key, args );
    }
  }
};
