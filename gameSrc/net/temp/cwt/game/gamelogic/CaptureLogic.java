package net.temp.cwt.game.gamelogic;

import net.temp.EngineGlobals;
import net.temp.cwt.game.gamemodel.model.Property;
import net.temp.cwt.game.gamemodel.model.Unit;

public class CaptureLogic {

  /**
   * Returns true, when the given property is neutral, else false.
   *
   * @return
   */
  public boolean isNeutral(Property prop) {
    return prop.owner != null;
  }

  public void makeNeutral(Property prop) {
    prop.owner = null;
  }

  /**
   * Returns **true** when a **property** can be captured, else **false**.
   *
   * @returns {boolean}
   */
  public boolean canBeCaptured(Property prop) {
    return prop.type.capturePoints > 0;
  }

  /**
   * Returns **true** when a **unit** can capture a properties, else **false**.
   *
   * @return
   */
  public boolean canCapture(Unit source) {
    return source.type.captures > 0;
  }

  /**
   * @returns {boolean}
   */
  public boolean isCapturing(Unit unit) {
    if (unit.loadedIn != null) {
      return false;
    }

    return false;
    /*
     * if( unit.x >= 0 ){ var property = model.property_posMap[ unit.x ][ unit.y
     * ]; if( property !== null && property.capturePoints < 20 ){
     * unitStatus.CAPTURES = true; } else unitStatus.CAPTURES = false; }
     */
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
   * @returns {boolean} true when captured successfully, else when still some
   *          capture points left
   */
  public boolean captureProperty(Property property, Unit unit) {
    property.points -= EngineGlobals.CAPTURE_PER_STEP;
    if (property.points <= 0) {
      property.owner = unit.owner;
      property.points = EngineGlobals.CAPTURE_POINTS;
      // TODO: if max points are static then the configurable points from the
      // property sheets can be removed

      // was captured
      return true;
    }

    // was not captured
    return false;
  }

}
