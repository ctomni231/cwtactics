package org.wolftec.cwt.states.menu;

import org.stjs.javascript.JSCollections;
import org.wolftec.cwt.audio.AudioService;
import org.wolftec.cwt.serialization.SaveManager;
import org.wolftec.cwt.states.base.AbstractMenuState;
import org.wolftec.cwt.states.base.GameActions;
import org.wolftec.cwt.states.base.StateFlowData;
import org.wolftec.cwt.util.JsUtil;

public class OptionsMenuState extends AbstractMenuState {

  public static final String UIC_WIPEOUT = "WIPEOUT";
  public static final String UIC_BACK = "BACK";
  public static final String UIC_REMAP_GAMEPAD = "REMAP_GAMEPAD";
  public static final String UIC_REMAP_KEYBOARD = "REMAP_KEYBOARD";
  public static final String UIC_CHECKBOX_FORCE_TOUCH = "CHECKBOX_FORCE_TOUCH";
  public static final String UIC_CHECKBOX_ANIMATED_TILES = "CHECKBOX_ANIMATED_TILES";
  public static final String UIC_INCREASE_SFX = "INCREASE_SFX";
  public static final String UIC_INCREASE_MUSIC = "INCREASE_MUSIC";
  public static final String UIC_DECREASE_MUSIC = "DECREASE_MUSIC";
  public static final String UIC_DECREASE_SFX = "DECREASE_SFX";

  private AudioService audio;
  protected SaveManager saving;

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
  public void onEnter(StateFlowData transition) {
    ui.setState(UIC_DECREASE_SFX);
  }

  @Override
  public void handleButtonA(StateFlowData transition, int delta, String currentUiState) {

    switch (currentUiState) {

      case UIC_DECREASE_SFX:
        audio.setSfxVolume(audio.getSfxVolume() - 0.05f);
        break;

      case UIC_INCREASE_SFX:
        audio.setSfxVolume(audio.getSfxVolume() + 0.05f);
        break;

      case UIC_DECREASE_MUSIC:
        audio.setMusicVolume(audio.getMusicVolume() - 0.05f);
        break;

      case UIC_INCREASE_MUSIC:
        audio.setMusicVolume(audio.getMusicVolume() + 0.05f);
        break;

      case UIC_CHECKBOX_ANIMATED_TILES:
      case UIC_CHECKBOX_FORCE_TOUCH:
      case UIC_REMAP_KEYBOARD:
      case UIC_REMAP_GAMEPAD:
        JsUtil.throwError("action is not implemented yet");
        break;

      case UIC_WIPEOUT:
        transition.setTransitionTo("WipeoutConfirmMenuState");
        break;

      case UIC_BACK:
        saving.saveAppData((saveError) -> {
          transition.setTransitionTo(transition.getPreviousState());
        });
        break;
    }
  }

}
