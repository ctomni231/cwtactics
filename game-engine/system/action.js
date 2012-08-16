/**
 * Actions contains only atomic functions. All actions will all time shared with other clients
 * if the game runs in a network context.
 *
 * @namespace
 */
cwt.action = {

  /**
   * Holds the actions.
   *
   * @private
   */
  _actions: {},

  /**
   * Registers a service function from a module as action.
   */
  registerAction: function( modName, actionName, actor ){
    var key = modName+"."+actionName;

    this._actions[key] = {
      actFn: actionName,
      that: cwt[modName],
      actor: actor
    };
  },

  /**
   * Pushes an action object to the cwt.messageBuffer.
   */
  doAction: function( actObj ){
    var act = this._actions[ actObj.k ];
    act.that[ act.actFn ].apply( act.that, actObj.a );
  },

  /**
   * Returns all available actions of a selected unit object at a given position x and y.
   *
   * @param x
   * @param y
   * @param uid selected unit id
   */
  unitActions: function( uid, x, y ){
    if( uid === undefined ) cwt.log.error("illegal argument uid");

    return this._actionList( x, y, uid );
  },

  /**
   * Returns all available actions by a 'click' on a given position x and y.
   *
   * @param x
   * @param y
   */
  mapActions: function( x, y ){
    if( x === undefined || y === undefined ) cwt.log.error("illegal arguments x/y");

    return this._actionList( x, y );
  },

  /**
   * @private
   */
  _actionList: function( x, y, selected ){
    var actions = [];
    var unitSelected = undefined;
    var propId = cwt.model.propertyIdByPos( x, y );
    var unitId = cwt.model.unitIdByPos( x, y );
    var prop = ( propId !== -1 )? cwt.model.property( propId ) : null;
    var unit = ( unitId !== -1 )? cwt.model.unit( unitId ) : null;
    var act;
    var keys = Object.keys( this._actions );

    // unit selected ?
    if( selected !== undefined ){
      unitSelected = cwt.model.unit(selected);

      // position is given ?
      if( x === undefined || y === undefined ){

        x = unitSelected.x;
        y = unitSelected.y;
      }
    }

    for( var i=0,e=keys.length; i<e; i++){
      act = this._actions[ keys[i] ];
      act.actor( actions, x, y, prop, unit, ( unitSelected === undefined )? null : unitSelected );
    }

    return actions;
  }
};