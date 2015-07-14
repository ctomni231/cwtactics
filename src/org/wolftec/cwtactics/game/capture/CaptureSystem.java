package org.wolftec.cwtactics.game.capture;

import org.wolftec.cwtactics.game.core.Asserter;
import org.wolftec.cwtactics.game.core.syscomponent.Components;
import org.wolftec.cwtactics.game.core.systems.System;
import org.wolftec.cwtactics.game.event.gameround.CaptureProperty;
import org.wolftec.cwtactics.game.event.gameround.CapturedProperty;
import org.wolftec.cwtactics.game.event.gameround.LoweredCapturePoints;
import org.wolftec.cwtactics.game.event.loading.LoadPropertyType;
import org.wolftec.cwtactics.game.event.loading.LoadUnitType;
import org.wolftec.cwtactics.game.player.Owner;

public class CaptureSystem implements System, CaptureProperty, LoadPropertyType, LoadUnitType {

  private Asserter               asserter;

  private LoweredCapturePoints   loweredPointsEvent;
  private CapturedProperty       capturedEvent;

  private Components<Owner>      owners;
  private Components<Capturer>   capturers;
  private Components<Capturable> capturables;

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
    if (capturers.isComponentInRootData(data)) {
      Capturer capturer = capturers.acquireWithRootData(entity, data);
      asserter.inspectValue("Capturer.points of " + entity, capturer.points).isIntWithinRange(1, 99);
    }
  }

  @Override
  public void onLoadPropertyType(String entity, Object data) {
    if (capturables.isComponentInRootData(data)) {
      Capturable capturable = capturables.acquireWithRootData(entity, data);
      asserter.inspectValue("Capturable.points of " + entity, capturable.points).isIntWithinRange(1, 99);
      asserter.inspectValue("Capturable.looseAfterCaptured of " + entity, capturable.looseAfterCaptured).isBoolean();
      asserter.inspectValue("Capturable.changeIntoAfterCaptured", capturable.changeIntoAfterCaptured).whenNotNull(() -> {
        asserter.isEntityId();
      });
    }
  }
}
