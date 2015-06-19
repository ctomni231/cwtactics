package org.wolftec.cwtactics.game.system;

import org.stjs.javascript.Array;
import org.wolftec.cwtactics.game.EntityManager;
import org.wolftec.cwtactics.game.components.Config;
import org.wolftec.cwtactics.game.components.ValueMetaData;
import org.wolftec.cwtactics.game.core.ConstructedClass;
import org.wolftec.cwtactics.game.core.Log;
import org.wolftec.cwtactics.game.event.GameroundEvents;

public class ConfigSystem implements ConstructedClass, GameroundEvents {

  private Log log;
  private EntityManager em;

  @Override
  public void onGameroundStarts() {
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
