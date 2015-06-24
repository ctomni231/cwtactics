package org.wolftec.cwtactics.game.system;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.wolftec.cwtactics.Constants;
import org.wolftec.cwtactics.game.EntityManager;
import org.wolftec.cwtactics.game.EventEmitter;
import org.wolftec.cwtactics.game.components.game.Movable;
import org.wolftec.cwtactics.game.components.game.Movemap;
import org.wolftec.cwtactics.game.components.game.MovingCosts;
import org.wolftec.cwtactics.game.components.game.Position;
import org.wolftec.cwtactics.game.core.Asserter;
import org.wolftec.cwtactics.game.core.ConstructedClass;
import org.wolftec.cwtactics.game.core.Log;
import org.wolftec.cwtactics.game.event.LoadEntityEvent;
import org.wolftec.cwtactics.game.event.game.MoveEvent;

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
        em.tryAcquireComponentFromDataSuccessCb(entity, data, Movable.class, (mdata) -> {
          asserter.inspectValue("Movable.fuel of " + entity, mdata.fuel).isIntWithinRange(1, 99);
          asserter.inspectValue("Movable.range of " + entity, mdata.range).isIntWithinRange(1, Constants.MAX_SELECTION_RANGE);
          asserter.inspectValue("Movable.type of " + entity, mdata.type).isEntityId();
        });
        break;

      case TYPE_MOVETYPE_DATA:
        em.tryAcquireComponentFromDataSuccessCb(entity, data, MovingCosts.class, (costs) -> {
          asserter.inspectValue("MovingCosts.costs of " + entity, costs.costs).forEachMapKey((key) -> {
            asserter.isEntityId();
          });
          asserter.inspectValue("MovingCosts.costs of " + entity, costs.costs).forEachMapValue((value) -> {
            asserter.isIntWithinRange(0, 99);
          });
        });
        break;
    }
  }

  @Override
  public void onUnitMove(String unit, Array<Integer> steps) {
    Position position = em.getComponent(unit, Position.class);

    int cX = position.x;
    int cY = position.y;
    int oX = cX;
    int oY = cY;
    // int cFuel = modeData.fuel;

    // TODO

    position.x = cX;
    position.y = cY;

    ev.publish(MoveEvent.class).onUnitMoved(unit, oX, oY, cX, cY);
  }
}
