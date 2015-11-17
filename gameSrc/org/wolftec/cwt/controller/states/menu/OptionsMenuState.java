package org.wolftec.cwt.controller.states.menu;

import org.stjs.javascript.JSCollections;
import org.wolftec.cwt.controller.states.base.MenuState;
import org.wolftec.cwt.controller.states.base.GameActionConstants;
import org.wolftec.cwt.controller.states.base.StateFlowData;
import org.wolftec.cwt.core.javascript.JsUtil;
import org.wolftec.cwt.core.persistence.SaveManager;
import org.wolftec.cwt.view.audio.Audio;

public class OptionsMenuState extends MenuState {

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

  private Audio audio;
  protected SaveManager saving;

  @Override
  public void onConstruction() {

    ui.registerMulti(UIC_DECREASE_SFX, JSCollections.$array(GameActionConstants.BUTTON_LEFT, GameActionConstants.BUTTON_RIGHT), UIC_INCREASE_SFX);
    ui.register(UIC_DECREASE_SFX, GameActionConstants.BUTTON_DOWN, UIC_DECREASE_MUSIC);
    ui.register(UIC_DECREASE_SFX, GameActionConstants.BUTTON_UP, UIC_BACK);

    ui.registerMulti(UIC_INCREASE_SFX, JSCollections.$array(GameActionConstants.BUTTON_LEFT, GameActionConstants.BUTTON_RIGHT), UIC_DECREASE_SFX);
    ui.register(UIC_INCREASE_SFX, GameActionConstants.BUTTON_DOWN, UIC_INCREASE_MUSIC);
    ui.register(UIC_INCREASE_SFX, GameActionConstants.BUTTON_UP, UIC_BACK);

    ui.registerMulti(UIC_DECREASE_MUSIC, JSCollections.$array(GameActionConstants.BUTTON_LEFT, GameActionConstants.BUTTON_RIGHT), UIC_INCREASE_MUSIC);
    ui.register(UIC_DECREASE_MUSIC, GameActionConstants.BUTTON_UP, UIC_DECREASE_SFX);
    ui.register(UIC_DECREASE_MUSIC, GameActionConstants.BUTTON_DOWN, UIC_CHECKBOX_ANIMATED_TILES);

    ui.registerMulti(UIC_INCREASE_MUSIC, JSCollections.$array(GameActionConstants.BUTTON_LEFT, GameActionConstants.BUTTON_RIGHT), UIC_DECREASE_MUSIC);
    ui.register(UIC_INCREASE_MUSIC, GameActionConstants.BUTTON_UP, UIC_INCREASE_SFX);
    ui.register(UIC_INCREASE_MUSIC, GameActionConstants.BUTTON_DOWN, UIC_CHECKBOX_ANIMATED_TILES);

    ui.register(UIC_CHECKBOX_ANIMATED_TILES, GameActionConstants.BUTTON_UP, UIC_INCREASE_SFX);
    ui.register(UIC_CHECKBOX_ANIMATED_TILES, GameActionConstants.BUTTON_DOWN, UIC_CHECKBOX_FORCE_TOUCH);

    ui.register(UIC_CHECKBOX_FORCE_TOUCH, GameActionConstants.BUTTON_UP, UIC_CHECKBOX_ANIMATED_TILES);
    ui.register(UIC_CHECKBOX_FORCE_TOUCH, GameActionConstants.BUTTON_DOWN, UIC_REMAP_KEYBOARD);

    ui.register(UIC_REMAP_KEYBOARD, GameActionConstants.BUTTON_UP, UIC_CHECKBOX_FORCE_TOUCH);
    ui.register(UIC_REMAP_KEYBOARD, GameActionConstants.BUTTON_DOWN, UIC_REMAP_GAMEPAD);

    ui.register(UIC_REMAP_GAMEPAD, GameActionConstants.BUTTON_UP, UIC_REMAP_KEYBOARD);
    ui.register(UIC_REMAP_GAMEPAD, GameActionConstants.BUTTON_DOWN, UIC_WIPEOUT);

    ui.register(UIC_WIPEOUT, GameActionConstants.BUTTON_UP, UIC_REMAP_GAMEPAD);
    ui.register(UIC_WIPEOUT, GameActionConstants.BUTTON_DOWN, UIC_BACK);

    ui.register(UIC_BACK, GameActionConstants.BUTTON_UP, UIC_WIPEOUT);
    ui.register(UIC_BACK, GameActionConstants.BUTTON_DOWN, UIC_DECREASE_SFX);

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
