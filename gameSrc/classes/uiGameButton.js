cwt.uiGameButton = my.Class({

  constructor: function (x, y, w, h, text, fsize) {
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
    this.fsize = fsize;

    this.text = cwt.Localization.forKey(text);
    this.key = text;

    this.inFocus = false;
  },

  /**
   *
   * @param x
   * @param y
   * @return {boolean}
   */
  positionInButton: function (x, y) {
    return (x >= this.x && x < this.x+this.width && y >= this.y && y < this.y+this.height);
  },

  /**
   *
   * @param {CanvasRenderingContext2D} ctx
   */
  draw: function (ctx) {

    ctx.fillStyle = (this.inFocus)? "black" : "white";
    ctx.fillRect(this.x,this.y,this.width,this.height);

    ctx.fillStyle = "blue";
    ctx.fillRect(this.x+1,this.y+1,this.width-2,this.height-2);

    ctx.fillStyle = (this.inFocus)? "black" : "white";
    ctx.fillRect(this.x+3,this.y+3,this.width-6,this.height-6);

    ctx.fillStyle = (this.inFocus)? "white" : "black";
    ctx.font = this.fsize+"pt Arial";
    var tw = ctx.measureText(this.text);
    ctx.fillText(this.text,this.x + (this.width/2) - (tw.width/2),this.y + (this.height/2) + this.fsize/2);
  }
});