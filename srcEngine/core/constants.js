var constants = {
  DEBUG:                true,
  
  INACTIVE_ID:          -1,
  ACTIONS_BUFFER_SIZE:  200,
  
  MAX_PLAYER:           5,
  MAX_MAP_WIDTH:        100,
  MAX_MAP_HEIGHT:       100,
  MAX_UNITS_PER_PLAYER: 50,
  MAX_PROPERTIES:       200,
  MAX_SELECTION_RANGE:  15,
  MAX_BUFFER_SIZE:      200,
  
  ERROR_MSG:            "Custom Wars Tactics - Debug: An error was raised",
  
  // #### CW:T Version
  VERSION:              "0.3.2.0 Beta - Howaito Raitoningu",
  
  // #### CW:T Errors
  error:{
    
    // ###### Error type numbers
    UNKNOWN:                  1,
    HOST_ONLY:                2,
    ILLEGAL_DATA:             3,
    ILLEGAL_PARAMETERS:       4,
    ILLEGAL_MAP_FORMAT:       5,
    NON_ENGINE_FAULT:         6,
    CLIENT_BREAKS_CONTRACT:   70,

    // ###### Error data numbers

    // ai errors
    AI_STEP_ON_NON_AI_PLAYER:       9001,
    
    // event errors
    NO_EVENT_SLOT_IS_FREE:          7003,
    EVENT_LISTENER_ALREADY_EXIST:   7002,
    EVENT_LISTENER_DOES_NOT_EXIST:  7001,
    
    // transporter errors
    LOAD_IS_NOT_IN_TRANSPORTER:     1103,
    TRANSPORTER_EXPECTED:           1102,
    TRANSPORTER_CANNOT_LOAD_ITSELF: 1101,
    
    // save data errors
    SAVEDATA_WEATHER_MISSMATCH:     1202,
    SAVEDATA_PLAYER_MISSMATCH:      1201,
    
    UNKNOWN_PLAYER_OBJECT:          1020,
    SUPPLY_UNIT_EXPECTED:           1019,
    PARAMETERS_MISSING:             1018,
    JOIN_TYPE_MISSMATCH:            1017,
    NO_SLOT_FREE:                   1016,
    UNKNOWN_MOVE_CODE:              1015,
    PROPERTY_NOT_FOUND:             1014,
    GAME_STATE_BREAK:               1013,
    POSITIONS_SHOULD_BE_NEIGHBORS:  1012,
    UNKNOWN_OBJECT_TYPE:            1011,
    UNIT_NOT_FOUND:                 1010,
    PROPERTY_NOT_FOUND:             1009,
    TURN_OWNER_ONLY:                1006,
    UNKNOWN_PLAYER_ID:              1005,
    CANNOT_FIND_NEXT_PLAYER:        1004,
    UNKNOWN_WEATHER:                1003,
    NOT_ENOUGH_MONEY:               1002,
    CALC_NEXT_WEATHER:              1001
  }
};