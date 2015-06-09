package org.wolftec.cwtactics.game.system;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.wolftec.cwtactics.game.EntityId;
import org.wolftec.cwtactics.game.IEntityComponent;
import org.wolftec.cwtactics.game.ISystem;
import org.wolftec.cwtactics.game.components.Owner;
import org.wolftec.cwtactics.game.components.Position;
import org.wolftec.cwtactics.game.components.Turn;
import org.wolftec.cwtactics.game.components.Vision;
import org.wolftec.cwtactics.game.event.FogEvent;
import org.wolftec.cwtactics.game.event.UnitDestroyedEvent;
import org.wolftec.cwtactics.game.event.UnitProducedEvent;

public class FogSystem implements ISystem, IEntityComponent, UnitProducedEvent, UnitDestroyedEvent {

  private Array<Array<Integer>> turnOwnerData; // TODO bounds
  private Array<Array<Integer>> clientOwnerData; // TODO bounds

  @Override
  public void onConstruction() {
    turnOwnerData = JSCollections.$array();
    clientOwnerData = JSCollections.$array();
  }

  @Override
  public void onUnitProduced(String factory, String unit, String type) {
    if (!isTurnOwnerObject(unit)) return;

    Position pos = em().getComponent(unit, Position.class);
    Vision vision = em().getComponent(unit, Vision.class);

    changeVision(turnOwnerData, pos.x, pos.y, vision.range, +1, true);
    changeVision(clientOwnerData, pos.x, pos.y, vision.range, +1, false); // TODO
  }

  @Override
  public void onUnitDestroyed(String unit) {
    if (!isTurnOwnerObject(unit)) return;

    Position pos = em().getComponent(unit, Position.class);
    Vision vision = em().getComponent(unit, Vision.class);

    changeVision(turnOwnerData, pos.x, pos.y, vision.range, -1, true);
    changeVision(clientOwnerData, pos.x, pos.y, vision.range, +1, false); // TODO
  }

  private void changeVision(Array<Array<Integer>> data, int x, int y, int range, int change, boolean publishEvents) {
    // TODO bounds

    int xe = x + range;
    int ye = y + range;
    x -= range;
    y -= range;

    if (x < 0) x = 0;
    if (y < 0) y = 0;

    int oy = y;
    for (; x <= xe; x++) {
      Array<Integer> column = data.$get(x);
      for (y = oy; y <= ye; y++) {

        int oldVision = column.$get(y);
        column.$set(y, oldVision + change);

        if (publishEvents) {
          if (column.$get(y) == 0 && oldVision > 0) {
            publish(FogEvent.class).onTileVisionChanges(x, y, false);

          } else if (column.$get(y) > 0 && oldVision == 0) {
            publish(FogEvent.class).onTileVisionChanges(x, y, true);
          }
        }
      }
    }
  }

  private boolean isTurnOwnerObject(String unit) {
    return (em().getComponent(unit, Owner.class).owner == em().getComponent(EntityId.GAME_ROUND, Turn.class).owner);
  }
}
