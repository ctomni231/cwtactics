package org.wolftec.cwt.test.base;

import org.wolftec.cwt.managed.ManagedClass;

public interface Test extends ManagedClass {

  default void beforeTest() {
  }

  default void afterTest() {
  }
}
