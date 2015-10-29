package org.wolftec.cwt.test.actions;

import org.wolftec.cwt.logic.actions.ChangeWeather;
import org.wolftec.cwt.test.tools.AbstractCwtTest;

public class ChangeWeatherActionTest extends AbstractCwtTest {

  private ChangeWeather action;

  public void testMustNotBeAvailableForUser() {
    test.assertThat.value(ActionsTest.sourceCheck(action, ActionsTest.noPos(), ActionsTest.noPos())).is(true);
  }

}
