/**
 * @private
 TODO move into the modules
 */
controller.scriptBoundaries_ = {
  minrange:[   1,CWT_MAX_SELECTION_RANGE-1 ],
  maxrange:[   1,CWT_MAX_SELECTION_RANGE   ],
  moverange:[   1,CWT_MAX_SELECTION_RANGE   ],
  movecost:[   1,CWT_MAX_SELECTION_RANGE   ],
  vision:[   1,10   ],
  att:[  50,400   ],
  counteratt:[  50,400   ],
  def:[  50,400   ],
  luck:[ -50,50    ],
  captureRate:[   50,9999 ],
  neutralizeWeather:[   0,1     ],
  firstcounter:[   0,1     ],
  funds:[   1,99999 ],
  fuelDrain:[   1,1     ],
  comtowerbonus:[   1,100   ],
  terraindefense:[   0,12    ],
  terraindefensemodifier:[  10,300   ]
};

/**
 * @private
 TODO move into the modules
 */
controller.configBoundaries_ = {
  daysOfPeace:{             min:0, max:50,    defaultValue:0 },      
  fogEnabled:{              min:0, max:1,     defaultValue:1 },     
  dayLimit:{                min:0, max:999,   defaultValue:0 },  
  noUnitsLeftLoose:{        min:0, max:1,     defaultValue:0 },      
  supplyAlliedUnits:{       min:0, max:1,     defaultValue:0 },
  captureLimit:{            min:0, max:CWT_MAX_PROPERTIES, defaultValue:0 },   
  unitLimit:{               min:0, max:CWT_MAX_UNITS_PER_PLAYER, defaultValue:0 },  
  weatherMinDays:{          min:1, max:5,     defaultValue:1 },  
  weatherRandomDays:{       min:0, max:5,     defaultValue:4 },  
  
  // TODO maybe as property action command        
  repairAlliedUnits:{       min:0, max:1,     defaultValue:0 }, 
  
  autoSupplyAtTurnStart:{   min:0, max:1,             defaultValue:1 },      
  coStarCost:{              min:5, max:50000, step:5, defaultValue:9000 },      
  coStarCostIncrease:{      min:0, max:50000, step:5, defaultValue:1800 },
  coStarCostIncreaseSteps:{ min:0, max:50,            defaultValue:10 },
  turnTimeLimit:{           min:0, max:60,            defaultValue:0 },
  gameTimeLimit:{           min:0, max:99999,         defaultValue:0 }
};

/**
 * 
 * @param {object} cfg
 */
controller.buildRoundConfig = function( cfg ){
  var boundaries = controller.configBoundaries_;
  
  var keys = Object.keys(boundaries);
  for( var i=0,e=keys.length; i<e; i++ ){
    var key = keys[i];
    
    var value;
    if( cfg.hasOwnProperty(key) ){
      value = cfg[key];
      
      // CHECK MIN MAX
      if( value < boundaries[key].min ) util.raiseError(key,"is greater than it's minimum value");
      if( value > boundaries[key].max ) util.raiseError(key,"is greater than it's maximum value");
      
      // CHECK STEP
      if( boundaries[key].hasOwnProperty("step") ){
        if( value % boundaries[key].step !== 0 ) util.raiseError(key,"is does not fits one of it's possible values");
      }
    }
    else value = boundaries[key].defaultValue;
    
    model.configRule[key] = value;
  }
};

/**
 * Returns the value of a game round configuration property.
 * 
 * @param {String} attr name of the attribute
 * @returns {Number}
 */
controller.configValue = function( attr ){
  return model.configRule[attr];
};

util.scoped(function(){
  
  function solve( ruleList, memory, attrName, value ){
    for( var i=0,e=ruleList.length; i<e; i++ ){    
      var rule = ruleList[i];
      var attrVal = rule[attrName];
      if( typeof attrVal === "number" ){
        var noMatch;
        var list;
        
        // HAS "AND" CONDITION
        list = rule.$all;
        if( typeof list !== "undefined" ){
          noMatch = false;
          
          // CHECK ALL
          for( var i2=0,e2=list.length; i2<e2; i2++ ){
            if( memory[list[i2]] !== true ){
              noMatch=true;
              break;
            }
          }
          
          if( noMatch ) continue;
        }
        
        
        // HAS "OR" CONDITION
        list = rule.$any;
        if( typeof list !== "undefined" ){
          noMatch = true;
          
          // CHECK ALL
          for( var i2=0,e2=list.length; i2<e2; i2++ ){
            if( memory[list[i2]] === true ){
              noMatch=false;
              break;
            }
          }
          
          if( noMatch ) continue;          
        }
        
        // ADD ATTRIBUTE VALUE
        value += attrVal;
      }
    }
    
    // CHECK BOUNDS
    bounds = controller.scriptBoundaries_[attrName];
    if( bounds !== undefined ){
      if( value < bounds[0] ) value = bounds[0];
      else if( value > bounds[1] ) value = bounds[1];
    }
    else util.raiseError("no boundaries given for "+attrName);
    
    // RETURN RESULT
    return value;
  };
  
  /**
   * Returns the value of a game attribute.
   * 
   * @param {object} tags set of tags of the invoking object
   * @param {Number} pid id number of the invoking player
   * @param {String} attr name of the attribute
   * @returns {Number}
   */
  controller.scriptedValue = function( pid, attr, value ){
    if( typeof value !== "number" ) util.raiseError("numberic value as parameter value expected");
    var tags = controller.scriptTags;
    
    // GLOBAL RULES
    value = solve( model.globalRules, tags, attr, value );
    
    // MAP RULES
    value = solve( model.mapRules, tags, attr, value );
    
    // PLAYER CO RULES
    var co = model.players[pid].mainCo;
    var weather = true;
    if( co ){
      value = solve( co.d2d, tags, attr, value );
      
      // IS NEUTRALIZED WEATHER GIVEN?
      weather = ( solve( co.d2d, tags, "neutralizeWeather", 0 ) === 0 );
    }
    
    // WEATHER
    var wth = model.weather;
    if( weather && wth ) value = solve( wth.rules, tags, attr, value );
    
    // CHECK BOUNDARIES
    var bounds = controller.scriptBoundaries_[attr];
         if( value < bounds[0] ) value = bounds[0];
    else if( value > bounds[1] ) value = bounds[1];
      
      // RETURN CALCULATED RESULT
      return value;
  };
});