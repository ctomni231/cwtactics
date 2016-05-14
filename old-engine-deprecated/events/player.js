// A player has loosed the game round due a specific reason. This function removes all of his
// units and properties. Furthermore the left teams will be checked. If only one team is left
// then the end game event will be invoked.
//
model.event_on("player_deactivatePlayer", function( pid ){
  assert( model.property_isValidPropId(pid) );

  // remove all units
  var i,e;
  i = model.unit_firstUnitId( pid );
  e = model.unit_lastUnitId( pid );
  for( ; i<e; i++ ){
    if( model.unit_data[i].owner !== INACTIVE_ID ) model.events.destroyUnit(i);
  }

  // remove all properties
  i = 0;
  e = model.property_data.length;
  for( ; i<e; i++ ){
    var prop = model.property_data[i];
    if( prop.owner === pid ){
      prop.owner = -1;

      // change type when the property is a
      // changing type property
      var changeType = prop.type.changeAfterCaptured;
      if( changeType ) model.events.property_changeType( i, changeType );
    }
  }

  // mark player slot as remove by removing
  // its team reference
  model.player_data[pid].team = -1;

  // when no opposite teams are found then the game has ended
  if( !model.player_areEnemyTeamsLeft() ){
    controller.commandStack_localInvokement("player_noTeamsAreLeft");
  }
});

// This function yields the game for the turn owner and invokes directly the
// `nextTurn` action.
//
// **Allowed to be called directly by the client.**
//
model.event_on("player_playerGivesUp", function(){
  assert( model.client_isLocalPid( model.round_turnOwner ) );

  model.events.nextTurn_invoked();

  // TODO: check this here
  // if model.player_playerGivesUp was called from network context
  // and the turn owner in in the local player instances then
  // it's an illegal action
});

// Invoked when the game ends because of a battle victory over all enemy player_data.
//
model.event_on("player_noTeamsAreLeft", function(){
  controller.update_endGameRound();
});
