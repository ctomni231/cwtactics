cwt.LoadingBar = my.Class({

  constructor: function (x, y, w, h) {
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
    this.process = 0;
  },

  erase: function (ctx) {
    ctx.clearRect(this.x,this.y,this.width,this.height);
  },

  draw: function (ctx) {
    ctx.fillStyle = "white";
    ctx.fillRect(this.x,this.y,this.width,this.height);

    ctx.fillStyle = "blue";
    ctx.fillRect(this.x,this.y,(parseInt(this.width*this.process/100,10)),this.height);
  },

  setPercentage: function (p) {
    if (cwt.DEBUG) {
      cwt.assert(p >= 0 && p <= 100);
    }

    this.process = p;
  }
});