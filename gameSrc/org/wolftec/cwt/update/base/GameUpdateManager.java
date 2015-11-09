package org.wolftec.cwt.update.base;

import org.stjs.javascript.Array;
import org.stjs.javascript.functions.Callback0;
import org.wolftec.cwt.Constants;
import org.wolftec.cwt.collection.ListUtil;
import org.wolftec.cwt.loading.GameLoadingHandler;
import org.wolftec.cwt.log.Log;
import org.wolftec.cwt.serialization.PersistenceManager;
import org.wolftec.cwt.util.ClassUtil;
import org.wolftec.cwt.util.JsUtil;
import org.wolftec.cwt.util.NullUtil;
import org.wolftec.cwt.util.NumberUtil;
import org.wolftec.cwt.util.VersionUtil;

/**
 * This class manages the update process of the game by invoking all
 * {@link GameUpdate} classes.
 */
public class GameUpdateManager implements GameLoadingHandler {

  private static final String KEY_SYSTEM_VERSION = "system/version";

  private Log log;
  private PersistenceManager pm;
  private Array<GameUpdate> updates;

  private void sortUpdaters() {
    updates.sort((a, b) -> {
      int aVers = VersionUtil.convertVersionToNumber(a.getUpdateVersion());
      int bVers = VersionUtil.convertVersionToNumber(b.getUpdateVersion());
      return NumberUtil.compare(aVers, bVers);
    });
  }

  private void doUpdate(GameUpdate update, Callback0 next) {
    log.info("doing update step for " + update.getUpdateVersion());
    log.info(update.getUpdateText());

    try {
      update.doUpdate(() -> {
        log.info("completed update step for " + update.getUpdateVersion());
        next.$invoke();
      });

    } catch (Exception e) {
      JsUtil.throwError("could not evaluate update for " + ClassUtil.getClassName(update));
      next.$invoke();
    }
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

    /*
     * we have to sort the updates into fixed order to make sure that older
     * updates (e.g. 1.x) will be evaluated before newer updates (e.g. 2.x).
     */
    sortUpdaters();

    pm.getItem(KEY_SYSTEM_VERSION, (err, data) -> {
      int currentVersion = VersionUtil.convertVersionToNumber(NullUtil.getOrElse((String) data, "0.0.0"));

      ListUtil.forEachArrayValueAsync(updates, (index, update, next) -> {
        if (currentVersion < VersionUtil.convertVersionToNumber(update.getUpdateVersion())) {
          doUpdate(update, next);
        } else {
          next.$invoke();
        }
      } , () -> {
        pm.set(KEY_SYSTEM_VERSION, Constants.VERSION, (sErr, sData) -> {
          doneCb.$invoke();
        });
      });
    });
  }
}
