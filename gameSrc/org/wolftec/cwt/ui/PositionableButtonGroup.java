package org.wolftec.cwt.ui;

public class PositionableButtonGroup extends ButtonGroup {

  public int x;
  public int y;

  public PositionableButtonGroup() {
    super();
    this.x = 0;
    this.y = 0;
  }

  public void setMenuPosition(int x, int y) {
    int diffX = x - this.x;
    int diffY = y - this.y;

    for (int i = 0, e = super.elements.$length(); i < e; i++) {
      Field element = elements.$get(i);

      element.x += diffX;
      element.y += diffY;
    }

    this.x = x;
    this.y = y;
  }
}
