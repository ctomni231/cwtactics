package org.wolftec.wPlay.state;

public interface AnimationState extends State {

  default boolean immediate() {
    return true;
  }

}
