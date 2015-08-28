package org.wolftec.cwt.states.ingame;

import org.wolftec.cwt.core.action.ActionManager;
import org.wolftec.cwt.logic.BattleLogic;
import org.wolftec.cwt.model.ModelManager;
import org.wolftec.cwt.states.AbstractState;
import org.wolftec.cwt.states.GameActions;
import org.wolftec.cwt.states.StateTransition;
import org.wolftec.cwt.states.UserInteractionData;

public class IngameIdleState extends AbstractState {

  private UserInteractionData data;
  private ModelManager        model;
  private BattleLogic         battle;
  private ActionManager       actions;

  @Override
  public void onEnter(StateTransition transition) {
    data.source.clean();
    data.target.clean();
    data.actionTarget.clean();
  }

  @Override
  public void update(StateTransition transition, int delta) {

    /*
     * We move out of this state directly here when we have actions in the
     * actions buffer.
     */
    if (actions.hasData()) {
      transition.setTransitionTo(IngameEvalActionState.class);
      return;
    }

    if (input.isActionPressed(GameActions.BUTTON_B)) {
      transition.setTransitionTo(IngameShowAttackRangeState.class);
      return;
    }

    if (input.isActionPressed(GameActions.BUTTON_A)) {
      data.source.set(model, input.lastX, input.lastY);
      data.target.set(model, input.lastX, input.lastY);
      transition.setTransitionTo(IngameMovepathSelectionState.class);
      return;
    }

    //
    // if (input.isActionPressed(GameActions.BUTTON_B)) {
    // data.source.set(model, input.lastX, input.lastY);
    // Unit unit = data.source.unit;
    // if (unit != null && (battle.hasMainWeapon(unit) ||
    // battle.hasSecondaryWeapon(unit))) {
    // return Maybe.of(ShowAttackRangeState.class);
    // }
    // }
  }
}
