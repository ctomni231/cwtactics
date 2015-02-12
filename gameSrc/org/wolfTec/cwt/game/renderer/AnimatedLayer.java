package org.wolfTec.cwt.game.renderer;

public interface AnimatedLayer extends LayerGroup {

  public int getSubStates();

  public default boolean isDoubleStepAnimated() {
    return false;
  }
}
