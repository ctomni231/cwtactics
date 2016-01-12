package org.wolftec.cwt.states.ingame;

import org.wolftec.cwt.action.ActionService;
import org.wolftec.cwt.input.InputService;
import org.wolftec.cwt.logic.BattleLogic;
import org.wolftec.cwt.logic.MoveLogic;
import org.wolftec.cwt.model.gameround.Unit;
import org.wolftec.cwt.states.base.AbstractIngameState;
import org.wolftec.cwt.states.base.StateFlowData;
import org.wolftec.cwt.ui.UserInteractionData;
import org.wolftec.cwt.util.NullUtil;

public class IngameIdleState extends AbstractIngameState
{

  private UserInteractionData data;
  private MoveLogic           move;
  private BattleLogic         battle;
  private ActionService       actions;

  @Override
  public void onEnter(StateFlowData transition)
  {
    data.source.clean();
    data.target.clean();
    data.actionTarget.clean();
    data.actor = model.turnOwner;
  }

  @Override
  public void update(StateFlowData flowData, int delta, InputService input)
  {

    /*
     * We move out of this state directly here when we have actions in the
     * actions buffer.
     */
    if (actions.hasData())
    {
      flowData.setTransitionTo("IngameEvalActionState");

    }
    else
    {
      super.update(flowData, delta, input);
    }
  }

  @Override
  public void handleButtonA(StateFlowData transition, int delta)
  {
    model.updatePositionData(data.source, data.cursorX, data.cursorY);
    model.updatePositionData(data.target, data.cursorX, data.cursorY);

    boolean movableUnitAtSource = NullUtil.isPresent(data.source.unit) && data.source.unit.canAct
        && move.canMoveSomewhere(model, data.source);

    transition.setTransitionTo(movableUnitAtSource ? "IngameMovepathSelectionState" : "IngameMenuState");
  }

  @Override
  public void handleButtonB(StateFlowData transition, int delta)
  {
    model.updatePositionData(data.source, data.cursorX, data.cursorY);
    Unit sourceUnit = data.source.unit;
    if (NullUtil.isPresent(sourceUnit) && !battle.cannotAttack(sourceUnit))
    {
      transition.setTransitionTo("IngameShowAttackRangeState");
    }
  }
}