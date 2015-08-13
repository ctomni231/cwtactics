package org.wolftec.cwt.save;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSObjectAdapter;
import org.stjs.javascript.functions.Callback0;
import org.stjs.javascript.functions.Callback1;
import org.wolftec.cwt.core.GameLoader;
import org.wolftec.cwt.core.ListUtil;
import org.wolftec.cwt.persistence.PersistenceManager;
import org.wolftec.cwt.system.ClassUtil;
import org.wolftec.cwt.system.Log;
import org.wolftec.cwt.system.Nullable;

public class SaveManager implements GameLoader {

  private static final String CONFIG_APP_JSON = "config/app.json";

  private Log                 log;
  private PersistenceManager  pm;

  private Array<GameHandler>  gameHandlers;
  private Array<AppHandler>   appHandlers;

  @Override
  public int priority() {
    return 1;
  }

  /**
   * 
   * @param saveName
   * @param doneCb
   *          (error) called when operation is done
   */
  public void saveGame(String saveName, Callback1<String> doneCb) {
    // TODO
  }

  /**
   * 
   * @param saveName
   * @param doneCb
   *          (error) called when operation is done
   */
  public void loadGame(String saveName, Callback1<String> doneCb) {
    // TODO
  }

  /**
   * 
   * @param saveName
   * @param doneCb
   *          (error) called when operation is done
   */
  public void saveAppData(Callback1<String> doneCb) {
    log.info("saving application config from game storage");

    Object data = JSObjectAdapter.$js("{}");
    ListUtil.forEachArrayValue(appHandlers, (index, appHandler) -> {
      Object handlerData = JSObjectAdapter.$js("{}");
      appHandler.onAppSave(data);
      JSObjectAdapter.$put(data, ClassUtil.getClassName(appHandler), handlerData);
    });

    pm.set(CONFIG_APP_JSON, data, (err, savedData) -> doneCb.$invoke(err));
  }

  /**
   * 
   * @param saveName
   * @param doneCb
   *          (error) called when operation is done
   */
  public void loadAppData(Callback1<String> doneCb) {
    pm.get(CONFIG_APP_JSON, (err, data) -> {
      if (Nullable.isPresent(data)) {
        log.info("loading application config from game storage");

        ListUtil.forEachArrayValue(appHandlers, (index, appHandler) -> {
          Nullable.ifPresent(JSObjectAdapter.$get(data, ClassUtil.getClassName(appHandler)), (handlerData) -> {
            appHandler.onAppLoad(data);
          });
        });

      } else {
        log.info("there is no application config in the game storage yet");
      }
      doneCb.$invoke("");
    });
  }

  @Override
  public void onLoad(Callback0 done) {
    loadAppData((err) -> done.$invoke());
  }
}
