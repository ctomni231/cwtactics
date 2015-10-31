package org.wolftec.cwt.states;

import org.stjs.javascript.Global;
import org.stjs.javascript.JSObjectAdapter;
import org.stjs.javascript.dom.DOMEvent;
import org.stjs.javascript.functions.Callback0;
import org.stjs.javascript.functions.Callback1;
import org.wolftec.cwt.system.GameLoadingHandler;
import org.wolftec.cwt.system.Log;
import org.wolftec.cwt.system.annotations.OptionalReturn;
import org.wolftec.cwt.util.NullUtil;

// TODO into state
public class PortraitWatcher implements GameLoadingHandler {

  private Log log;
  private StateManager statemachine;

  private String lastState;

  @Override
  public void onLoad(Callback0 done) {
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
            log.info("portrait");
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

    done.$invoke();
  }

  @OptionalReturn
  private Integer grabOrientationData() {
    return JSObjectAdapter.$js("window.orientation");
  }
}
