package org.wolftec.cwtactics.game.system.game;

import org.wolftec.cwtactics.game.EntityManager;
import org.wolftec.cwtactics.game.EventEmitter;
import org.wolftec.cwtactics.game.components.game.Buyable;
import org.wolftec.cwtactics.game.components.game.Factory;
import org.wolftec.cwtactics.game.components.game.Owner;
import org.wolftec.cwtactics.game.components.game.Position;
import org.wolftec.cwtactics.game.core.Asserter;
import org.wolftec.cwtactics.game.core.ConstructedClass;
import org.wolftec.cwtactics.game.core.Log;
import org.wolftec.cwtactics.game.event.ErrorEvent;
import org.wolftec.cwtactics.game.event.LoadEntityEvent;
import org.wolftec.cwtactics.game.event.game.FactoryEvents;

public class FactorySystem implements ConstructedClass, FactoryEvents, LoadEntityEvent {

  private Log log;
  private EntityManager em;
  private EventEmitter ev;
  private Asserter asserter;

  @Override
  public void onLoadEntity(String entity, String entityType, Object data) {
    switch (entityType) {
      case LoadEntityEvent.TYPE_UNIT_DATA:
        em.tryAcquireComponentFromDataSuccessCb(entity, data, Buyable.class, (buyable) -> {
          asserter.inspectValue("Buyable.cost of " + entity, buyable.cost).isIntWithinRange(0, 999999);
        });
        break;

      case LoadEntityEvent.TYPE_PROPERTY_DATA:
        em.tryAcquireComponentFromDataSuccessCb(entity, data, Factory.class, (factory) -> {
          asserter.inspectValue("Factory.builds of " + entity, factory.builds).forEachArrayValue((value) -> {
            asserter.isEntityId();
          });
        });
        break;
    }
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

    ev.publish(FactoryEvents.class).onUnitProduced(unit, type, unitPos.x, unitPos.y);
  }

  private void checkBuildData(String type, Factory factoryData) {
    if (factoryData == null) {
      ev.publish(ErrorEvent.class).onIllegalGameData("NotAFactory");

    } else if (factoryData.builds.indexOf(type) == -1) {
      ev.publish(ErrorEvent.class).onIllegalGameData("TypeIsNotProcuceAble");
    }
  }
}
