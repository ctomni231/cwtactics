package org.wolftec.cwt.environment;

import org.stjs.javascript.Global;
import org.stjs.javascript.JSObjectAdapter;
import org.stjs.javascript.dom.DOMEvent;
import org.stjs.javascript.functions.Callback0;
import org.stjs.javascript.functions.Callback1;
import org.wolftec.cwt.core.GameLoader;
import org.wolftec.cwt.system.Log;
import org.wolftec.cwt.system.Nullable;

public class PortraitWatcher implements GameLoader {

  private Log log;

  @Override
  public void onLoad(Callback0 done) {
    Nullable.ifPresent(grabOrientationData(), (orientation) -> {
      Callback1<DOMEvent> doOnOrientationChange = (event) -> {
        switch ((int) grabOrientationData()) {
          case -90:
          case 90:
            log.info("landscape");
            break;

          default:
            log.info("portrait");
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
