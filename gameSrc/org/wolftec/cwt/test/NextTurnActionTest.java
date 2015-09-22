package org.wolftec.cwt.test;

import org.wolftec.cwt.actions.NextTurn;
import org.wolftec.cwt.test.tools.AbstractCwtTest;

public class NextTurnActionTest extends AbstractCwtTest {

  private NextTurn action;

  public void testClickOnEmptyTile() {
    uiData.source.set(model, 0, 0);
    uiData.target.set(model, 0, 0);
    assertValue(action.condition(uiData)).is(true);
  }

  public void testFail() {
    uiData.source.set(model, 0, 0);
    uiData.target.set(model, 0, 0);
    assertValue(action.condition(uiData)).is(false);
  }
}
