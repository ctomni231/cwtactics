/**
 * Holds the actions.
 *
 * @private
 */
cwt._actions = {};

/**
 * Registers a service function from a module as action.
 */
cwt.registerUserAction = cwt.userAction = function( actionName, actor ){
  cwt._actions[actionName] = actor;
};

/**
 * Pushes an action object to the cwt.messageBuffer.
 */
cwt.doAction = function( actObj ){
  // var act = this._actions[ actObj.k ];
  if( !cwt._actions.hasOwnProperty( actObj.k ) ){
    cwt.error("{0} is not registered as action",actObj.k);
  }
  var act = cwt[ actObj.k ];
  cwt[ actObj.k ].apply( cwt, actObj.a );
};

/**
 * Returns all available actions of a selected unit object at a given position x and y.
 *
 * @param x
 * @param y
 * @param uid selected unit id
 */
cwt.unitActions = function( uid, x, y ){
  if( uid === undefined ){
    cwt.error("illegal uid {0}",uid);
  }

  return cwt._generateActionList( x, y, uid );
};

/**
 * Returns all available actions by a 'click' on a given position x and y.
 *
 * @param x
 * @param y
 */
cwt.mapActions = function( x, y ){
  if( x === undefined || y === undefined ){
    cwt.error("illegal position ({0},{1})",x,y);
  }

  return cwt._generateActionList( x, y );
};

/**
 * @private
 */
cwt._generateActionList = function( x, y, selected ){
  var actions = [];
  var unitSelected = undefined;
  var prop = cwt.propertyByPos( x, y );
  var unit = cwt.unitByPos( x, y );
  var propId = ( prop !== null )? cwt.extractPropertyId( prop ) : null;
  var unitId = ( unit !== null )? cwt.extractUnitId( unit ) : null;
  var act;
  var keys = Object.keys( cwt._actions );

  // unit selected ?
  if( selected !== undefined ){
    unitSelected = cwt.unitById(selected);

    // position is given ?
    if( x === undefined || y === undefined ){

      x = unitSelected.x;
      y = unitSelected.y;
    }
  }

  for( var i=0,e=keys.length; i<e; i++){
    act = cwt._actions[ keys[i] ];
    act( actions, x, y, prop, unit, ( unitSelected === undefined )? null : unitSelected );
  }

  return actions;
};