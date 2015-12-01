package org.wolftec.cwt.model.actions;

import org.wolftec.cwt.core.AssertUtil;
import org.wolftec.cwt.model.ActionData;
import org.wolftec.cwt.model.ActionType;

public class UnitWaitAction extends AbstractAction {

  @Override
  public String key() {
    return "wait";
  }

  @Override
  public ActionType type() {
    return ActionType.UNIT_ACTION;
  }

  @Override
  public boolean condition(ModelData model, ControllerData controller) {
    return controller.ui.source.unit.usable.canAct();
  }

  @Override
  public void fillData(ModelData model, ControllerData controller) {
    controller.data.p1 = controller.ui.source.unitId;
  }

  @Override
  public void checkData(ModelData model, ActionData data) {
    AssertUtil.assertThat(model.battlefield.units.isValidUnitId(data.p1), "");
  }

  @Override
  public void evaluateByData(ModelData model, ControllerData controller) {
    model.battlefield.units.getUnit(controller.data.p1).usable.makeInactable();
  }

}
