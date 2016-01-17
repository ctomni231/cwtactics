package org.wolftec.cwt.action.actions;

import org.wolftec.cwt.Constants;
import org.wolftec.cwt.action.Action;
import org.wolftec.cwt.action.ActionData;
import org.wolftec.cwt.action.ActionService;
import org.wolftec.cwt.action.ActionType;
import org.wolftec.cwt.action.TargetSelectionMode;
import org.wolftec.cwt.collection.RingList;
import org.wolftec.cwt.logic.MoveLogic;
import org.wolftec.cwt.logic.TransportLogic;
import org.wolftec.cwt.model.gameround.ModelManager;
import org.wolftec.cwt.model.gameround.Unit;
import org.wolftec.cwt.model.sheets.SheetManager;
import org.wolftec.cwt.model.sheets.types.MoveType;
import org.wolftec.cwt.states.base.StateFlowData;
import org.wolftec.cwt.ui.UserInteractionData;

public class UnloadUnit implements Action
{

  private ModelManager model;
  private TransportLogic transport;
  private SheetManager sheets;
  private MoveLogic move;
  private ActionService actions;

  private RingList<Integer> unloadMovepath;

  @Override
  public void onConstruction()
  {
    unloadMovepath = new RingList<>(1);
  }

  @Override
  public String key()
  {
    return "unloadUnit";
  }

  @Override
  public ActionType type()
  {
    return ActionType.UNIT_ACTION;
  }

  @Override
  public boolean multiStepAction()
  {
    return true;
  }

  @Override
  public boolean condition(UserInteractionData data)
  {
    return transport.isTransportUnit(data.source.unit)
        && transport.canUnloadSomethingAt(data.source.unit, data.target.x, data.target.y);
  }

  @Override
  public boolean hasSubMenu()
  {
    return true;
  }

  @Override
  public void prepareActionMenu(UserInteractionData data)
  {
    for (int i = 0, e = Constants.MAX_PLAYER * Constants.MAX_UNITS; i < e; i++)
    {
      if (model.getUnit(i).loadedIn == data.source.unitId)
      {
        data.addInfo(i + "", true);
      }
    }
  }

  @Override
  public TargetSelectionMode targetSelectionType()
  {
    return TargetSelectionMode.B;
  }

  @Override
  public void prepareTargets(UserInteractionData data)
  {
    MoveType loadMovetype = sheets.movetypes.get(model.getUnit(data.actionDataCode).type.movetype);
    Unit transporter = data.source.unit;
    int x = data.target.x;
    int y = data.target.y;

    // check west
    if (move.canTypeMoveTo(loadMovetype, x - 1, y))
    {
      data.targets.setValue(x - 1, y, 1);
    }

    // check east
    if (move.canTypeMoveTo(loadMovetype, x + 1, y))
    {
      data.targets.setValue(x + 1, y, 1);
    }

    // check south
    if (move.canTypeMoveTo(loadMovetype, x, y + 1))
    {
      data.targets.setValue(x, y + 1, 1);
    }

    // check north
    if (move.canTypeMoveTo(loadMovetype, x, y - 1))
    {
      data.targets.setValue(x, y - 1, 1);
    }
  }

  @Override
  public void fillData(UserInteractionData interactionData, ActionData actionData)
  {
    actionData.p1 = interactionData.source.unitId;
    actionData.p2 = interactionData.actionDataCode;
    actionData.p3 = interactionData.target.x;
    actionData.p4 = interactionData.target.y;
    actionData.p5 = move.codeFromAtoB(actionData.p3, actionData.p4, interactionData.actionTarget.x,
                                      interactionData.actionTarget.y);
  }

  @Override
  public void evaluateByData(int delta, ActionData data, StateFlowData stateTransition)
  {
    Unit load = model.getUnit(data.p2);
    Unit transporter = model.getUnit(data.p1);

    transport.unload(transporter, load);
    unloadMovepath.clear();
    unloadMovepath.push(data.p5);
    move.move(load, data.p3, data.p4, unloadMovepath, true, true, false);
  }

}
