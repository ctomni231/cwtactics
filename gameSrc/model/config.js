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
    
    /**
     * 
     */
    getValue: function( name ){
      return this.registeredValues_[name].value;
    },
    
    /**
     * 
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
    this.value = defaultValue;  
  }
  
});

// Different configuration parameters
new cwt.Config("fogEnabled",0,1,1);
new cwt.Config("daysOfPeace",0,50,0);
new cwt.Config("weatherMinDays",1,5,1);
new cwt.Config("weatherRandomDays",0,5,4);
new cwt.Config("round_dayLimit",0,999,0);
new cwt.Config("noUnitsLeftLoose",0,1,0);
new cwt.Config("autoSupplyAtTurnStart",0,1,1);
new cwt.Config("timer_turnTimeLimit",0,60,0);
new cwt.Config("timer_gameTimeLimit",0,99999,0);
new cwt.Config("unitLimit",0,MAX_UNITS_PER_PLAYER,0);
new cwt.Config("captureLimit",0,MAX_PROPERTIES,0);
new cwt.Config("co_getStarCost",5,50000,9000,5);
new cwt.Config("co_getStarCostIncrease",0,50000,1800,5);
new cwt.Config("co_getStarCostIncreaseSteps",0,50,10);
new cwt.Config("co_enabledCoPower",0,1,1);