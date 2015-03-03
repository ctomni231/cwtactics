package org.wolfTec.cwt.game.gamemodel.model;

public class MenuEntry {

  private String content;

  /**
   * True when the entry is enabled, false if not
   */
  private boolean enabled;

  public MenuEntry() {
    setContent(null);
    setEnabled(false);
  }

  public String getContent() {
    return content;
  }

  public void setContent(String content) {
    this.content = content;
  }

  public boolean isEnabled() {
    return enabled;
  }

  public void setEnabled(boolean enabled) {
    this.enabled = enabled;
  }
}