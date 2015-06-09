package org.wolftec.cwtactics.game.core;

public interface ConstructedObject {
  default void onConstruction(ConstructedClass instance) {
  }
}
