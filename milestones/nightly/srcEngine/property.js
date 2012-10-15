cwt.defineLayer( CWT_LAYER_MODEL, function( model, util ){

  var maxW = CWT_MAX_MAP_WIDTH;
  var maxH = CWT_MAX_MAP_HEIGHT;

  /**
   *
   */
  model.properties = util.list( CWT_MAX_PROPERTIES,
    function(){
      return {
        capturePoints: 20,
        owner: -1
      }
    });

  /**
   *
   */
  model.propertyPosMap = util.matrix( maxW, maxH, null );
});

// ###########################################################################
// ###########################################################################

cwt.defineLayer( CWT_LAYER_DATA_ACCESS, function( data, model, sheets, util ){

  /**
   * Returns a property by its id.
   *
   * @param id
   */
  data.propertyById = function(id){
    if( id < 0 || model.properties.length <= id ){
      util.logError("invalid property id",id);
    }

    var o = model.properties[id];
    return ( o.owner === CWT_INACTIVE_ID )? null : o;
  };

  /**
   * Returns a property by its position.
   *
   * @param id
   */
  data.propertyByPos = function( x, y ){
    return model.propertyPosMap[x][y];
  };

  /**
   *
   * @param x
   * @param y
   */
  data.tileIsProperty = function( x,y ){
    var prop = data.propertyByPos(x,y);
    if( prop === null ) return false;
    else{
      return data.extractPropertyId( prop );
    }
  };

  /**
   * Extracts the identical number from a property object.
   *
   * @param unit
   */
  data.extractPropertyId = function( property ){
    if( property === null ){
      util.logError("property argument cannot be null");
    }

    var props = model.properties;
    for( var i=0,e=props.length; i<e; i++ ){
      if( props[i] === property ) return i;
    }

    // illegal unit object ?!
    util.logError("cannot find property",property );
  };

  /**
   * Captures a property by a given unit.
   *
   * @param x x position
   * @param y y position
   * @param id identical number for the capturing unit object
   */
  data.captureProperty = function( x, y, id ){
    var unit   = data.unitById(id);
    var unitSh = data.unitSheet( unit.type );
    var prop   = data.propertyByPos( x, y );

    prop.capturePoints -= unitSh.captures;
    if( prop.capturePoints <= 0 ){
      if( util.DEBUG ){
        util.logInfo( "property at (",x,",",y,") captured");
      }

      // if the property is a hq then the owner looses the game
      if( prop.type === 'HQ' ){
        var oldPlayer = data.player( prop.owner );

        var units = cwt.selectOwnUnits( prop.owner );
        for( var i = 0, e = units.length; i<e; i++ ){
          units[i].team = -1;
          model.unitPosMap[ units[i].x ][ units[i].y ] = null;
        }

        var props = cwt.selectOwnProperties( prop.owner );
        for( var i = 0, e = props.length; i<e; i++ ){
          props[i].owner = -1;
        }

        oldPlayer.team = -1;

        // check win/loose
        if( data.annithilationWinner() ){
          if( util.DEBUG ){
            util.logInfo("the game ends because no opposite players exists");
          }
        }
      }

      // set new meta data for property
      prop.capturePoints = 20;
      prop.owner = unit.owner;
    }
  };
});

// ###########################################################################
// ###########################################################################

cwt.defineLayer( CWT_LAYER_ACTIONS, function( action, data ){

  action.captureProperty = {
    condition: function( x, y, rStP, rStU , selected, property, unit ){
      return (
        rStP === data.RELATIONSHIP_ENEMY &&
          rStU === data.RELATIONSHIP_NONE &&

          data.unitSheet( selected.type ).captures > 0
        );
    },

    action: function( x, y, suid ){
      data.captureProperty( x,y,suid );
      action.wait.action( suid );
    }
  }
});