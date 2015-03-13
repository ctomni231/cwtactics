package net.temp.wolfTecEngine.statemachine;

public interface AnimationState extends State {

  default boolean isAnimationState() {
    return true;
  }

}
