/**
 * 
 * @class
 */
cwt.CachedCanvas = my.Class( /** @lends cwt.CachedCanvas */ {

  constructor: function (frames, renderFn) {
    this.canvas = [];
    this.ctx = [];
    this.render = renderFn;
  },
  
  getFrame: function (frame) {
    if (DEBUG) assert(frame >= 0 && frame < this.canvas.length);
    return this.canvas[frame];
  },
  
  getContext: function (frame) {
    if (DEBUG) assert(frame >= 0 && frame < this.canvas.length);
    return this.canvas[frame];
  },
  
  update: function () {
    for( var i = 0, e = this.canvas.length; i<e; i++ ){
      this.render.call(this,i);
    }
  }

});

/*


var renderTileMap = function (layer) {
  var map = cwt.Map.data;
  
  var lx;
  var rx;
  var uy;
  var dy;
  for (var xi = ly, xe = ry; xi<=xe; xi++) {
    for (var yi = uy, ye = dy; yi<=ye; yi++) {
      var tile = map[xi][yi];
      
      if (tile.property) {
        cwt.Draw.drawTile(xi,yi,tile);
      } else {
          if (tile.visionClient === 0) {
              cwt.Draw.drawProperty(xi,yi,tile);
          } else {
              cwt.Draw.drawPropertyGray(xi,yi,tile.property);
          }
      }
    }
  }
};

var renderFogMap = function () {
  var map = cwt.Map.data;
  
  var lx;
  var rx;
  var uy;
  var dy;
  for (var xi = ly, xe = ry; xi<=xe; xi++) {
    for (var yi = uy, ye = dy; yi<=ye; yi++) {
      
    }
  }
};

var renderUnitMap = function () {
  var map = cwt.Map.data;
  
  var lx;
  var rx;
  var uy;
  var dy;
  for (var xi = ly, xe = ry; xi<=xe; xi++) {
    for (var yi = uy, ye = dy; yi<=ye; yi++) {
      
    }
  }
};


*/
