/**
 * This module cointains all necessary model classes for CustomWars.
 * 
 * @author BlackCat
 * @since 4.12.2011
 */
define(["cwt/properties"], function( props ){
  
  var _MapObject = my.Class({
    
    __reset__: function( type )
    {
      this.type = type;
    }
  });
  
  
  var _Property = my.Class(_MapObject,{
    
    constructor: function()
    {
      
    },
    
    __reset__: function( type )
    {
      this._super._reset(type);
      this.capturePoints = 20;
      this.owner = 0;
    }
  });
  
  
  var _Unit = my.Class(_MapObject,{
    
    constructor: function()
    {
      
    },
    
    __reset__: function( type )
    {
      this._super._reset(type);
      this.hp = 99;
      this.ammo = 0;
      this.fuel = 0;
      this.acted = false;
      this.exp = 0;
      this.rank = 0;
    }

  });
  
  return {
    Unit : _Unit,
    Property : _Property
  }
  
})