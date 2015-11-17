package org.wolftec.cwt.core.persistence;

import org.stjs.javascript.Array;
import org.stjs.javascript.functions.Callback0;
import org.stjs.javascript.functions.Callback1;
import org.wolftec.cwt.core.NullUtil;
import org.wolftec.cwt.core.annotations.AsyncCallback;
import org.wolftec.cwt.core.annotations.AsyncOperation;
import org.wolftec.cwt.core.collection.ListUtil;

public class FolderStorage {

  private String folder;

  public FolderStorage(String folder) {
    if (!folder.endsWith("/")) {
      folder += "/";
    }
    this.folder = folder;
  }

  @AsyncOperation
  public <T> void readFile(String fileName, @AsyncCallback Callback1<T> onFinish, @AsyncCallback Callback1<String> onError) {
    LocalForage.localforage.getItem(folder + fileName, (String error, T data) -> {
      if (NullUtil.isPresent(error)) {
        onError.$invoke(error);
      } else {
        onFinish.$invoke(data);
      }
    });
  }

  @AsyncOperation
  public <T> void writeFile(String fileName, T content, @AsyncCallback Callback0 onFinish, @AsyncCallback Callback1<String> onError) {
    LocalForage.localforage.setItem(folder + fileName, content, (error, data) -> {
      if (NullUtil.isPresent(error)) {
        onError.$invoke(error);
      } else {
        onFinish.$invoke();
      }
    });
  }

  @AsyncOperation
  public <T> void deleteFile(String fileName, @AsyncCallback Callback0 onFinish, @AsyncCallback Callback1<String> onError) {
    LocalForage.localforage.removeItem(folder + fileName, (error) -> {
      if (NullUtil.isPresent(error)) {
        onError.$invoke(error);
      } else {
        onFinish.$invoke();
      }
    });
  }

  @AsyncOperation
  public <T> void deleteAllFiles(@AsyncCallback Callback0 onFinish, @AsyncCallback Callback1<String> onError) {

    /* prevents stjs this binding of the following lamda function */
    FolderStorage that = this;

    LocalForage.localforage.keys((error, keys) -> {
      if (NullUtil.isPresent(error)) {
        onError.$invoke(error);
      } else {
        keys.filter((value, index, array) -> value.startsWith(folder));
        ListUtil.forEachArrayValueAsync(keys, (i, key, next) -> {
          that.deleteFile(key, next, onError);
        } , onFinish);
      }
    });
  }

  @AsyncOperation
  public <T> void fileList(@AsyncCallback Callback1<Array<String>> onFinish, @AsyncCallback Callback1<String> onError) {
    LocalForage.localforage.keys((error, keys) -> {
      if (NullUtil.isPresent(error)) {
        onError.$invoke(error);
      } else {
        keys.filter((value, index, array) -> value.startsWith(folder));
        onFinish.$invoke(keys);
      }
    });
  }
}
