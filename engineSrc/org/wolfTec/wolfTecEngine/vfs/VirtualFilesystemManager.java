package org.wolfTec.wolfTecEngine.vfs;

import org.stjs.javascript.Array;
import org.stjs.javascript.functions.Callback0;
import org.stjs.javascript.functions.Callback1;
import org.stjs.javascript.functions.Callback2;
import org.stjs.javascript.functions.Callback3;
import org.wolfTec.wolfTecEngine.components.Injected;
import org.wolfTec.wolfTecEngine.components.ManagedComponent;
import org.wolfTec.wolfTecEngine.container.ContainerUtil;

/**
 * A virtual file system that will be used by WolfTec to store game data files.
 */
@ManagedComponent
public class VirtualFilesystemManager {

  @Injected
  private VfsBackend backend;

  public <T> void readKey(String path, Serializer<T> ser, Callback2<String, VfsEntity<T>> cb) {
    backend.readKey(path, (err, data) -> {
      if (err != null) {
        cb.$invoke(err, null);

      } else {
        ser.deserialize(data.value, (typedDataValue) -> {
          VfsEntity<T> typedData = new VfsEntity();
          typedData.key = data.key;
          typedData.value = typedDataValue;
          cb.$invoke(null, typedData);
        });
      }
    });
  }

  public <T> void readKeys(String pathRegEx, Serializer<T> ser,
      Callback2<String, Array<VfsEntity<T>>> cb) {

    Array<VfsEntity<T>> typedDataList = ContainerUtil.createArray();

    backend.readKeys(pathRegEx, (err, dataList) -> {
      ContainerUtil.forEachElementInListAsync(dataList, (entry, next) -> {
        ser.deserialize(entry.value, typedValue -> {
          VfsEntity<T> typedData = new VfsEntity();
          typedData.key = entry.key;
          typedData.value = typedValue;
          typedDataList.push(typedData);
          next.$invoke(); // TODO err
          });

      }, () -> {
        cb.$invoke(null, typedDataList);
      });
    });
  }

  public <T> void forEachKey(String pathRegEx, Serializer<T> ser,
      Callback3<String, VfsEntity<T>, Callback0> fileCb, Callback0 cb) {
    
    readKeys(pathRegEx, ser, (err, typedDataList) -> {
      ContainerUtil.forEachElementInListAsync(typedDataList, (entry, next) -> {
        fileCb.$invoke(null, entry, next); // TODO err
        }, cb);
    });
  }

  public <T> void writeKey(String path, Serializer<T> ser, T value, Callback1<String> cb) {
    ser.serialize(value, serData -> backend.writeKey(path, serData, cb));
  }

  public void hasKeys(String pathRegEx, Callback2<String, Boolean> cb) {
    backend.hasKeys(pathRegEx, cb);
  }

  public void purgeKey(String path, Callback1<String> cb) {
    backend.purgeKey(path, cb);
  }

  public void purgeKeys(String pathRegEx, Callback1<String> cb) {
    backend.purgeKeys(pathRegEx, cb);
  }

  /**
   * 
   * @param callback
   *          will be called with true as parameter when the file system is
   *          empty, else false will be used
   */
  public void isEmpty(Callback1<Boolean> callback) {
    backend.hasKeys("", (err, notEmpty) -> callback.$invoke(!notEmpty));
  }
}
