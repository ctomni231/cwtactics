package org.wolftec.cwt.environment;

import org.stjs.javascript.Global;
import org.stjs.javascript.functions.Callback0;
import org.wolftec.cwt.core.BrowserUtil;
import org.wolftec.cwt.core.Loader;
import org.wolftec.cwt.persistence.PersistenceManager;
import org.wolftec.cwt.system.Log;
import org.wolftec.cwt.system.Nullable;

public class ResetSystem implements Loader {

  public static final String PARAM_WIPEOUT = "resetData";

  private Log                log;
  private PersistenceManager pm;

  @Override
  public int priority() {
    return 1000;
  }

  @Override
  public void onLoad(Callback0 done) {
    Nullable.ifPresentOrElse(BrowserUtil.getUrlParameter(PARAM_WIPEOUT), (value) -> {
      if (!(value == "1" || value == "true")) {
        log.warn("IllegalUrlParameter: " + PARAM_WIPEOUT + "can only true or 1");
        return;
      }

      pm.clear((error) -> {
        Global.window.document.location.reload();
      });
    }, () -> done.$invoke());
  }

}
