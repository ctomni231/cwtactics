package org.wolftec.cwt.test;

import org.wolftec.cwt.Constants;
import org.wolftec.cwt.actions.NextTurn;
import org.wolftec.cwt.core.action.ActionData;
import org.wolftec.cwt.core.util.NullUtil;
import org.wolftec.cwt.test.tools.AbstractCwtTest;

public class NextTurnActionTest extends AbstractCwtTest {

  private NextTurn action;

  public void testClickOnEmptyTile() {
    expect().cursorAt(0, 0);

    assertThat(action.condition(uiData)).is(true);

    ActionData data = new ActionData();
    action.fillData(uiData, data);

    assertThat(data.p1).is(Constants.INACTIVE);
    assertThat(data.p2).is(Constants.INACTIVE);
    assertThat(data.p3).is(Constants.INACTIVE);
    assertThat(data.p4).is(Constants.INACTIVE);
    assertThat(data.p5).is(Constants.INACTIVE);

    action.evaluateByData(0, data, null);
  }

  public void testClickOnUnit() {
    expect().unitAt(0, 0, "INFT", model.getPlayer(0));

    expect().cursorAt(0, 0);
    assertThat(NullUtil.isPresent(uiData.source.unit)).is(true);
    assertThat(action.condition(uiData)).is(false);
  }

  public void testClickOnProperty() {
    expect().propertyAt(0, 0, "BASE", model.getPlayer(0));
    expect().propertyAt(1, 1, "BASE", model.getPlayer(1));
    expect().propertyAt(2, 2, "BASE", model.getPlayer(2));

    expect().cursorAt(0, 0);
    assertThat(NullUtil.isPresent(uiData.source.property)).is(true);
    assertThat(action.condition(uiData)).is(true);

    expect().cursorAt(1, 1);
    assertThat(NullUtil.isPresent(uiData.source.property)).is(true);
    assertThat(action.condition(uiData)).is(false);

    expect().cursorAt(2, 2);
    assertThat(NullUtil.isPresent(uiData.source.property)).is(true);
    assertThat(action.condition(uiData)).is(false);
  }
}
