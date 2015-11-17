package org.wolftec.cwt.model.actions;

import org.wolftec.cwt.controller.actions.core.ActionType;
import org.wolftec.cwt.model.gameround.Unit;

public class UnitUnhideAction extends AbstractAction {

  @Override
  public String key() {
    return "unitUnhide";
  }

  @Override
  public ActionType type() {
    return ActionType.UNIT_ACTION;
  }

  @Override
  public boolean condition(ModelData model, ControllerData controller) {
    Unit unit = controller.ui.source.unit;
    return unit.type.stealth && unit.hide.isHidden();
  }

  @Override
  public void fillData(ModelData model, ControllerData controller) {
    controller.data.p1 = controller.ui.source.unitId;
  }

  @Override
  public void evaluateByData(ModelData model, ControllerData controller) {
    model.battlefield.units.getUnit(controller.data.p1).hide.unhide();
  }

}
