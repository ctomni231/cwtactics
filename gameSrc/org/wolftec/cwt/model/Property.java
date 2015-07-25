package org.wolftec.cwt.model;

import org.wolftec.cwt.sheets.PropertyType;

public class Property {

  public static final int CAPTURE_POINTS = 20; // TODO
  public static final int CAPTURE_STEP   = 10; // TODO

  public int              points         = 20;
  public Player           owner;
  public PropertyType     type;

  public Property() {
    this.points = 20;
    this.owner = null;
    this.type = null;
  }

  /**
   * @return true, when the given property is neutral, else false.
   */
  public boolean isNeutral() {
    return owner == null;
  }

  public void makeNeutral() {
    owner = null;
  }
}
