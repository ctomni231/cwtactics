package org.wolfTec.cwt.game.input;


public interface InputBackend {

  default void update(int delta) {
  };

  abstract void enable();

  abstract void disable();
}
