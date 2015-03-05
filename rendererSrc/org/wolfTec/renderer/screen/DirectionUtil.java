package org.wolfTec.renderer.screen;

public abstract class DirectionUtil {

  /**
   * A direction between two tiles on the map.
   */
  public enum Direction {

    /**
     * <strong>result:</strong> y-1
     */
    UP,

    /**
     * <strong>result:</strong> y+1
     */
    DOWN,

    /**
     * <strong>result:</strong> x-1
     */
    LEFT,

    /**
     * <strong>result:</strong> x+1
     */
    RIGHT;

  }

  /**
   * Extracts the direction from one position to another position.
   * 
   * @param sx
   * @param sy
   * @param tx
   * @param ty
   * @return
   */
  public static Direction codeFromAtoB(int sx, int sy, int tx, int ty) {
    Direction code = null;
    if (sx < tx) {
      code = Direction.RIGHT;
    } else if (sx > tx) {
      code = Direction.LEFT;
    } else if (sy < ty) {
      code = Direction.DOWN;
    } else if (sy > ty) {
      code = Direction.UP;
    }

    return code;
  }
}
