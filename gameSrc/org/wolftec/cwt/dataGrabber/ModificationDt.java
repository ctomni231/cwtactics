package org.wolftec.cwt.dataGrabber;

import org.stjs.javascript.functions.Callback0;
import org.wolftec.cwt.PersistenceManager;

public class ModificationDt implements Grabber {

  @Override
  public String forPath() {
    // TODO Auto-generated method stub
    return null;
  }

  @Override
  public void grabData(PersistenceManager pm, FileDescriptor file, Callback0 completeCb) {
    // TODO Auto-generated method stub

  }

  @Override
  public void loadData(PersistenceManager pm, FileDescriptor file, Callback0 completeCb) {
    // TODO Auto-generated method stub

  }

  // public void grabData(String path, Callback0 callback) {
  // RequestUtil.doXmlHttpRequest(path, null, (err, data) -> {
  // if (err != null) {
  // JsUtil.throwError("CouldNotGrabMod");
  // }
  //
  // cachedMod = data;
  //
  // pm.set("__modification__", data, (savedData, saveErr) ->
  // callback.$invoke());
  // });
  // }
  //
  // public void transferFromCache(Callback0 callback) {
  //
  // };
  //
  // public Object getMod() {
  // return cachedMod;
  // }
  //
  // public void clearCachedMod() {
  // cachedMod = null;
  // }
  //
  // @Override
  // public void fromRemote(String dataKey, Callback1<Object> dataCb) {
  // // TODO Auto-generated method stub
  //
  // }
  //
  // @Override
  // public void fromCache(PersistenceManager pm, String dataKey,
  // Callback1<Object> dataCb) {
  // pm.get(dataKey, (err, value) -> {
  // dataCb.$invoke(value);
  // });
  // }
}
