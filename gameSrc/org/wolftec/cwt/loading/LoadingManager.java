package org.wolftec.cwt.loading;

import org.stjs.javascript.functions.Callback;
import org.stjs.javascript.functions.Callback0;
import org.stjs.javascript.functions.Callback1;
import org.stjs.javascript.functions.Function1;
import org.wolftec.cwt.PersistenceManager;
import org.wolftec.cwt.system.Log;

public class LoadingManager {

  private static final String PARAM_HAS_CACHE = "__hasCache__";

  private Log                 log;
  private PersistenceManager  persistence;

  private boolean             hasCachedData;

  /**
   * Starts the loading process. After the loading process the loading stuff
   * will be removed. The Loading namespace will remain with a property with
   * value true as marker. This property will be named deInitialized.
   *
   * @param setProcess
   * @param callback
   */
  public void startProcess(Callback1<Integer> setProcess, Callback0 callback) {

    Function1<Integer, Callback1<Callback0>> setProgress = (i) -> {
      return (next) -> {
        setProcess.$invoke(i);
        next.$invoke();
      };
    };

    function setLoader(mod) {
      return function (next) {
        mod.loader(next, hasCachedData);
      };
    }

    log.info("start loading game data");
    storage.get(PARAM_HAS_CACHE, (value) -> {
      hasCachedData = value;
      workflow.sequence([
          setLoader(require("./loading/checkSystem")),
          setProgress(5),
          setLoader(require("./loading/startParameters")),
          setProgress(10),
          setLoader(require("./loading/loadMod")),
          setProgress(15),
          setLoader(require("./loading/injectMod")),
          setProgress(20),
          setLoader(require("./loading/language")),
          setProgress(25),
          setLoader(require("./loading/imageLoad")),
          setProgress(50),
          setLoader(require("./loading/audioInit")),
          setProgress(75),
          setLoader(require("./loading/inputInit")),
          setProgress(80),
          setLoader(require("./loading/loadMaps")),
          setProgress(90),
          setLoader(require("./loading/portraitCheck")),
          setProgress(95),
          setLoader(require("./loading/addStates")),
          setProgress(100),
          function (next){
            // release cached modification
            require("./dataTransfer/mod").clearCachedMod();
            next();
          }
        ],
        () -> {
          if (callback) {
            log.info("finished loading game data");
            persistence.set(PARAM_HAS_CACHE, true, callback);
          }
        }
      );
    });
  }
}
