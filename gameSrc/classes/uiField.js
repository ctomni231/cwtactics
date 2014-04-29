/**
 *
 * @class
 */
cwt.UIField = my.Class( /** @lends cwt.UIField.prototype */ {

  constructor: function (x, y, w, h, text, fsize, actionFn) {
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
    this.fsize = fsize;
    this.text = (text)? cwt.Localization.forKey(text) : text;
    this.key = text;
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

    ctx.fillStyle = "blue";
    ctx.fillRect(this.x + 1, this.y + 1, this.width - 2, this.height - 2);

    ctx.fillStyle = (this.inFocus) ? "black" : "white";
    ctx.fillRect(this.x + 3, this.y + 3, this.width - 6, this.height - 6);

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