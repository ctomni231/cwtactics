// ### Model

// Holds all game rules
//
model.globalRules = [];

// Holds all map rules
//
model.mapRules = util.list( 20, null );

controller.persistenceHandler(
  
  // load
  function(  ){
    model.mapRules.resetValues();
  },
  
  // save
  function(  ){}
);
  
// ---

// ### Logic

model.isValidRule = function(rule, isMapRule){
  return true;
};

model.pushRule = function(rule, isMapRule){
  if( !model.isValidRule(rule,isMapRule) ){
    model.criticalError(
      constants.error.ILLEGAL_PARAMETERS,
      constants.error.ILLEGAL_RULE_DEFINITION );
  }
  
  if(isMapRule) model.mapRules.push(rule);
  else model.globalRules.push(rule);
};