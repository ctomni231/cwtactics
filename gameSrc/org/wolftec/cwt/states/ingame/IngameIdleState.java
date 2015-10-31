package org.wolftec.cwt.states.ingame;

import org.wolftec.cwt.logic.ActionManager;
import org.wolftec.cwt.logic.features.BattleLogic;
import org.wolftec.cwt.logic.features.MoveLogic;
import org.wolftec.cwt.model.gameround.Unit;
import org.wolftec.cwt.states.AbstractIngameState;
import org.wolftec.cwt.states.StateFlowData;
import org.wolftec.cwt.states.UserInteractionData;
import org.wolftec.cwt.system.InputProvider;
import org.wolftec.cwt.util.NullUtil;

public class IngameIdleState extends AbstractIngameState {

  private UserInteractionData data;
  private MoveLogic move;
  private BattleLogic battle;
  private ActionManager actions;

  @Override
  public void onEnter(StateFlowData transition) {
    data.source.clean();
    data.target.clean();
    data.actionTarget.clean();
    data.actor = model.turnOwner;
  }

  @Override
  public void update(StateFlowData flowData, int delta, InputProvider input) {

    /*
     * We move out of this state directly here when we have actions in the
     * actions buffer.
     */
    if (actions.hasData()) {
      flowData.setTransitionTo("IngameEvalActionState");

    } else {
      super.update(flowData, delta, input);
    }
  }

  @Override
  public void handleButtonA(StateFlowData transition, int delta) {
    model.updatePositionData(data.source, data.cursorX, data.cursorY);
    model.updatePositionData(data.target, data.cursorX, data.cursorY);

    boolean movableUnitAtSource = NullUtil.isPresent(data.source.unit) && data.source.unit.canAct && move.canMoveSomewhere(model, data.source);

    transition.setTransitionTo(movableUnitAtSource ? "IngameMovepathSelectionState" : "IngameMenuState");
  }

  @Override
  public void handleButtonB(StateFlowData transition, int delta) {
    model.updatePositionData(data.source, data.cursorX, data.cursorY);
    Unit sourceUnit = data.source.unit;
    if (NullUtil.isPresent(sourceUnit) && !battle.cannotAttack(sourceUnit)) {
      transition.setTransitionTo("IngameShowAttackRangeState");
    }
  }
}