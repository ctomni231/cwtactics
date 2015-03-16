package org.wolftec.cwtactics.system.renderer;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;

public class UiContainer implements Drawable {

  public int top;
  public int left;

  private Array<UiElement> elements;

  public UiContainer() {
    elements = JSCollections.$array();
  }

  public void addElement(UiElement element) {
    elements.push(element);
  }

  /**
   * 
   * @param left
   * @param top
   * @param protectScreenBounds
   *          if the value is true and the container would go out of bounds at
   *          the target position then the container position (left/top) will be
   *          altered to fit in the screen bounds
   */
  public void setPosition(int left, int top, boolean protectScreenBounds) {

    for (int i = 0; i < elements.$length(); i++) {
      UiElement element = elements.$get(i);
      element.left = left + (element.left - this.left);
      element.top = top + (element.top - this.top);
    }

    this.left = left;
    this.top = top;
  }

  @Override
  public void draw(GraphicLayer layer) {
    for (int i = 0; i < elements.$length(); i++) {
      elements.$get(i).draw(layer);
    }
  }
}
