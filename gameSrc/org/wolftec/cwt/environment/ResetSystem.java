package org.wolftec.cwt.environment;

import org.stjs.javascript.Global;
import org.stjs.javascript.functions.Callback0;
import org.wolftec.cwt.core.loading.GameLoader;
import org.wolftec.cwt.core.persistence.PersistenceManager;
import org.wolftec.cwt.core.util.UrlParameterUtil;
import org.wolftec.cwt.system.Log;

public class ResetSystem implements GameLoader {

  public static final String PARAM_WIPEOUT = "resetData";

  private Log                log;
  private PersistenceManager pm;

  @Override
  public int priority() {
    return +999;
  }

  @Override
  public void onLoad(Callback0 done) {
    UrlParameterUtil.getParameter(PARAM_WIPEOUT).ifPresent((value) -> {
      if (!(value == "1" || value == "true")) {
        log.warn("IllegalUrlParameter: " + PARAM_WIPEOUT + "can only true or 1");
        return;
      }

      wipeAndReload();
    });
    done.$invoke();
  }

  public void wipeAndReload() {
    pm.clear((error) -> {
      String href = Global.window.document.location.href;
      Global.window.document.location.replace(href.substring(0, href.indexOf("?")));
    });
  }

}
