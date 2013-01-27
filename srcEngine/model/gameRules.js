model.rules = {};

/**
 * Unites modification rules and custom rules to a valid game round rule
 * object.
 */
model.setRulesByOption = function( options ){
  var modRules = model.sheets.defaultRules;
  var rules = model.rules;

  var keys = Object.keys( modRules );
  for( var i=0,e=keys.length; i<e; i++ ){

    var key = keys[i];

    // TAKE EITHER MOD DEFAULT VALUES OR CUSTOM VALUES
    if( options.hasOwnProperty(key) ){
      rules[key] = options[key];
    } else{
      rules[key] = modRules[key];
    }
  }
};