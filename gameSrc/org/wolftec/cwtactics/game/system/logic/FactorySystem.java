package org.wolftec.cwtactics.game.system.logic;

import org.stjs.javascript.Array;
import org.wolftec.cwtactics.game.components.IEntityComponent;
import org.wolftec.cwtactics.game.components.data.FactoryCmp;
import org.wolftec.cwtactics.game.components.objects.OwnableCmp;
import org.wolftec.cwtactics.game.components.objects.Positionable;
import org.wolftec.cwtactics.game.system.ISystem;

public class FactorySystem implements ISystem {

  @Override
  public void onConstruction() {

  }

  public boolean isFactory(String factoryId) {
    return gec(factoryId, FactoryCmp.class) != null;
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

    FactoryCmp factoryData = gec(factoryId, FactoryCmp.class);
    if (factoryData.builds.indexOf(type) == -1) {
      events().ERROR_RAISED.publish("GivenTypeIsNotProcuceAble");
    }

    // TODO way too much coupling here :P

    Positionable factoryPos = gec(factoryId, Positionable.class);
    OwnableCmp factoryOwner = gec(factoryId, OwnableCmp.class);

    String unitEntity = entityManager().acquireEntity();
    Positionable unitPos = aec(unitEntity, Positionable.class);
    OwnableCmp unitOwner = aec(unitEntity, OwnableCmp.class);

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
