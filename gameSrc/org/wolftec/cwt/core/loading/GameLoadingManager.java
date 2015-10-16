package org.wolftec.cwt.core.loading;

import org.stjs.javascript.Array;
import org.stjs.javascript.functions.Callback0;
import org.wolftec.cwt.core.Log;
import org.wolftec.cwt.core.collections.ListUtil;
import org.wolftec.cwt.core.ioc.Injectable;
import org.wolftec.cwt.core.util.ClassUtil;

public class GameLoadingManager implements Injectable {

  private Log               log;

  private Array<GameLoader> loaders;

  private boolean           started;

  @Override
  public void onConstruction() {
    started = false;
    loaders.sort((a, b) -> {
      if (a.priority() > b.priority()) {
        return -1;
      } else if (a.priority() == b.priority()) {
        return 0;
      } else {
        return +1;
      }
    });
  }

  /**
   * Loads all data into the system by invoking the onLoad method on all
   * loaders.
   * 
   * @param doneCb
   */
  public void loadData(Callback0 doneCb) {
    started = true;
    ListUtil.forEachArrayValueAsync(loaders, (index, loader, next) -> {
      log.info("Invoking " + ClassUtil.getClassName(loader));
      loader.onLoad(next);
    }, doneCb);
  }

  public boolean isStarted() {
    return started;
  }
}
