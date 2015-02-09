package net.wolfTec.cwt.renderer;

public interface AnimatedLayer extends LayerGroup {

  public int getSubStates();
  
  public default boolean isDoubleStepAnimated () {
    return false;
  }
}
