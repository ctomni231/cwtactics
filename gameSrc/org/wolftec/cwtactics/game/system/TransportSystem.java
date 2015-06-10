package org.wolftec.cwtactics.game.system;

import org.wolftec.cwtactics.engine.ischeck.Is;
import org.wolftec.cwtactics.engine.util.JsUtil;
import org.wolftec.cwtactics.game.EntityManager;
import org.wolftec.cwtactics.game.components.Transporter;
import org.wolftec.cwtactics.game.core.Asserter;
import org.wolftec.cwtactics.game.core.ConstructedClass;
import org.wolftec.cwtactics.game.event.LoadEntityEvent;

public class TransportSystem implements ConstructedClass, LoadEntityEvent {

  private EntityManager em;
  private Asserter asserter;

  @Override
  public void onConstruction() {
  }

  @Override
  public void onLoadEntity(String entity, String entityType, Object data) {
    switch (entityType) {
      case LoadEntityEvent.TYPE_UNIT_DATA:
        Transporter transporter = em.tryAcquireComponentFromData(entity, data, Transporter.class);
        if (transporter != null) {
          asserter.assertTrue("transporter.slots int", Is.is.integer(transporter.slots));
          asserter.assertTrue("transporter.slots > 0", Is.is.above(transporter.slots, 0));
          asserter.assertTrue("transporter.slots < 10", Is.is.under(transporter.slots, 11));

          asserter.assertTrue("transporter.loads array", Is.is.array(transporter.loads));
          JsUtil.forEachArrayValue(transporter.loads, (index, entry) -> {
            asserter.assertTrue("transporter.loads(v) str", Is.is.string(entry));
            asserter.assertTrue("transporter.loads(v) entity", em.isEntity(entry));
          });
        }
        break;
    }
  }
}
