package org.wolftec.cwtactics.system.state;

public interface AnimationState extends State {

  default boolean isAnimationState() {
    return true;
  }

}
