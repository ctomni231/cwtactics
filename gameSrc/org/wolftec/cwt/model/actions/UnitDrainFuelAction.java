package org.wolftec.cwt.model.actions;

import org.wolftec.cwt.model.ActionType;
import org.wolftec.cwt.model.gameround.Unit;

public class UnitDrainFuelAction extends AbstractAction {

  @Override
  public String key() {
    return "drainFuel";
  }

  @Override
  public ActionType type() {
    return ActionType.ENGINE_UNIT_ACTION;
  }

  @Override
  public boolean condition(ModelData model, ControllerData controller) {
    return controller.ui.source.unit.type.dailyFuelDrain > 0;
  }

  @Override
  public void fillData(ModelData model, ControllerData controller) {
    controller.data.p1 = controller.ui.source.unitId;
  }

  @Override
  public void evaluateByData(ModelData model, ControllerData controller) {
    Unit unit = model.battlefield.units.getUnit(controller.data.p1);
    int value = unit.type.dailyFuelDrain;

    // hidden units may drain more fuel
    if (unit.hide.isHidden() && unit.type.dailyFuelDrainHidden > 0) {
      value = unit.type.dailyFuelDrainHidden;
    }

    unit.supplies.fuel -= value;
    if (unit.supplies.fuel < 0) {
      unit.supplies.fuel = 0;
    }
  }

}
