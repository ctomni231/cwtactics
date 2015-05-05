package org.wolftec.cwtactics.gameold.domain.menu;

public class MenuEntry {

  public String content;
  public boolean enabled;

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