package org.wolftec.cwt.states.menu;

import org.wolftec.cwt.input.InputManager;
import org.wolftec.cwt.states.GameActions;
import org.wolftec.cwt.states.State;
import org.wolftec.cwt.states.UserInteractionData;
import org.wolftec.cwt.states.UserInteractionMap;
import org.wolftec.cwt.states.ingame.IngameEnter;
import org.wolftec.cwt.system.Log;
import org.wolftec.cwt.system.Maybe;

public class MapSelectionState implements State {

  private Log                 log;
  private UserInteractionData data;
  private UserInteractionMap  mapping;

  @Override
  public void onConstruction() {
    mapping.register("TEST_A", GameActions.BUTTON_LEFT, "TEST_B");
    mapping.register("TEST_B", GameActions.BUTTON_LEFT, "TEST_A");
    mapping.register("TEST_A", GameActions.BUTTON_RIGHT, "TEST_B");
    mapping.register("TEST_B", GameActions.BUTTON_RIGHT, "TEST_A");
    mapping.setState("TEST_A");
  }

  @Override
  public Maybe<Class<? extends State>> update(int delta, InputManager input) {

    if (input.isActionPressed(GameActions.BUTTON_LEFT)) {
      mapping.event(GameActions.BUTTON_LEFT);
      log.info("new input state " + mapping.getState());
    } else if (input.isActionPressed(GameActions.BUTTON_RIGHT)) {
      mapping.event(GameActions.BUTTON_RIGHT);
      log.info("new input state " + mapping.getState());
    }

    return Maybe.of(IngameEnter.class);
  }
}
