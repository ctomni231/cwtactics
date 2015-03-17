package org.wolftec.persistence;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.Map;
import org.stjs.javascript.functions.Callback1;
import org.stjs.javascript.functions.Callback2;
import org.wolftec.container.ContainerUtil;
import org.wolftec.core.ComponentManager;
import org.wolftec.core.JsExec;
import org.wolftec.core.ManagedComponent;
import org.wolftec.core.ManagedComponentInitialization;

/**
 * This is the default local file system of the WolfTec engine. Every file will
 * be handled by Mozillas localForage. In general this means that it uses your
 * browsers IndexedDB technology to persist everything.
 */
@ManagedComponent
public class LocalForageVfs implements VfsBackend, ManagedComponentInitialization {

  /**
   * iOS 7 has a serious bug which makes unable to get the permission to
   * increase the internal persistent storage above 5MB. To prevent that bug we
   * simply use 4 MB as storage. If the pre-set size of the storage sis below
   * 5MB then iOS7 creates a database that can be filled up to 50MB without any
   * permission. Strange? Yes it is!
   */
  public static final int IOS7_WEBSQL_BUGFIX_SIZE = 4;

  /**
   * Maximum size of the application storage.
   */
  public static final int DEFAULT_DB_SIZE = 50;

  @Override
  public void onComponentConstruction(ComponentManager manager) {
    Map<String, Object> config = JSCollections.$map();
    config.$put("name", "CWT_DATABASE");
    config.$put("size", (1 == 2 ? IOS7_WEBSQL_BUGFIX_SIZE : DEFAULT_DB_SIZE * 1024 * 1024));

    JsExec.injectJS("localForage.config(config)");
  }

  @Override
  public void keyList(String pathRegEx, Callback1<Array<String>> callback) {

    @SuppressWarnings("unused") Callback1<Array<String>> fileCb = (fileList) -> {
      Array<String> resultFileList = ContainerUtil.createArray();

      // search all file which are a sub entry of path
      // remove the path from the fill file path
      for (int i = 0; i < fileList.$length(); i++) {
        String file = fileList.$get(i);
        if (file.matches(pathRegEx)) {
          resultFileList.push(file);
        }
      }

      callback.$invoke(resultFileList);
    };

    JsExec.injectJS("localForage.keys(fileCb)");
  }

  @Override
  public void readKey(String path, Callback2<String, VfsEntity<String>> cb) {
    JsExec.injectJS("localForage.getItem(key, cb)");
  }

  @Override
  public void readKeys(String pathRegEx, Callback2<String, Array<VfsEntity<String>>> cb) {
    Array<VfsEntity<String>> contentList = ContainerUtil.createArray();
    keyList(pathRegEx, (keyList) -> {
      ContainerUtil.forEachElementInListAsync(keyList, (key, next) -> {
        readKey(key, (err, data) -> {
          contentList.push(data);
          next.$invoke();
        });
      }, () -> cb.$invoke(null, contentList));
    });
  }

  @Override
  public void writeKey(String path, String value, Callback1<String> cb) {

    @SuppressWarnings("unused") Callback2<String, VfsEntity<String>> safeCb = (error, result) -> {

      // try a second time when fail at the first time because on ios the
      // question for more storage invokes an error => we don't want to
      // need to reload then
      if (error != null) {
        JsExec.injectJS("localForage.setItem(key, value, cb)");
      } else {
        cb.$invoke(error);
      }
    };

    JsExec.injectJS("localForage.setItem(key, value, safeCb)");
  }

  @Override
  public void hasKeys(String pathRegEx, Callback2<String, Boolean> cb) {
    // TODO Auto-generated method stub

  }

  @Override
  public void purgeKey(String path, Callback1<String> cb) {
    JsExec.injectJS("localForage.removeItem(key, cb)");
  }

  @Override
  public void purgeKeys(String pathRegEx, Callback1<String> cb) {
    if (pathRegEx == "") {
      JsExec.injectJS("localForage.clear(cb)");

    } else {
      keyList(pathRegEx, (keyList) -> {
        ContainerUtil.forEachElementInListAsync(keyList, (key, next) -> {
          purgeKey(key, (err) -> next.$invoke());
        }, () -> cb.$invoke(null));
      });
    }
  }
}
