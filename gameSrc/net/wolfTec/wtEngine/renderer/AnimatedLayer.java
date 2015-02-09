package net.wolfTec.wtEngine.renderer;

public interface AnimatedLayer extends LayerGroup {

  public int getSubStates();
  
  public default boolean isDoubleStepAnimated () {
    return false;
  }
}
