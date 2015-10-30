package org.wolftec.cwt.states;

import org.stjs.javascript.Global;
import org.stjs.javascript.functions.Callback0;
import org.wolftec.cwt.util.UrlParameterUtil;
import org.wolftec.cwt.wotec.env.Features;
import org.wolftec.cwt.wotec.loading.GameLoader;
import org.wolftec.cwt.wotec.log.Log;

public class CheckSystem implements GameLoader {

  private Log log;
  private Features features;

  @Override
  public int priority() {
    return +998;
  }

  @Override
  public void onLoad(Callback0 done) {
    if (UrlParameterUtil.getParameter("skipEnvCheck") == "true") {
      done.$invoke();
      return;
    }

    log.info("checking abilities of the active environment");
    if (!features.supported) {

      log.warn("system is not supported");

      if (Global.confirm("Go on ?")) {
        // HINT may show a styled dialog here
        log.warn("starting cwtactics in an unsupported environment");
        done.$invoke();
      }

    } else {
      log.info("starting cwtactics in an supported environment");
      done.$invoke();
    }
  }

}
