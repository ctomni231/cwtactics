package org.wolftec.cwtactics.game.factory;

import org.wolftec.cwtactics.game.ISystem;
import org.wolftec.cwtactics.game.event.ActionInvokedEvent;
import org.wolftec.cwtactics.game.event.ErrorEvent;
import org.wolftec.cwtactics.game.event.ObjectChangeTypeEvent;
import org.wolftec.cwtactics.game.event.OwnerEvent;
import org.wolftec.cwtactics.game.event.PositionEvent;
import org.wolftec.cwtactics.game.event.UnitCreatedEvent;
import org.wolftec.cwtactics.game.event.UnitProducedEvent;

public class FactorySystem implements ISystem, ActionInvokedEvent {

  @Override
  public void onBuildUnit(String factory, String type) {
    FactoryComponent factoryData = gec(factory, FactoryComponent.class);
    checkBuildData(type, factoryData);

    String unit = entityManager().acquireEntity();

    publish(ObjectChangeTypeEvent.class).onObjectGetsType(type);
    publish(OwnerEvent.class).onUnitGetsPropertyOwner(factory);
    publish(PositionEvent.class).onUnitPlacedAtProperty(unit, factory);
    publish(UnitCreatedEvent.class).onUnitCreated(unit);

    info("produced a unit [" + unit + "]");

    publish(UnitProducedEvent.class).onUnitProduced(factory, unit, type);
  }

  private void checkBuildData(String type, FactoryComponent factoryData) {
    if (factoryData == null) {
      publish(ErrorEvent.class).onIllegalGameData("NotAFactory");
    } else if (factoryData.builds.indexOf(type) == -1) {
      publish(ErrorEvent.class).onIllegalGameData("TypeIsNotProcuceAble");
    }
  }
}
