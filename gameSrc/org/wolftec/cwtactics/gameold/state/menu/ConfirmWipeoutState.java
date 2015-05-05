package org.wolftec.cwtactics.gameold.state.menu;

import org.wolftec.wCore.core.BrowserUtil;
import org.wolftec.wCore.core.Injected;
import org.wolftec.wCore.core.ManagedComponent;
import org.wolftec.wCore.persistence.VirtualFilesystemManager;
import org.wolftec.wPlay.gui.UiTextFieldRenderer;
import org.wolftec.wPlay.gui.UiContainer;
import org.wolftec.wPlay.state.MenuState;
import org.wolftec.wPlay.state.StateManager;

@Constructed
public class ConfirmWipeoutState extends MenuState {

  @Injected
  private UiTextFieldRenderer textRenderer;

  @Injected
  private VirtualFilesystemManager storage;

  @Override
  public void createLayout(StateManager stm) {
    createTextField(root, textRenderer, "options.wipeout.message", "10% 20% 80% 40%");
    UiContainer menu = createContainer(root, null, "10% 70% 40% 20%");
    createActionButton(menu, null, "options.wipeout.no", "0 0 50% 100%", () -> stm.changeToStateClass(OptionsMainState.class));
    createActionButton(menu, null, "options.wipeout.yes", "0 0 50% 100%", () -> {
      storage.purgeKeys(null, (err) -> BrowserUtil.reloadCurrentURL());
    });
  }
}
