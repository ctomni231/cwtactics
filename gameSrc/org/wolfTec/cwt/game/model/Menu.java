package org.wolfTec.cwt.game.model;

import org.stjs.javascript.annotation.Template;
import org.wolfTec.cwt.utility.beans.InjectedByFactory;
import org.wolfTec.cwt.utility.container.CircularBuffer;

public class Menu {

  private int selectedIndex;
  private int size;

  @InjectedByFactory
  private CircularBuffer<MenuEntry> entries;

  public Menu() {
    this.selectedIndex = 0; // TODO do it different
    for (int i = 0; i < 50; i++) {
      entries.push(new MenuEntry());
    }
  }

  public int getSelectedIndex() {
    return this.selectedIndex;
  }

  public String getSelectedContent() {
    return this.entries.get(this.selectedIndex).getContent();
  }

  public String getContentAt(int index) {
    return this.entries.get(index).getContent();
  }

  @Template("toProperty")
  public int getSize() {
    return size;
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
