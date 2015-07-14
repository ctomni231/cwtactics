package org.wolftec.cwtactics.game.action;

import org.wolftec.cwtactics.game.core.CircularBuffer;
import org.wolftec.cwtactics.game.core.systems.System;

public class MenuSystem implements System {

  public CircularBuffer<MenuEntry> menu;

  @Override
  public void onConstruction() {
    menu = new CircularBuffer<MenuEntry>(50);
  }

}
