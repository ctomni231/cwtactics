package org.wolftec.cwt.model.actions;

import org.wolftec.cwt.Constants;
import org.wolftec.cwt.controller.actions.core.ActionType;
import org.wolftec.cwt.controller.actions.core.TileMeta;
import org.wolftec.cwt.core.AssertUtil;
import org.wolftec.cwt.model.gameround.Unit;

public class UnitJoinAction extends AbstractAction {

  @Override
  public String key() {
    return "joinUnits";
  }

  @Override
  public ActionType type() {
    return ActionType.UNIT_ACTION;
  }

  @Override
  public boolean noAutoWait() {
    return false;
  }

  @Override
  public boolean checkTarget(TileMeta unitFlag, TileMeta propertyFlag) {
    return unitFlag == TileMeta.OWN;
  }

  @Override
  public boolean condition(ModelData model, ControllerData controller) {
    if (controller.ui.source.unit.type != controller.ui.target.unit.type) {
      return false;
    }

    if (controller.ui.target.unit.live.healthPoints() == 10) {
      return false;
    }

    if (controller.ui.target.unit.transport.hasLoads() || controller.ui.source.unit.transport.hasLoads()) {
      return false;
    }

    return true;
  }

  @Override
  public void fillData(ModelData model, ControllerData controller) {
    controller.data.p1 = controller.ui.source.unitId;
    controller.data.p2 = controller.ui.target.unitId;
  }

  @Override
  public void evaluateByData(ModelData model, ControllerData controller) {
    Unit source = model.battlefield.units.getUnit(controller.data.p1);
    Unit target = model.battlefield.units.getUnit(controller.data.p2);

    AssertUtil.assertThat(target.type == source.type);

    int diff = target.live.healPoints(source.live.healthPoints());
    target.owners.getOwner().earnMoney(target.type.getCostsByPercentage(diff));

    if (target.type.ammo != Constants.INACTIVE) {
      target.supplies.ammo = Math.max(target.supplies.ammo + source.supplies.ammo, target.type.ammo);
    }
    target.supplies.fuel = Math.max(target.supplies.fuel + source.supplies.fuel, target.type.fuel);
    target.exp += source.exp;

    model.battlefield.units.searchUnit(source, (ux, uy, unit) -> model.battlefield.units.destroyUnit(ux, uy));
  }

}
