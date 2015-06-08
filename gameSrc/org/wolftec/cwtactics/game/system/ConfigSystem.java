package org.wolftec.cwtactics.game.system;

import org.wolftec.cwtactics.game.ISystem;
import org.wolftec.cwtactics.game.components.ConfigMetaComponent;
import org.wolftec.cwtactics.game.components.ConfigValueComponent;
import org.wolftec.cwtactics.game.event.ConfigUpdateEvent;

public class ConfigSystem implements ISystem, ConfigUpdateEvent {

  @Override
  public void onConfigUpdate(String configName, boolean increaseValue) {
    ConfigValueComponent cfg = em().getComponent(configName, ConfigValueComponent.class);
    ConfigMetaComponent meta = em().getComponent(configName, ConfigMetaComponent.class);

    if (increaseValue) {
      if (cfg.value + meta.changeValue <= meta.upperBound) cfg.value += meta.changeValue;
    } else {
      if (cfg.value - meta.changeValue >= meta.upperBound) cfg.value -= meta.changeValue;
    }
  }
}
