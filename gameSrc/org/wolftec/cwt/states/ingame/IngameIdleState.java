package org.wolftec.cwt.states.ingame;

import org.wolftec.cwt.logic.BattleLogic;
import org.wolftec.cwt.logic.MoveLogic;
import org.wolftec.cwt.model.ModelManager;
import org.wolftec.cwt.model.Unit;
import org.wolftec.cwt.states.AbstractIngameState;
import org.wolftec.cwt.states.StateTransition;
import org.wolftec.cwt.states.UserInteractionData;

public class IngameIdleState extends AbstractIngameState {

  private UserInteractionData data;
  private ModelManager        model;
  private MoveLogic           move;
  private BattleLogic         battle;

  @Override
  public void onEnter(StateTransition transition) {
    data.source.clean();
    data.target.clean();
    data.actionTarget.clean();
  }

  @Override
  public void handleButtonA(StateTransition transition, int delta) {
    data.source.set(model, data.cursorX, data.cursorY);
    data.target.set(model, data.cursorX, data.cursorY);

    boolean movableUnitAtSource = data.source.unit != null && data.source.unit.canAct && move.canMoveSomewhere(model, data.source);

    transition.setTransitionTo(movableUnitAtSource ? "IngameMovepathSelectionState" : "IngameMenuState");
  }

  @Override
  public void handleButtonB(StateTransition transition, int delta) {
    data.source.set(model, data.cursorX, data.cursorY);
    Unit sourceUnit = data.source.unit;
    if (sourceUnit != null && (battle.hasMainWeapon(sourceUnit) || battle.hasSecondaryWeapon(sourceUnit))) {
      transition.setTransitionTo("IngameShowAttackRangeState");
    }
  }
}