/**
 * Rule object holder.
 */
model.ruleTable = {};

/**
 * Data level rules.
 */
model.ruleTable.dataLevel = {

  /** attack damage modifier */
  att:100,

  /** defense damage modifier */
  def:100,

  /** counter attack damage modifier */
  cAtt:100,

  /** the funds returned by owned properties */
  funds:1000,

  /** the vision modifier */
  vision: 0,
  
  /** the move range modifier */
  moveRange: 0,
  
  /** days to regenerate silos, -1 if no regeneration should be done */
  siloRegeneration:-1,

  /** is fog enabled? */
  fogEnabled:true,
  
  /** is a silo usable? */
  usableSilo:true
};

model.ruleTable.mapLevel = Object.create( model.ruleTable.dataLevel );
model.ruleTable.roundLevel = Object.create( model.ruleTable.mapLevel );
model.ruleTable.playerLevel = Object.create( model.ruleTable.roundLevel );

/**
 * Main rule object.
 */
model.rules = model.ruleTable.playerLevel;

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