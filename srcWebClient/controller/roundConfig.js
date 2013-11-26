controller.roundConfig_CHANGE_TYPE = {
  CO_MAIN     : 0,
  CO_SIDE     : 1,
  CO_TYPE     : 2,
  PLAYER_TYPE : 3,
  TEAM        : 4
};

controller.roundConfig_prepare     = function(){

};

controller.roundConfig_checkConfig = function( pid ){

};

//
//
controller.roundConfig_changeConfig = function( pid, type, chTp ){
  assert(
    type >= controller.roundConfig_CHANGE_TYPE.CO_MAIN &&
      type >= controller.roundConfig_CHANGE_TYPE.TEAM
  );

  switch( type ){

    case controller.roundConfig_CHANGE_TYPE.CO_MAIN:
      break;

    case controller.roundConfig_CHANGE_TYPE.CO_SIDE:
      break;

    case controller.roundConfig_CHANGE_TYPE.CO_TYPE:
      break;

    case controller.roundConfig_CHANGE_TYPE.PLAYER_TYPE:
      break;

    case controller.roundConfig_CHANGE_TYPE.TEAM:
      break;
  }
};