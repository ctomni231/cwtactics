package org.wolftec.wTec.ioc;

public interface Constructable {

  default void onConstruction(Injectable instance) {
  }
}
