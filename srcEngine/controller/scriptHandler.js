controller.eventScripts_ = {};

controller.scripts_ = {};

controller.SCRIPT_TRIGGER = {
  MOVE_ON_TILE :  0,
  MOVE_OFF_TILE : 1,
  UNIT_ATTACKED : 2
};

controller.SCRIPT_ACTIONS = {
  LOG : 0
};

controller.addScriptEvent = function( id, trigger, action ){
  controller.eventScripts_[trigger] = [];
  controller.eventScripts_[trigger].push( action );
};

controller.triggerScriptEvent = function( name, obj ){

};


/**
 *
 *
 *
 */
controller.ruleInterpreter = function( value, rules ){
  for( var i=0,e=rules.length; i<e; i++ ){
    
    var ruleAst = rules[i];
    var key = ruleAst[0];
    switch( key ){
      
      case 0:
        value += ruleAst[1];
        break;
      
      case 1:
        value *= ruleAst[1];
        break;
        
      case 2:
        value = ruleAst[1];
        break;
        
    }
  }
    
  return value;
};