package org.wolftec.cwt.logic.features;

import org.wolftec.cwt.core.config.ConfigurableValue;
import org.wolftec.cwt.core.config.ConfigurationProvider;
import org.wolftec.cwt.core.ioc.Injectable;
import org.wolftec.cwt.model.gameround.Property;
import org.wolftec.cwt.model.gameround.Unit;

public class CaptureLogic implements Injectable, ConfigurationProvider {

  private ConfigurableValue cfgCapturerPoints;
  private ConfigurableValue cfgPropertyPoints;

  @Override
  public void onConstruction() {
    cfgPropertyPoints = new ConfigurableValue("game.capture.propertyPoints", 5, 99, 20);
    cfgCapturerPoints = new ConfigurableValue("game.capture.capturerPoints", 5, 99, 10);
  }

  /**
   * 
   * @param unit
   * @return **true** when a **unit** can capture a properties, else **false**.
   */
  public boolean canCapture(Unit unit) {
    return unit.type.captures;
  }

  /**
   * 
   * @param property
   * @return **true** when a **property** can be captured, else **false**.
   */
  public boolean canBeCaptured(Property property) {
    return property.type.capturable;
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
   * @return true if the property was captured completely, else false
   */
  public boolean captureProperty(Property property, Unit unit) {
    property.points -= cfgCapturerPoints.value;
    if (property.points <= 0) {
      property.owner = unit.owner;
      property.points = cfgPropertyPoints.value;
      return true;
    }
    return false;
  }
}
