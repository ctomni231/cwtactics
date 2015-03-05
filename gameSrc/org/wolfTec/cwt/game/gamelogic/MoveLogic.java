package org.wolfTec.cwt.game.gamelogic;

import org.stjs.javascript.JSObjectAdapter;
import org.wolfTec.cwt.game.EngineGlobals;
import org.wolfTec.cwt.game.gamemodel.bean.GameRoundBean;
import org.wolfTec.cwt.game.gamemodel.model.MoveType;
import org.wolfTec.cwt.game.gamemodel.model.Tile;
import org.wolfTec.wolfTecEngine.components.CreatedType;
import org.wolfTec.wolfTecEngine.components.Injected;
import org.wolfTec.wolfTecEngine.components.ManagedComponent;
import org.wolfTec.wolfTecEngine.container.CircularBuffer;
import org.wolfTec.wolfTecEngine.container.ContainerSize;
import org.wolfTec.wolfTecEngine.pathfinding.PathFinder;
import org.wolfTec.wolfTecEngine.util.JsExec;

@ManagedComponent
public class MoveLogic {

  @Injected
  private GameRoundBean gameround;
  
  @Injected
  private PathFinder pathfinder;

  private int uid = EngineGlobals.INACTIVE_ID;
  private int x = EngineGlobals.INACTIVE_ID;
  private int y = EngineGlobals.INACTIVE_ID;

  @CreatedType("{size=$options.maxMoveLength}")
  @ContainerSize(0)
  private CircularBuffer<MoveCode> moveBuffer;

  /**
   * Extracts the move code between two positions.
   * 
   * @param sx
   * @param sy
   * @param tx
   * @param ty
   * @return
   */
  public MoveCode codeFromAtoB(int sx, int sy, int tx, int ty) {
    MoveCode code = null;
    if (sx < tx) {
      code = MoveCode.RIGHT;
    } else if (sx > tx) {
      code = MoveCode.LEFT;
    } else if (sy < ty) {
      code = MoveCode.DOWN;
    } else if (sy > ty) {
      code = MoveCode.UP;
    }

    return code;
  }

  /**
   * Returns the move cost to move with a given move type on a given tile type.
   * 
   * @param movetype
   * @param x
   * @param y
   * @return
   */
  public int getMoveCosts(MoveType movetype, int x, int y) {
    int v;
    Tile tile = gameround.getTile(x, y);

    // grab costs from property or if not given from tile
    // TODO
    boolean blocks = JsExec.injectJS("(tile.property != null) ? "
        + "tile.property.type.blocksVision : tile.type.blocksVision");
    if (tile.type.blocksVision) {
      return EngineGlobals.INACTIVE_ID;
    } else {
      if (JSObjectAdapter.hasOwnProperty(movetype.costs, tile.type.ID)) {
        return movetype.costs.$get(tile.type.ID);
      }
    }

    // check wildcard
    if (JSObjectAdapter.hasOwnProperty(movetype.costs, "*")) {
      return movetype.costs.$get("*");
    }

    // no match then return `-1`as not move able
    return EngineGlobals.INACTIVE_ID;
  }

  /**
   * Returns **true** if a **moveType** can move to a position (**x**,**y**),
   * else **false**.
   * 
   * @param moveType
   * @param x
   * @param y
   * @return
   */
  public boolean canTypeMoveTo(MoveType moveType, int x, int y) {

    // check technical movement to tile type
    if (getMoveCosts(moveType, x, y) == EngineGlobals.INACTIVE_ID) {
      return false;
    }

    // check some other rules like fog and units
    Tile tile = gameround.getTile(x, y);
    return (tile.visionTurnOwner == 0 || tile.unit == null);
  }
}
