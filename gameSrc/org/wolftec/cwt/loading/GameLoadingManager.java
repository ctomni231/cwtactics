package org.wolftec.cwt.loading;

import org.stjs.javascript.Array;
import org.stjs.javascript.functions.Callback0;
import org.wolftec.cwt.collection.ListUtil;
import org.wolftec.cwt.log.Log;
import org.wolftec.cwt.managed.ManagedClass;
import org.wolftec.cwt.util.AssertUtil;
import org.wolftec.cwt.util.ClassUtil;

/**
 * This class handles the game boot.
 */
public class GameLoadingManager implements ManagedClass {

  private Log log;
  private Array<GameLoadingHandler> loaders;

  private boolean started;

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
    AssertUtil.assertThat(!started);
    started = true;

    log.info("booting game");

    ListUtil.forEachArrayValueAsync(loaders, (index, loader, next) -> {
      log.info("[" + index + "] booting " + ClassUtil.getClassName(loader));
      loader.onLoad(next);

    } , () -> {
      log.info("game booted");
      doneCb.$invoke();
    });
  }
}
