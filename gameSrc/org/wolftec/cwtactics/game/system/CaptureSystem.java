package org.wolftec.cwtactics.game.system;

import org.wolftec.cwtactics.game.EntityManager;
import org.wolftec.cwtactics.game.EventEmitter;
import org.wolftec.cwtactics.game.components.Capturable;
import org.wolftec.cwtactics.game.components.Capturer;
import org.wolftec.cwtactics.game.components.Owner;
import org.wolftec.cwtactics.game.core.ConstructedClass;
import org.wolftec.cwtactics.game.event.ActionInvokedEvent;
import org.wolftec.cwtactics.game.event.CaptureEvents;
import org.wolftec.cwtactics.game.event.LoadEntityEvent;

public class CaptureSystem implements ConstructedClass, ActionInvokedEvent, LoadEntityEvent {

  private EventEmitter ev;
  private EntityManager em;

  @Override
  public void onLoadEntity(String entity, String entityType, Object data) {
    switch (entityType) {

      case LoadEntityEvent.TYPE_UNIT_DATA:
        em.tryAcquireComponentFromData(entity, data, Capturer.class);
        break;

      case LoadEntityEvent.TYPE_PROPERTY_DATA:
        em.tryAcquireComponentFromData(entity, data, Capturable.class);
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
