package org.wolftec.wTec.test;

import org.wolftec.wTec.ioc.Injectable;

public interface Test extends Injectable {

  default void beforeTest() {
  }

  default void afterTest() {
  }
}
