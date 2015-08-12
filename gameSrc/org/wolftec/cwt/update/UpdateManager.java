package org.wolftec.cwt.update;

import org.stjs.javascript.Array;
import org.stjs.javascript.functions.Callback0;
import org.wolftec.cwt.core.ListUtil;
import org.wolftec.cwt.core.ioc.Injectable;
import org.wolftec.cwt.system.Log;

public class UpdateManager implements Injectable {

  private Log           log;
  private Array<Update> updates;

  public void doNecessaryUpdates(Callback0 doneCb) {
    int currentVersionCode = 999999999;
    /* TODO fix the logic here :P */
    ListUtil.forEachArrayValueAsync(updates, (index, update, next) -> {
      if (10 > currentVersionCode) {
        log.info("doing update step for " + update.getUpdateVersion());
        log.info(update.getUpdateText());
        update.doUpdate(next);
        log.info("completed update step for " + update.getUpdateVersion());
      }
    }, doneCb);
  }
}
