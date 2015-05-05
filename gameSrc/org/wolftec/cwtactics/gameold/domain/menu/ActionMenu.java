package org.wolftec.cwtactics.gameold.domain.menu;

import org.wolftec.cwtactics.EngineGlobals;
import org.wolftec.wCore.container.CircularBuffer;
import org.wolftec.wCore.core.ComponentManager;
import org.wolftec.wCore.core.ManagedComponent;
import org.wolftec.wCore.core.ManagedComponentInitialization;

@Constructed
public class ActionMenu implements ManagedComponentInitialization {

  private CircularBuffer<MenuEntry> entries;
  public int selectedIndex;
  public int size;

  @Override
  public void onComponentConstruction(ComponentManager manager) {
    entries = new CircularBuffer<MenuEntry>(EngineGlobals.MENU_ELEMENTS_MAX);
    this.selectedIndex = 0;
    for (int i = 0; i < entries.getSize(); i++) {
      entries.push(new MenuEntry());
    }
  }

  public String getSelectedContent() {
    return this.entries.get(this.selectedIndex).getContent();
  }

  public String getContentAt(int index) {
    return this.entries.get(index).getContent();
  }

  public boolean isSelectedEntryEnabled() {
    return this.entries.get(this.selectedIndex).isEnabled();
  }

  public void clean() {
    // release string references
    for (int i = 0, e = this.entries.getSize(); i < e; i++) {
      this.entries.get(i).setContent(null);
    }

    this.selectedIndex = 0;
    this.size = 0;
  }

  /**
   * 
   * @param content
   * @param enabled
   */
  public void addEntry(String content, boolean enabled) {
    if (this.entries.getSize() == this.size) {
      throw new IllegalStateException("IndexOutOfBounds");
    }

    MenuEntry entry = this.entries.get(this.size);
    entry.setContent(content);
    entry.setEnabled(enabled);
    this.size++;
  }
}
