package org.wolftec.cwtactics.game.core;

public class Asserter extends Log implements ConstructedObject {

  public void assertTrue(String key, boolean expr) {
    if (!expr) {
      error("assertion for " + key + " failed");
    }
  }
}
