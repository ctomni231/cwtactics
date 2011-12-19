define(["cwt/model/map","cwt/sys/event"],function(map,event){
	
	var _properties = {};
	
	var API = {
			
	  /**
	   * Returns the amount of properties of a player.
	   * 
	   * @param player
	   * @returns {Number}
	   */
	  numOfProperties: function( player )
	  {
		  var res=0;
		  
		  for( property in _properties )
		  {
			if( _properties.hasOwnProperty(property) && 
				_properties[property].owner === player  )
				res++;
		  }  
		  
		  return res;
	  },

	  /**
	   * Captures a building.
	   * 
	   * @param unit
	   * @param property
	   */
    captureBuilding: function( unit, property )
    {
      if( !(map.getTile(unit)===map.getTile(property)) )
      {
        var capt = unit.type.captures;
      capt = event.invoke("unitCaptures",unit,property,capt);

      event.invoke("propertyCaptured",unit,property);

        if( capt ) property.capturePoints -= capt;
        //TODO error

        if( property.capturePoints < 0 )
        {
          property.capturePoints = property.type.capturePoints;


          event.invoke("propertyCaptured",unit,property);
          
          // is HQ
          if( property.ID == "HQ" )
          {
            // player loosing game
          }
          
          //TODO works?
          property.owner = unit.owner;
        }
      }
      //TODO error
    },

    /**
     * Returns the property of a given index or position.
     * 
     * @param index index of the position or x coordinate
     * @param y y coordinate (if index is an index, then y must be undefined)
     * @returns property object, if no one exists an error will be thrown
     */
    getPropertyAt: function( index, y )
    {
      if( y ) index = map.toIndex(index, y);
      var res = _properties[index];
      if( res ) return res;

      return null;
    },

    /**
     * Is a given tile ID a property?
     * 
     * @param tileID
     * @returns {Boolean}
     */
	  isProperty: function( tileID )
	  {
		  return typeof _properties[tileID] !== 'undefined'; 
	  }
	};
	
	return API;
});