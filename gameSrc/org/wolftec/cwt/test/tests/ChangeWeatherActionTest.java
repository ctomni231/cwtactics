package org.wolftec.cwt.test.tests;

import org.wolftec.cwt.logic.actions.ChangeWeather;
import org.wolftec.cwt.test.AbstractCwtTest;

public class ChangeWeatherActionTest extends AbstractCwtTest {

  private ChangeWeather action;

  public void testMustNotBeAvailableForUser() {
    test.assertThat.value(ActionsTest.sourceCheck(action, ActionsTest.noPos(), ActionsTest.noPos())).is(true);
  }

}
