package org.wolftec.cwtactics.game.system.game;

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
import org.wolftec.cwtactics.game.core.Log;
import org.wolftec.cwtactics.game.core.System;
import org.wolftec.cwtactics.game.event.game.move.UnitMove;
import org.wolftec.cwtactics.game.event.game.move.UnitMoved;
import org.wolftec.cwtactics.game.event.persistence.LoadMoveType;
import org.wolftec.cwtactics.game.event.persistence.LoadUnitType;

public class MoveSystem implements System, UnitMove, LoadUnitType, LoadMoveType {

  private Log log;
  private EntityManager em;
  private EventEmitter ev;
  private Asserter asserter;

  private UnitMoved movedEvent;

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
  public void onLoadMoveType(String entity, Object data) {
    em.tryAcquireComponentFromDataSuccessCb(entity, data, MovingCosts.class, (costs) -> {
      asserter.inspectValue("MovingCosts.costs of " + entity, costs.costs).forEachMapKey((key) -> {
        asserter.isEntityId();
      });
      asserter.inspectValue("MovingCosts.costs of " + entity, costs.costs).forEachMapValue((value) -> {
        asserter.isIntWithinRange(0, 99);
      });
    });
  }

  @Override
  public void onLoadUnitType(String entity, Object data) {
    em.tryAcquireComponentFromDataSuccessCb(entity, data, Movable.class, (mdata) -> {
      asserter.inspectValue("Movable.fuel of " + entity, mdata.fuel).isIntWithinRange(1, 99);
      asserter.inspectValue("Movable.range of " + entity, mdata.range).isIntWithinRange(1, Constants.MAX_SELECTION_RANGE);
      asserter.inspectValue("Movable.type of " + entity, mdata.type).isEntityId();
    });
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

    movedEvent.onUnitMoved(unit, oX, oY, cX, cY);
  }
}
