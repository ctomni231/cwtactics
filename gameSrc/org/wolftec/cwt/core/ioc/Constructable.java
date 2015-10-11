package org.wolftec.cwt.core.ioc;

public interface Constructable {

  default void onConstruction(Injectable instance) {
  }
}
