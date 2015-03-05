package org.wolfTec.wolfTecEngine.renderer;

public abstract class DirectionUtil {

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
