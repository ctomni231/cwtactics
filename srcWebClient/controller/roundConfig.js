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
controller.roundConfig_coSelected = util.list( MAX_PLAYER , INACTIVE_ID );

//
//
controller.roundConfig_typeSelected = util.list( MAX_PLAYER , INACTIVE_ID );

//
//
controller.roundConfig_teamSelected = util.list( MAX_PLAYER , 0 );

//
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

//
//
controller.roundConfig_evalAfterwards = function(){
  var tmp;

  // TODO: player one is deactivated

  // deregister old players
  controller.ai_reset();
  model.client_deregisterPlayers();

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
      } else {
        model.client_registerPlayer(i);
      }

      // co
      tmp = ( controller.roundConfig_coSelected[i] !== INACTIVE_ID)? 
        model.data_coTypes[controller.roundConfig_coSelected[i]] : null;

      model.co_setMainCo( i, tmp );

    } else {

      // deactivate player
      model.player_data[i].team = INACTIVE_ID;
    } 
  }
};

//
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
        if( cSelect < INACTIVE_ID ) cSelect = model.data_coTypes.length-1;
      }
      else{
        cSelect++;
        if( cSelect >= model.data_coTypes.length ) cSelect = INACTIVE_ID;
      }
      controller.roundConfig_coSelected[pid] = cSelect;
      break;

    /* ---------------------------------------------------------- */

    case controller.roundConfig_CHANGE_TYPE.CO_SIDE:
      assert(false,"not supported yet");
      break;

    /* ---------------------------------------------------------- */

    case controller.roundConfig_CHANGE_TYPE.CO_TYPE:
      assert(false,"not supported yet");
      break;

    /* ---------------------------------------------------------- */

    case controller.roundConfig_CHANGE_TYPE.PLAYER_TYPE:
      var cSelect = controller.roundConfig_typeSelected[pid];
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