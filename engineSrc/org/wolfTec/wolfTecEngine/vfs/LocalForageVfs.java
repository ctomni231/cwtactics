package org.wolfTec.wolfTecEngine.vfs;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.Map;
import org.stjs.javascript.functions.Callback0;
import org.stjs.javascript.functions.Callback1;
import org.stjs.javascript.functions.Callback2;
import org.wolfTec.wolfTecEngine.components.ComponentManager;
import org.wolfTec.wolfTecEngine.components.ManagedComponent;
import org.wolfTec.wolfTecEngine.components.ManagedComponentInitialization;
import org.wolfTec.wolfTecEngine.container.ContainerUtil;
import org.wolfTec.wolfTecEngine.util.BrowserUtil;
import org.wolfTec.wolfTecEngine.components.JsExec;

/**
 * This is the default local file system of the WolfTec engine. Every file will
 * be handled by Mozillas localForage. In general this means that it uses your
 * browsers IndexedDB technology to persist everything.
 */
@ManagedComponent
public class LocalForageVfs implements Vfs, ManagedComponentInitialization {

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
  public void deleteDirectory(String path, Callback0 callback) {
    Array<Callback1<Callback0>> deleteJobs = ContainerUtil.createArray();
    Callback1<String> pushDelete = (file) -> {
      deleteJobs.push((next) -> deleteFile(file, next));
    };
    
    fileList(path, true, (fileList) -> {
      for (int i = 0; i < fileList.$length(); i++) {
        pushDelete.$invoke(fileList.$get(i));
      }
      BrowserUtil.executeSeries(deleteJobs, callback);
    });
  }

  @Override
  public void deleteEverything(Callback0 callback) {
    JsExec.injectJS("localForage.clear(callback)");
  }

  @Override
  public void deleteFile(String path, Callback0 callback) {
    JsExec.injectJS("localForage.removeItem(key, callback)");
  }

  @Override
  public void fileList(String path, boolean searchSubDirs, Callback1<Array<String>> callback) {
    Callback1<Array<String>> fileCb = (fileList) -> {
      Array<String> resultFileList = ContainerUtil.createArray();

      // search all file which are a sub entry of path
      // remove the path from the fill file path
      for (int i = 0; i < fileList.$length(); i++) {
        String file = fileList.$get(i);
        if (file.startsWith(path)) {
          resultFileList.push(file.substring(path.length()));
        }
      }

      callback.$invoke(resultFileList);
    };
    JsExec.injectJS("localForage.keys(fileCb)");
  }

  @Override
  public void onComponentConstruction(ComponentManager manager) {

    Map<String, Object> config = JSCollections.$map();
    config.$put("name", "CWT_DATABASE");
    config.$put("size", (1 == 2 ? IOS7_WEBSQL_BUGFIX_SIZE : DEFAULT_DB_SIZE * 1024 * 1024));

    JsExec.injectJS("localForage.config(config)");
  }

  @Override
  public <T> void readFile(String path, Callback1<VfsEntityDescriptor<T>> callback) {
    JsExec.injectJS("localForage.getItem(key, callback)");
  }

  @Override
  public <T> void writeFile(final String path, final T value,
      final Callback2<Object, Object> callback) {

    Callback2<VfsEntityDescriptor<?>, Object> safeCb = (result, error) -> {
      // try a second time when fail at the first time because on ios the
      // question for more storage invokes an error => we don't want to
      // need to reload then
      if (error != null) {
        JsExec.injectJS("localForage.setItem(key, value, callback)");
      } else {
        callback.$invoke(result, null);
      }
    };

    JsExec.injectJS("localForage.setItem(key, value, safeCb)");
  }

}
