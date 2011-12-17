/**
 * This module cointains all necessary model classes for CustomWars.
 * 
 * @author BlackCat
 * @since 4.12.2011
 */
define(["json!cwt/config"], function( cfg ){
  
  var _MapObject = my.Class({
    
    __reset__: function( type )
    {
      this.type = type;
    }
  });
  
  /**
   * Player class.
   */
  var _Player = my.Class(_MapObject,{
    
    __reset__: function()
    {
      this.gold = 0;
      
      // reset units
      var array = this.units;
      for( var i=0,e=array.length; i<e; i++ )
        array[i].__index__ = 0;
    }
  });
  
  /**
   * Property class.
   */
  var _Property = my.Class(_MapObject,{
    
    constructor: function()
    {
      
    },
    
    __reset__: function( type )
    {
      this.Super.__reset__(type);
      this.capturePoints = cfg.MAX_CAPTURE_POINTS;
      this.owner = 0;
    }
  });
  
  /**
   * Unit class.
   */
  var _Unit = my.Class(_MapObject,{
    
    constructor: function()
    {
      
    },
    
    __reset__: function( type )
    {
      this.Super.__reset__(type);
      this.__index__ = -1;
      
      this.hp     = cfg.MAX_HP;
      this.ammo   = 0;
      this.fuel   = 0;
      this.acted  = false;
      this.exp    = 0;
      this.rank   = 0;
    }

  });
  
  return {
    Unit     : _Unit,
    Property : _Property
  }
  
})