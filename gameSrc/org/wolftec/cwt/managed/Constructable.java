package org.wolftec.cwt.managed;

public interface Constructable {

  default void onConstruction(ManagedClass instance) {
  }
}
