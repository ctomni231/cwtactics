package org.wolftec.cwt.core;

import org.stjs.javascript.Array;
import org.stjs.javascript.functions.Callback0;
import org.wolftec.cwt.core.ioc.Injectable;
import org.wolftec.cwt.system.ClassUtil;
import org.wolftec.cwt.system.Log;

public class LoadingManager implements Injectable {

  private Log           log;

  private Array<Loader> loaders;

  @Override
  public void onConstruction() {
    loaders.sort((a, b) -> {
      if (a.priority() < b.priority()) {
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
    ListUtil.forEachArrayValueAsync(loaders, (index, loader, next) -> {
      log.info("Invoking " + ClassUtil.getClassName(loader));
      loader.onLoad(next);
    }, doneCb);
  }
}
