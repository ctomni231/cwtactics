package org.wolftec.cwt.model.actions;

import org.wolftec.cwt.model.ActionType;
import org.wolftec.cwt.model.TileMeta;
import org.wolftec.cwt.model.gameround.Property;
import org.wolftec.cwt.model.gameround.Unit;
import org.wolftec.cwt.model.tags.TagValue;

public class UnitCapturePropertyAction extends AbstractAction {

  private TagValue cfgCapturerPoints;
  private TagValue cfgPropertyPoints;

  public UnitCapturePropertyAction() {
    cfgPropertyPoints = new TagValue("game.capture.propertyPoints", 5, 99, 20);
    cfgCapturerPoints = new TagValue("game.capture.capturerPoints", 5, 99, 10);
  }

  @Override
  public String key() {
    return "capture";
  }

  @Override
  public ActionType type() {
    return ActionType.UNIT_ACTION;
  }

  @Override
  public boolean checkTarget(TileMeta unitFlag, TileMeta propertyFlag) {
    return unitFlag == TileMeta.EMPTY && (propertyFlag == TileMeta.ENEMY || propertyFlag == TileMeta.NEUTRAL);
  }

  @Override
  public boolean condition(ModelData model, ControllerData controller) {
    return controller.ui.target.property.type.capturable && controller.ui.source.unit.type.captures;
  }

  @Override
  public void fillData(ModelData model, ControllerData controller) {
    controller.data.p1 = controller.ui.target.propertyId;
    controller.data.p2 = controller.ui.source.unitId;
  }

  @Override
  public void evaluateByData(ModelData model, ControllerData controller) {
    Property property = model.battlefield.properties.getProperty(controller.data.p1);
    Unit unit = model.battlefield.units.getUnit(controller.data.p2);

    property.capture.points -= cfgCapturerPoints.value;
    if (property.capture.points <= 0) {
      property.owners.setOwner(unit.owners.getOwner());
      property.capture.points = cfgPropertyPoints.value;
    }
  }

}
