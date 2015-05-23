package org.wolftec.cwtactics.game.system.menu;

import org.wolftec.cwtactics.game.components.menu.MenuCmp;
import org.wolftec.cwtactics.game.system.ISystem;

public class MenuSys implements ISystem {

  @Override
  public void onInit() {
    entityManager().acquireEntityWithId("MENU");
    entityManager().acquireEntityComponent("MENU", MenuCmp.class);
  }
}
