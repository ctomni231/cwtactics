package org.wolftec.cwt.environment;

import org.stjs.javascript.Global;
import org.stjs.javascript.JSObjectAdapter;
import org.stjs.javascript.dom.DOMEvent;
import org.stjs.javascript.functions.Callback0;
import org.stjs.javascript.functions.Callback1;
import org.wolftec.cwt.core.GameLoader;
import org.wolftec.cwt.states.State;
import org.wolftec.cwt.states.StateManager;
import org.wolftec.cwt.states.misc.PortraitWarningState;
import org.wolftec.cwt.system.Log;
import org.wolftec.cwt.system.Nullable;

public class PortraitWatcher implements GameLoader {

  private Log                    log;
  private StateManager           statemachine;

  private Class<? extends State> lastState;

  @Override
  public void onLoad(Callback0 done) {
    Nullable.ifPresent(grabOrientationData(), (orientation) -> {
      Callback1<DOMEvent> doOnOrientationChange = (event) -> {
        Class<? extends State> currentState = (Class<? extends State>) JSObjectAdapter.$constructor(statemachine.getActiveState());

        switch ((int) grabOrientationData()) {
          case -90:
          case 90:
            if (currentState == PortraitWarningState.class) {
              statemachine.changeState(lastState);
              lastState = null;
            }
            break;

          default:
            log.info("portrait");
            if (currentState != PortraitWarningState.class) {
              lastState = currentState;
              statemachine.changeState(PortraitWarningState.class);
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

  private Object grabOrientationData() {
    return JSObjectAdapter.$js("window.orientation");
  }
}
