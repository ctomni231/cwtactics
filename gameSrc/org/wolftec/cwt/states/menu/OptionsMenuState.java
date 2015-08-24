package org.wolftec.cwt.states.menu;

import org.stjs.javascript.JSCollections;
import org.wolftec.cwt.input.AbstractMenuState;
import org.wolftec.cwt.states.AbstractState;
import org.wolftec.cwt.states.GameActions;
import org.wolftec.cwt.system.Maybe;

public class OptionsMenuState extends AbstractMenuState {

  private static final String            UIC_WIPEOUT                 = "WIPEOUT";
  private static final String            UIC_BACK                    = "BACK";
  private static final String            UIC_REMAP_GAMEPAD           = "REMAP_GAMEPAD";
  private static final String            UIC_REMAP_KEYBOARD          = "REMAP_KEYBOARD";
  private static final String            UIC_CHECKBOX_FORCE_TOUCH    = "CHECKBOX_FORCE_TOUCH";
  private static final String            UIC_CHECKBOX_ANIMATED_TILES = "CHECKBOX_ANIMATED_TILES";
  private static final String            UIC_INCREASE_SFX            = "INCREASE_SFX";
  private static final String            UIC_INCREASE_MUSIC          = "INCREASE_MUSIC";
  private static final String            UIC_DECREASE_MUSIC          = "DECREASE_MUSIC";
  private static final String            UIC_DECREASE_SFX            = "DECREASE_SFX";

  private Class<? extends AbstractState> last;

  @Override
  public void onConstruction() {

    ui.registerMulti(UIC_DECREASE_SFX, JSCollections.$array(GameActions.BUTTON_LEFT, GameActions.BUTTON_RIGHT), UIC_INCREASE_SFX);
    ui.register(UIC_DECREASE_SFX, GameActions.BUTTON_DOWN, UIC_DECREASE_MUSIC);
    ui.register(UIC_DECREASE_SFX, GameActions.BUTTON_UP, UIC_BACK);

    ui.registerMulti(UIC_INCREASE_SFX, JSCollections.$array(GameActions.BUTTON_LEFT, GameActions.BUTTON_RIGHT), UIC_DECREASE_SFX);
    ui.register(UIC_INCREASE_SFX, GameActions.BUTTON_DOWN, UIC_INCREASE_MUSIC);
    ui.register(UIC_INCREASE_SFX, GameActions.BUTTON_UP, UIC_BACK);

    ui.registerMulti(UIC_DECREASE_MUSIC, JSCollections.$array(GameActions.BUTTON_LEFT, GameActions.BUTTON_RIGHT), UIC_INCREASE_MUSIC);
    ui.register(UIC_DECREASE_MUSIC, GameActions.BUTTON_UP, UIC_DECREASE_SFX);
    ui.register(UIC_DECREASE_MUSIC, GameActions.BUTTON_DOWN, UIC_CHECKBOX_ANIMATED_TILES);

    ui.registerMulti(UIC_INCREASE_MUSIC, JSCollections.$array(GameActions.BUTTON_LEFT, GameActions.BUTTON_RIGHT), UIC_DECREASE_MUSIC);
    ui.register(UIC_INCREASE_MUSIC, GameActions.BUTTON_UP, UIC_INCREASE_SFX);
    ui.register(UIC_INCREASE_MUSIC, GameActions.BUTTON_DOWN, UIC_CHECKBOX_ANIMATED_TILES);

    ui.register(UIC_CHECKBOX_ANIMATED_TILES, GameActions.BUTTON_UP, UIC_INCREASE_SFX);
    ui.register(UIC_CHECKBOX_ANIMATED_TILES, GameActions.BUTTON_DOWN, UIC_CHECKBOX_FORCE_TOUCH);

    ui.register(UIC_CHECKBOX_FORCE_TOUCH, GameActions.BUTTON_UP, UIC_CHECKBOX_ANIMATED_TILES);
    ui.register(UIC_CHECKBOX_FORCE_TOUCH, GameActions.BUTTON_DOWN, UIC_REMAP_KEYBOARD);

    ui.register(UIC_REMAP_KEYBOARD, GameActions.BUTTON_UP, UIC_CHECKBOX_FORCE_TOUCH);
    ui.register(UIC_REMAP_KEYBOARD, GameActions.BUTTON_DOWN, UIC_REMAP_GAMEPAD);

    ui.register(UIC_REMAP_GAMEPAD, GameActions.BUTTON_UP, UIC_REMAP_KEYBOARD);
    ui.register(UIC_REMAP_GAMEPAD, GameActions.BUTTON_DOWN, UIC_WIPEOUT);

    ui.register(UIC_WIPEOUT, GameActions.BUTTON_UP, UIC_REMAP_GAMEPAD);
    ui.register(UIC_WIPEOUT, GameActions.BUTTON_DOWN, UIC_BACK);

    ui.register(UIC_BACK, GameActions.BUTTON_UP, UIC_WIPEOUT);
    ui.register(UIC_BACK, GameActions.BUTTON_DOWN, UIC_DECREASE_SFX);

  }

  @Override
  public void onEnter(Maybe<Class<? extends AbstractState>> previous) {
    last = previous.get();
    ui.setState(UIC_DECREASE_SFX);
  }

  @Override
  public Maybe<Class<? extends AbstractState>> handleButtonA(int delta, String currentUiState) {
    if (currentUiState == UIC_BACK) {
      return Maybe.of(last);
    }
    return NO_TRANSITION;
  }

}
