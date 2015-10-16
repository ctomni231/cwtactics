package org.wolftec.cwt.model.gameround;

import org.wolftec.cwt.model.sheets.types.PropertyType;

public class Property implements Ownable {

  public int          points = 20;
  public Player       owner;
  public PropertyType type;

  /**
   * @return true, when the given property is neutral, else false.
   */
  public boolean isNeutral() {
    return owner == null;
  }

  public void makeNeutral() {
    owner = null;
  }

  @Override
  public Player getOwner() {
    return owner;
  }
}
