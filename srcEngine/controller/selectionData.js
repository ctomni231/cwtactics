controller.SelectionData = function( range ){
  var len = range*2 + 1;
  this.data = [
    util.matrix( len,len,0 ), // DATA
    0,0                       // CENTERX, CENTERY
  ];
};

/**
 *
 * @param defaultData
 * @param cx
 * @param cy
 */
controller.SelectionData.prototype.cleanIt = function( defaultData, cx,cy ){
  var data = this.data[0];
  var e = data.length;
  for (var x = 0; x < e; x++) {
    for (var y = 0; y < e; y++) {
      data[x][y] = defaultData;
    }
  }

  // right bounds are not important
  this.data[1] = Math.max(0, cx - CWT_MAX_SELECTION_RANGE);
  this.data[2] = Math.max(0, cy - CWT_MAX_SELECTION_RANGE);
};

/**
 *
 * @param x
 * @param y
 * @param value
 */
controller.SelectionData.prototype.setPositionValue = function( x,y, value ){
  var data = this.data[0];
  var cy = this.data[1];
  var cx = this.data[2];
  x = x - cx;
  y = y - cy;
  var maxLen = data.length;

  if( x < 0 || y < 0 || x >= maxLen || y >= maxLen ){
    util.illegalPositionError();
  }
  else data[x][y] = value;
};

/**
 *
 * @param x
 * @param y
 */
controller.SelectionData.prototype.getPositionValue = function( x,y ){
  var data = this.data[0];
  var cy = this.data[1];
  var cx = this.data[2];
  x = x - cx;
  y = y - cy;
  var maxLen = data.length;

  if( x < 0 || y < 0 || x >= maxLen || y >= maxLen ){
    return -1;
  }
  else return data[x][y];
};

/**
 *
 */
controller.SelectionData.prototype.getCenterX = function(){
  return this.data[1];
};

/**
 *
 */
controller.SelectionData.prototype.getCenterY = function(){
  return this.data[1];
};

/**
 *
 */
controller.SelectionData.prototype.getDataMatrix = function( ){
  return this.data[0];
};