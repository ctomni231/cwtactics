package org.wolftec.cwt.model.actions;

import org.wolftec.cwt.controller.actions.core.ActionType;
import org.wolftec.cwt.model.gameround.Unit;
import org.wolftec.cwt.model.sheets.types.SuicideType;

public class UnitExplodeAction extends AbstractAction {

  @Override
  public String key() {
    return "explode";
  }

  @Override
  public ActionType type() {
    return ActionType.UNIT_ACTION;
  }

  @Override
  public boolean condition(ModelData model, ControllerData controller) {
    SuicideType explodeType = controller.ui.source.unit.type.suicide;
    return explodeType.damage > 0 && explodeType.range > 0;
  }

  @Override
  public void fillData(ModelData model, ControllerData controller) {
    controller.data.p1 = controller.ui.source.unitId;
    controller.data.p2 = controller.ui.target.x;
    controller.data.p3 = controller.ui.target.y;
  }

  @Override
  public void evaluateByData(ModelData model, ControllerData controller) {
    Unit exploder = model.battlefield.units.getUnit(controller.data.p1);
    int x = controller.data.p2;
    int y = controller.data.p3;
    int range = exploder.type.suicide.range;
    int damage = exploder.type.suicide.damage;

    model.battlefield.units.destroyUnit(x, y);
    model.battlefield.map.doInRange(x, y, range, (cx, cy, ctile, crange) -> {
      Unit unit = ctile.unit;
      if (unit != null) {
        unit.live.damagePoints(damage, 9);
      }
      return true;
    });
  }

}
