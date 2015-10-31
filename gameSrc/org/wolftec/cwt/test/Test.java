package org.wolftec.cwt.test;

import org.wolftec.cwt.system.ManagedClass;

public interface Test extends ManagedClass {

  default void beforeTest() {
  }

  default void afterTest() {
  }
}
