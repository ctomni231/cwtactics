package org.wolftec.cwt.controller.updates;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.functions.Callback0;
import org.wolftec.cwt.Constants;
import org.wolftec.cwt.core.NullUtil;
import org.wolftec.cwt.core.NumberUtil;
import org.wolftec.cwt.core.VersionUtil;
import org.wolftec.cwt.core.annotations.AsyncCallback;
import org.wolftec.cwt.core.annotations.AsyncOperation;
import org.wolftec.cwt.core.collection.ListUtil;
import org.wolftec.cwt.core.javascript.ClassUtil;
import org.wolftec.cwt.core.javascript.JsUtil;
import org.wolftec.cwt.core.javascript.ReflectionUtil;
import org.wolftec.cwt.core.log.Log;
import org.wolftec.cwt.core.log.LogFactory;
import org.wolftec.cwt.core.persistence.FolderStorage;

/**
 * This class manages the update process of the game by invoking all
 * {@link GameUpdate} classes.
 */
public class GameUpdateManager {

  private static final String KEY_SYSTEM_VERSION = "system-version";

  private final Log log;
  private final FolderStorage cfg;
  private final Array<GameUpdate> updates;

  public GameUpdateManager() {
    log = LogFactory.byClass(GameUpdateManager.class);
    cfg = new FolderStorage("cfg");
    updates = JSCollections.$array();

    ReflectionUtil.forEachClassOfType(GameUpdate.class, (c) -> updates.push(ReflectionUtil.createInstance(c)));
  }

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

  @AsyncOperation
  public void updateGame(@AsyncCallback Callback0 onFinish) {
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

    cfg.readFile(KEY_SYSTEM_VERSION, (data) -> {
      int currentVersion = VersionUtil.convertVersionToNumber(NullUtil.getOrElse((String) data, "0.0.0"));

      ListUtil.forEachArrayValueAsync(updates, (index, update, next) -> {
        if (currentVersion < VersionUtil.convertVersionToNumber(update.getUpdateVersion())) {
          doUpdate(update, next);
        } else {
          next.$invoke();
        }
      } , () -> {
        cfg.writeFile(KEY_SYSTEM_VERSION, Constants.VERSION, onFinish, JsUtil.throwErrorCallback());
      });
    } , JsUtil.throwErrorCallback());
  }
}
