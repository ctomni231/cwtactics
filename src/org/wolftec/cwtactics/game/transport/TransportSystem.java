package org.wolftec.cwtactics.game.transport;

import org.wolftec.cwtactics.game.EntityManager;
import org.wolftec.cwtactics.game.core.Asserter;
import org.wolftec.cwtactics.game.core.System;
import org.wolftec.cwtactics.game.event.LoadUnit;
import org.wolftec.cwtactics.game.event.LoadUnitType;
import org.wolftec.cwtactics.game.event.UnloadUnit;
import org.wolftec.cwtactics.game.map.Position;

public class TransportSystem implements System, LoadUnitType, LoadUnit, UnloadUnit {

  private EntityManager em;
  private Asserter asserter;

  @Override
  public void onConstruction() {
  }

  @Override
  public void onLoadUnitType(String entity, Object data) {
    em.tryAcquireComponentFromDataSuccessCb(entity, data, LoadingAbility.class, (transporter) -> {
      asserter.inspectValue("Transporter.slots of " + entity, transporter.slots).isIntWithinRange(1, 10);
      asserter.inspectValue("Transporter.noDamage of " + entity, transporter.loads).forEachArrayValue((target) -> {
        asserter.isEntityId();
      });
    });
  }

  @Override
  public void onLoadUnit(String transporter, String load) {

    // TODO this should be done by the move system
    em.detachEntityComponentByClass(load, Position.class);

    TransportContainer tc = em.getComponent(transporter, TransportContainer.class);
    LoadingAbility tAbility = em.getComponent(transporter, LoadingAbility.class);

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

    TransportContainer tc = em.getComponent(transporter, TransportContainer.class);

    // --> TODO not so good because this prepare and throw when looks ugly :/
    asserter.resetFailureDetection();
    asserter.inspectValue("transporter loads contains given unit", tc.loaded.indexOf(load) != -1).isFalse();
    asserter.throwErrorWhenFailureDetected();
    // <-- TODO not so good because this prepare and throw when looks ugly :/

    tc.loaded.remove(load);

    // TODO this should be done by the move system
    Position loadPos = em.acquireEntityComponent(load, Position.class);
    loadPos.x = atX;
    loadPos.y = atY;
  }
}