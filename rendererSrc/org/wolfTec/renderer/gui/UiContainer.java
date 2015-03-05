package org.wolfTec.renderer.gui;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.wolfTec.renderer.layer.GraphicLayer;

public class UiContainer extends UiElement {

  private Array<UiElement> elements;

  public UiContainer() {
    elements = JSCollections.$array();
  }

  public void addElement(UiElement element) {
    elements.push(element);
  }
  
  @Override
  public void draw(GraphicLayer layer) {
    for (int i = 0; i < elements.$length(); i++) {
      elements.$get(i).draw(layer);
    }
  }
}
