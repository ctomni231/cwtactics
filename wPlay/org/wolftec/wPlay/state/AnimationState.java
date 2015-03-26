package org.wolftec.wPlay.state;

public interface AnimationState extends State {

  default boolean isAnimationState() {
    return true;
  }

}
