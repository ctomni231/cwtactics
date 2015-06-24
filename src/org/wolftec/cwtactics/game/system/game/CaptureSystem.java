package org.wolftec.cwtactics.game.system.game;

import org.stjs.javascript.Map;
import org.wolftec.cwtactics.engine.util.JsUtil;
import org.wolftec.cwtactics.game.EntityManager;
import org.wolftec.cwtactics.game.EventEmitter;
import org.wolftec.cwtactics.game.components.game.Capturable;
import org.wolftec.cwtactics.game.components.game.Capturer;
import org.wolftec.cwtactics.game.components.game.Owner;
import org.wolftec.cwtactics.game.core.Asserter;
import org.wolftec.cwtactics.game.core.ConstructedClass;
import org.wolftec.cwtactics.game.event.LoadEntityEvent;
import org.wolftec.cwtactics.game.event.actions.CaptureEvents;

public class CaptureSystem implements ConstructedClass, CaptureEvents, LoadEntityEvent {

  private EventEmitter ev;
  private EntityManager em;
  private Asserter asserter;

  @Override
  public void onLoadEntity(String entity, String entityType, Object data) {
    switch (entityType) {

      case LoadEntityEvent.TYPE_UNIT_DATA:
        em.tryAcquireComponentFromDataSuccessCb(entity, data, Capturer.class, (capturer) -> {
          asserter.inspectValue("Capturer.points of " + entity, capturer.points).isIntWithinRange(1, 99);
        });
        break;

      case LoadEntityEvent.TYPE_PROPERTY_DATA:
        em.tryAcquireComponentFromDataSuccessCb(entity, data, Capturable.class, (capturable) -> {
          asserter.inspectValue("Capturable.points of " + entity, capturable.points).isIntWithinRange(1, 99);
          asserter.inspectValue("Capturable.looseAfterCaptured of " + entity, capturable.looseAfterCaptured).isBoolean();
          asserter.inspectValue("Capturable.changeIntoAfterCaptured", capturable.changeIntoAfterCaptured).whenNotNull(() -> {
            asserter.isEntityId();
          });
        });
        break;

      case LoadEntityEvent.TYPE_MAP:
        JsUtil.forEachMapValueByFilteredKey((Map<String, Object>) data, (key) -> key.startsWith("PR"), (key, entityData) -> {
          em.tryAcquireComponentFromDataSuccessCb(key, entityData, Capturable.class, (capturable) -> {
            asserter.inspectValue("Capturable.points of " + key, capturable.points).isIntWithinRange(1, 99);
          });
        });
        break;
    }
  }

  @Override
  public void onCaptureProperty(String capturer, String property) {
    Capturable propertyData = em.getComponent(property, Capturable.class);
    Capturer capturerData = em.getComponent(capturer, Capturer.class);

    propertyData.points -= capturerData.points;
    ev.publish(CaptureEvents.class).onLoweredCapturePoints(property, capturerData.points);

    if (propertyData.points <= 0) {

      Owner propertyOwner = em.getComponent(property, Owner.class);
      Owner capturerOwner = em.getComponent(capturer, Owner.class);

      ev.publish(CaptureEvents.class).onCapturedProperty(property, capturerOwner.owner, propertyOwner.owner);

      propertyOwner.owner = capturerOwner.owner;
    }
  }

}
