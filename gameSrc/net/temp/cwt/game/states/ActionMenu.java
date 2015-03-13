package net.temp.cwt.game.states;

import net.temp.cwt.game.gamemodel.model.MenuEntry;

import org.wolfTec.wolfTecEngine.components.CreatedType;
import org.wolfTec.wolfTecEngine.components.PostConstruct;
import org.wolfTec.wolfTecEngine.container.CircularBuffer;
import org.wolfTec.wolfTecEngine.container.ContainerSize;
import org.wolftec.core.ManagedComponent;

@ManagedComponent
public class ActionMenu {

  public int selectedIndex;
  public int size;

  @CreatedType // TODO ("{size=$options.menuSize}")
  @ContainerSize(20)
  private CircularBuffer<MenuEntry> entries;

  @PostConstruct
  public void init() {
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
