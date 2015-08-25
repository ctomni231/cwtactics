package org.wolftec.cwt.update;

import org.stjs.javascript.Array;
import org.stjs.javascript.functions.Callback0;
import org.wolftec.cwt.Constants;
import org.wolftec.cwt.core.GameLoader;
import org.wolftec.cwt.core.ListUtil;
import org.wolftec.cwt.persistence.PersistenceManager;
import org.wolftec.cwt.system.Log;
import org.wolftec.cwt.system.Option;
import org.wolftec.cwt.system.VersionUtil;

public class UpdateManager implements GameLoader {

  private static final String KEY_SYSTEM_VERSION = "system/version";
  private PersistenceManager  pm;
  private Log                 log;
  private Array<Update>       updates;

  private void sortUpdaters() {
    updates.sort((a, b) -> {
      int aVers = VersionUtil.convertVersionToNumber(a.getUpdateVersion());
      int bVers = VersionUtil.convertVersionToNumber(b.getUpdateVersion());

      if (aVers < bVers) {
        return -1;
      } else if (aVers > bVers) {
        return +1;
      } else {
        return 0;
      }
    });
  }

  private void doUpdate(Update update, Callback0 next) {
    log.info("doing update step for " + update.getUpdateVersion());
    log.info(update.getUpdateText());
    update.doUpdate(() -> {
      log.info("completed update step for " + update.getUpdateVersion());
      next.$invoke();
    });
  }

  @Override
  public int priority() {
    return -1;
  }

  @Override
  public void onLoad(Callback0 doneCb) {
    log.info("checking necessary update steps");

    /*
     * try a conversion here to check the VERSION from constants.
     */
    VersionUtil.convertVersionToNumber(Constants.VERSION);

    sortUpdaters();

    pm.getItem(KEY_SYSTEM_VERSION, (String err, Option<String> data) -> {
      int currentVersion = VersionUtil.convertVersionToNumber(data.orElse("0.0.0"));

      ListUtil.forEachArrayValueAsync(updates, (index, update, next) -> {
        if (currentVersion < VersionUtil.convertVersionToNumber(update.getUpdateVersion())) {
          doUpdate(update, next);

        } else {
          next.$invoke();
        }

      }, () -> {
        pm.set(KEY_SYSTEM_VERSION, Constants.VERSION, (sErr, sData) -> {
          doneCb.$invoke();
        });
      });
    });
  }
}
