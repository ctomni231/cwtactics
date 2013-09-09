// Holds the current script tags
controller.scriptTags = {};

// Generates script tags based on a position pair
controller.prepareTags = function( x,y, uid, fx,fy, fuid ){
  var tags = controller.scriptTags;
  
  if( tags.__oldUnit__ ) tags[ tags.__oldUnit__ ] = false;
  if( tags.__oldTile__ ) tags[ tags.__oldTile__ ] = false;
  
  tags.INDIRECT = false;
  tags.DIRECT = false;
  
  var unit = (uid > -1)? model.units[uid] : model.unitPosMap[x][y];
  if( unit ){
    tags.__oldUnit__ = unit.type.ID;
    tags[ tags.__oldUnit__ ] = true;
    
    if( model.isIndirectUnit( (uid > -1)? uid : model.extractUnitId(unit) ) ) tags.INDIRECT = true;
    else tags.DIRECT = true;
    
  }
  
  var tileTp = model.map[x][y].ID;
  var prop = model.propertyPosMap[x][y];
  if( prop ){
    tileTp = prop.type.ID;
  }
  
  tags.__oldTile__ = tileTp;
  tags[ tags.__oldTile__ ] = true;
  
  // FOCUS TILE GIVEN
  if( arguments.length > 3 ){
    
    tags.OTHER_INDIRECT = false;
    tags.OTHER_DIRECT = false;
    
    unit = (fuid > -1)? model.units[fuid] : model.unitPosMap[fx][fy];
    if( unit ){
      if( model.isIndirectUnit( (fuid > -1)? fuid : model.extractUnitId(unit) ) ) tags.OTHER_INDIRECT = true;
      else tags.OTHER_DIRECT = true;
    }
  }
};

// Holds all configurable var boundaries
controller.configBoundaries_ = {};

// Defines a configurable variable to control the 
// game rules.
//
controller.defineGameConfig = function( name, min, max, def, step ){
  
  // check name
  if( !name || controller.configBoundaries_.hasOwnProperty(name) ){
    model.criticalError(
      constants.error.ILLEGAL_PARAMETERS,
      constants.error.ILLEGAL_CONFIG_VAR_DEFINTION
    );
  }
  
  // check meta data
  if( max < min ||
     def < min ||
     def > max ){
    
    model.criticalError(
      constants.error.ILLEGAL_PARAMETERS,
      constants.error.ILLEGAL_CONFIG_VAR_DEFINTION
    );
  }
  
  controller.configBoundaries_[name] = {
    min:min,
    max:max,
    defaultValue: def,
    step: (typeof step === "number")? step: 1
  };
};

// Builds the round configuration data
//
controller.buildRoundConfig = function( cfg ){
  var boundaries = controller.configBoundaries_;
  model.configRule = {};
  
  var keys = Object.keys(boundaries);
  for( var i=0,e=keys.length; i<e; i++ ){
    var key = keys[i];
    
    var value;
    if( cfg && cfg.hasOwnProperty(key) ){
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

// Returns the value of a game round configuration property.
// 
// @param {String} attr name of the attribute
// @returns {Number}
// 
controller.configValue = function( attr ){
  return model.configRule[attr];
};

// Holds all scriptable var boundaries
controller.scriptBoundaries_ = {};

// Defines a scriptable variable to control the 
// game data via rules.
//
controller.defineGameScriptable = function( name, min, max ){
  
  // check name and meta data
  if( !name || controller.scriptBoundaries_.hasOwnProperty(name) || max < min ){
    model.criticalError(
      constants.error.ILLEGAL_PARAMETERS,
      constants.error.ILLEGAL_CONFIG_VAR_DEFINTION
    );
  }
  
  controller.scriptBoundaries_[name] = [ min, max ];
};

util.scoped(function(){
  
  function solve( ruleList, memory, attrName, value ){
    for( var i=0,e=ruleList.length; i<e; i++ ){    
      var rule = ruleList[i];
      if( !rule ) continue;
      
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
  
  // Returns the value of a game attribute.
  //  
  // @param {object} tags set of tags of the invoking object
  // @param {Number} pid id number of the invoking player
  // @param {String} attr name of the attribute
  // @returns {Number}
  //   
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