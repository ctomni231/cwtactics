package org.wolftec.cwtactics.game.components.old;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.annotation.SyntheticType;
import org.wolftec.cwtactics.game.IEntityComponent;

public class MenuCmp implements IEntityComponent {

  @SyntheticType
  public static class MenuEntry {
    public String key;
    public boolean enabled;
  }

  public Array<MenuEntry> entries;

  public MenuCmp() {

    // TODO constants

    entries = JSCollections.$array();
    for (int i = 0; i < 10; i++) {
      entries.push(new MenuEntry());
    }
  }
}
