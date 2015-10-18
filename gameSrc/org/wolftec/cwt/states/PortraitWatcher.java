package org.wolftec.cwt.states;

import org.stjs.javascript.Global;
import org.stjs.javascript.JSObjectAdapter;
import org.stjs.javascript.dom.DOMEvent;
import org.stjs.javascript.functions.Callback0;
import org.stjs.javascript.functions.Callback1;
import org.wolftec.cwt.core.Option;
import org.wolftec.cwt.core.loading.GameLoader;
import org.wolftec.cwt.core.log.Log;
import org.wolftec.cwt.core.state.StateManager;

public class PortraitWatcher implements GameLoader {

  private Log          log;
  private StateManager statemachine;

  private String lastState;

  @Override
  public void onLoad(Callback0 done) {
    grabOrientationData().ifPresent((orientation) -> {
      Callback1<DOMEvent> doOnOrientationChange = (event) -> {
        String currentState = statemachine.getActiveStateId();

        switch ((int) orientation) {
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
    });

    done.$invoke();
  }

  private Option<Object> grabOrientationData() {
    return Option.ofNullable(JSObjectAdapter.$js("window.orientation"));
  }
}
