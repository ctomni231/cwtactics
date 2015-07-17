package org.wolftec.cwtactics.game.systems;

import org.wolftec.cwtactics.game.components.Config;
import org.wolftec.cwtactics.game.components.ValueMetaData;
import org.wolftec.cwtactics.game.core.Log;
import org.wolftec.cwtactics.game.core.syscomponent.Components;
import org.wolftec.cwtactics.game.core.systems.System;
import org.wolftec.cwtactics.game.events.gameround.GameroundStart;

public class ConfigSystem implements System, GameroundStart {

  private Log                       log;

  private Components<Config>        configs;
  private Components<ValueMetaData> configMetas;

  @Override
  public void gameroundStart() {
    log.info("going to reset all config values");
    configs.each((cfgKey, cfg) -> cfg.value = configMetas.get(cfgKey).defaultValue);
  }

  // @Override
  // public void onConfigUpdate(String configName, boolean increaseValue) {
  // Config cfg = em().getComponent(configName, Config.class);
  // ValueMetaData meta = em().getComponent(configName, ValueMetaData.class);
  //
  // if (increaseValue) {
  // if (cfg.value + meta.changeValue <= meta.upperBound) cfg.value +=
  // meta.changeValue;
  // } else {
  // if (cfg.value - meta.changeValue >= meta.upperBound) cfg.value -=
  // meta.changeValue;
  // }
  // }
}
