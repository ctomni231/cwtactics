// Holds all game rules.
//
model.rule_global = [];

// Holds all map rules.
//
model.rule_map = util.list( 20, null );

// Checks a rule.
//
model.rule_isValid = function(rule, isMapRule){
  return true;
};

// Pushes a rule into the model.
//
model.rule_push = function(rule, isMapRule){
  assert( model.rule_isValid(rule,isMapRule) );
  
  if(isMapRule) model.rule_map.push(rule);
  else          model.rule_global.push(rule);
};
