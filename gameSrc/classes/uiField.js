/**
 *
 * @class
 */
cwt.UIField = my.Class( /** @lends cwt.UIField.prototype */ {

  STATIC: {
    STYLE_NORMAL:0,
    STYLE_S:1,
    STYLE_N:2,
    STYLE_W:3,
    STYLE_E:4,
    STYLE_NE:5,
    STYLE_NW:6,
    STYLE_ES:7,
    STYLE_SW:8,
    STYLE_ESW:9,
    STYLE_NEW:10,
    STYLE_NSW:11,
    STYLE_NES:12
  },

  constructor: function (x, y, w, h, text, fsize, style, actionFn) {
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
    this.fsize = fsize;
    this.text = (text)? cwt.Localization.forKey(text) : text;
    this.key = text;
    this.style = style;
    this.inFocus = false;
    this.action = actionFn;
  },

  /**
   *
   * @param ctx
   * @param text
   * @param maxWidth
   * @return {*}
   */
  fragmentText: function (ctx, text, maxWidth) {
    var words = text.split(' '),
      lines = [],
      line = "";

    if (ctx.measureText(text).width < maxWidth) {
      return [text];
    }

    while (words.length > 0) {
      while (ctx.measureText(words[0]).width >= maxWidth) {
        var tmp = words[0];
        words[0] = tmp.slice(0, -1);
        if (words.length > 1) {
          words[1] = tmp.slice(-1) + words[1];
        } else {
          words.push(tmp.slice(-1));
        }
      }
      if (ctx.measureText(line + words[0]).width < maxWidth) {
        line += words.shift() + " ";
      } else {
        lines.push(line);
        line = "";
      }
      if (words.length === 0) {
        lines.push(line);
      }
    }
    return lines;
  },

  /**
   *
   * @param x
   * @param y
   * @return {boolean}
   */
  positionInButton: function (x, y) {
    return (x >= this.x && x < this.x + this.width && y >= this.y && y < this.y + this.height);
  },

  /**
   *
   * @param {CanvasRenderingContext2D} ctx
   */
  draw: function (ctx) {

    ctx.fillStyle = (this.inFocus) ? "black" : "white";
    ctx.fillRect(this.x, this.y, this.width, this.height);

    // draw borders
    ctx.fillStyle = "blue";
    switch (this.style) {

      case cwt.UIField.STYLE_NORMAL :
        ctx.fillRect(this.x + 1, this.y + 1, this.width - 2 , this.height - 2);
        ctx.fillStyle = (this.inFocus) ? "black" : "white";
        ctx.fillRect(this.x + 3, this.y + 3, this.width - 6 , this.height - 6);
        break;

      case cwt.UIField.STYLE_N :
        ctx.fillRect(this.x, this.y + 1, this.width , 2);
        break;

      case cwt.UIField.STYLE_E :
        ctx.fillRect(this.x + this.width - 3, this.y, 2 , this.height);
        break;

      case cwt.UIField.STYLE_S :
        ctx.fillRect(this.x, this.y + this.height - 3, this.width , 2);
        break;

      case cwt.UIField.STYLE_W :
        ctx.fillRect(this.x + 1, this.y , 2 , this.height);
        break;

      case cwt.UIField.STYLE_NE :
        ctx.fillRect(this.x, this.y + 1, this.width - 1 , 2);
        ctx.fillRect(this.x + this.width - 3, this.y + 1, 2 , this.height - 1);
        break;

      case cwt.UIField.STYLE_NW :
        ctx.fillRect(this.x + 1, this.y + 1, this.width , 2);
        ctx.fillRect(this.x + 1, this.y + 1, 2 , this.height - 1);
        break;

      case cwt.UIField.STYLE_ES :
        ctx.fillRect(this.x + this.width - 3, this.y, 2 , this.height - 1);
        ctx.fillRect(this.x, this.y + this.height - 3, this.width - 1, 2);
        break;

      case cwt.UIField.STYLE_SW :
        ctx.fillRect(this.x + 1, this.y + this.height - 3, this.width - 1 , 2);
        ctx.fillRect(this.x + 1, this.y , 2 , this.height - 1);
        break;

      case cwt.UIField.STYLE_ESW :
        ctx.fillRect(this.x + this.width - 3, this.y, 2 , this.height - 1);
        ctx.fillRect(this.x + 1, this.y + this.height - 3, this.width - 2 , 2);
        ctx.fillRect(this.x + 1, this.y , 2 , this.height - 1);
        break;

      case cwt.UIField.STYLE_NEW :
        ctx.fillRect(this.x + 1, this.y + 1, this.width - 2, 2);
        ctx.fillRect(this.x + this.width - 3, this.y + 1, 2 , this.height - 1);
        ctx.fillRect(this.x + 1, this.y + 1 , 2 , this.height - 1);
        break;

      case cwt.UIField.STYLE_NSW :
        ctx.fillRect(this.x + 1, this.y + 1, this.width - 1 , 2);
        ctx.fillRect(this.x + 1, this.y + this.height - 3, this.width - 1 , 2);
        ctx.fillRect(this.x + 1, this.y + 1, 2 , this.height - 2);
        break;

      case cwt.UIField.STYLE_NES :
        ctx.fillRect(this.x, this.y + 1, this.width - 1, 2);
        ctx.fillRect(this.x + this.width - 3, this.y + 1, 2 , this.height - 2);
        ctx.fillRect(this.x, this.y + this.height - 3, this.width - 1, 2);
        break;
    }

    ctx.fillStyle = (this.inFocus) ? "white" : "black";
    ctx.font = this.fsize + "pt Arial";

    var tw = ctx.measureText(this.text);
    if (tw.width >= this.width - 20) {
      var lines = this.fragmentText(ctx, this.text, this.width - 20);
      for (var i = 0, e = lines.length; i < e; i++) {
        tw = ctx.measureText(lines[i]);
        ctx.fillText(
          lines[i],
          this.x + (this.width / 2) - (tw.width / 2),
          this.y + this.fsize + ((i + 1) * (this.fsize + 8)));
      }
    } else {
      ctx.fillText(
        this.text,
        this.x + (this.width / 2) - (tw.width / 2),
        this.y + (this.height / 2) + this.fsize / 2);
    }
  }
});