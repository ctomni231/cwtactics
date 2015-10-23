package org.wolftec.cwt.core.test;

import org.wolftec.cwt.core.ioc.Injectable;

public interface Test extends Injectable {

  /**
   * @return a index string (a.b[.c[.d]]) which will be used to order all tests.
   */
  @Deprecated
  default String getIndex() {
    return "1.0.0.0";
  }

  default void beforeTest() {
  }

  default void afterTest() {
  }
}
