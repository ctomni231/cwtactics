package org.wolftec.cwtactics.game.system.old;

import org.wolftec.cwtactics.engine.util.ClassUtil;
import org.wolftec.cwtactics.game.ISystem;
import org.wolftec.cwtactics.game.components.old.MenuCmp;
import org.wolftec.cwtactics.game.components.old.SingleUse;
import org.wolftec.cwtactics.game.components.old.MenuCmp.MenuEntry;

public class WaitAction implements ISystem {

  @Override
  public void onConstruction() {

    events().CLICK_ON_TILE.subscribe((tile, property, unit) -> {
      if (property == null && unit == null) {
        MenuEntry entry = gec("MENU", MenuCmp.class).entries.$get(0);
        entry.enabled = true;
        entry.key = ClassUtil.getClassName(WaitAction.class);
      }
    });

    events().INVOKE_ACTION.subscribe((action, p1, p2, p3) -> {
      if (action == ClassUtil.getClassName(WaitAction.class)) {
        gec(p1, SingleUse.class).used = true;
        events().OBJECT_WAITS.publish(p1);
      }
    });
  }
}
