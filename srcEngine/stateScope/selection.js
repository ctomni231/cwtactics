/** @namespace */
controller.stateMachine.data.selection = {
  
  /**
   * X coordinate of the selection data.
   */
  centerX: 0,
  
  /**
   * Y coordinate of the selection data.
   */
  centerY: 0,
  
  /**
   * Data matrix of the selection data.
   */
  data: util.matrix( 
    CWT_MAX_SELECTION_RANGE * 4 + 1, 
    CWT_MAX_SELECTION_RANGE * 4 + 1, 
    0 
  ),
  
  /**
   * Sets the value of a position x,y in the selectiond data.
   * 
   * @param {Number} x x coordinate
   * @param {Number} y y coordinate
   * @param {Number} defValue value that will be set into every cell of the matrix
   */
  setCenter: function(x, y, defValue) {
    var data = this.data;
    var e = data.length;
    var cx = x;
    var cy = y;
    for (var x = 0; x < e; x++) {
      for (var y = 0; y < e; y++) {
        data[x][y] = defValue;
      }
    }
    
    // right bounds are not important
    this.centerX = Math.max(0, cx - CWT_MAX_SELECTION_RANGE * 2);
    this.centerY = Math.max(0, cy - CWT_MAX_SELECTION_RANGE * 2);
  },
  
  /**
   * Returns the value of a position x,y in the selectiond data.
   * 
   * @param {Number} x x coordinate
   * @param {Number} y y coordinate
   */
  getValueAt: function(x, y) {
    var data = this.data;
    var cy = this.centerX;
    var cx = this.centerY;
    x = x - cx;
    y = y - cy;
    var maxLen = data.length;
    
    if (x < 0 || y < 0 || x >= maxLen || y >= maxLen) {
      return -1;
    }
    else
      return data[x][y];
  },
  
  /**
   * Sets the value of a position x,y in the selectiond data.
   * 
   * @param {Number} x x coordinate
   * @param {Number} y y coordinate
   * @param {Number} value value that will be set
   */
  setValueAt: function(x, y, value) {
    var data = this.data;
    var cy = this.centerX;
    var cx = this.centerY;
    x = x - cx;
    y = y - cy;
    var maxLen = data.length;
    
    if (x < 0 || y < 0 || x >= maxLen || y >= maxLen) {
      util.raiseError();
    }
    else
      data[x][y] = value;
  },
  
  /**
   * Prepares the selection for a the saved action key and returns the correct selection state key.
   */
  prepare: function() {
    var target = controller.stateMachine.data.target;
    var x = target.x;
    var y = target.y;
    
    this.setCenter(x, y, -1);
    
    var actObj = controller.stateMachine.data.action.object;
    actObj.prepareTargets(controller.stateMachine.data);
    
    return (actObj.targetSelectionType === "A") ? "ACTION_SELECT_TARGET_A" : "ACTION_SELECT_TARGET_B";
  },

  /**
   *
   */
  nextValidPosition: function( x,y, minValue, walkLeft, cb ){
    var data = this.data;
    var cy = this.centerX;
    var cx = this.centerY;
    x = x - cx;
    y = y - cy;
    var maxLen = data.length;
    
    // OUT OF BOUNDS ?
    if (x < 0 || y < 0 || x >= maxLen || y >= maxLen) {
      
      // START BOTTOM RIGHT
      if( walkLeft ){
        x = maxLen-1;
        y = maxLen-1;
      }
      // START TOP LEFT
      else{
        x = 0;
        y = 0;
      }
    }
    
    // WALK TO THE NEXT TARGET
    var mod = (walkLeft)? -1 : +1;
    y += mod;
    for( ; (walkLeft)? x>=0 : x<maxLen ; x += mod ){
      for( ; (walkLeft)? y>=0 : y<maxLen ; y += mod ){
        
        // VALID POSITION
        if( data[x][y] >= minValue ){
        
          if( DEBUG ) util.log("found the next valid position at",x,",",y);
          cb(x,y);
          return;
        }
      }
      y = ( walkLeft )? maxLen-1 : 0;
    }
    
    if( DEBUG ) util.log("could not find the next valid position");
  }
};