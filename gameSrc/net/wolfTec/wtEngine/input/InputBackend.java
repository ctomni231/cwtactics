package net.wolfTec.wtEngine.input;


public interface InputBackend {

  default void update(int delta) {
  };

  abstract void enable();

  abstract void disable();
}
