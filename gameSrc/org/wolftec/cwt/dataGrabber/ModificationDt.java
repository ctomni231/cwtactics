package org.wolftec.cwt.dataGrabber;

import org.stjs.javascript.functions.Callback0;
import org.wolftec.cwt.PersistenceManager;
import org.wolftec.cwt.core.Injectable;
import org.wolftec.cwt.core.JsUtil;
import org.wolftec.cwt.system.RequestUtil;

public class ModificationDt implements Injectable {

  private PersistenceManager pm;

  private Object             cachedMod;

  public void grabData(String path, Callback0 callback) {
    RequestUtil.doXmlHttpRequest(path, null, (err, data) -> {
      if (err != null) {
        JsUtil.throwError("CouldNotGrabMod");
      }

      cachedMod = data;

      pm.set("__modification__", data, (savedData, saveErr) -> callback.$invoke());
    });
  }

  public void transferFromCache(Callback0 callback) {
    pm.get("__modification__", (err, value) -> {
      cachedMod = value;
      callback.$invoke();
    });
  };

  public Object getMod() {
    return cachedMod;
  }

  public void clearCachedMod() {
    cachedMod = null;
  }
}
