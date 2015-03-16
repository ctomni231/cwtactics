package org.wolftec.cwtactics.system.pathfinding;

import net.temp.wolfTecEngine.renderer.screen.DirectionUtil.Direction;

import org.stjs.javascript.Array;
import org.wolftec.container.MoveableMatrix;

public interface PathFinder {

  /**
   * Finds a path from a start position (sx, sy) to a final position (tx, ty).
   * 
   * @param costs
   *          map with move costs for every tile
   * @param sx
   * @param sy
   * @param tx
   * @param ty
   * @return
   */
  public Array<Direction> findPath(MoveableMatrix costs, int sx, int sy, int tx, int ty);
}
