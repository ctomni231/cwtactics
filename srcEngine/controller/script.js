// Holds the current script tags
//
controller.scriptTags = {};

// Script memory that holds the data of the current object in focus.
//
controller.script_memory_ = [];

// Maps all string values in rules to the fitting position in the memory.
//
controller.script_memoryMapper = function(rules){

};

// Holds all scriptable var boundaries
//
controller.scriptBoundaries_ = {};

// Defines a scriptable variable to control the 
// game data via rules.
//
controller.defineGameScriptable = function( name, min, max ){
  
  // check name and meta data
  if( !name || controller.scriptBoundaries_.hasOwnProperty(name) || max < min ){
    model.criticalError(
      error.ILLEGAL_PARAMETERS,
      error.ILLEGAL_CONFIG_VAR_DEFINTION
    );
  }
  
  controller.scriptBoundaries_[name] = [ min, max ];
};

// Generates script tags based on a position pair
//
controller.prepareTags = function( x,y, uid, fx,fy, fuid ){
  var tags = controller.scriptTags;

  if( tags.__oldUnit__ ) tags[ tags.__oldUnit__ ] = false;
  if( tags.__oldTile__ ) tags[ tags.__oldTile__ ] = false;

  tags.INDIRECT = false;
  tags.DIRECT = false;

  var unit = (uid > -1)? model.unit_data[uid] : model.unit_posData[x][y];
  if( unit ){
    tags.__oldUnit__ = unit.type.ID;
    tags[ tags.__oldUnit__ ] = true;

    if( model.battle_isIndirectUnit( (uid > -1)? uid :
      model.unit_extractId(unit) ) ) tags.INDIRECT = true;
    else tags.DIRECT = true;

  }

  var tileTp = model.map_data[x][y].ID;
  var prop = model.property_posMap[x][y];
  if( prop ){
    tileTp = prop.type.ID;
  }

  tags.__oldTile__ = tileTp;
  tags[ tags.__oldTile__ ] = true;

  // FOCUS TILE GIVEN
  if( arguments.length > 3 ){

    tags.OTHER_INDIRECT = false;
    tags.OTHER_DIRECT = false;

    unit = (fuid > -1)? model.unit_data[fuid] : model.unit_posData[fx][fy];
    if( unit ){
      if( model.battle_isIndirectUnit( (fuid > -1)? fuid :
        model.unit_extractId(unit) ) ) tags.OTHER_INDIRECT = true;
      else tags.OTHER_DIRECT = true;
    }
  }
};

controller.scriptedValueByRules = function( rules, pid, attr, value ){

}

// Returns the value of a game attribute.
//
controller.scriptedValue = function( pid, attr, value ){
  assert( util.isInt(value) );

  var tags = controller.scriptTags;

  // global effects
  value = jsonScript.solve( model.rule_global, tags, attr, value );

  // map effects
  value = jsonScript.solve( model.rule_map, tags, attr, value );

  // co effects
  var co = model.co_data[pid].coA;
  var weather = true;
  if( co ){
    value = jsonScript.solve( co.d2d, tags, attr, value );

    // neutralized weather ?
    weather = ( jsonScript.solve( co.d2d, tags, "neutralizeWeather", 0 ) === 0 );

    // active power ?
    if( model.co_data[pid].level >= model.co_POWER_LEVEL.COP ){
      if(        model.co_data[pid].level === model.co_POWER_LEVEL.COP ){
        value = jsonScript.solve( co.cop.turn, tags, attr, value );
      } else if( model.co_data[pid].level === model.co_POWER_LEVEL.SCOP ){
        value = jsonScript.solve( co.scop.turn, tags, attr, value );
      }
    }
  }

  // weather effects
  var wth = model.weather_data;
  if( weather && wth ) value = jsonScript.solve( wth.rules, tags, attr, value );

  // check boundaries
  var bounds = controller.scriptBoundaries_[attr];
  if(      value < bounds[0] ) value = bounds[0];
  else if( value > bounds[1] ) value = bounds[1];

  // return calculated value
  return value;
};
