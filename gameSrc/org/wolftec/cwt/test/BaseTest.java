package org.wolftec.cwt.test;

import org.wolftec.cwt.test.tools.AbstractCwtTest;

public class BaseTest extends AbstractCwtTest {

  public void test_TestEngine() {
    assertModel().unitAt(0, 0).notExists();
  }
}
