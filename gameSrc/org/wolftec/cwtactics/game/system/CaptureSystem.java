package org.wolftec.cwtactics.game.system;

import org.wolftec.cwtactics.engine.ischeck.Is;
import org.wolftec.cwtactics.game.EntityManager;
import org.wolftec.cwtactics.game.EventEmitter;
import org.wolftec.cwtactics.game.components.Capturable;
import org.wolftec.cwtactics.game.components.Capturer;
import org.wolftec.cwtactics.game.components.Owner;
import org.wolftec.cwtactics.game.core.Asserter;
import org.wolftec.cwtactics.game.core.ConstructedClass;
import org.wolftec.cwtactics.game.event.ActionInvokedEvent;
import org.wolftec.cwtactics.game.event.CaptureEvents;
import org.wolftec.cwtactics.game.event.LoadEntityEvent;

public class CaptureSystem implements ConstructedClass, ActionInvokedEvent, LoadEntityEvent {

  private EventEmitter ev;
  private EntityManager em;
  private Asserter asserter;

  @Override
  public void onLoadEntity(String entity, String entityType, Object data) {
    switch (entityType) {

      case LoadEntityEvent.TYPE_UNIT_DATA:
        Capturer capturer = em.tryAcquireComponentFromData(entity, data, Capturer.class);
        if (capturer != null) {
          asserter.assertTrue("points int", Is.is.integer(capturer.points));
          asserter.assertTrue("points > 0", Is.is.above(capturer.points, 0));
          asserter.assertTrue("points < 100", Is.is.under(capturer.points, 100));
        }
        break;

      case LoadEntityEvent.TYPE_PROPERTY_DATA:
        Capturable capturable = em.tryAcquireComponentFromData(entity, data, Capturable.class);
        if (capturable != null) {
          asserter.assertTrue("points int", Is.is.integer(capturable.points));
          asserter.assertTrue("points > 0", Is.is.above(capturable.points, 0));
          asserter.assertTrue("points < 100", Is.is.under(capturable.points, 100));
          asserter.assertTrue("looseAfterCaptured bool", Is.is.bool(capturable.looseAfterCaptured));
          asserter.assertTrue("changeIntoAfterCaptured str or null", Is.is.string(capturable.changeIntoAfterCaptured)
              || capturable.changeIntoAfterCaptured == null);
        }
        break;
    }
  }

  @Override
  public void onInvokeAction(String action, String pstr, int p1, int p2, int p3, int p4, int p5) {
    if (action == "Capture") {
      String property = null;
      String capturer = null;

      Capturable propertyData = em.getComponent(property, Capturable.class);
      Capturer capturerData = em.getComponent(capturer, Capturer.class);

      propertyData.points -= capturerData.points;
      ev.publish(CaptureEvents.class).onLoweredCapturePoints(capturer, property, capturerData.points);

      if (propertyData.points <= 0) {

        Owner propertyOwner = em.getComponent(property, Owner.class);
        Owner capturerOwner = em.getComponent(capturer, Owner.class);

        propertyOwner.owner = capturerOwner.owner;

        ev.publish(CaptureEvents.class).onCapturedProperty(capturer, property);
      }
    }
  }

}
