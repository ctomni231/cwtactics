package org.wolftec.cwtactics.gameold.startup;

import org.stjs.javascript.Global;
import org.stjs.javascript.functions.Callback0;
import org.stjs.javascript.functions.Callback1;
import org.wolftec.cwtactics.EngineGlobals;
import org.wolftec.wCore.core.Injected;
import org.wolftec.wCore.core.ManagedComponent;
import org.wolftec.wCore.core.ManagedConstruction;
import org.wolftec.wCore.log.Logger;
import org.wolftec.wCore.persistence.VirtualFilesystemManager;
import org.wolftec.wPlay.loading.GameLoadingHandler;

@ManagedComponent
public class BrowserCheck implements GameLoadingHandler {

  @ManagedConstruction
  private Logger LOG;

  @Injected
  private VirtualFilesystemManager fs;

  @Override
  public void loadStuff(Callback1<String> triggerElementLoading, Callback0 triggerDone) {
    LOG.info("checking system compatibility");

    // TODO
    if (false || Global.confirm(EngineGlobals.CONFIRM_UNSUPPORTED_SYSTEM_MESSAGE)) {
      triggerDone.$invoke();

    } else {
      Global.window.document
          .writeln("<h1>Your system is not supported - Stopped startup sequence</h1>");
    }
  }

  @Override
  public int getLoadPriority() {
    return 999;
  }

}
