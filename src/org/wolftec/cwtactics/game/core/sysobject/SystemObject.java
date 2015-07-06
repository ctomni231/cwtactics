package org.wolftec.cwtactics.game.core.sysobject;

import org.wolftec.cwtactics.game.core.systems.System;

public interface SystemObject {
  default void onConstruction(System instance) {
  }
}
