package org.wolftec.cwtactics.game.system.actions;

import org.wolftec.cwtactics.engine.util.ClassUtil;
import org.wolftec.cwtactics.game.components.data.SingleUse;
import org.wolftec.cwtactics.game.components.menu.MenuCmp;
import org.wolftec.cwtactics.game.components.menu.MenuCmp.MenuEntry;
import org.wolftec.cwtactics.game.system.ISystem;

public class WaitAction implements ISystem {

  @Override
  public void onInit() {

    events().CLICK_ON_TILE.subscribe((tile, property, unit) -> {
      MenuEntry entry = gec("MENU", MenuCmp.class).entries.$get(0);
      entry.enabled = true;
      entry.key = ClassUtil.getClassName(WaitAction.class);
    });

    events().INVOKE_ACTION.subscribe((action, p1, p2, p3) -> {
      if (action == ClassUtil.getClassName(WaitAction.class)) {
        gec(p1, SingleUse.class).used = true;
        events().OBJECT_WAITS.publish(p1);
      }
    });
  }
}
