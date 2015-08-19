package org.wolftec.cwt.actions;

import org.wolftec.cwt.Constants;
import org.wolftec.cwt.core.Action;
import org.wolftec.cwt.core.ActionData;
import org.wolftec.cwt.core.ActionManager;
import org.wolftec.cwt.core.ActionTargetMode;
import org.wolftec.cwt.core.ActionType;
import org.wolftec.cwt.logic.MoveLogic;
import org.wolftec.cwt.logic.TransportLogic;
import org.wolftec.cwt.model.ModelManager;
import org.wolftec.cwt.model.Unit;
import org.wolftec.cwt.sheets.MoveType;
import org.wolftec.cwt.sheets.SheetManager;
import org.wolftec.cwt.states.UserInteractionData;

public class UnloadUnit implements Action {

  private ModelManager   model;
  private TransportLogic transport;
  private SheetManager   sheets;
  private MoveLogic      move;
  private ActionManager  actions;

  @Override
  public String key() {
    return "unloadUnit";
  }

  @Override
  public ActionType type() {
    return ActionType.UNIT_ACTION;
  }

  @Override
  public boolean multiStepAction() {
    return true;
  }

  @Override
  public boolean condition(UserInteractionData data) {
    return transport.isTransportUnit(data.source.unit) && transport.canUnloadSomethingAt(data.source.unit, data.target.x, data.target.y);
  }

  @Override
  public void prepareMenu(UserInteractionData data) {
    for (int i = 0, e = Constants.MAX_PLAYER * Constants.MAX_UNITS; i < e; i++) {
      if (model.getUnit(i).loadedIn == data.source.unitId) {
        data.addInfo(i + "", true);
      }
    }
  }

  @Override
  public ActionTargetMode targetSelectionType() {
    return ActionTargetMode.B;
  }

  @Override
  public void prepareTargets(UserInteractionData data) {
    MoveType loadMovetype = sheets.movetypes.get(model.getUnit(data.actionDataCode).type.movetype);
    Unit transporter = data.source.unit;
    int x = data.target.x;
    int y = data.target.y;

    // check west
    if (transport.canUnloadSomethingAt(transporter, x - 1, y) && move.canTypeMoveTo(loadMovetype, x - 1, y)) {
      data.targets.setValue(x - 1, y, 1);
    }

    // check east
    if (transport.canUnloadSomethingAt(transporter, x + 1, y) && move.canTypeMoveTo(loadMovetype, x + 1, y)) {
      data.targets.setValue(x + 1, y, 1);
    }

    // check south
    if (transport.canUnloadSomethingAt(transporter, x, y + 1) && move.canTypeMoveTo(loadMovetype, x, y + 1)) {
      data.targets.setValue(x, y + 1, 1);
    }

    // check north
    if (transport.canUnloadSomethingAt(transporter, x, y - 1) && move.canTypeMoveTo(loadMovetype, x, y - 1)) {
      data.targets.setValue(x, y - 1, 1);
    }
  }

  @Override
  public void fillData(UserInteractionData interactionData, ActionData actionData) {
    actionData.p1 = interactionData.source.unitId;
    actionData.p2 = interactionData.actionDataCode;
    actionData.p3 = interactionData.target.x;
    actionData.p4 = interactionData.target.y;
    actionData.p5 = move.codeFromAtoB(actionData.p3, actionData.p4, interactionData.actionTarget.x, interactionData.actionTarget.y);
  }

  @Override
  public void invoke(ActionData data) {
    Unit load = model.getUnit(data.p2);
    Unit transporter = model.getUnit(data.p1);

    transport.unload(transporter, load);

    // add commands in reverse order
    int inactive = Constants.INACTIVE;
    actions.localActionLIFO("wait", data.p1, inactive, inactive, inactive, inactive);
    actions.localActionLIFO("moveEnd", 0, 1, inactive, inactive, inactive);
    actions.localActionLIFO("moveAppend", data.p5, inactive, inactive, inactive, inactive);
    actions.localActionLIFO("moveStart", data.p2, data.p3, data.p4, inactive, inactive);
  }

}
