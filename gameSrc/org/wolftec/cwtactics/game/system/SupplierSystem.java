package org.wolftec.cwtactics.game.system;

import org.wolftec.cwtactics.engine.ischeck.Is;
import org.wolftec.cwtactics.engine.util.JsUtil;
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
        Supplier supplier = em.tryAcquireComponentFromData(entity, data, Supplier.class);
        if (supplier != null) {
          asserter.assertTrue("supplier.refillLoads bool", Is.is.bool(supplier.refillLoads));

          asserter.assertTrue("supplier.supplies array", Is.is.array(supplier.supplies));
          JsUtil.forEachArrayValue(supplier.supplies, (index, entry) -> {
            asserter.assertTrue("supplier.supplies(v) str", Is.is.string(entry));
            asserter.assertTrue("supplier.supplies(v) entity", em.isEntity(entry));
          });
        }
        break;
    }

    switch (entityType) {
      case TYPE_PROPERTY_DATA:
        Funds funds = em.tryAcquireComponentFromData(entity, data, Funds.class);
        if (funds != null) {
          asserter.assertTrue("funds.amount int", Is.is.integer(funds.amount));
          asserter.assertTrue("funds.amount > 0", Is.is.above(funds.amount, 0));
          asserter.assertTrue("funds.amount < 100000", Is.is.under(funds.amount, 100000));
        }
        break;
    }
  }
}
