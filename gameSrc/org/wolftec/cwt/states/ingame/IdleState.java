package org.wolftec.cwt.states.ingame;

import org.wolftec.cwt.input.InputManager;
import org.wolftec.cwt.logic.BattleLogic;
import org.wolftec.cwt.model.ModelManager;
import org.wolftec.cwt.model.Unit;
import org.wolftec.cwt.states.GameActions;
import org.wolftec.cwt.states.State;
import org.wolftec.cwt.states.UserInteractionData;
import org.wolftec.cwt.system.Maybe;

public class IdleState implements State {

  private UserInteractionData data;
  private ModelManager        model;
  private BattleLogic         battle;

  @Override
  public void onEnter() {
    data.source.clean();
    data.target.clean();
    data.actionTarget.clean();
  }

  @Override
  public Maybe<Class<? extends State>> update(int delta, InputManager input) {

    if (input.isActionPressed(GameActions.BUTTON_A)) {
      data.source.set(model, input.lastX, input.lastY);
      data.target.set(model, input.lastX, input.lastY);
      return Maybe.of(MovepathSelectionState.class);
    }

    if (input.isActionPressed(GameActions.BUTTON_B)) {
      data.source.set(model, input.lastX, input.lastY);
      Unit unit = data.source.unit;
      if (unit != null && (battle.hasMainWeapon(unit) || battle.hasSecondaryWeapon(unit))) {
        return Maybe.of(ShowAttackRangeState.class);
      }
    }

    return NO_TRANSITION;
  }
}
