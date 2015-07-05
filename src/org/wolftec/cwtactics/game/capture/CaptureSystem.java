package org.wolftec.cwtactics.game.capture;

import org.wolftec.cwtactics.engine.bitset.BitSet;
import org.wolftec.cwtactics.game.EntityManager;
import org.wolftec.cwtactics.game.core.Asserter;
import org.wolftec.cwtactics.game.core.Components;
import org.wolftec.cwtactics.game.core.System;
import org.wolftec.cwtactics.game.event.ActionFlags;
import org.wolftec.cwtactics.game.event.AddAction;
import org.wolftec.cwtactics.game.event.BuildActions;
import org.wolftec.cwtactics.game.event.CaptureProperty;
import org.wolftec.cwtactics.game.event.CapturedProperty;
import org.wolftec.cwtactics.game.event.IllegalArguments;
import org.wolftec.cwtactics.game.event.InvokeAction;
import org.wolftec.cwtactics.game.event.LoadMap;
import org.wolftec.cwtactics.game.event.LoadPropertyType;
import org.wolftec.cwtactics.game.event.LoadUnitType;
import org.wolftec.cwtactics.game.event.LoweredCapturePoints;
import org.wolftec.cwtactics.game.living.Living;
import org.wolftec.cwtactics.game.map.Position;
import org.wolftec.cwtactics.game.player.Owner;

public class CaptureSystem implements System, CaptureProperty, LoadMap, LoadPropertyType, LoadUnitType, BuildActions, InvokeAction {

  private EntityManager em;

  private Asserter asserter;

  IllegalArguments illegalArgumentsExc;
  AddAction addActionEvent;
  LoweredCapturePoints loweredPointsEvent;
  CapturedProperty capturedEvent;

  Components<Owner> owners;
  Components<Living> livings;
  Components<Capturer> capturers;
  Components<Position> positions;
  Components<Capturable> capturables;

  @Override
  public void buildActions(int x, int y, String tile, String property, String unit, BitSet flags) {
    boolean capturableFlag = flags.get(ActionFlags.FLAG_SOURCE_PROP_TO_ENEMY) == 1 || flags.get(ActionFlags.FLAG_SOURCE_PROP_NONE) == 1;
    if (flags.get(ActionFlags.FLAG_SOURCE_UNIT_TO) == 1 && capturableFlag) {
      if (capturables.has(property)) {
        addActionEvent.addAction("capture", true);
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
        illegalArgumentsExc.onIllegalArguments("missing data");
      }

      onCaptureProperty(capturer, property);
    }
  }

  @Override
  public void onCaptureProperty(String capturer, String property) {
    Capturable propertyData = capturables.get(property);
    Capturer capturerData = capturers.get(capturer);

    propertyData.points -= capturerData.points;

    loweredPointsEvent.onLoweredCapturePoints(property, capturerData.points);

    if (propertyData.points <= 0) {

      Owner propertyOwner = owners.get(property);
      Owner capturerOwner = owners.get(capturer);

      capturedEvent.onCapturedProperty(property, capturerOwner.owner, propertyOwner.owner);

      propertyOwner.owner = capturerOwner.owner;
    }
  }

  @Override
  public void onLoadUnitType(String entity, Object data) {

    em.tryAcquireComponentFromDataSuccessCb(entity, data, Capturer.class, (capturer) -> {
      asserter.inspectValue("Capturer.points of " + entity, capturer.points).isIntWithinRange(1, 99);
    });
  }

  @Override
  public void onLoadPropertyType(String entity, Object data) {
    em.tryAcquireComponentFromDataSuccessCb(entity, data, Capturable.class, (capturable) -> {
      asserter.inspectValue("Capturable.points of " + entity, capturable.points).isIntWithinRange(1, 99);
      asserter.inspectValue("Capturable.looseAfterCaptured of " + entity, capturable.looseAfterCaptured).isBoolean();
      asserter.inspectValue("Capturable.changeIntoAfterCaptured", capturable.changeIntoAfterCaptured).whenNotNull(() -> {
        asserter.isEntityId();
      });
    });
  }

  @Override
  public void onLoadMap(String entity, Object data) {
    em.tryAcquireComponentFromDataSuccessCb(entity, data, Capturable.class, (capturable) -> {
      asserter.inspectValue("Capturable.points of " + entity, capturable.points).isIntWithinRange(1, 99);
    });
  }
}
