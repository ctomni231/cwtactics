package org.wolftec.cwtactics.game.system;

import org.wolftec.cwtactics.game.EntityManager;
import org.wolftec.cwtactics.game.EventEmitter;
import org.wolftec.cwtactics.game.components.Factory;
import org.wolftec.cwtactics.game.components.Owner;
import org.wolftec.cwtactics.game.components.Position;
import org.wolftec.cwtactics.game.core.ConstructedClass;
import org.wolftec.cwtactics.game.core.Log;
import org.wolftec.cwtactics.game.event.ActionInvokedEvent;
import org.wolftec.cwtactics.game.event.ErrorEvent;
import org.wolftec.cwtactics.game.event.UnitProducedEvent;

public class FactorySystem implements ConstructedClass, ActionInvokedEvent {

  private Log log;
  private EntityManager em;
  private EventEmitter ev;

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
