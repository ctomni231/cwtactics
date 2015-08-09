package org.wolftec.cwt.environment;

import org.stjs.javascript.Global;
import org.stjs.javascript.functions.Callback0;
import org.wolftec.cwt.core.Loader;
import org.wolftec.cwt.system.Features;
import org.wolftec.cwt.system.Log;

public class CheckSystem implements Loader {

  private Log      log;
  private Features features;

  @Override
  public int priority() {
    return 999;
  }

  @Override
  public void onLoad(Callback0 done) {
    log.info("checking abilities of the active environment");

    // TODO
    // ask question when system is not supported
    if (!features.supported) {
      log.warn("system is not supported");

      if (Global.confirm("Go on ?")) {
        log.warn("starting cwtactics in an unsupported environment");
        done.$invoke();
      }

    } else {
      log.info("starting cwtactics in an supported environment");
      done.$invoke();
    }
  }

}
