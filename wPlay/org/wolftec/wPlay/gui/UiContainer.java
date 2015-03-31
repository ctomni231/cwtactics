package org.wolftec.wPlay.gui;

import org.stjs.javascript.Array;
import org.wolftec.wCore.container.ContainerUtil;
import org.wolftec.wPlay.layergfx.GraphicLayer;

public class UiContainer extends UiElement {

  private Array<UiElement> elements;

  public UiContainer() {
    elements = ContainerUtil.createArray();
  }

  public UiContainer appendChild(UiElement element) {
    elements.push(element);
    return this;
  }

  public UiContainer appendChilds(UiElement... arguments) {
    elements.push(arguments);
    return this;
  }

  @Override
  public void draw(GraphicLayer layer) {
    for (int i = 0; i < elements.$length(); i++) {
      elements.$get(i).draw(layer);
    }
  }
}
