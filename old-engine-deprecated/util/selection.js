(function(){

  function setCenter( x, y, defValue ){
    var e = this.data.length;
    var cx = x;
    var cy = y;

    // reset data
    for( x = 0; x < e; x++ ) {
      for( y = 0; y < e; y++ ) {
        this.data[x][y] = defValue;
      }
    }

    // right bounds are not important
    this.centerX = Math.max( 0, cx - (e - 1) );
    this.centerY = Math.max( 0, cy - (e - 1) );
  }

  function getValueAt( x, y ){
    var data = this.data;
    var cy = this.centerX;
    var cx = this.centerY;
    var maxLen = data.length;

    x = x - cx;
    y = y - cy;
    if( x < 0 || y < 0 || x >= maxLen || y >= maxLen ) return -1;
    else return data[x][y];
  }

  function setValueAt( x, y, value ){
    var data = this.data;
    var cy = this.centerX;
    var cx = this.centerY;
    var maxLen = data.length;

    x = x - cx;
    y = y - cy;
    if( x < 0 || y < 0 || x >= maxLen || y >= maxLen ) {
      model.criticalError( error.ILLEGAL_PARAMETERS, error.SELECTION_DATA_OUT_OF_BOUNDS );
    }
    else data[x][y] = value;
  }

  function grab( otherSelection ){
    if( this.data.length !== otherSelection.data.length ) throw Error("illegal grab selection");
    this.centerX = otherSelection.centerX;
    this.centerY = otherSelection.centerY;

    var e = this.data.length;
    for( x = 0; x < e; x++ ) {
      for( y = 0; y < e; y++ ) {
        this.data[x][y] = otherSelection.data[x][y];
      }
    }
  }

  function nextValidPosition( x, y, minValue, walkLeft, cb, arg  ){
    var data = this.data;
    var cy = this.centerX;
    var cx = this.centerY;
    var maxLen = data.length;

    x = x - cx;
    y = y - cy;

    // OUT OF BOUNDS ?
    if( x < 0 || y < 0 || x >= maxLen || y >= maxLen ) {

      // START BOTTOM RIGHT
      if( walkLeft ) {
        x = maxLen - 1;
        y = maxLen - 1;
      }
      // START TOP LEFT
      else {
        x = 0;
        y = 0;
      }
    }

    // WALK TO THE NEXT TARGET
    var mod = (walkLeft) ? -1 : +1;
    y += mod;
    for( ; (walkLeft) ? x >= 0 : x < maxLen; x += mod ) {
      for( ; (walkLeft) ? y >= 0 : y < maxLen; y += mod ) {

        // VALID POSITION
        if( data[x][y] >= minValue ) {
          cb( x, y, arg );
          return;
        }
      }
      y = (walkLeft) ? maxLen - 1 : 0;
    }
  }

  function nextRandomPosition( cb, arg, minValue ){
    if( minValue === void 0 ) minValue = 0;

    var e = this.data.length;
    var n = parseInt( Math.random()*e , 10 );
    var x,y;
    for( x = 0; x < e; x++ ) {
      for( y = 0; y < e; y++ ) {
        if( this.data[x][y] >= minValue ){
          n--;
          if( n < 0 ){
            cb(x,y,arg);
            return true;
          }
        }
      }
    }

    return false;
  }

  util.selectionMap = function( size ){
    var obj = {};

    // meta data
    obj.centerX = 0;
    obj.centerY = 0;
    obj.data = util.matrix( size, size, INACTIVE_ID );

    // api
    obj.nextValidPosition  = nextValidPosition;
    obj.nextRandomPosition = nextRandomPosition;
    obj.setValueAt = setValueAt;
    obj.getValueAt = getValueAt;
    obj.setCenter  = setCenter;
    obj.grab       = grab;

    return obj;
  };

})();
