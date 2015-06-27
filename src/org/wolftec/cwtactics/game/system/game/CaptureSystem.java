package org.wolftec.cwtactics.game.system.game;

import org.stjs.javascript.Map;
import org.wolftec.cwtactics.engine.bitset.BitSet;
import org.wolftec.cwtactics.engine.util.JsUtil;
import org.wolftec.cwtactics.game.EntityManager;
import org.wolftec.cwtactics.game.EventEmitter;
import org.wolftec.cwtactics.game.components.game.Capturable;
import org.wolftec.cwtactics.game.components.game.Capturer;
import org.wolftec.cwtactics.game.components.game.Living;
import org.wolftec.cwtactics.game.components.game.Owner;
import org.wolftec.cwtactics.game.components.game.Position;
import org.wolftec.cwtactics.game.core.Asserter;
import org.wolftec.cwtactics.game.core.ConstructedClass;
import org.wolftec.cwtactics.game.event.ErrorEvent;
import org.wolftec.cwtactics.game.event.LoadEntityEvent;
import org.wolftec.cwtactics.game.event.game.CaptureEvents;
import org.wolftec.cwtactics.game.event.ui.ActionEvents;

public class CaptureSystem implements ConstructedClass, CaptureEvents, LoadEntityEvent, ActionEvents {

  private EventEmitter ev;
  private EntityManager em;
  private Asserter asserter;

  @Override
  public void onBuildActions(int x, int y, String tile, String property, String unit, BitSet flags) {
    boolean capturableFlag = flags.get(FLAG_SOURCE_PROP_TO_ENEMY) == 1 || flags.get(FLAG_SOURCE_PROP_NONE) == 1;
    if (flags.get(FLAG_SOURCE_UNIT_TO) == 1 && capturableFlag) {
      if (em.hasEntityComponent(property, Capturable.class)) {
        ev.publish(ActionEvents.class).onAddAction("capture", true);
      }
    }
  }

  @Override
  public void onInvokeAction(String action, int x, int y, int tx, int ty) {
    if (action == "capture") {

      // TODO improve readability
      String capturer = em.getEntityByFilter(Position.class, (em, entity, pos) -> em.hasEntityComponent(entity, Living.class) && pos.x == tx && pos.y == tx);
      String property = em
          .getEntityByFilter(Position.class, (em, entity, pos) -> em.hasEntityComponent(entity, Capturable.class) && pos.x == tx && pos.y == tx);

      if (capturer == null || property == null) {
        ev.publish(ErrorEvent.class).onIllegalArguments("missing data");
      }

      ev.publish(CaptureEvents.class).onCaptureProperty(capturer, property);
    }
  }

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
