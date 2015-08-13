package org.wolftec.cwt.update;

import org.stjs.javascript.Array;
import org.stjs.javascript.functions.Callback0;
import org.wolftec.cwt.core.ListUtil;
import org.wolftec.cwt.core.ioc.Injectable;
import org.wolftec.cwt.persistence.PersistenceManager;
import org.wolftec.cwt.system.Log;
import org.wolftec.cwt.system.Nullable;
import org.wolftec.cwt.system.NumberUtil;

public class UpdateManager implements Injectable {

  private PersistenceManager pm;
  private Log                log;
  private Array<Update>      updates;

  public void doNecessaryUpdates(Callback0 doneCb) {
    pm.get("system/version", (err, data) -> {
      if (Nullable.isPresent(data)) {
        ListUtil.forEachArrayValueAsync(updates, this::checkPossibleUpdate, doneCb);

      } else {
        doneCb.$invoke();
      }
    });
  }

  private void checkPossibleUpdate(Object data, Update update, Callback0 next) {
    if (((Integer) data) < NumberUtil.stringAsInt(update.getUpdateVersion())) {
      log.info("doing update step for " + update.getUpdateVersion());
      log.info(update.getUpdateText());
      update.doUpdate(next);
      log.info("completed update step for " + update.getUpdateVersion());

    } else {
      next.$invoke();
    }
  }
}
