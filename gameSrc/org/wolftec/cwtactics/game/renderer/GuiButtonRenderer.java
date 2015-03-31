package org.wolftec.cwtactics.game.renderer;

import org.wolftec.wCore.core.ComponentManager;
import org.wolftec.wCore.core.Injected;
import org.wolftec.wCore.core.ManagedComponent;
import org.wolftec.wCore.core.ManagedComponentInitialization;
import org.wolftec.wCore.i18n.LocalizationManager;
import org.wolftec.wPlay.gui.UiElement;
import org.wolftec.wPlay.gui.UiRenderer;
import org.wolftec.wPlay.layergfx.GraphicLayer;

@ManagedComponent
public class GuiButtonRenderer implements UiRenderer, ManagedComponentInitialization {

  @Injected
  private LocalizationManager i18n;

  // TODO this is not good
  public static GuiButtonRenderer INSTANCE;

  @Override
  public void onComponentConstruction(ComponentManager manager) {
    INSTANCE = this;
  }

  @Override
  public void renderElement(GraphicLayer layer, UiElement element) {
    String buttonText = i18n.solveKey(element.data.$get("buttonText"));
  }

}
