package org.wolftec.wPlay.gui;

import org.stjs.javascript.Map;
import org.wolftec.wCore.container.ContainerUtil;
import org.wolftec.wCore.core.JsUtil;
import org.wolftec.wPlay.layergfx.GraphicLayer;

public class UiElement {

  public static final int MODE_PIXEL = 1;
  public static final int MODE_PERC = 2;

  public static final int TYPE_LEFT = 1;
  public static final int TYPE_TOP = 2;
  public static final int TYPE_WIDTH = 3;
  public static final int TYPE_HEIGHT = 4;
  public static final int TYPE_RIGHT = 5;
  public static final int TYPE_BOTTOM = 6;

  public UiRenderer renderer;

  public int mode_x;
  public int value_x;

  public int mode_y;
  public int value_y;

  public int mode_width;
  public int value_width;

  public int mode_height;
  public int value_height;

  public Map<String, String> data;

  public UiElement() {
    renderer = null;
    data = ContainerUtil.createMap();
  }

  public UiElement setValue(int type, int value, int mode) {
    if ((type < TYPE_LEFT && type > TYPE_BOTTOM) || (mode != MODE_PERC && mode != MODE_PIXEL) || (value < 0)) {
      JsUtil.raiseError("IllegalSizeValues");
    }

    // TODO
    return this;
  }

  public UiElement styleByQuery(String query) {
    // TODO
    return this;
  }

  public void draw(GraphicLayer layer) {
    if (renderer == null) {
      JsUtil.raiseError("RendererNotDefined");
    }
    renderer.renderElement(layer, this);
  }
}
