// Changing types of the round configuration.
//
controller.roundConfig_CHANGE_TYPE = {
  CO_MAIN     : 0,
  CO_SIDE     : 1,
  GAME_TYPE   : 2,
  PLAYER_TYPE : 3,
  TEAM        : 4
};

// Data holder to remember selected co's.
//
controller.roundConfig_coSelected = util.list( MAX_PLAYER , 0 );

// Data holder to remember selected player types.
//
controller.roundConfig_typeSelected = util.list( MAX_PLAYER , INACTIVE_ID );

// Data holder to remember selected teams.
//
controller.roundConfig_teamSelected = util.list( MAX_PLAYER , 0 );

// Prepares a new game round by reset the configuration data.
//
controller.roundConfig_prepare     = function(){
  controller.roundConfig_coSelected.resetValues();
  controller.roundConfig_typeSelected.resetValues();
  controller.roundConfig_teamSelected.resetValues();

  for( var i= 0, e=MAX_PLAYER; i<e; i++ ){
    if( model.player_data[i].team > INACTIVE_ID ){

      if( i === 0 ){
        controller.roundConfig_typeSelected[i] = 0;
      } else controller.roundConfig_typeSelected[i] = 1;

      controller.roundConfig_teamSelected[i] = i; // model.player_data[i].team;

    } else {
      controller.roundConfig_typeSelected[i] = DESELECT_ID;
    }
  }
};

// Evaluates the selected data. The data will be transfered
// into the model when the data model as whole object is
// correct.
//
controller.roundConfig_evalAfterwards = function(){
  var tmp;

  // TODO: player one is deactivated

  // deregister old players
  controller.ai_reset();
  model.events.client_deregisterPlayers();

  var onlyAI = true;
  for( var i= 0, e=MAX_PLAYER; i<e; i++ ){
    if( controller.roundConfig_typeSelected[i] === 0 ){
      onlyAI = false;
      break;
    }
  }

  // update model
  for( var i= 0, e=MAX_PLAYER; i<e; i++ ){
    if( controller.roundConfig_typeSelected[i] >= 0 ){

      // game data
      model.player_data[i].gold = 0;

      // team
      model.player_data[i].team = controller.roundConfig_teamSelected[i];

      // type
      if( controller.roundConfig_typeSelected[i] === 1 ){
        controller.ai_register(i);
        if( onlyAI ) model.events.client_registerPlayer(i);
      } else {
        model.events.client_registerPlayer(i);
      }

      // co
      tmp = ( controller.roundConfig_coSelected[i] !== INACTIVE_ID)?
        model.data_coTypes[controller.roundConfig_coSelected[i]] : null;

      model.events.setMainCo( i, tmp );

    } else {

      // deactivate player
      model.player_data[i].team = INACTIVE_ID;

      // remove all units
      var firstUid = model.unit_firstUnitId(i);
      var lastUid = model.unit_lastUnitId(i);
      for( ; firstUid<=lastUid; firstUid++ ){
        var unit = model.unit_data[firstUid];
        if( unit ){
          model.unit_posData[unit.x][unit.y] = null;
          model.unit_data[firstUid].owner = INACTIVE_ID;
        }
      }

      // remove all properties
      for( var pi = 0, pe = model.property_data.length; pi < pe; pi++ ){
        var prop = model.property_data[pi];
        if( prop && prop.owner === i ){
          prop.owner = INACTIVE_ID;
        }
      }
    }
  }
};

// Changes a parameter of the configuration data.
//
controller.roundConfig_changeConfig = function( pid, type, prev ){
  assert(
    type >= controller.roundConfig_CHANGE_TYPE.CO_MAIN &&
      type <= controller.roundConfig_CHANGE_TYPE.TEAM
  );

  switch( type ){

    /* ---------------------------------------------------------- */

    case controller.roundConfig_CHANGE_TYPE.CO_MAIN:
      var cSelect = controller.roundConfig_coSelected[pid];
      if( prev ){
        cSelect--;
        if( cSelect < 0 ) cSelect = model.data_coTypes.length-1;
      }
      else{
        cSelect++;
        if( cSelect >= model.data_coTypes.length ) cSelect = 0;
      }
      controller.roundConfig_coSelected[pid] = cSelect;
      break;

    /* ---------------------------------------------------------- */

    case controller.roundConfig_CHANGE_TYPE.CO_SIDE:
      assert(false,"not supported yet");
      break;

    /* ---------------------------------------------------------- */

    case controller.roundConfig_CHANGE_TYPE.GAME_TYPE:
      if( prev ){
        if( model.co_activeMode === model.co_MODES.AW1 ) model.co_activeMode = model.co_MODES.AW2;
        else if( model.co_activeMode === model.co_MODES.AW2 ) model.co_activeMode = model.co_MODES.AW1;
      } else{
        if( model.co_activeMode === model.co_MODES.AW1 ) model.co_activeMode = model.co_MODES.AW2;
        else if( model.co_activeMode === model.co_MODES.AW2 ) model.co_activeMode = model.co_MODES.AW1;
      }
      break;

    /* ---------------------------------------------------------- */

    case controller.roundConfig_CHANGE_TYPE.PLAYER_TYPE:
      var cSelect = controller.roundConfig_typeSelected[pid];
      if( cSelect === DESELECT_ID ) break;
      if( prev ){
        cSelect--;
        if( cSelect < INACTIVE_ID ) cSelect = 1;
      }
      else{
        cSelect++;
        if( cSelect >= 2 ) cSelect = INACTIVE_ID;
      }
      controller.roundConfig_typeSelected[pid] = cSelect;
      break;

    /* ---------------------------------------------------------- */

    case controller.roundConfig_CHANGE_TYPE.TEAM:
      var cSelect = controller.roundConfig_teamSelected[pid];
      while( true ){
        if( prev ){
          cSelect--;
          if( cSelect < 0 ) cSelect = 3;
        }
        else{
          cSelect++;
          if( cSelect >= 4 ) cSelect = 0;
        }

        var s = false;
        for( var i= 0, e=MAX_PLAYER; i<e; i++ ){
          if( i === pid ) continue;

          if( controller.roundConfig_typeSelected[i] >= 0 &&
            controller.roundConfig_teamSelected[i] !== cSelect ){
            s = true;
          }
        }

        if( s ) break;
      }
      controller.roundConfig_teamSelected[pid] = cSelect;
      break;

    /* ---------------------------------------------------------- */

  }
};
