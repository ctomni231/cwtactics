package org.wolftec.cwtactics.game.system;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.wolftec.cwtactics.game.IEntityComponent;
import org.wolftec.cwtactics.game.ISystem;
import org.wolftec.cwtactics.game.components.FightingComponent;
import org.wolftec.cwtactics.game.components.HealthComponent;
import org.wolftec.cwtactics.game.components.RangedFightingComponent;
import org.wolftec.cwtactics.game.event.LoadEntityEvent;
import org.wolftec.cwtactics.game.event.ObjectChangeTypeEvent;
import org.wolftec.cwtactics.game.event.UnitDestroyedEvent;
import org.wolftec.cwtactics.game.util.EntitySerializationUtil;

public class TypeSystem implements ISystem, ObjectChangeTypeEvent, UnitDestroyedEvent, LoadEntityEvent {

  @Override
  public void onObjectGetsType(String object, String type) {
    em().setEntityPrototype(object, type);
  }

  @Override
  public void onUnitDestroyed(String unitEntity) {
    em().setEntityPrototype(unitEntity, null);
  }

  @Override
  public void onLoadEntity(String data, String entityType) {
    info("parsing object prototype");

    switch (entityType) {
      case "UNIT_PROTOTYPE":
        loadUnitEntity(data);
        return;

      default:
        break;
    }
  }

  private void loadUnitEntity(String data) {
    Array<Class<? extends IEntityComponent>> req = JSCollections.$array();
    req.push(HealthComponent.class);

    Array<Class<? extends IEntityComponent>> opt = JSCollections.$array();
    req.push(FightingComponent.class);
    req.push(RangedFightingComponent.class);

    String entity = EntitySerializationUtil.readEntity(data, req, opt);

    info("loaded unit prototype " + entity);
    publish(LoadEntityEvent.class).onLoadedEntity(entity, "UNIT_PROTOTYPE");
  }
}
