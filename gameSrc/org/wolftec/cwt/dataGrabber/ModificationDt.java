package org.wolftec.cwt.dataGrabber;

import org.stjs.javascript.functions.Callback0;
import org.stjs.javascript.functions.Callback1;
import org.wolftec.cwt.PersistenceManager;
import org.wolftec.cwt.core.JsUtil;
import org.wolftec.cwt.system.RequestUtil;

public class ModificationDt implements Grabber {

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

  };

  public Object getMod() {
    return cachedMod;
  }

  public void clearCachedMod() {
    cachedMod = null;
  }

  @Override
  public void fromRemote(String dataKey, Callback1<Object> dataCb) {
    // TODO Auto-generated method stub

  }

  @Override
  public void fromCache(PersistenceManager pm, String dataKey, Callback1<Object> dataCb) {
    pm.get(dataKey, (err, value) -> {
      dataCb.$invoke(value);
    });
  }
}
