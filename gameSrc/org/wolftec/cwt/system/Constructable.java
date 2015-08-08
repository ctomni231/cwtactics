package org.wolftec.cwt.system;

import org.wolftec.cwt.core.Injectable;

public interface Constructable {

  default void onConstruction(Injectable instance) {
  }
}
