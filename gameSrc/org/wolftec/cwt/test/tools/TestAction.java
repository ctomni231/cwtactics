package org.wolftec.cwt.test.tools;

import org.wolftec.cwt.core.action.Action;
import org.wolftec.cwt.core.action.ActionData;
import org.wolftec.cwt.core.state.StateFlowData;

public class TestAction {

  private CwtTestManager parent;

  public TestAction(CwtTestManager parent) {
    this.parent = parent;
  }

  public void checkAction(Action action) {
    parent.uiData.cleanInfos();
    if (action.isUsable(parent.uiData)) {
      parent.uiData.addInfo(action.key(), true);
    }
  }

  public void checkActions(Action... arguments) {
    parent.uiData.cleanInfos();
    for (int i = 0; i < arguments.length; i++) {
      Action action = arguments[i];
      if (action.isUsable(parent.uiData)) {
        parent.uiData.addInfo(action.key(), true);
      }
    }
  }

  public void invokeAction(Action action) {
    ActionData data = new ActionData();
    StateFlowData flow = new StateFlowData();
    action.fillData(parent.uiData, data);
    action.evaluateByData(0, data, flow);
  }
}
