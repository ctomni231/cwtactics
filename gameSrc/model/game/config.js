/**
 * @class
 */
cwt.Config = my.Class({
  
  STATIC:{
    
    /**
     * Holds all registered configuration parameters.
     */
    registeredValues_:{},
    
    /**
     * Holds all registered configuration parameter names.
     */
    registeredNames_:[],
    
    /**
     * Registers a configuration parameter.
     */
    register_: function( name,config ){
      assert( !this.registeredValues_.hasOwnProperty(name) );
      this.registeredValues_[name] = config;
      this.registeredNames_.push(name);
    },

    resetAll: function(){
      for (var i = this.registeredNames_.length - 1; i >= 0; i--) {
        var key = this.registeredNames_[i];
        var cfg = this.registeredValues_[key];

        // reset value
        cfg.resetValue();
      };
    },

    create: function (name, min, max, defaultValue, step){
      new cwt.Config(name, min, max, defaultValue, step);
    },
    
    /**
     * Returns the actual configuration value of a given configuration
     * key.
     */
    getValue: function( name ){
      return this.registeredValues_[name].value;
    },
    
    /**
     * Returns the actual configuration object of a given configuration
     * key.
     */
    getConfig: function( name ){
      return this.registeredValues_[name];    
    }
  },
  
  constructor: function( name, min, max, defaultValue, step ){
    this.min = min;
    this.max = max;
    this.def = defaultValue;
    this.step = (step !== void 0)? step : 1;
    this.resetValue();
    
    // register parameter
    cwt.Config.register_(name,this);
  },

  /**
   * 
   */
  setValue: function( value ){
    
    // check bounds
    if( value < this.min ) value = this.min;
    if( value > this.max ) value = this.max;
    
    // check steps
    if( (value - this.min) % this.step !== 0 ){
      assert(false,"step criteria is broken");
    }  
  },
  
  /**
   * Resets the value of the parameter back to the default 
   * value.
   */
  resetValue: function(){
    this.value = this.def;
  }
  
});

// Different configuration parameters
cwt.Config.create("fogEnabled",0,1,1);
cwt.Config.create("daysOfPeace",0,50,0);
cwt.Config.create("weatherMinDays",1,5,1);
cwt.Config.create("weatherRandomDays",0,5,4);
cwt.Config.create("round_dayLimit",0,999,0);
cwt.Config.create("noUnitsLeftLoose",0,1,0);
cwt.Config.create("autoSupplyAtTurnStart",0,1,1);
cwt.Config.create("timer_turnTimeLimit",0,60,0);
cwt.Config.create("timer_gameTimeLimit",0,99999,0);
cwt.Config.create("unitLimit",0,MAX_UNITS_PER_PLAYER,0);
cwt.Config.create("captureLimit",0,MAX_PROPERTIES,0);
cwt.Config.create("co_getStarCost",5,50000,9000,5);
cwt.Config.create("co_getStarCostIncrease",0,50000,1800,5);
cwt.Config.create("co_getStarCostIncreaseSteps",0,50,10);
cwt.Config.create("co_enabledCoPower",0,1,1);