package org.wolftec.cwt.test.actions;

import org.wolftec.cwt.actions.HealUnit;
import org.wolftec.cwt.test.tools.AbstractCwtTest;

public class HealActionTest extends AbstractCwtTest {

  private HealUnit action;

  public void test_neverAvailable() {
    test.assertThat.value(ActionsTest.sourceCheck(action, ActionsTest.noPos(), ActionsTest.noPos())).is(true);
  }

}
