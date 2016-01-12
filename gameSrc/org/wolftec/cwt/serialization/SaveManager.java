package org.wolftec.cwt.serialization;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSObjectAdapter;
import org.stjs.javascript.functions.Callback0;
import org.stjs.javascript.functions.Callback1;
import org.wolftec.cwt.collection.ListUtil;
import org.wolftec.cwt.loading.GameLoadingHandler;
import org.wolftec.cwt.log.Log;
import org.wolftec.cwt.util.ClassUtil;
import org.wolftec.cwt.util.NullUtil;

public class SaveManager implements GameLoadingHandler
{

  private static final String CONFIG_APP_JSON = "config/app.json";

  private Log                log;
  private PersistenceManager pm;

  private Array<SavegameHandler>    gameHandlers;
  private Array<SaveAppdataHandler> appHandlers;

  @Override
  public int priority()
  {
    return 1;
  }

  /**
   * 
   * @param saveName
   * @param doneCb
   *          (error) called when operation is done
   */
  public void saveGame(String saveName, Callback1<String> doneCb)
  {
    log.error("not implemented yet");
  }

  /**
   * 
   * @param saveName
   * @param doneCb
   *          (error) called when operation is done
   */
  public void loadGame(String saveName, Callback1<String> doneCb)
  {
    log.error("not implemented yet");
  }

  /**
   * 
   * @param saveName
   * @param doneCb
   *          (error) called when operation is done
   */
  public void saveAppData(Callback1<String> doneCb)
  {
    log.info("saving application config from game storage");

    Object data = JSObjectAdapter.$js("{}");
    ListUtil.forEachArrayValue(appHandlers, (index, appHandler) ->
    {
      Object handlerData = JSObjectAdapter.$js("{}");
      appHandler.onAppSave(handlerData);
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
  public void loadAppData(Callback1<String> doneCb)
  {
    pm.get(CONFIG_APP_JSON, (err, data) ->
    {
      if (NullUtil.isPresent(data))
      {
        log.info("loading application config from game storage");

        ListUtil.forEachArrayValue(appHandlers, (index, appHandler) ->
        {
          Object handlerData = JSObjectAdapter.$get(data, ClassUtil.getClassName(appHandler));
          if (NullUtil.isPresent(handlerData))
          {
            appHandler.onAppLoad(handlerData);
          }
        });

      }
      else
      {
        log.info("there is no application config in the game storage yet");
      }
      doneCb.$invoke("");
    });
  }

  @Override
  public void onLoad(Callback0 done)
  {
    loadAppData((err) -> done.$invoke());
  }
}
