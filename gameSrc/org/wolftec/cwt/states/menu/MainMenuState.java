package org.wolftec.cwt.states.menu;

import org.stjs.javascript.JSCollections;
import org.wolftec.cwt.input.AbstractMenuState;
import org.wolftec.cwt.states.AbstractState;
import org.wolftec.cwt.states.GameActions;
import org.wolftec.cwt.system.Maybe;

public class MainMenuState extends AbstractMenuState {

  private static final String            UIC_OPTIONS  = "OPTIONS";
  private static final String            UIC_SKIRMISH = "SKIRMISH";

  private Class<? extends AbstractState> last;

  @Override
  public void onConstruction() {
    ui.registerMulti(UIC_SKIRMISH, JSCollections.$array(GameActions.BUTTON_UP, GameActions.BUTTON_DOWN), UIC_OPTIONS);
    ui.registerMulti(UIC_OPTIONS, JSCollections.$array(GameActions.BUTTON_UP, GameActions.BUTTON_DOWN), UIC_SKIRMISH);
  }

  @Override
  public void onEnter(Maybe<Class<? extends AbstractState>> previous) {
    ui.setState(UIC_SKIRMISH);
    last = previous.get();
  }

  @Override
  public Maybe<Class<? extends AbstractState>> handleButtonA(int delta, String currentUiState) {
    switch (ui.getState()) {

      case UIC_OPTIONS:
        return Maybe.of(OptionsMenuState.class);

      case UIC_SKIRMISH:
        return Maybe.of(MapSelectionState.class);
    }
    return NO_TRANSITION;
  }
}
