package org.wolftec.cwtactics.game.core.sysevent;

import org.stjs.javascript.Array;

public interface EventDistributor {

  boolean hasEventCall();

  void pullEventCall(SharedEventCallHandler eventHandler);

  void pushEventCall(String eventClass, String eventFunction, Array<?> args);
}
