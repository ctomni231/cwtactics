package org.wolftec.cwt.model;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.functions.Callback0;
import org.stjs.javascript.functions.Callback1;
import org.wolftec.cwt.core.BrowserUtil;
import org.wolftec.cwt.core.FileDescriptor;
import org.wolftec.cwt.core.Grabber;
import org.wolftec.cwt.core.JsUtil;
import org.wolftec.cwt.core.ioc.Injectable;
import org.wolftec.cwt.persistence.PersistenceManager;

public class MapManager implements Injectable, Grabber {

  private PersistenceManager pm;

  private Array<String>      maps;

  @Override
  public void onConstruction() {
    maps = JSCollections.$array();
  }

  @Override
  public String forPath() {
    return "maps\\";
  }

  @Override
  public void grabData(PersistenceManager pm, FileDescriptor file, Callback0 completeCb) {
    BrowserUtil.doXmlHttpRequest(file.path, null, (err, data) -> {
      pm.set(file.path, data, (saveErr, saveData) -> completeCb.$invoke());
    });
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
  public void loadData(PersistenceManager pm, FileDescriptor file, Callback0 completeCb) {
    maps.push(file.path);
  }

}
