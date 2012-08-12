/**
 * Properties controller.
 *
 * @module
 * @namespace
 */
cwt.properties = {

  init: function( annotated ){
    annotated.userAction("capture", this._captureCond );
    annotated.transaction("capture");
  },

  /** @private */
  _captureCond: function( actions, x, y, prop, unit, selected ){

    if( selected !== null && prop !== null &&
      cwt.db.unit( selected.type ).captures > 0 &&
      cwt.model.player(prop.owner).team !== cwt.model.player(selected.owner).team ){

      actions.push({
        k:"properties.capture",
        a:[ x, y, unit.x, unit.y ]
      });
    }
  },

  /**
   * Captures a property by a given unit.
   *
   * @param x x position
   * @param y y position
   * @throws error if the data is not legal
   */
  capture: function( x, y, sx, sy ){
    var unit = cwt.model._unitPosMap[sx][sy];
    var unitSh = cwt.db.unit( unit.type );
    var prop = cwt.model.propertyByPos( x, y );

    prop.capturePoints -= unitSh.captures;
    if( prop.capturePoints <= 0 ){
      if( cwt.DEBUG ) cwt.log.info( "property at ({0},{1}) captured", x, y );

      prop.capturePoints = 20;
      prop.owner = unit.owner;

      // TODO: hq
    }
  }
};