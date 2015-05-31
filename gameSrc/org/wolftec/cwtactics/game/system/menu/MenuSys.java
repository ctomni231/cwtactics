package org.wolftec.cwtactics.game.system.menu;

import org.wolftec.cwtactics.game.components.menu.MenuCmp;
import org.wolftec.cwtactics.game.system.ISystem;

public class MenuSys implements ISystem {

  @Override
  public void onConstruction() {

    aewid("MENU");
    aec("MENU", MenuCmp.class);

    events().FLUSHED_ACTION.subscribe(this::onFlushedAction);
  }

  public void onFlushedAction() {
    MenuCmp menu = gec("MENU", MenuCmp.class);
    // TODO clear here ?
  }
}
