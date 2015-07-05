package org.wolftec.cwtactics.game.system;

import org.stjs.javascript.Array;
import org.wolftec.cwtactics.game.EntityManager;
import org.wolftec.cwtactics.game.components.game.Config;
import org.wolftec.cwtactics.game.components.game.ValueMetaData;
import org.wolftec.cwtactics.game.core.Log;
import org.wolftec.cwtactics.game.core.System;
import org.wolftec.cwtactics.game.event.game.gameround.GameroundStart;

public class ConfigSystem implements System, GameroundStart {

  private Log log;
  private EntityManager em;

  @Override
  public void gameroundStart() {
    log.info("going to reset all config values");

    Array<String> entities = em.getEntitiesWithComponentType(Config.class);
    for (int i = 0; i < entities.$length(); i++) {
      String entity = entities.$get(i);
      em.getComponent(entity, Config.class).value = em.getComponent(entity, ValueMetaData.class).defaultValue;
    }
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
