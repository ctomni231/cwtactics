package org.wolftec.cwt.model.actions;

import org.wolftec.cwt.model.ActionType;
import org.wolftec.cwt.model.TileMeta;
import org.wolftec.cwt.model.gameround.Property;
import org.wolftec.cwt.model.gameround.Unit;
import org.wolftec.cwt.model.gameround.objecttypes.PropertyType;
import org.wolftec.cwt.model.gameround.objecttypes.SiloType;

public class PropertyFireRocketAction extends AbstractAction {

  @Override
  public String key() {
    return "fireSilo";
  }

  @Override
  public ActionType type() {
    return ActionType.UNIT_ACTION;
  }

  @Override
  public boolean checkTarget(TileMeta unitFlag, TileMeta propertyFlag) {
    return unitFlag == TileMeta.EMPTY;
  }

  @Override
  public boolean condition(ModelData model, ControllerData controller) {
    SiloType type = controller.ui.source.property.type.rocketsilo;
    return type.inflictsDamage() && type.fireableContains(controller.ui.source.unit.type.ID);
  }

  @Override
  public void fillData(ModelData model, ControllerData controller) {
    controller.data.p1 = controller.ui.target.x;
    controller.data.p2 = controller.ui.target.y;
    controller.data.p3 = controller.ui.actionTarget.x;
    controller.data.p4 = controller.ui.actionTarget.y;
    controller.data.p5 = controller.ui.target.unitId;
  }

  @Override
  public void evaluateByData(ModelData model, ControllerData controller) {
    int x = controller.data.p1;
    int y = controller.data.p2;
    int tx = controller.data.p3;
    int ty = controller.data.p4;

    Property silo = model.battlefield.map.getTile(x, y).property;

    // change silo type to empty
    PropertyType type = silo.type;
    silo.type = model.typeDB.properties.get(type.rocketsilo.changeTo);

    int damage = type.rocketsilo.damage;
    int range = type.rocketsilo.range;

    model.battlefield.map.doInRange(tx, ty, range, (cx, cy, tile, crange) -> {
      Unit unit = tile.unit;
      if (unit != null) {
        unit.live.damagePoints(damage, 9);
      }
      return true;
    });
  }
}
