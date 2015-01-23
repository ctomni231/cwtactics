package net.wolfTec.wtEngine.input;

import org.stjs.javascript.Map;

public interface InputBackend {
  
  default Map<String, Integer> getKeyMap() {
    return null;
  };

  default void update(int delta) {
  };

  abstract void enable();

  abstract void disable();
}
