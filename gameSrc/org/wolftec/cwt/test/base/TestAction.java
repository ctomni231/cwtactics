package org.wolftec.cwt.test.base;

import org.stjs.javascript.annotation.Native;
import org.stjs.javascript.functions.Callback1;
import org.wolftec.cwt.controller.actions.core.ActionData;
import org.wolftec.cwt.controller.states.base.StateFlowData;
import org.wolftec.cwt.core.NullUtil;
import org.wolftec.cwt.core.annotations.OptionalParameter;
import org.wolftec.cwt.core.javascript.JsUtil;
import org.wolftec.cwt.model.actions.AbstractAction;

public class TestAction {

  private CwtTestManager parent;

  public TestAction(CwtTestManager parent) {
    this.parent = parent;
  }

  public void checkAction(AbstractAction action) {
    parent.uiData.cleanInfos();
    if (action.isUsable(parent.uiData)) {
      parent.uiData.addInfo(action.key(), true);
    }
  }

  public void checkActions(AbstractAction... arguments) {
    parent.uiData.cleanInfos();
    for (int i = 0; i < arguments.length; i++) {
      AbstractAction action = arguments[i];
      if (action.isUsable(parent.uiData)) {
        parent.uiData.addInfo(action.key(), true);
      }
    }
  }

  public void buildActionMenu(AbstractAction action) {
    parent.uiData.cleanInfos();
    if (!action.hasSubMenu()) {
      JsUtil.throwError("action has no sub menu");
    }
    action.prepareActionMenu(parent.uiData);
  }

  @Native
  public void invokeAction(AbstractAction action) {
  }

  public void invokeAction(AbstractAction action, @OptionalParameter Callback1<StateFlowData> callback) {
    ActionData data = new ActionData();
    StateFlowData flow = new StateFlowData();

    action.fillData(parent.uiData, data);

    do {
      action.evaluateByData(0, data, flow);
    } while (!action.isDataEvaluationCompleted(data));

    if (NullUtil.isPresent(callback)) {
      callback.$invoke(flow);
    }
  }
}
