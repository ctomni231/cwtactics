package org.wolftec.cwtactics.game.startup;

import org.stjs.javascript.Global;
import org.stjs.javascript.functions.Callback0;
import org.stjs.javascript.functions.Callback1;
import org.wolftec.core.BrowserUtil;
import org.wolftec.core.Injected;
import org.wolftec.core.ManagedComponent;
import org.wolftec.core.ManagedConstruction;
import org.wolftec.cwtactics.EngineGlobals;
import org.wolftec.cwtactics.system.loading.GameLoadingHandler;
import org.wolftec.log.Logger;
import org.wolftec.persistence.VirtualFilesystemManager;

@ManagedComponent
public class ResetCheck implements GameLoadingHandler {

  @ManagedConstruction
  private Logger LOG;

  @Injected
  private VirtualFilesystemManager fs;

  @Override
  public void loadStuff(Callback1<String> triggerElementLoading, Callback0 triggerDone) {
    if (BrowserUtil.getUrlParameter(EngineGlobals.PARAM_RESET_DATA) == "1") {
      fs.purgeKeys("", (err) -> {
        if (err != null) {
          LOG.error("FailtedToPurgeStorage");

        } else {
          Global.window.document.location.reload();
        }
      });
    } else {

      triggerDone.$invoke();
    }
  }

  @Override
  public int getLoadPriority() {
    return 100;
  }

}
