package org.wolftec.cwtactics.system.gui;

import org.wolftec.cwtactics.system.layergfx.GraphicLayer;

public interface UiRenderer {

  void renderElement(GraphicLayer layer, UiElement element);
}
