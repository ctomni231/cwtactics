cwt.onInit( "properties", function(){
  cwt.userAction("capture",
    function( actions, x, y, prop, unit, selected ){

      if( selected !== null && prop !== null &&
        cwt.unitSheet( selected.type ).captures > 0 &&
        cwt.player(prop.owner).team !== cwt.player(selected.owner).team ){

        actions.push({
          k: "captureProperty",
          a: [ x, y, cwt.extractUnitId( selected ) ]
        });
      }
    });

  cwt.transaction("captureProperty");
});

/**
 * Captures a property by a given unit.
 *
 * @param x x position
 * @param y y position
 * @throws error if the data is not legal
 */
cwt.captureProperty = function( x, y, id ){
  var unit   = cwt.unitById(id);
  var unitSh = cwt.unitSheet( unit.type );
  var prop   = cwt.propertyByPos( x, y );

  prop.capturePoints -= unitSh.captures;
  if( prop.capturePoints <= 0 ){
    if( cwt.DEBUG ) cwt.info( "property at ({0},{1}) captured", x, y );

    // if the property is a hq then the owner looses the game
    if( prop.type === 'HQ' ){
      var oldPlayer = cwt.player(prop.owner);

      var units = cwt.units( cwt.selectors.own, prop.owner );
      for( var i = 0, e = units.length; i<e; i++ ){
        units[i].team = -1;
        cwt._unitPosMap[ units[i].x ][ units[i].y ] = null;
      }

      var props = cwt.properties( cwt.selectors.own, prop.owner );
      for( var i = 0, e = props.length; i<e; i++ ){
        props[i].owner = -1;
      }

      oldPlayer.team = -1;
    }

    // set new meta data for property
    prop.capturePoints = 20;
    prop.owner = unit.owner;
  }
};