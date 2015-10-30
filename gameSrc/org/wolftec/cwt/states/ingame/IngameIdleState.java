package org.wolftec.cwt.states.ingame;

import org.wolftec.cwt.logic.features.BattleLogic;
import org.wolftec.cwt.logic.features.MoveLogic;
import org.wolftec.cwt.model.gameround.ModelManager;
import org.wolftec.cwt.model.gameround.Unit;
import org.wolftec.cwt.states.UserInteractionData;
import org.wolftec.cwt.util.NullUtil;
import org.wolftec.wTec.state.AbstractIngameState;
import org.wolftec.wTec.state.StateFlowData;

public class IngameIdleState extends AbstractIngameState {

  private UserInteractionData data;
  private ModelManager        model;
  private MoveLogic           move;
  private BattleLogic         battle;

  @Override
  public void onEnter(StateFlowData transition) {
    data.source.clean();
    data.target.clean();
    data.actionTarget.clean();
    data.actor = model.turnOwner;
  }

  @Override
  public void handleButtonA(StateFlowData transition, int delta) {
    data.source.set(model, data.cursorX, data.cursorY);
    data.target.set(model, data.cursorX, data.cursorY);

    boolean movableUnitAtSource = NullUtil.isPresent(data.source.unit) && data.source.unit.canAct && move.canMoveSomewhere(model, data.source);

    transition.setTransitionTo(movableUnitAtSource ? "IngameMovepathSelectionState" : "IngameMenuState");
  }

  @Override
  public void handleButtonB(StateFlowData transition, int delta) {
    data.source.set(model, data.cursorX, data.cursorY);
    Unit sourceUnit = data.source.unit;
    if (NullUtil.isPresent(sourceUnit) && (battle.hasMainWeapon(sourceUnit) || battle.hasSecondaryWeapon(sourceUnit))) {
      transition.setTransitionTo("IngameShowAttackRangeState");
    }
  }
}