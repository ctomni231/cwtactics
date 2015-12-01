package org.wolftec.cwt.model.actions;

import org.wolftec.cwt.model.ActionType;
import org.wolftec.cwt.model.gameround.Property;
import org.wolftec.cwt.model.gameround.Tile;
import org.wolftec.cwt.model.gameround.Unit;

public class PropertyRepairUnitAction extends AbstractAction {

  @Override
  public String key() {
    return "repairUnit";
  }

  @Override
  public ActionType type() {
    return ActionType.ENGINE_PROPERTY_ACTION;
  }

  @Override
  public boolean condition(ModelData model, ControllerData controller) {
    Tile tile = model.battlefield.map.getTile(controller.ui.source.x, controller.ui.source.y);
    Property prop = tile.property;
    Unit unit = tile.unit;
    if (prop != null && unit != null) {
      if (prop.type.repairs.indexOf(unit.type.movetype) != -1 || prop.type.repairs.indexOf(unit.type.ID) != -1) {
        return true;
      }
    }
    return false;
  }

  @Override
  public void fillData(ModelData model, ControllerData controller) {
    controller.data.p1 = controller.ui.source.x;
    controller.data.p2 = controller.ui.source.y;
  }

  @Override
  public void evaluateByData(ModelData model, ControllerData controller) {
    int x = controller.data.p1;
    int y = controller.data.p2;
    Tile tile = model.battlefield.map.getTile(x, y);
    Property prop = tile.property;
    Unit unit = tile.unit;

    int diff = unit.live.heal(prop.type.repairAmount);
    unit.owners.getOwner().earnMoney(unit.type.getCostsByPercentage(diff));
  }
}
