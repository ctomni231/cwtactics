(function(){

  function deact( uid ){
    var si = model.unit_data[uid] * MAX_UNITS_PER_PLAYER;
    model.actions_leftActors[ uid - si] = false;
  }

  model.events_on("wait_invoked",    deact);
  model.events_on("trapwait_invoked",deact);

})();

// Resets the actable units for the player that starts the turn.
//
model.events_on("nextTurn_pidStartsTurn",function(pid){
  var i   = model.unit_firstUnitId( pid );
  var e   = model.unit_lastUnitId(  pid );
  var io  = i;

  for( ; i<e; i++ ){
    model.actions_leftActors[ i-io ] = (
      model.unit_data[i].owner !== INACTIVE_ID );
  }
});
