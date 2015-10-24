package org.wolftec.cwt.test.actions;

import org.wolftec.cwt.actions.RefillSupply;
import org.wolftec.cwt.test.tools.AbstractCwtTest;

public class RefillSuppliesActionTest extends AbstractCwtTest {

  private RefillSupply action;

  public void test_neverAvailable() {
    test.assertThat.value(ActionsTest.sourceCheck(action, ActionsTest.noPos(), ActionsTest.noPos())).is(true);
  }
}
