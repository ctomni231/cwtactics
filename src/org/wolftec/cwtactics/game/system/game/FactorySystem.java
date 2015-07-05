package org.wolftec.cwtactics.game.system.game;

import org.wolftec.cwtactics.game.EntityManager;
import org.wolftec.cwtactics.game.EventEmitter;
import org.wolftec.cwtactics.game.components.game.Buyable;
import org.wolftec.cwtactics.game.components.game.Factory;
import org.wolftec.cwtactics.game.components.game.Owner;
import org.wolftec.cwtactics.game.components.game.Position;
import org.wolftec.cwtactics.game.core.Asserter;
import org.wolftec.cwtactics.game.core.Log;
import org.wolftec.cwtactics.game.core.System;
import org.wolftec.cwtactics.game.event.error.IllegalGameData;
import org.wolftec.cwtactics.game.event.game.factory.BuildUnit;
import org.wolftec.cwtactics.game.event.game.factory.UnitProduced;
import org.wolftec.cwtactics.game.event.persistence.LoadPropertyType;
import org.wolftec.cwtactics.game.event.persistence.LoadUnitType;

public class FactorySystem implements System, BuildUnit, LoadUnitType, LoadPropertyType {

  private Log log;
  private EntityManager em;
  private EventEmitter ev;
  private Asserter asserter;

  IllegalGameData illegalGameDataExc;

  UnitProduced producedEvent;

  @Override
  public void onLoadUnitType(String entity, Object data) {
    em.tryAcquireComponentFromDataSuccessCb(entity, data, Buyable.class, (buyable) -> {
      asserter.inspectValue("Buyable.cost of " + entity, buyable.cost).isIntWithinRange(0, 999999);
    });
  }

  @Override
  public void onLoadPropertyType(String entity, Object data) {
    em.tryAcquireComponentFromDataSuccessCb(entity, data, Factory.class, (factory) -> {
      asserter.inspectValue("Factory.builds of " + entity, factory.builds).forEachArrayValue((value) -> {
        asserter.isEntityId();
      });
    });
  }

  @Override
  public void onBuildUnit(String factory, String type) {
    Factory factoryData = em.getComponent(factory, Factory.class);

    checkBuildData(type, factoryData);

    String unit = em.acquireEntity();

    Owner unitOwner = em.getNonNullComponent(unit, Owner.class);
    Position unitPos = em.getNonNullComponent(unit, Position.class);

    Owner factoryOwner = em.getComponent(factory, Owner.class);
    Position factoryPos = em.getComponent(factory, Position.class);

    unitOwner.owner = factoryOwner.owner;
    unitPos.x = factoryPos.x;
    unitPos.y = factoryPos.y;

    em.setEntityPrototype(unit, type);

    log.info("produced a unit [ID:" + unit + ", Type: " + type + "]");

    producedEvent.onUnitProduced(unit, type, unitPos.x, unitPos.y);
  }

  private void checkBuildData(String type, Factory factoryData) {
    if (factoryData == null) {
      illegalGameDataExc.onIllegalGameData("NotAFactory");

    } else if (factoryData.builds.indexOf(type) == -1) {
      illegalGameDataExc.onIllegalGameData("TypeIsNotProcuceAble");
    }
  }
}
