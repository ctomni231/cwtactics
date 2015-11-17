package org.wolftec.cwt.model.gameround;

import org.wolftec.cwt.model.Specialization;

public class Capturable extends Specialization<Property> {

  public int points = 20;

  public boolean canBeCaptured() {
    return self.type.capturable;
  }

  public boolean canBeCapturedBy(Unit capturer) {
    return capturer.type.captures;
  }

  /**
   * @param property
   * @param unit
   * @return true if the property was captured completely, else false
   */
  public boolean capturedBy(Unit unit, int capturerPointsBase, int fullPropertyPoints) {
    points -= capturerPointsBase;
    if (points <= 0) {
      self.owner = unit.owner;
      points = fullPropertyPoints;
      return true;
    }
    return false;
  }
}
