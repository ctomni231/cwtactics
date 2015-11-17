package org.wolftec.cwt.controller.states.misc;

import org.stjs.javascript.Global;
import org.stjs.javascript.JSObjectAdapter;
import org.stjs.javascript.dom.DOMEvent;
import org.stjs.javascript.functions.Callback1;
import org.wolftec.cwt.controller.states.base.State;
import org.wolftec.cwt.controller.states.base.StateFlowData;
import org.wolftec.cwt.controller.states.base.StateManager;
import org.wolftec.cwt.core.NullUtil;
import org.wolftec.cwt.core.annotations.OptionalReturn;
import org.wolftec.cwt.view.input.InputService;

public class PortraitWarningState extends State {

  private StateManager statemachine;
  private String lastState;

  @Override
  public void onEnter(StateFlowData flowData) {
    if (NullUtil.isPresent(grabOrientationData())) {
      Callback1<DOMEvent> doOnOrientationChange = (event) -> {
        String currentState = statemachine.getActiveStateId();

        switch (grabOrientationData()) {
          case -90:
          case 90:
            if (currentState == "PortraitWarningState") {
              statemachine.changeState(lastState);
              lastState = null;
            }
            break;

          default:
            if (currentState != "PortraitWarningState") {
              lastState = currentState;
              statemachine.changeState("PortraitWarningState");
            }
            break;
        }
      };

      Global.window.addEventListener("orientationchange", doOnOrientationChange);

      /* Initial execution if needed */
      doOnOrientationChange.$invoke(null);
    }
  }

  @Override
  public void update(StateFlowData transition, int delta, InputService input) {
  }

  @OptionalReturn
  private Integer grabOrientationData() {
    return JSObjectAdapter.$js("window.orientation");
  }
}
