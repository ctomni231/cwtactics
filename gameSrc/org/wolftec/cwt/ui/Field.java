package org.wolftec.cwt.ui;

import org.stjs.javascript.dom.canvas.CanvasRenderingContext2D;
import org.stjs.javascript.functions.Callback0;
import org.wolftec.cwt.system.Nullable;

public class Field {

  public static final int STYLE_NONE   = -1;
  public static final int STYLE_NORMAL = 0;
  public static final int STYLE_S      = 1;
  public static final int STYLE_N      = 2;
  public static final int STYLE_W      = 3;
  public static final int STYLE_E      = 4;
  public static final int STYLE_NE     = 5;
  public static final int STYLE_NW     = 6;
  public static final int STYLE_ES     = 7;
  public static final int STYLE_SW     = 8;
  public static final int STYLE_EW     = 13;
  public static final int STYLE_NS     = 14;
  public static final int STYLE_ESW    = 9;
  public static final int STYLE_NEW    = 10;
  public static final int STYLE_NSW    = 11;
  public static final int STYLE_NES    = 12;

  public int              x;
  public int              y;
  public int              width;
  public int              height;
  public int              fsize;
  public int              style;
  public boolean          inFocus;
  public Callback0        action;
  public boolean          inactive;
  public String           key;
  public String           text;

  public Field(int x, int y, int w, int h, String text, int fsize, int style, Callback0 actionFn) {
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
    this.fsize = fsize;
    this.style = style;
    this.inFocus = false;
    this.action = actionFn;
    this.inactive = false;

    this.key = text;
    this.text = text; // TODO (text) ? i18n.forKey(text) : text;
    // if (text.search(/\n/) !== -1) {
    // text = this.text.split("\n");
    // }
  }

  public boolean positionInButton(int x, int y) {
    return (x >= this.x && x < this.x + this.width && y >= this.y && y < this.y + this.height);
  }

  public void erase(CanvasRenderingContext2D ctx) {
    ctx.clearRect(this.x, this.y, this.width, this.height);
  }

  public void draw(CanvasRenderingContext2D ctx) {
    if (style == STYLE_NONE) {
      return;
    }

    ctx.fillStyle = (this.inFocus) ? "rgb(220,220,220)" : "white";
    ctx.fillRect(this.x, this.y, this.width, this.height);

    // draw borders
    ctx.fillStyle = "rgb(60,60,60)";
    switch (this.style) {

      case STYLE_NORMAL:
        ctx.fillRect(this.x + 1, this.y + 1, this.width - 2, this.height - 2);
        ctx.fillStyle = (this.inFocus) ? "rgb(220,220,220)" : "white";
        ctx.fillRect(this.x + 3, this.y + 3, this.width - 6, this.height - 6);
        break;

      case STYLE_N:
        ctx.fillRect(this.x, this.y + 1, this.width, 2);
        break;

      case STYLE_E:
        ctx.fillRect(this.x + this.width - 3, this.y, 2, this.height);
        break;

      case STYLE_S:
        ctx.fillRect(this.x, this.y + this.height - 3, this.width, 2);
        break;

      case STYLE_W:
        ctx.fillRect(this.x + 1, this.y, 2, this.height);
        break;

      case STYLE_NE:
        ctx.fillRect(this.x, this.y + 1, this.width - 1, 2);
        ctx.fillRect(this.x + this.width - 3, this.y + 1, 2, this.height - 1);
        break;

      case STYLE_NW:
        ctx.fillRect(this.x + 1, this.y + 1, this.width, 2);
        ctx.fillRect(this.x + 1, this.y + 1, 2, this.height - 1);
        break;

      case STYLE_ES:
        ctx.fillRect(this.x + this.width - 3, this.y, 2, this.height - 1);
        ctx.fillRect(this.x, this.y + this.height - 3, this.width - 1, 2);
        break;

      case STYLE_SW:
        ctx.fillRect(this.x + 1, this.y + this.height - 3, this.width - 1, 2);
        ctx.fillRect(this.x + 1, this.y, 2, this.height - 1);
        break;

      case STYLE_EW:
        ctx.fillRect(this.x + this.width - 3, this.y, 2, this.height);
        ctx.fillRect(this.x + 1, this.y, 2, this.height);
        break;

      case STYLE_NS:
        ctx.fillRect(this.x, this.y + 1, this.width, 2);
        ctx.fillRect(this.x, this.y + this.height - 3, this.width, 2);
        break;

      case STYLE_ESW:
        ctx.fillRect(this.x + this.width - 3, this.y, 2, this.height - 1);
        ctx.fillRect(this.x + 1, this.y + this.height - 3, this.width - 2, 2);
        ctx.fillRect(this.x + 1, this.y, 2, this.height - 1);
        break;

      case STYLE_NEW:
        ctx.fillRect(this.x + 1, this.y + 1, this.width - 2, 2);
        ctx.fillRect(this.x + this.width - 3, this.y + 1, 2, this.height - 1);
        ctx.fillRect(this.x + 1, this.y + 1, 2, this.height - 1);
        break;

      case STYLE_NSW:
        ctx.fillRect(this.x + 1, this.y + 1, this.width - 1, 2);
        ctx.fillRect(this.x + 1, this.y + this.height - 3, this.width - 1, 2);
        ctx.fillRect(this.x + 1, this.y + 1, 2, this.height - 2);
        break;

      case STYLE_NES:
        ctx.fillRect(this.x, this.y + 1, this.width - 1, 2);
        ctx.fillRect(this.x + this.width - 3, this.y + 1, 2, this.height - 2);
        ctx.fillRect(this.x, this.y + this.height - 3, this.width - 1, 2);
        break;
    }

    ctx.fillStyle = "black";
    ctx.font = this.fsize + "pt Arial";

    int tw;
    if (Nullable.isPresent(text)) {
      // TODO
      // if (typeof this.text === "string") {
      // tw = ctx.measureText(this.text);
      // ctx.fillText(
      // this.text,
      // this.x + (this.width / 2) - (tw.width / 2),
      // this.y + (this.height / 2) + this.fsize / 2);
      // } else {
      // for (var i = 0, e = this.text.length; i < e; i++) {
      // tw = ctx.measureText(this.text[i]);
      // ctx.fillText(
      // this.text[i],
      // this.x + (this.width / 2) - (tw.width / 2),
      // this.y + this.fsize + ((i + 1) * (this.fsize + 8)));
      // }
      // }
    }
  }
}
