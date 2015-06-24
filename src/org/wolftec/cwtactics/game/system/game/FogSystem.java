package org.wolftec.cwtactics.game.system.game;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.wolftec.cwtactics.Constants;
import org.wolftec.cwtactics.game.EntityId;
import org.wolftec.cwtactics.game.EntityManager;
import org.wolftec.cwtactics.game.EventEmitter;
import org.wolftec.cwtactics.game.components.game.Owner;
import org.wolftec.cwtactics.game.components.game.Position;
import org.wolftec.cwtactics.game.components.game.Turn;
import org.wolftec.cwtactics.game.components.game.Visible;
import org.wolftec.cwtactics.game.components.game.Vision;
import org.wolftec.cwtactics.game.core.Asserter;
import org.wolftec.cwtactics.game.core.ConstructedClass;
import org.wolftec.cwtactics.game.event.LoadEntityEvent;
import org.wolftec.cwtactics.game.event.UnitDestroyedEvent;
import org.wolftec.cwtactics.game.event.game.CaptureEvents;
import org.wolftec.cwtactics.game.event.game.FactoryEvents;
import org.wolftec.cwtactics.game.event.game.FogEvents;
import org.wolftec.cwtactics.game.event.game.MoveEvent;

public class FogSystem implements ConstructedClass, FactoryEvents, UnitDestroyedEvent, MoveEvent, CaptureEvents, LoadEntityEvent {

  private EntityManager em;
  private EventEmitter ev;
  private Asserter asserter;

  private Array<Array<Integer>> turnOwnerData;
  private Array<Array<Integer>> clientOwnerData;

  @Override
  public void onConstruction() {
    initDataMap();
  }

  private void initDataMap() {
    turnOwnerData = JSCollections.$array();
    clientOwnerData = JSCollections.$array();

    for (int x = 0; x < Constants.MAX_MAP_SIDE_LENGTH; x++) {
      turnOwnerData.push(JSCollections.$array());
      clientOwnerData.push(JSCollections.$array());
    }

    resetData();
  }

  /**
   * Sets every field of the fog data map to zero.
   */
  private void resetData() {
    for (int x = 0; x < Constants.MAX_MAP_SIDE_LENGTH; x++) {

      turnOwnerData.push(JSCollections.$array());
      clientOwnerData.push(JSCollections.$array());

      for (int y = 0; y < Constants.MAX_MAP_SIDE_LENGTH; y++) {
        turnOwnerData.$get(x).$set(y, 0);
        clientOwnerData.$get(x).$set(y, 0);
      }
    }
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
  public void onCapturedProperty(String property, String newOwner, String oldOwner) {
    changeEntityVision(property, isTurnOwner(oldOwner), isClientOwner(oldOwner), -1);
    changeEntityVision(property, isTurnOwner(newOwner), isClientOwner(newOwner), +1);
  }

  @Override
  public void onUnitProduced(String unit, String type, int x, int y) {
    changeEntityVision(unit, isTurnOwner(unitOwner(unit)), isClientOwner(unitOwner(unit)), +1);
  }

  @Override
  public void onUnitDestroyed(String unit) {
    changeEntityVision(unit, isTurnOwner(unitOwner(unit)), isClientOwner(unitOwner(unit)), -1);
  }

  @Override
  public void onUnitMoved(String unit, int fromX, int fromY, int toX, int toY) {
    boolean clientOwnerObject = isClientOwner(unitOwner(unit));
    boolean turnOwnerObject = isTurnOwner(unitOwner(unit));

    changeEntityVisionByPosition(unit, turnOwnerObject, clientOwnerObject, fromX, fromY, -1);
    changeEntityVisionByPosition(unit, turnOwnerObject, clientOwnerObject, toX, toY, +1);
  }

  private void changeEntityVision(String entity, boolean turnOwnerAffect, boolean clientOwnerAffect, int change) {
    if (!turnOwnerAffect && !clientOwnerAffect) return;

    Position pos = em.getComponent(entity, Position.class);
    changeEntityVisionByPosition(entity, turnOwnerAffect, clientOwnerAffect, pos.x, pos.y, change);
  }

  private void changeEntityVisionByPosition(String entity, boolean turnOwnerAffect, boolean clientOwnerAffect, int x, int y, int change) {
    if (!turnOwnerAffect && !clientOwnerAffect) return;

    Vision vision = em.getComponent(entity, Vision.class);
    if (turnOwnerAffect) changeVision(turnOwnerData, x, y, vision.range, change, true);
    if (clientOwnerAffect) changeVision(clientOwnerData, x, y, vision.range, change, false);
  }

  private void changeVision(Array<Array<Integer>> data, int x, int y, int range, int change, boolean publishEvents) {
    int xe = x + range;
    int ye = y + range;

    // TODO may use real bounds to save iterations
    if (xe >= Constants.MAX_MAP_SIDE_LENGTH) xe = Constants.MAX_MAP_SIDE_LENGTH - 1;
    if (ye >= Constants.MAX_MAP_SIDE_LENGTH) ye = Constants.MAX_MAP_SIDE_LENGTH - 1;

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
            ev.publish(FogEvents.class).onTileVisionChanges(x, y, false);

          } else if (column.$get(y) > 0 && oldVision == 0) {
            ev.publish(FogEvents.class).onTileVisionChanges(x, y, true);
          }
        }
      }
    }
  }

  /**
   * 
   * @param unit
   * @return unit owner
   */
  private String unitOwner(String unit) {
    return em.getComponent(unit, Owner.class).owner;
  }

  /**
   * 
   * @param owner
   * @return true when the given owner is the turn owner
   */
  private boolean isTurnOwner(String owner) {
    return (owner == em.getComponent(EntityId.GAME_ROUND, Turn.class).owner);
  }

  /**
   * 
   * @param owner
   * @return true when the given owner is the client visible player
   */
  private boolean isClientOwner(String owner) {
    return (owner == em.getComponent(EntityId.GAME_ROUND, Turn.class).lastClientOwner);
  }
}
