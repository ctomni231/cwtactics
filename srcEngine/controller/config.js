// Holds all configurable var boundaries
//
controller.configBoundaries_ = {};

//
//
controller.configNames_ = [];

// Defines a configurable variable to control the
// game rules.
//
controller.defineGameConfig = function( name, min, max, def, step ){
  assert( name && !controller.configBoundaries_.hasOwnProperty(name) );
  assert( max >= min && def >= min && def <= max );

  controller.configNames_.push(name);
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
  // model.cfg_configuration = {};

  var keys = Object.keys(boundaries);
  for( var i=0,e=keys.length; i<e; i++ ){
    var key = keys[i];

    var value;
    if( cfg && cfg.hasOwnProperty(key) ){
      value = cfg[key];

      // CHECK MIN MAX
      if( value < boundaries[key].min ) assert(false,key,"is greater than it's minimum value");
      if( value > boundaries[key].max ) assert(false,key,"is greater than it's maximum value");

      // CHECK STEP
      if( boundaries[key].hasOwnProperty("step") ){
        if( value % boundaries[key].step !== 0 ) assert(false,key,"is does not fits one of it's possible values");
      }
    }
    else value = boundaries[key].defaultValue;

    model.cfg_configuration[key] = value;
  }
};

// Returns the value of a game round configuration property.
//
controller.configValue = function( attr ){
  return model.cfg_configuration[attr];
};
