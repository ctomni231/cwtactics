package org.wolftec.cwt.ui;

import org.stjs.javascript.dom.canvas.CanvasRenderingContext2D;
import org.stjs.javascript.functions.Callback0;
import org.stjs.javascript.functions.Callback1;
import org.stjs.javascript.functions.Callback2;
import org.wolftec.cwt.Constants;
import org.wolftec.cwt.system.Nullable;

/**
 * A screen layout is a group out of ui elements. This elements can be
 * interactive or non-interactive. It should be used to create and define a
 * screen layout. Furthermore the screen layout offers API to interact with the
 * components.
 */
public class ScreenLayout extends ButtonGroup {

  int left;
  int curX;
  int curY;
  int curH;

  public ScreenLayout(int slotsX, int slotsY, int startX, int startY) {
    super();

    this.left = Nullable.getOrElse(startX, 0);
    this.curX = Nullable.getOrElse(startX, 0);
    this.curY = Nullable.getOrElse(startY, 0);
    this.curH = 0;

    breakLine();
  }

  public ScreenLayout repeat(int n, Callback2<ScreenLayout, Integer> f) {
    for (int i = 0; i < n; i++) {
      f.$invoke(this, i);
    }
    return this;
  }

  public ScreenLayout addRowGap(int tiles) {
    curY += Constants.TILE_BASE * tiles;
    return this;
  }

  public ScreenLayout addColGap(int tiles) {
    curX += Constants.TILE_BASE * tiles;
    return this;
  }

  /**
   * Breaks the current line
   * 
   * @return
   */
  public ScreenLayout breakLine() {
    curX = left;
    curY += curH * Constants.TILE_BASE;
    curH = 1;
    return this;
  }

  public ScreenLayout addButton(int tilesX, int tilesY, int offsetY, String key, int style, int fSize, Callback0 action) {
    if (curH < tilesY) {
      curH = tilesY;
    }

    Field btn = new Field(curX, curY + (offsetY * Constants.TILE_BASE), tilesX * Constants.TILE_BASE, tilesY * Constants.TILE_BASE, key, fSize, style, action);

    curX += tilesX * Constants.TILE_BASE;

    addElement(btn);

    return this;
  }

  public ScreenLayout addCustomField(int tilesX, int tilesY, int offsetY, String key, Callback1<CanvasRenderingContext2D> draw, boolean ignoreHeight) {
    if (ignoreHeight != true && curH < tilesY) {
      curH = tilesY;
    }

    CustomField btn = new CustomField(curX, curY + (offsetY * Constants.TILE_BASE), tilesX * Constants.TILE_BASE, tilesY * Constants.TILE_BASE, key, draw);

    curX += tilesX * Constants.TILE_BASE;

    addElement(btn);

    return this;
  }

  public ScreenLayout addCheckbox(int tilesX, int tilesY, int offsetY, String key, int style, int fSize) {
    if (this.curH < tilesY) {
      this.curH = tilesY;
    }

    Checkbox btn = new Checkbox(curX, curY + (offsetY * Constants.TILE_BASE), tilesX * Constants.TILE_BASE, tilesY * Constants.TILE_BASE, key, fSize, style);
    curX += tilesX * Constants.TILE_BASE;

    addElement(btn);
    return this;
  }
}
