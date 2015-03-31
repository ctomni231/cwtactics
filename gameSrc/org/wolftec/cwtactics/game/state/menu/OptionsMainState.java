package org.wolftec.cwtactics.game.state.menu;

import org.wolftec.cwtactics.game.renderer.GuiButtonRenderer;
import org.wolftec.wCore.core.Injected;
import org.wolftec.wPlay.audio.AudioChannel;
import org.wolftec.wPlay.audio.AudioManager;
import org.wolftec.wPlay.gui.MenuUtil;
import org.wolftec.wPlay.gui.UiContainer;
import org.wolftec.wPlay.gui.UiElement;
import org.wolftec.wPlay.gui.UiInputHandler;
import org.wolftec.wPlay.state.MenuState;
import org.wolftec.wPlay.state.StateManager;

public class OptionsMainState implements MenuState {

  @Injected
  private GuiButtonRenderer buttonRenderer;

  @Injected
  private AudioManager audio;

  private UiElement sfx;
  private UiElement music;

  @Override
  public void createLayout(StateManager stm, UiInputHandler input, UiContainer root) {
    UiContainer menu = MenuUtil.createContainer(root, null, "20% 20% 80% 80%");

    // ---------------------- SFX ----------------------
    MenuUtil.createActionButton(menu, input, buttonRenderer, null, "0 0 20% 10%", () -> {
      audio.setVolume(AudioChannel.CHANNEL_SFX, audio.getVolume(AudioChannel.CHANNEL_SFX) - 5);
      sfx.data.$put("buttonText", "" + (audio.getVolume(AudioChannel.CHANNEL_SFX) - 5));
    });
    sfx = MenuUtil.createActionButton(menu, input, buttonRenderer, null, "22% 0 56% 10%", null);
    MenuUtil.createActionButton(menu, input, buttonRenderer, null, "80% 0 20% 10%", () -> {
      audio.setVolume(AudioChannel.CHANNEL_SFX, audio.getVolume(AudioChannel.CHANNEL_SFX) + 5);
      sfx.data.$put("buttonText", "" + (audio.getVolume(AudioChannel.CHANNEL_SFX) + 5));
    });

    // ---------------------- MUSIC ----------------------
    MenuUtil.createActionButton(menu, input, buttonRenderer, null, "0 10% 20% 10%", () -> {
      audio.setVolume(AudioChannel.CHANNEL_BG, audio.getVolume(AudioChannel.CHANNEL_BG) - 5);
      music.data.$put("buttonText", "" + (audio.getVolume(AudioChannel.CHANNEL_BG) - 5));
    });
    music = MenuUtil.createActionButton(menu, input, buttonRenderer, null, "22% 10% 56% 10%", null);
    MenuUtil.createActionButton(menu, input, buttonRenderer, null, "80% 10% 20% 10%", () -> {
      audio.setVolume(AudioChannel.CHANNEL_BG, audio.getVolume(AudioChannel.CHANNEL_BG) + 5);
      music.data.$put("buttonText", "" + (audio.getVolume(AudioChannel.CHANNEL_BG) + 5));
    });
  }
}
