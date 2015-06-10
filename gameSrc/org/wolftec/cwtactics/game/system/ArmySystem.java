package org.wolftec.cwtactics.game.system;

import org.wolftec.cwtactics.Constants;
import org.wolftec.cwtactics.engine.ischeck.Is;
import org.wolftec.cwtactics.game.EntityManager;
import org.wolftec.cwtactics.game.components.Army;
import org.wolftec.cwtactics.game.core.Asserter;
import org.wolftec.cwtactics.game.core.ConstructedClass;
import org.wolftec.cwtactics.game.event.LoadEntityEvent;

public class ArmySystem implements ConstructedClass, LoadEntityEvent {

  private EntityManager em;
  private Asserter asserter;

  @Override
  public void onConstruction() {
  }

  @Override
  public void onLoadEntity(String entity, String entityType, Object data) {
    switch (entityType) {
      case LoadEntityEvent.TYPE_ARMY_DATA:

        Army army = em.tryAcquireComponentFromData(entity, data, Army.class);
        if (army != null) {
          asserter.assertTrue("name string", Is.is.string(army.name));
          asserter.assertTrue("name number of chars", Is.is.equal(army.name.length(), Constants.IDENTIFIER_LENGTH));
          asserter.assertTrue("music string", Is.is.string(army.music));
          asserter.assertTrue("color integer", Is.is.integer(army.color));
          asserter.assertTrue("color greater equals 0", Is.is.above(army.color, -1));
        }

        break;
    }
  }
}
