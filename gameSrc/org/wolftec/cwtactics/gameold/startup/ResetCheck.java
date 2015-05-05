package org.wolftec.cwtactics.gameold.startup;

import org.stjs.javascript.Global;
import org.stjs.javascript.functions.Callback0;
import org.stjs.javascript.functions.Callback1;
import org.wolftec.cwtactics.EngineGlobals;
import org.wolftec.wCore.core.BrowserUtil;
import org.wolftec.wCore.core.Injected;
import org.wolftec.wCore.core.ManagedComponent;
import org.wolftec.wCore.core.ManagedConstruction;
import org.wolftec.wCore.log.Logger;
import org.wolftec.wCore.persistence.VirtualFilesystemManager;
import org.wolftec.wPlay.loading.GameLoadingHandler;

@Constructed
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
          LOG.error("FailedToPurgeStorage");

        } else {
          CanvasQueryGlb.window.document.location.reload();
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
