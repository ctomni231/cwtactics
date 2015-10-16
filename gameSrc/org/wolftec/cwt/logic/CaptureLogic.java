package org.wolftec.cwt.logic;

import org.wolftec.cwt.core.ioc.Injectable;
import org.wolftec.cwt.model.gameround.Property;
import org.wolftec.cwt.model.gameround.Unit;

public class CaptureLogic implements Injectable {

  public static final int CAPTURE_STEP   = 10; // TODO
  public static final int CAPTURE_POINTS = 20; // TODO

  /**
   * 
   * @param unit
   * @return **true** when a **unit** can capture a properties, else **false**.
   */
  public boolean canCapture(Unit unit) {
    return (unit.type.captures > 0);
  }

  /**
   * 
   * @param property
   * @return **true** when a **property** can be captured, else **false**.
   */
  public boolean canBeCaptured(Property property) {
    return (property.type.capturePoints > 0);
  }

  /**
   * The **unit** captures the **property**. When the capture points of the
   * **property** falls down to zero, then the owner of the **property** changes
   * to the owner of the capturing **unit** and **true** will be returned. If
   * the capture points does not fall down to zero then **false** will be
   * returned.
   * 
   * @param property
   * @param unit
   * @return
   */
  public boolean captureProperty(Property property, Unit unit) {

    property.points -= CaptureLogic.CAPTURE_STEP;
    if (property.points <= 0) {
      property.owner = unit.owner;
      property.points = CaptureLogic.CAPTURE_POINTS;
      // TODO: if max points are static then the configurable points from the
      // property sheets can be removed

      // was captured
      return true;
    }

    // was not captured
    return false;
  }
}
