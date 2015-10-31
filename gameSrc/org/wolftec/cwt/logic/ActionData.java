package org.wolftec.cwt.logic;

import org.stjs.javascript.JSCollections;
import org.stjs.javascript.JSGlobal;

public class ActionData {
  public int id;
  public int p1;
  public int p2;
  public int p3;
  public int p4;
  public int p5;

  public ActionData() {
    reset();
  }

  /**
   * Resets the data of the data object.
   */
  public void reset() {
    this.id = -1;
    this.p1 = -1;
    this.p2 = -1;
    this.p3 = -1;
    this.p4 = -1;
    this.p5 = -1;
  }

  @Override
  public String toString() {
    return JSGlobal.JSON.stringify(JSCollections.$array(id, p1, p2, p3, p4, p5));
  }
}
