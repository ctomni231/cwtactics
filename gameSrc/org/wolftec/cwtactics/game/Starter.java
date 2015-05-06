package org.wolftec.cwtactics.game;

import org.wolftec.cwtactics.engine.components.ConstructedFactory;

/**
 * Starter class with main function.
 */
public class Starter {
  public static void main(String[] args) {
    ConstructedFactory.initObjects();
    // ConstructedFactory.getObject(Cwt.class).setStateByClass(GameInit.class);
  }
}
