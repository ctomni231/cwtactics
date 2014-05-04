/**
 *
 * @class
 */
cwt.UICheckboxField = my.Class( null, cwt.UIField, /** @lends cwt.UICheckboxField.prototype */ {

  constructor: function (x, y, w, h, text, fsize, style) {
    cwt.UIField.call(this,x, y, w, h, text, fsize, style, function (button,state) {
      state.rendered = false;
      button.checked = !button.checked;
    });
    this.text = "";
    this.checked = false;
  },

  /**
   *
   * @param {CanvasRenderingContext2D} ctx
   */
  draw: function (ctx) {
    cwt.UIField.prototype.draw.call(this,ctx);

    ctx.fillStyle = "black";
    ctx.fillRect(this.x+4,this.y+4,this.width-8,this.height-8);

    ctx.fillStyle = (this.checked)? "rgb(60,60,60)" : "white";
    ctx.fillRect(this.x+5,this.y+5,this.width-10,this.height-10);
  }
});