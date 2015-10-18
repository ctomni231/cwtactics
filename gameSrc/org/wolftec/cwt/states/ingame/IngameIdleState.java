package org.wolftec.cwt.states.ingame;

import org.wolftec.cwt.core.Option;
import org.wolftec.cwt.core.state.AbstractIngameState;
import org.wolftec.cwt.core.state.StateFlowData;
import org.wolftec.cwt.logic.BattleLogic;
import org.wolftec.cwt.logic.MoveLogic;
import org.wolftec.cwt.model.gameround.ModelManager;
import org.wolftec.cwt.model.gameround.Unit;
import org.wolftec.cwt.states.UserInteractionData;

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

    boolean movableUnitAtSource = data.source.unit.isPresent() && data.source.unit.get().canAct && move.canMoveSomewhere(model, data.source);

    transition.setTransitionTo(movableUnitAtSource ? "IngameMovepathSelectionState" : "IngameMenuState");
  }

  @Override
  public void handleButtonB(StateFlowData transition, int delta) {
    data.source.set(model, data.cursorX, data.cursorY);
    Option<Unit> sourceUnit = data.source.unit;
    if (sourceUnit.isPresent() && (battle.hasMainWeapon(sourceUnit.get()) || battle.hasSecondaryWeapon(sourceUnit.get()))) {
      transition.setTransitionTo("IngameShowAttackRangeState");
    }
  }
}