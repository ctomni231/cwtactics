package org.wolftec.cwt.test.tools;

import org.stjs.javascript.annotation.Native;
import org.stjs.javascript.functions.Callback1;
import org.wolftec.cwt.core.action.Action;
import org.wolftec.cwt.core.action.ActionData;
import org.wolftec.cwt.core.annotations.OptionalParameter;
import org.wolftec.cwt.core.state.StateFlowData;
import org.wolftec.cwt.core.util.JsUtil;
import org.wolftec.cwt.core.util.NullUtil;

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

  public void buildActionMenu(Action action) {
    parent.uiData.cleanInfos();
    if (!action.hasSubMenu()) {
      JsUtil.throwError("action has no sub menu");
    }
    action.prepareActionMenu(parent.uiData);
  }

  @Native
  public void invokeAction(Action action) {
  }

  public void invokeAction(Action action, @OptionalParameter Callback1<StateFlowData> callback) {
    ActionData data = new ActionData();
    StateFlowData flow = new StateFlowData();

    action.fillData(parent.uiData, data);
    action.evaluateByData(0, data, flow);
    if (NullUtil.isPresent(callback)) {
      callback.$invoke(flow);
    }
  }
}
