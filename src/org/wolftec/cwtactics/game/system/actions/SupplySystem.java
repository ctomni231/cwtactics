package org.wolftec.cwtactics.game.system.actions;

import org.stjs.javascript.Array;
import org.wolftec.cwtactics.game.EntityManager;
import org.wolftec.cwtactics.game.components.Funds;
import org.wolftec.cwtactics.game.components.Position;
import org.wolftec.cwtactics.game.components.SupplierAbility;
import org.wolftec.cwtactics.game.core.Asserter;
import org.wolftec.cwtactics.game.core.ConstructedClass;
import org.wolftec.cwtactics.game.event.LoadEntityEvent;
import org.wolftec.cwtactics.game.event.actions.SupplyEvents;
import org.wolftec.cwtactics.game.event.actions.TurnEvents;

public class SupplySystem implements ConstructedClass, LoadEntityEvent, TurnEvents, SupplyEvents {

  private EntityManager em;
  private Asserter asserter;

  @Override
  public void onSupplyNeighbors(String supplier) {
    Position supPos = em.getComponent(supplier, Position.class);

  }

  @Override
  public void onTurnStart(String player, int turn) {
    Array<String> suppliers = em.getEntitiesWithComponentType(SupplierAbility.class);
  }

  @Override
  public void onLoadEntity(String entity, String entityType, Object data) {
    switch (entityType) {
      case TYPE_UNIT_DATA:
      case TYPE_PROPERTY_DATA:
        em.tryAcquireComponentFromDataSuccessCb(entity, data, SupplierAbility.class, (supplier) -> {
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
