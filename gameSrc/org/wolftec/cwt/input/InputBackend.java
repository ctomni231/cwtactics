package org.wolftec.cwt.input;

import org.stjs.javascript.Map;

public interface InputBackend {

  void enable();

  void disable();

  Map<String, Integer> getMapping();
}