
// Adds a timed event to the engine. The action will be invoked in `turn` turns.
//
model.event_on("dayEvent", function( days, action, argA, argB ){
  if( argA === void 0 ) argA = INACTIVE_ID;
  if( argB === void 0 ) argB = INACTIVE_ID;

  var list = model.dayTick_dataTime;
  for( var i=0,e=list.length; i<e; i++ ){

    if( list[i] === INACTIVE_ID ){
      list[i]                       = model.round_daysToTurns(days);
      model.dayTick_dataEvent[i]    = action;
      model.dayTick_dataArgs[i*2]   = argA;
      model.dayTick_dataArgs[i*2+1] = argB;
      return;
    }
  }

  assert(false,"day event buffer overflow");
});

// Ticks a turn.
//
model.event_on("nextTurn_invoked", function(){
  var list = model.dayTick_dataTime;
  for( var i=0,e=list.length; i<e; i++ ){
    if( list[i] === INACTIVE_ID ) continue;

    list[i]--;
    if( !list[i] ){

      // deactivate slot
      list[i] = INACTIVE_ID;

      model.events[model.dayTick_dataEvent[i]](
        model.dayTick_dataArgs[i*2],
        model.dayTick_dataArgs[i*2+1]
      );
    }
  }
});
