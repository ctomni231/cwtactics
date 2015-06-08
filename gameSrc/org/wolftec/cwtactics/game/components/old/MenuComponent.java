package org.wolftec.cwtactics.game.components.old;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.annotation.SyntheticType;
import org.wolftec.cwtactics.game.IEntityComponent;

public class MenuComponent implements IEntityComponent {

  private static final int MENU_SIZE = 10;

  @SyntheticType
  public static class MenuEntry {
    public String key;
    public boolean disabled;
  }

  public Array<MenuEntry> entries;

  public MenuComponent() {
    entries = JSCollections.$array();
    for (int i = 0; i < MENU_SIZE; i++) {
      entries.push(new MenuEntry());
    }
  }

  public void clear() {
    for (int i = 0; i < MENU_SIZE; i++) {
      MenuEntry entry = entries.$get(i);
      entry.key = null;
      entry.disabled = false;
    }
  }

  /**
   * Adds an menu entry.
   * 
   * @param key
   * @param disabled
   * @return true when added, else false
   */
  public boolean addEntry(String key, boolean disabled) {
    for (int i = 0; i < MENU_SIZE; i++) {
      MenuEntry entry = entries.$get(i);
      if (entry.key == null) {
        entry.key = key;
        entry.disabled = disabled;
        return true;
      }
    }
    return false;
  }
}
