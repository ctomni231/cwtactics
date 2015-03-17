package org.wolftec.laycagui;

import org.stjs.javascript.Array;
import org.wolftec.container.ContainerUtil;
import org.wolftec.layca.GraphicLayer;

public class UiContainer extends UiElement {

  private Array<UiElement> _elements;

  public UiContainer(UiElement parent) {
    super(parent);
    _elements = ContainerUtil.createArray();
  }

  public void appendChild(UiElement element, int top, int left, int right, int bottom) {
    _elements.push(element);
  }

  @Override
  public void draw(GraphicLayer layer) {
    for (int i = 0; i < _elements.$length(); i++) {
      _elements.$get(i).draw(layer);
    }
  }
}
