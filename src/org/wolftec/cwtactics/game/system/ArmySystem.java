package org.wolftec.cwtactics.game.system;

import org.wolftec.cwtactics.game.EntityManager;
import org.wolftec.cwtactics.game.components.game.Army;
import org.wolftec.cwtactics.game.core.Asserter;
import org.wolftec.cwtactics.game.core.ConstructedClass;
import org.wolftec.cwtactics.game.event.LoadEntityEvent;

public class ArmySystem implements ConstructedClass, LoadEntityEvent {

  private EntityManager em;
  private Asserter asserter;

  @Override public void onConstruction() {
  }

  @Override public void onLoadEntity(String entity, String entityType, Object data) {
    switch (entityType) {
      case LoadEntityEvent.TYPE_ARMY_DATA:
        em.tryAcquireComponentFromDataSuccessCb(entity, data, Army.class, (army) -> {
          asserter.inspectValue("Army.name of " + entity, army.name).isString();
          asserter.inspectValue("Army.music of " + entity, army.music).isString();
          asserter.inspectValue("Army.color of " + entity, army.color).isIntWithinRange(0, 999);
        });
        break;
    }
  }
}
