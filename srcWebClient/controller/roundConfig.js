//
//
controller.roundConfig_CHANGE_TYPE = {
  CO_MAIN     : 0,
  CO_SIDE     : 1,
  CO_TYPE     : 2,
  PLAYER_TYPE : 3,
  TEAM        : 4
};

//
//
controller.roundConfig_prepare     = function(){
  for( var i= 0, e=MAX_PLAYER; i<e; i++ ){
    model.co_data[i].coA                 = null;
    controller.roundConfig_coSelected[i] = INACTIVE_ID;
    if( model.player_isValidPid(i) ) model.client_registerPlayer(i);
  }
};

//
//
controller.roundConfig_checkConfig = function( pid ){

};

//
//
controller.roundConfig_coSelected = [0,0,0,0];

//
//
controller.roundConfig_changeConfig = function( pid, type, prev ){
  assert(
    type >= controller.roundConfig_CHANGE_TYPE.CO_MAIN &&
      type <= controller.roundConfig_CHANGE_TYPE.TEAM
  );

  switch( type ){

    /* ----------------------------- */

    case controller.roundConfig_CHANGE_TYPE.CO_MAIN:
      var cSelect = controller.roundConfig_coSelected[pid];

      // grab next entry
      if( prev ){
        cSelect--;
        if( cSelect < INACTIVE_ID ) cSelect = model.data_coTypes.length-1;
      }
      else{
        cSelect++;
        if( cSelect >= model.data_coTypes.length ) cSelect = INACTIVE_ID;
      }

      // update model
      controller.roundConfig_coSelected[pid] = cSelect;
      if( cSelect !== INACTIVE_ID ){
        model.co_setMainCo( pid, model.data_coTypes[cSelect] );
      } else {
        model.co_setMainCo( pid, null );
      }

      break;

    /* ----------------------------- */

    case controller.roundConfig_CHANGE_TYPE.CO_SIDE:
      break;

    /* ----------------------------- */

    case controller.roundConfig_CHANGE_TYPE.CO_TYPE:
      break;

    /* ----------------------------- */

    case controller.roundConfig_CHANGE_TYPE.PLAYER_TYPE:
      break;

    /* ----------------------------- */

    case controller.roundConfig_CHANGE_TYPE.TEAM:
      var player = model.player_data[pid];

      do{
        if( prev ){
          player.team--;
          if( player.team < 0 ) player.team = MAX_PLAYER-1;
        } else {
          player.team++;
          if( player.team === MAX_PLAYER ) player.team=0;
        }
      }
      while( !model.player_areEnemyTeamsLeft() );
      break;

    /* ----------------------------- */

  }
};