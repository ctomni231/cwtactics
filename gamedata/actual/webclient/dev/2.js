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
  
  // ### CW:T Version
  VERSION:              "0.3.2.0 Beta - Burakku Raitoningu",
  
  // ### CW:T Errors
  error:{
    
    // #### Error type numbers
    
    NON_CAUGHT_ERROR:               0,
    UNKNOWN:                        1,
    HOST_ONLY:                      2,
    ILLEGAL_DATA:                   3,
    ILLEGAL_PARAMETERS:             4,
    ILLEGAL_MAP_FORMAT:             5,
    NON_ENGINE_FAULT:               6,
    MOD_DATA_FORMAT_FAULT:          7,
    CLIENT_ERROR:                   71,
    CLIENT_BREAKS_CONTRACT:         70,
    
    STM_NO_EVENT:                   90,
    STM_INVALID_NEXT_STATE:         91,
    STM_ACTIONSTATE_BREAKS_TRANS:   92,
    STM_NEXT_STATE_MISSING:         93,
    STM_STILL_IN_INITIAL_STATE: 		94,
    STM_BACK_TRANSITION_NO_HISTORY: 95,

    // #### Error data numbers

    ILLEGAL_ACTION_FUNCTION_ID:     9999,
    NO_GAME_ROUND_ACTIVE:           9998,
    GAME_ROUND_ACTIVE:              9997,
    ILLEGAL_CONFIG_VAR_DEFINTION:   9996,
    ILLEGAL_SCRIPT_VAR_DEFINTION:   9995,
    ILLEGAL_SHEET_ID:               9994,
    ILLEGAL_SHEET_ALREADY_DEFINED:  9993,
    BREAKS_SHEET_CONTRACT:          9992,
    ILLEGAL_SHEET_HANDLER:          9991,
    ILLEGAL_RULE_DEFINITION:        9990,
    CLIENT_DATA_ERROR:              9989,
    CLIENT_LOAD_ERROR:              9988,
    
    // ai errors
    AI_STEP_ON_NON_AI_PLAYER:       9001,
    
    // event errors
    NO_EVENT_SLOT_IS_FREE:          7003,
    EVENT_LISTENER_ALREADY_EXIST:   7002,
    EVENT_LISTENER_DOES_NOT_EXIST:  7001,
    
    // save data errors
    SAVEDATA_WEATHER_MISSMATCH:     6002,
    SAVEDATA_PLAYER_MISSMATCH:      6001,
    
    // player related errors
    UNKNOWN_PLAYER_OBJECT:          5001,
    
    // unit related errors 
    UNIT_NOT_FOUND:                 4006,
    JOIN_TYPE_MISSMATCH:            4005,
    SUPPLY_UNIT_EXPECTED:           4004,
    TRANSPORTER_CANNOT_LOAD_ITSELF: 4003,
    TRANSPORTER_EXPECTED:           4002,
    LOAD_IS_NOT_IN_TRANSPORTER:     4001,
    
    // action errors
    ACTION_CONDITION_MISSING:       8001,
    ACTION_KEY_MISSING:             8002,
    ACTION_IMPLEMENTATION_MISSING:  8003,
    ACTION_KEY_ALREADY_DEFINED:     8004,
    ACTION_ONLY_ONE_SELECTION_TYPE: 8005,
  
    // move fauls
    ILLEGAL_MOVE_ENEMY_IS_NEIGHTBOR: 3003,
    ILLEGAL_MOVE_PATH:               3002,
    ILLEGAL_MOVE_CODE:               3001,
    
    // data faults
    DATA_FAULT_IS_SAME_FAULT:       2008,
    DATA_FAULT_NUMBER_FAULT:        2007,
    DATA_FAULT_STRING_FAULT:        2006,
    DATA_FAULT_BOOLEAN_FAULT:       2005,
    DATA_FAULT_IS_IN_FAULT:         2004,
    DATA_FAULT_NOT_IN_FAULT:        2003,
    DATA_FAULT_ARRAY_FAULT:         2002,
    DATA_FAULT_OBJECT_FAULT:        2001,
    
    // other errors
    FACTORY_EXPECTED: 						  1017,
    SELECTION_DATA_OUT_OF_BOUNDS:   1016,
    PROPERTY_NOT_FOUND:             1015,
    CANNOT_FIND_NEXT_PLAYER:        1014,
    UNKNOWN_PLAYER_ID:              1013,
    NON_ACTION_CALL_FUNCTION:       1012,
    NON_MODEL_FUNCTION:             1011,
    NO_SLOT_FREE:                   1010,
    PARAMETERS_MISSING:             1009,
    GAME_STATE_BREAK:               1008,
    POSITIONS_SHOULD_BE_NEIGHBORS:  1007,
    TURN_OWNER_ONLY:                1006,
    NOT_ENOUGH_FUEL:                1005,
    UNKNOWN_OBJECT_TYPE:            1004,
    UNKNOWN_WEATHER:                1003,
    NOT_ENOUGH_MONEY:               1002,
    CALC_NEXT_WEATHER:              1001
  }
};