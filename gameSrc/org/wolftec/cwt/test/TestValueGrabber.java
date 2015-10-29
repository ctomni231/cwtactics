package org.wolftec.cwt.test;

public class TestValueGrabber {

  private CwtTestManager parent;

  public TestValueGrabber(CwtTestManager parent) {
    this.parent = parent;
  }

  public String selectedMenuValue() {
    return parent.uiData.getInfo();
  }

  public String menuValueAt(int index) {
    return parent.uiData.getInfoAtIndex(index);
  }
}
