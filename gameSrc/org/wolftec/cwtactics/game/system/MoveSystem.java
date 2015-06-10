package org.wolftec.cwtactics.game.system;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.wolftec.cwtactics.Constants;
import org.wolftec.cwtactics.engine.ischeck.Is;
import org.wolftec.cwtactics.engine.util.JsUtil;
import org.wolftec.cwtactics.game.EntityManager;
import org.wolftec.cwtactics.game.EventEmitter;
import org.wolftec.cwtactics.game.components.Movable;
import org.wolftec.cwtactics.game.components.Movemap;
import org.wolftec.cwtactics.game.components.MovingCosts;
import org.wolftec.cwtactics.game.components.Position;
import org.wolftec.cwtactics.game.components.old.MovingAbilityCmp;
import org.wolftec.cwtactics.game.core.Asserter;
import org.wolftec.cwtactics.game.core.ConstructedClass;
import org.wolftec.cwtactics.game.core.Log;
import org.wolftec.cwtactics.game.event.LoadEntityEvent;
import org.wolftec.cwtactics.game.event.MoveEvent;

public class MoveSystem implements ConstructedClass, MoveEvent, LoadEntityEvent {

  private Log log;
  private EntityManager em;
  private EventEmitter ev;
  private Asserter asserter;

  @Override
  public void onConstruction() {
    log.info("initialize move-data component");

    em.acquireEntityWithId("?");
    Movemap map = em.getNonNullComponent("?", Movemap.class);

    map.data = JSCollections.$array();
    for (int i = 0; i < Constants.MAX_SELECTION_RANGE; i++) {
      map.data.$set(i, JSCollections.$array());
      for (int j = 0; j < Constants.MAX_SELECTION_RANGE; j++) {
        map.data.$get(i).$set(j, 0);
      }
    }
  }

  @Override
  public void onLoadEntity(String entity, String entityType, Object data) {
    switch (entityType) {

      case LoadEntityEvent.TYPE_UNIT_DATA:
        Movable mdata = em.tryAcquireComponentFromData(entity, data, Movable.class);
        if (mdata != null) {
          asserter.assertTrue("mdata.fuel int", Is.is.integer(mdata.fuel));
          asserter.assertTrue("mdata.fuel > 0", Is.is.above(mdata.fuel, 0));
          asserter.assertTrue("mdata.fuel < 100", Is.is.under(mdata.fuel, 100));

          asserter.assertTrue("mdata.range int", Is.is.integer(mdata.range));
          asserter.assertTrue("mdata.range > 0", Is.is.above(mdata.range, 0));
          asserter.assertTrue("mdata.range < MAX_SELECTION_RANGE", Is.is.under(mdata.range, Constants.MAX_SELECTION_RANGE));

          asserter.assertTrue("mdata.type str", Is.is.string(mdata.type));
          asserter.assertTrue("mdata.type movetype", em.hasEntityComponent(mdata.type, MovingCosts.class));

          em.setEntityPrototype(entity, mdata.type);
        }
        break;

      case TYPE_MOVETYPE_DATA:
        MovingCosts costs = em.tryAcquireComponentFromData(entity, data, MovingCosts.class);
        if (costs != null) {
          JsUtil.forEachMapValue(costs.costs, (key, value) -> {
            asserter.assertTrue("costs.costs(v) int", Is.is.integer(value));
            asserter.assertTrue("costs.costs(v) >= 0", Is.is.above(value, -1));
            asserter.assertTrue("costs.costs(v) < 100", Is.is.under(value, 100));
          });
        }
        break;
    }
  }

  @Override
  public void onUnitMove(String unit, Array<Integer> steps) {
    Position position = em.getComponent(unit, Position.class);
    MovingAbilityCmp modeData = em.getComponent(unit, MovingAbilityCmp.class);

    int cX = position.x;
    int cY = position.y;
    int oX = cX;
    int oY = cY;
    int cFuel = modeData.fuel;

    // TODO

    position.x = cX;
    position.y = cY;

    ev.publish(MoveEvent.class).onUnitMoved(unit, oX, oY, cX, cY);
  }
}
