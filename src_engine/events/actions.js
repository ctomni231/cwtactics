(function(){

  function deact( uid ){
    var si = model.unit_data[uid].owner * MAX_UNITS_PER_PLAYER;
    model.actions_leftActors[ uid - si] = false;
  }

  model.event_on("wait_invoked",    deact);
  model.event_on("trapwait_invoked",deact);

})();

// Resets the actable units for the player that starts the turn.
//
model.event_on("nextTurn_pidStartsTurn",function(pid){
  var i   = model.unit_firstUnitId( pid );
  var e   = model.unit_lastUnitId(  pid );
  var io  = i;

  for( ; i<e; i++ ){
    model.actions_leftActors[ i-io ] = ( model.unit_data[i].owner !== INACTIVE_ID );
  }
});
