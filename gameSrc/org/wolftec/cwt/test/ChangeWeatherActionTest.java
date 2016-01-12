package org.wolftec.cwt.test;

import org.wolftec.cwt.action.actions.ChangeWeather;
import org.wolftec.cwt.test.base.AbstractCwtTest;

public class ChangeWeatherActionTest extends AbstractCwtTest
{

  private ChangeWeather action;

  public void testMustNotBeAvailableForUser()
  {
    test.assertThat.value(ActionsTest.sourceCheck(action, ActionsTest.noPos(), ActionsTest.noPos())).is(true);
  }

}
