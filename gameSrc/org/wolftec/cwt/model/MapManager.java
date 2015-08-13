package org.wolftec.cwt.model;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.functions.Callback0;
import org.stjs.javascript.functions.Callback1;
import org.wolftec.cwt.core.DataLoader;
import org.wolftec.cwt.core.FileDescriptor;
import org.wolftec.cwt.core.JsUtil;
import org.wolftec.cwt.core.ioc.Injectable;
import org.wolftec.cwt.persistence.PersistenceManager;
import org.wolftec.cwt.system.Maybe;
import org.wolftec.cwt.system.RequestUtil;

public class MapManager implements Injectable, DataLoader {

  private PersistenceManager pm;

  private Array<String>      maps;

  @Override
  public void onConstruction() {
    maps = JSCollections.$array();
  }

  @Override
  public String forPath() {
    return "maps";
  }

  /**
   * 
   * @param path
   * @param cb
   */
  public void loadMap(String path, Callback1<String> cb) {
    if (maps.indexOf(path) != -1) {
      pm.get(path, (err, data) -> {
        /* TODO */
      });
    }

    JsUtil.throwError("UnknownFile");
  }

  @Override
  public void downloadRemoteFolder(FileDescriptor entryDesc, Callback1<Maybe<Object>> doneCb) {
    RequestUtil.getJSON(entryDesc.path, (response) -> doneCb.$invoke(response.data));
  }

  @Override
  public void handleFolderEntry(FileDescriptor entryDesc, Object entry, Callback0 doneCb) {
    maps.push(entryDesc.fileName);
    doneCb.$invoke();
  }

}
