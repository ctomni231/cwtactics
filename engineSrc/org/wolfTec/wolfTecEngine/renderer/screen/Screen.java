package org.wolfTec.wolfTecEngine.renderer.screen;

import org.wolfTec.wolfTecEngine.renderer.screen.DirectionUtil.Direction;

public interface Screen {

  public abstract void resetAnimations();

  /**
   * 
   * @param delta
   */
  public abstract void update(int delta);

  /**
   * Re-renders the screen.
   */
  public abstract void draw();

  /**
   * 
   * @param x
   * @param y
   */
  public abstract void setCameraPosition(int x, int y);

  /**
   * Shifts the camera position.
   * 
   * @param direction
   * @param amount
   */
  public abstract void shiftCameraPosition(Direction direction, int amount);

}