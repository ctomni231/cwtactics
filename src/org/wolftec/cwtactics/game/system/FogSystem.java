package org.wolftec.cwtactics.game.system;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.wolftec.cwtactics.Constants;
import org.wolftec.cwtactics.game.EntityId;
import org.wolftec.cwtactics.game.EntityManager;
import org.wolftec.cwtactics.game.EventEmitter;
import org.wolftec.cwtactics.game.components.Owner;
import org.wolftec.cwtactics.game.components.Position;
import org.wolftec.cwtactics.game.components.Turn;
import org.wolftec.cwtactics.game.components.Visible;
import org.wolftec.cwtactics.game.components.Vision;
import org.wolftec.cwtactics.game.core.Asserter;
import org.wolftec.cwtactics.game.core.ConstructedClass;
import org.wolftec.cwtactics.game.event.FogEvent;
import org.wolftec.cwtactics.game.event.LoadEntityEvent;
import org.wolftec.cwtactics.game.event.UnitDestroyedEvent;
import org.wolftec.cwtactics.game.event.actions.FactoryEvents;

public class FogSystem implements ConstructedClass, FactoryEvents, UnitDestroyedEvent, LoadEntityEvent {

  private EntityManager em;
  private EventEmitter ev;
  private Asserter asserter;

  private Array<Array<Integer>> turnOwnerData; // TODO bounds
  private Array<Array<Integer>> clientOwnerData; // TODO bounds

  @Override
  public void onConstruction() {
    turnOwnerData = JSCollections.$array();
    clientOwnerData = JSCollections.$array();
  }

  @Override
  public void onLoadEntity(String entity, String entityType, Object data) {
    switch (entityType) {

      case LoadEntityEvent.TYPE_UNIT_DATA:
      case LoadEntityEvent.TYPE_PROPERTY_DATA:
        em.tryAcquireComponentFromDataSuccessCb(entity, data, Vision.class, (vision) -> {
          asserter.inspectValue("Vision.range of " + entity, vision.range)
              .isIntWithinRange(entityType == TYPE_UNIT_DATA ? 1 : 0, Constants.MAX_SELECTION_RANGE);
        });
        break;

      case LoadEntityEvent.TYPE_TILE_DATA:
        em.tryAcquireComponentFromDataSuccessCb(entity, data, Visible.class, (visible) -> {
          asserter.inspectValue("Visible.blocksVision of " + entity, visible.blocksVision).isBoolean();
        });
        break;
    }
  }

  @Override
  public void onUnitProduced(String unit, String type, int x, int y) {
    if (!isTurnOwnerObject(unit)) return;

    Position pos = em.getComponent(unit, Position.class);
    Vision vision = em.getComponent(unit, Vision.class);

    changeVision(turnOwnerData, pos.x, pos.y, vision.range, +1, true);
    changeVision(clientOwnerData, pos.x, pos.y, vision.range, +1, false); // TODO
  }

  @Override
  public void onUnitDestroyed(String unit) {
    if (!isTurnOwnerObject(unit)) return;

    Position pos = em.getComponent(unit, Position.class);
    Vision vision = em.getComponent(unit, Vision.class);

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
            ev.publish(FogEvent.class).onTileVisionChanges(x, y, false);

          } else if (column.$get(y) > 0 && oldVision == 0) {
            ev.publish(FogEvent.class).onTileVisionChanges(x, y, true);
          }
        }
      }
    }
  }

  private boolean isTurnOwnerObject(String unit) {
    return (em.getComponent(unit, Owner.class).owner == em.getComponent(EntityId.GAME_ROUND, Turn.class).owner);
  }
}
