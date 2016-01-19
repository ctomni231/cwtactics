package org.wolftec.cwt.update;

import org.stjs.javascript.Array;
import org.stjs.javascript.functions.Callback0;
import org.wolftec.cwt.Constants;
import org.wolftec.cwt.collection.ListUtil;
import org.wolftec.cwt.log.Log;
import org.wolftec.cwt.serialization.Storage;
import org.wolftec.cwt.serialization.StorageProvider;
import org.wolftec.cwt.util.ClassUtil;
import org.wolftec.cwt.util.JsUtil;
import org.wolftec.cwt.util.NullUtil;
import org.wolftec.cwt.util.NumberUtil;
import org.wolftec.cwt.util.Plugins;
import org.wolftec.cwt.util.VersionUtil;

/**
 * This class manages the update process of the game by invoking all
 * {@link GameUpdate} classes.
 */
public class GameUpdater
{

  private static final String KEY_SYSTEM_VERSION = "system/version";

  public void invokeAllNecessaryGameUpdates(Callback0 doneCb)
  {
    final Log log = new Log(this);
    final Storage storage = StorageProvider.getStorage();
    final Plugins<GameUpdate> updaters = new Plugins<>(GameUpdate.class);

    log.info("checking necessary update steps");

    /*
     * try a conversion here to check the VERSION from constants.
     */
    VersionUtil.convertVersionToNumber(Constants.VERSION);

    /*
     * we have to sort the updates into fixed order to make sure that older
     * updates (e.g. 1.x) will be evaluated before newer updates (e.g. 2.x).
     */

    Array<GameUpdate> updates = updaters.getPlugins();

    updates.sort((a, b) ->
    {
      int aVers = VersionUtil.convertVersionToNumber(a.getUpdateVersion());
      int bVers = VersionUtil.convertVersionToNumber(b.getUpdateVersion());
      return NumberUtil.compare(aVers, bVers);
    });

    storage.loadEntry(KEY_SYSTEM_VERSION, (data) ->
    {
      int currentVersion = VersionUtil.convertVersionToNumber(NullUtil.getOrElse((String) data, "0.0.0"));

      ListUtil.forEachArrayValueAsync(updates, (index, update, next) ->
      {
        if (currentVersion < VersionUtil.convertVersionToNumber(update.getUpdateVersion()))
        {
          doUpdate(update, log, next);
        }
        else
        {
          next.$invoke();
        }
      } , () ->
      {
        storage.saveEntry(KEY_SYSTEM_VERSION, Constants.VERSION, () ->
        {
          doneCb.$invoke();
        } , JsUtil.throwErrorCallback());
      });

    } , (err) ->
    {
      storage.saveEntry(KEY_SYSTEM_VERSION, Constants.VERSION, () ->
      {
        doneCb.$invoke();
      } , JsUtil.throwErrorCallback());
    });
  }

  private void doUpdate(GameUpdate update, Log log, Callback0 next)
  {
    log.info("doing update step for " + update.getUpdateVersion());
    log.info(update.getUpdateText());

    try
    {
      update.doUpdate(() ->
      {
        log.info("completed update step for " + update.getUpdateVersion());
        next.$invoke();
      });

    }
    catch (Exception e)
    {
      JsUtil.throwError("could not evaluate update for " + ClassUtil.getClassName(update));
      next.$invoke();
    }
  }
}
