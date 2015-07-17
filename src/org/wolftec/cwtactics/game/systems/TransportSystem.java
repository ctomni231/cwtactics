package org.wolftec.cwtactics.game.systems;

import org.wolftec.cwtactics.game.components.TransportAbility;
import org.wolftec.cwtactics.game.components.Position;
import org.wolftec.cwtactics.game.components.TransportContainer;
import org.wolftec.cwtactics.game.core.Asserter;
import org.wolftec.cwtactics.game.core.syscomponent.Components;
import org.wolftec.cwtactics.game.core.systems.System;
import org.wolftec.cwtactics.game.events.gameround.UnloadUnit;
import org.wolftec.cwtactics.game.events.loading.LoadUnit;
import org.wolftec.cwtactics.game.events.loading.LoadUnitType;

public class TransportSystem implements System, LoadUnitType, LoadUnit, UnloadUnit {

  private Asserter                       asserter;

  private Components<TransportAbility>     loaders;
  private Components<Position>           positions;
  private Components<TransportContainer> containers;

  @Override
  public void onLoadUnitType(String entity, Object data) {
    if (loaders.isComponentInRootData(data)) {
      TransportAbility transporter = loaders.acquireWithRootData(entity, data);
      asserter.inspectValue("Transporter.slots of " + entity, transporter.slots).isIntWithinRange(1, 10);
      asserter.inspectValue("Transporter.noDamage of " + entity, transporter.loads).forEachArrayValue((target) -> {
        asserter.isEntityId();
      });
    }
  }

  @Override
  public void onLoadUnit(String transporter, String load) {

    // TODO this should be done by the move system
    positions.release(load);

    TransportContainer tc = containers.get(transporter);
    TransportAbility tAbility = loaders.get(transporter);

    // --> TODO not so good because this prepare and throw when looks ugly :/
    asserter.resetFailureDetection();
    asserter.inspectValue("transporter can load the given unit", tAbility.loads.indexOf(load) != -1).isTrue();
    asserter.inspectValue("transporter loads is not full", tc.loaded.isFull()).isFalse();
    asserter.throwErrorWhenFailureDetected();
    // <-- TODO not so good because this prepare and throw when looks ugly :/

    tc.loaded.add(load);
  }

  @Override
  public void onUnloadUnit(String transporter, String load, int atX, int atY) {
    TransportContainer tc = containers.get(transporter);

    // --> TODO not so good because this prepare and throw when looks ugly :/
    asserter.resetFailureDetection();
    asserter.inspectValue("transporter loads contains given unit", tc.loaded.indexOf(load) != -1).isFalse();
    asserter.throwErrorWhenFailureDetected();
    // <-- TODO not so good because this prepare and throw when looks ugly :/

    tc.loaded.remove(load);

    // TODO this should be done by the move system
    Position loadPos = positions.acquire(load);
    loadPos.x = atX;
    loadPos.y = atY;
  }
}