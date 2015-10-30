package org.wolftec.cwt.wotec.test;

import org.wolftec.cwt.wotec.ioc.Injectable;

public interface Test extends Injectable {

  default void beforeTest() {
  }

  default void afterTest() {
  }
}
