package org.wolftec.cwtactics.game.system;

import org.wolftec.cwtactics.game.EntityManager;
import org.wolftec.cwtactics.game.components.Funds;
import org.wolftec.cwtactics.game.components.Supplier;
import org.wolftec.cwtactics.game.core.Asserter;
import org.wolftec.cwtactics.game.core.ConstructedClass;
import org.wolftec.cwtactics.game.event.LoadEntityEvent;

public class SupplierSystem implements ConstructedClass, LoadEntityEvent {

  private EntityManager em;
  private Asserter asserter;

  @Override
  public void onConstruction() {
  }

  @Override
  public void onLoadEntity(String entity, String entityType, Object data) {
    switch (entityType) {
      case TYPE_UNIT_DATA:
      case TYPE_PROPERTY_DATA:
        em.tryAcquireComponentFromDataSuccessCb(entity, data, Supplier.class, (supplier) -> {
          asserter.inspectValue("Supplier.refillLoads of " + entity, supplier.refillLoads).isBoolean();
          asserter.inspectValue("Supplier.supplies of " + entity, supplier.supplies).forEachArrayValue((target) -> {
            asserter.isEntityId();
          });
        });
        break;
    }

    switch (entityType) {
      case TYPE_PROPERTY_DATA:
        em.tryAcquireComponentFromDataSuccessCb(entity, data, Funds.class, (funds) -> {
          asserter.inspectValue("Funds.amount of " + entity, funds.amount).isIntWithinRange(0, 999999);
        });
        break;
    }
  }
}
