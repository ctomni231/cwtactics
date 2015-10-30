package org.wolftec.cwt.wotec.ioc;

public interface Constructable {

  default void onConstruction(Injectable instance) {
  }
}
