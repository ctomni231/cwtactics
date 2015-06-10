package org.wolftec.cwtactics.game.system;

import org.wolftec.cwtactics.engine.ischeck.Is;
import org.wolftec.cwtactics.game.EntityManager;
import org.wolftec.cwtactics.game.EventEmitter;
import org.wolftec.cwtactics.game.components.Buyable;
import org.wolftec.cwtactics.game.components.Factory;
import org.wolftec.cwtactics.game.components.Living;
import org.wolftec.cwtactics.game.components.Owner;
import org.wolftec.cwtactics.game.components.Position;
import org.wolftec.cwtactics.game.core.Asserter;
import org.wolftec.cwtactics.game.core.ConstructedClass;
import org.wolftec.cwtactics.game.core.Log;
import org.wolftec.cwtactics.game.event.ActionInvokedEvent;
import org.wolftec.cwtactics.game.event.ErrorEvent;
import org.wolftec.cwtactics.game.event.LoadEntityEvent;
import org.wolftec.cwtactics.game.event.UnitProducedEvent;

public class FactorySystem implements ConstructedClass, ActionInvokedEvent, LoadEntityEvent {

  private Log log;
  private EntityManager em;
  private EventEmitter ev;
  private Asserter asserter;

  @Override
  public void onLoadEntity(String entity, String entityType, Object data) {
    switch (entityType) {
      case LoadEntityEvent.TYPE_UNIT_DATA:
        Buyable buyable = em.tryAcquireComponentFromData(entity, data, Buyable.class);
        if (buyable != null) {
          asserter.assertTrue("buyable.cost int", Is.is.integer(buyable.cost));
          asserter.assertTrue("buyable.cost > 0", Is.is.above(buyable.cost, 0));
        }
        break;

      case LoadEntityEvent.TYPE_PROPERTY_DATA:
        Factory factory = em.tryAcquireComponentFromData(entity, data, Factory.class);
        if (factory != null) {
          asserter.assertTrue("factory.builds array", Is.is.array(factory.builds));
          factory.builds.$forEach((entry) -> {
            asserter.assertTrue("factory.builds(x) str", Is.is.string(entry));
            asserter.assertTrue("factory.builds(x) unit entity", em.hasEntityComponent(entry, Living.class) && em.hasEntityComponent(entry, Owner.class));
          });
        }
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

    ev.publish(UnitProducedEvent.class).onUnitProduced(factory, unit, type);
  }

  private void checkBuildData(String type, Factory factoryData) {
    if (factoryData == null) {
      ev.publish(ErrorEvent.class).onIllegalGameData("NotAFactory");

    } else if (factoryData.builds.indexOf(type) == -1) {
      ev.publish(ErrorEvent.class).onIllegalGameData("TypeIsNotProcuceAble");
    }
  }
}
