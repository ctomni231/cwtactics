package org.wolftec.cwt.states.actions;

import org.wolftec.cwt.input.InputData;
import org.wolftec.cwt.model.ModelManager;
import org.wolftec.cwt.renderer.GraphicManager;
import org.wolftec.cwt.states.Action;
import org.wolftec.cwt.states.ActionData;
import org.wolftec.cwt.states.ActionType;
import org.wolftec.cwt.states.State;
import org.wolftec.cwt.states.UserInteractionData;

public class WaitUnit implements Action {

  private ModelManager model;

  @Override
  public String key() {
    return "wait";
  }

  @Override
  public ActionType type() {
    return ActionType.UNIT_ACTION;
  }

  @Override
  public boolean condition(UserInteractionData data) {
    return data.source.unit.canAct;
  }

  @Override
  public void fillData(UserInteractionData positionData, ActionData actionData) {
    actionData.p1 = positionData.source.unitId;
  }

  @Override
  public void invoke(ActionData data) {
    model.getUnit(data.p1).setActable(false);
  }

  @Override
  public Class<? extends State> update(int delta, InputData lastInput) {
    return null;
  }

  @Override
  public void render(int delta, GraphicManager canvas) {
  }
}
