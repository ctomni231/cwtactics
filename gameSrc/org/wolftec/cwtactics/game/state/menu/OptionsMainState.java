package org.wolftec.cwtactics.game.state.menu;

import org.wolftec.cwtactics.game.domain.managers.GameConfigManager;
import org.wolftec.wCore.core.Injected;
import org.wolftec.wPlay.audio.AudioChannel;
import org.wolftec.wPlay.audio.AudioManager;
import org.wolftec.wPlay.gui.UiButtonRenderer;
import org.wolftec.wPlay.gui.UiCheckboxRenderer;
import org.wolftec.wPlay.gui.UiContainer;
import org.wolftec.wPlay.gui.UiElement;
import org.wolftec.wPlay.state.MenuState;
import org.wolftec.wPlay.state.StateManager;

public class OptionsMainState extends MenuState {

  @Injected
  private UiButtonRenderer buttonRenderer;

  @Injected
  private UiCheckboxRenderer checkboxRenderer;

  @Injected
  private AudioManager audio;

  @Injected
  private GameConfigManager cfgMgr;

  private boolean enabledAnimatedTiles;
  private boolean enabledForceTouch;

  private UiElement sfx;
  private UiElement music;

  private void updateVolume(UiElement element, int change) {
    AudioChannel ch = element == sfx ? AudioChannel.CHANNEL_SFX : AudioChannel.CHANNEL_BG;
    audio.setVolume(ch, audio.getVolume(ch) + change);
    element.data.$put("buttonText", "" + audio.getVolume(ch));
  }

  @Override
  public void createLayout(StateManager stm) {
    UiContainer menu = createContainer(root, null, "20% 20% 80% 80%");

    createActionButton(menu, buttonRenderer, null, "0 0 20% 10%", () -> updateVolume(sfx, -5));
    sfx = createActionButton(menu, buttonRenderer, null, "22% 0 56% 10%", null);
    createActionButton(menu, buttonRenderer, null, "80% 0 20% 10%", () -> updateVolume(sfx, 5));

    createActionButton(menu, buttonRenderer, null, "0 10% 20% 10%", () -> updateVolume(music, -5));
    music = createActionButton(menu, buttonRenderer, null, "22% 10% 56% 10%", null);
    createActionButton(menu, buttonRenderer, null, "80% 10% 20% 10%", () -> updateVolume(music, 5));

    createActionButton(menu, checkboxRenderer, "options.animatedTiles", "0 25% 100% 10%", () -> enabledAnimatedTiles = !enabledAnimatedTiles);
    createActionButton(menu, checkboxRenderer, "options.forceTouch", "0 35% 100% 10%", () -> enabledForceTouch = !enabledForceTouch);

    createTransitionButton(menu, buttonRenderer, "options.remap.keyboard", "0 55% 50% 10%", OptionsSetMappingState.class);
    createTransitionButton(menu, buttonRenderer, "options.remap.gamepad", "50% 55% 50% 10%", OptionsSetMappingState.class);

    createTransitionButton(menu, buttonRenderer, "options.wipeout", "0 75% 100% 10%", ConfirmWipeoutState.class);

    createActionButton(menu, buttonRenderer, "menu.back", "0 90% 50% 10%", () -> {
      cfgMgr.getConfig("animatedTiles").setValue(enabledAnimatedTiles ? 1 : 0);
      cfgMgr.getConfig("forceTouch").setValue(enabledForceTouch ? 1 : 0);
      cfgMgr.saveData(() -> stm.changeToStateClass(MainMenuState.class));
    });

    registerMenuHandler(stm, MainMenuState.class);
  }
}
