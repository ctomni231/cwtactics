package org.wolftec.cwtactics.game.system.logic;

import org.stjs.javascript.Array;
import org.wolftec.cwtactics.game.components.IEntityComponent;
import org.wolftec.cwtactics.game.components.data.FactoryCmp;
import org.wolftec.cwtactics.game.components.objects.OwnableCmp;
import org.wolftec.cwtactics.game.components.objects.Positionable;
import org.wolftec.cwtactics.game.system.ISystem;

public class FactorySys implements ISystem {

  @Override
  public void onInit() {

  }

  public boolean isFactory(String factoryId) {
    return entityManager().hasEntityComponent(factoryId, FactoryCmp.class);
  }

  /**
   * 
   * @param factoryId
   *          entity id of the factory
   * @param type
   *          wanted unit type that will be produced
   */
  public void buildUnit(String factoryId, String type) {
    if (!isFactory(factoryId)) {
      events().ERROR_RAISED.publish("EntityIsNoFactory");
    }

    FactoryCmp factoryData = getEntityComponent(factoryId, FactoryCmp.class);
    if (factoryData.builds.indexOf(type) == -1) {
      events().ERROR_RAISED.publish("GivenTypeIsNotProcuceAble");
    }

    Positionable factoryPos = getEntityComponent(factoryId, Positionable.class);
    OwnableCmp factoryOwner = getEntityComponent(factoryId, OwnableCmp.class);

    String unitEntity = entityManager().acquireEntity();
    Positionable unitPos = entityManager().acquireEntityComponent(unitEntity, Positionable.class);
    OwnableCmp unitOwner = entityManager().acquireEntityComponent(unitEntity, OwnableCmp.class);

    // set unit abilities as reference
    Array<IEntityComponent> typeComponents = entityManager().getEntityComponents(type);
    for (int i = 0; i < typeComponents.$length(); i++) {
      entityManager().attachEntityComponent(unitEntity, typeComponents.$get(i));
    }

    unitPos.x = factoryPos.x;
    unitPos.y = factoryPos.y;
    unitOwner.owner = factoryOwner.owner;

    events().UNIT_PRODUCED.publish(unitEntity, type, unitPos.x, unitPos.y);
  }
}
