package org.wolftec.cwtactics.game.core.sysevent;

import org.stjs.javascript.Array;

public interface SharedEventCallHandler {
  void onSharedCall(String eventClass, String eventFunction, Array<?> args);
}
