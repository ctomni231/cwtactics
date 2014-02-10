/**
 * Contains the states of the game flow.
 */
cwt.gameFlow = {};

/**
 * Contains the data of the game flow.
 */
cwt.gameFlowData = {};

/**
 * The central state machine of the game engine. 
 * The player only interacts with this machine with the 
 * input system of the client.
 */
cwt.stateMachine = cwt.stateMachine(cwt.gameFlow);

// inject data
cwt.stateMachine.data = cwt.gameFlowData;




// ### StateMachineData
// Action process data memory object. It is used as data holder to transport data between the single states of the state machine of the game engine.
//
controller.stateMachine.data = {
  

  // ### StateMachineData.hereIsUnitRelationShip
  // Does a unit to unit relationcheck. Both arguments `posA` and `posB` are objects of the type
  // `controller.TaggedPosition`. An instance of `model.player_RELATION_MODES` will be returned.
  //
  thereIsUnitRelationShip: function( posA, posB ){
    // TODO check for undefined

    if( posA.unit && posA.unit === posB.unit ) return model.player_RELATION_MODES.SAME_OBJECT;

    return model.player_getRelationship(
      (posA.unit !== null) ? posA.unit.owner : -1,
      (posB.unit !== null) ? posB.unit.owner : -1
    );
  },

  // Does a unit to property relationcheck. Both arguments `posA` and `posB` are objects of the
  // type `controller.TaggedPosition`. An instance of `model.player_RELATION_MODES` will be
  // returned.
  //
  thereIsUnitToPropertyRelationShip: function( posA, posB ){
    // TODO check for undefined

    return model.player_getRelationship(
      (posA.unit !== null    ) ? posA.unit.owner     : -1,
      (posB.property !== null) ? posB.property.owner : null
    );
  }
};
