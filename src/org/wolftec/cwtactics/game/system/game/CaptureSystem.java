package org.wolftec.cwtactics.game.system.game;

import org.wolftec.cwtactics.engine.bitset.BitSet;
import org.wolftec.cwtactics.game.ComponentHolder;
import org.wolftec.cwtactics.game.EntityManager;
import org.wolftec.cwtactics.game.components.game.Capturable;
import org.wolftec.cwtactics.game.components.game.Capturer;
import org.wolftec.cwtactics.game.components.game.Living;
import org.wolftec.cwtactics.game.components.game.Owner;
import org.wolftec.cwtactics.game.components.game.Position;
import org.wolftec.cwtactics.game.core.Asserter;
import org.wolftec.cwtactics.game.core.System;
import org.wolftec.cwtactics.game.event.ErrorEvent;
import org.wolftec.cwtactics.game.event.LoadEntityEvent;
import org.wolftec.cwtactics.game.event.game.CaptureEvents;
import org.wolftec.cwtactics.game.event.ui.ActionEvents;

public class CaptureSystem implements System, CaptureEvents, LoadEntityEvent, ActionEvents {

  private EntityManager em;

  private Asserter asserter;

  private ErrorEvent errors;
  private ActionEvents actionEvents;
  private CaptureEvents captureEvent;

  private ComponentHolder<Owner> owners;
  private ComponentHolder<Living> livings;
  private ComponentHolder<Capturer> capturers;
  private ComponentHolder<Position> positions;
  private ComponentHolder<Capturable> capturables;

  @Override
  public void buildActions(int x, int y, String tile, String property, String unit, BitSet flags) {
    boolean capturableFlag = flags.get(FLAG_SOURCE_PROP_TO_ENEMY) == 1 || flags.get(FLAG_SOURCE_PROP_NONE) == 1;
    if (flags.get(FLAG_SOURCE_UNIT_TO) == 1 && capturableFlag) {
      if (capturables.has(property)) {
        actionEvents.addAction("capture", true);
      }
    }
  }

  @Override
  public void invokeAction(String action, int x, int y, int tx, int ty) {
    if (action == "capture") {

      // TODO improve readability
      String capturer = positions.find((entity, pos) -> livings.has(entity) && pos.x == tx && pos.y == tx);
      String property = positions.find((entity, pos) -> capturables.has(entity) && pos.x == tx && pos.y == tx);

      if (capturer == null || property == null) {
        errors.onIllegalArguments("missing data");
      }

      captureEvent.onCaptureProperty(capturer, property);
    }
  }

  @Override
  public void onCaptureProperty(String capturer, String property) {
    Capturable propertyData = capturables.get(property);
    Capturer capturerData = capturers.get(capturer);

    propertyData.points -= capturerData.points;

    captureEvent.onLoweredCapturePoints(property, capturerData.points);

    if (propertyData.points <= 0) {

      Owner propertyOwner = owners.get(property);
      Owner capturerOwner = owners.get(capturer);

      captureEvent.onCapturedProperty(property, capturerOwner.owner, propertyOwner.owner);

      propertyOwner.owner = capturerOwner.owner;
    }
  }

  @Override
  public void onLoadUnitTypeEntity(String entity, Object data) {

    em.tryAcquireComponentFromDataSuccessCb(entity, data, Capturer.class, (capturer) -> {
      asserter.inspectValue("Capturer.points of " + entity, capturer.points).isIntWithinRange(1, 99);
    });
  }

  @Override
  public void onLoadPropertyTypeEntity(String entity, Object data) {
    em.tryAcquireComponentFromDataSuccessCb(entity, data, Capturable.class, (capturable) -> {
      asserter.inspectValue("Capturable.points of " + entity, capturable.points).isIntWithinRange(1, 99);
      asserter.inspectValue("Capturable.looseAfterCaptured of " + entity, capturable.looseAfterCaptured).isBoolean();
      asserter.inspectValue("Capturable.changeIntoAfterCaptured", capturable.changeIntoAfterCaptured).whenNotNull(() -> {
        asserter.isEntityId();
      });
    });
  }

  @Override
  public void onLoadMapEntity(String entity, Object data) {
    em.tryAcquireComponentFromDataSuccessCb(entity, data, Capturable.class, (capturable) -> {
      asserter.inspectValue("Capturable.points of " + entity, capturable.points).isIntWithinRange(1, 99);
    });
  }
}
