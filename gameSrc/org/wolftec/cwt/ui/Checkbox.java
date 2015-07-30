package org.wolftec.cwt.ui;

import org.stjs.javascript.dom.canvas.CanvasRenderingContext2D;

public class Checkbox extends Field {

  public boolean checked;

  public Checkbox(int x, int y, int w, int h, String text, int fsize, int style) {
    super(x, y, w, h, text, fsize, style, (button, state) -> {

      state.rendered = false;
      chkbox.checked = !button.checked;
    });
    checked = false;
  }

  @Override
  public void draw(CanvasRenderingContext2D ctx) {
    super.draw(ctx);

    ctx.fillStyle = "black";
    ctx.fillRect(this.x + 4, this.y + 4, this.width - 8, this.height - 8);

    ctx.fillStyle = checked ? "rgb(60,60,60)" : "white";
    ctx.fillRect(this.x + 5, this.y + 5, this.width - 10, this.height - 10);
  }
}
