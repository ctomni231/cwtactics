//
// @type {null|HTMLCanvasElement}
// @private
//
cwt.MapRenderer.tmpCanv_ = null;

//
// Returns a temporary canvas (singleton)
//
// @return {HTMLCanvasElement}
//
cwt.MapRenderer.getTempCanvas = function () {
  if (!this.tmpCanv_) {
    this.tmpCanv_ = document.createElement("canvas");
    this.tmpCanv_.width = cwt.Screen.width;
    this.tmpCanv_.height = cwt.Screen.height;
  }

  return this.tmpCanv_;
};