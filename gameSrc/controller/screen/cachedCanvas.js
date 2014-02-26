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
