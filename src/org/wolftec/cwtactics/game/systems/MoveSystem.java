package org.wolftec.cwtactics.game.systems;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.wolftec.cwt.Constants;
import org.wolftec.cwt.game.components.Movemap;
import org.wolftec.cwtactics.Entities;
import org.wolftec.cwtactics.game.components.MovingAbility;
import org.wolftec.cwtactics.game.components.MovingCosts;
import org.wolftec.cwtactics.game.components.Position;
import org.wolftec.cwtactics.game.core.Asserter;
import org.wolftec.cwtactics.game.core.Log;
import org.wolftec.cwtactics.game.core.syscomponent.Components;
import org.wolftec.cwtactics.game.core.systems.System;
import org.wolftec.cwtactics.game.events.gameround.UnitMove;
import org.wolftec.cwtactics.game.events.gameround.UnitMoved;
import org.wolftec.cwtactics.game.events.loading.LoadMoveType;
import org.wolftec.cwtactics.game.events.loading.LoadUnitType;

public class MoveSystem implements System, UnitMove, LoadUnitType, LoadMoveType {

  private Log                       log;
  private Asserter                  asserter;

  private UnitMoved                 movedEvent;

  private Components<MovingAbility> movables;
  private Components<Movemap>       movemaps;
  private Components<MovingCosts>   movecosts;
  private Components<Position>      positions;

  @Override
  public void onConstruction() {
    log.info("initialize move-data component");

    Movemap map = movemaps.acquire(Entities.GAME_ROUND);

    createMoveData(map);
    resetMoveData(map);
  }

  private void createMoveData(Movemap map) {
    map.data = JSCollections.$array();
    for (int i = 0; i < Constants.MAX_SELECTION_RANGE; i++) {
      map.data.$set(i, JSCollections.$array());
    }
  }

  private void resetMoveData(Movemap map) {
    for (int i = 0; i < Constants.MAX_SELECTION_RANGE; i++) {
      for (int j = 0; j < Constants.MAX_SELECTION_RANGE; j++) {
        map.data.$get(i).$set(j, 0);
      }
    }
  }

  @Override
  public void onLoadMoveType(String entity, Object data) {
    MovingCosts costs = movecosts.acquireWithRootData(entity, data);
    asserter.inspectValue("MovingCosts.costs of " + entity, costs.costs).forEachMapKey((key) -> {
      asserter.isEntityId();
    });
    asserter.inspectValue("MovingCosts.costs of " + entity, costs.costs).forEachMapValue((value) -> {
      asserter.isIntWithinRange(0, 99);
    });
  }

  @Override
  public void onLoadUnitType(String entity, Object data) {
    MovingAbility mdata = movables.acquireWithRootData(entity, data);
    asserter.inspectValue("Movable.fuel of " + entity, mdata.fuel).isIntWithinRange(1, 99);
    asserter.inspectValue("Movable.range of " + entity, mdata.range).isIntWithinRange(1, Constants.MAX_SELECTION_RANGE);
    asserter.inspectValue("Movable.type of " + entity, mdata.type).isEntityId();
  }

  @Override
  public void onUnitMove(String unit, Array<Integer> steps) {
    Position position = positions.get(unit);

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
