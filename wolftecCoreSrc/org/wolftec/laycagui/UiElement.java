package org.wolftec.laycagui;

import org.wolftec.core.JsUtil;
import org.wolftec.layca.GraphicLayer;

public class UiElement {

  public final UiElement parent;

  public UiRenderer renderer;

  public int x;
  public int y;
  public int width;
  public int height;

  public UiElement(UiElement parent) {
    this.parent = parent;
    renderer = null;
  }

  public void draw(GraphicLayer layer) {
    if (renderer == null) {
      JsUtil.raiseError("RendererNotDefined");
    }

    renderer.renderElement(layer, this);
  }
}
