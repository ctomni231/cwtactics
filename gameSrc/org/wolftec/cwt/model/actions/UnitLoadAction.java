package org.wolftec.cwt.model.actions;

import org.wolftec.cwt.core.AssertUtil;
import org.wolftec.cwt.model.ActionType;
import org.wolftec.cwt.model.MoveMeta;
import org.wolftec.cwt.model.TileMeta;
import org.wolftec.cwt.model.gameround.Unit;

public class UnitLoadAction extends AbstractAction {

  @Override
  public String key() {
    return "loadUnit";
  }

  @Override
  public ActionType type() {
    return ActionType.UNIT_ACTION;
  }

  @Override
  public MoveMeta positionUpdateMode() {
    return MoveMeta.PREVENT_SET_NEW_POS;
  }

  @Override
  public boolean checkTarget(TileMeta unitFlag, TileMeta propertyFlag) {
    return unitFlag == TileMeta.OWN;
  }

  @Override
  public boolean condition(ModelData model, ControllerData controller) {
    Unit load = controller.ui.source.unit;
    Unit transporter = controller.ui.target.unit;
    int transporterId = controller.ui.target.unitId;

    if (transporter.type.maxloads == 0) {
      return false;
    }

    if (transporter.type.canload.indexOf(load.type.movetype) == -1 && transporter.type.canload.indexOf(load.type.ID) == -1) {
      return false;
    }

    int loads = model.battlefield.units.unitsWithStatus(u -> u.transport.loadedIn == transporterId);

    if (loads >= transporter.type.maxloads) {
      return false;
    }

    return true;
  }

  @Override
  public void fillData(ModelData model, ControllerData controller) {
    controller.data.p1 = controller.ui.target.unitId;
    controller.data.p2 = controller.ui.source.unitId;
  }

  @Override
  public void evaluateByData(ModelData model, ControllerData controller) {
    Unit transporter = model.battlefield.units.getUnit(controller.data.p1);
    Unit load = model.battlefield.units.getUnit(controller.data.p2);

    AssertUtil.assertThat(load.transport.loadedIn == model.battlefield.units.getUnitId(transporter));
    load.transport.loadedIn = model.battlefield.units.getUnitId(transporter);
  }
}
