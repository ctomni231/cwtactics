package org.wolfTec.vfs;

import org.stjs.javascript.Array;
import org.stjs.javascript.functions.Callback0;
import org.stjs.javascript.functions.Callback1;
import org.stjs.javascript.functions.Callback2;
import org.wolfTec.wolfTecEngine.container.ContainerUtil;
import org.wolfTec.wolfTecEngine.util.BrowserUtil;

/**
 * A virtual file system that will be used by WolfTec to store game data files.
 */
public interface Vfs {

  /**
   * Deletes all files from a directory.
   * 
   * @param path
   *          full path of the directory
   * @param callback
   */
  public void deleteDirectory(String path, Callback0 callback);

  /**
   * Deletes all files from the file system.
   */
  public void deleteEverything(Callback0 callback);

  /**
   * Deletes a file.
   * 
   * @param path
   * @param callback
   */
  public void deleteFile(String path, Callback0 callback);

  /**
   * Lists all files from a directory.
   * 
   * @param path
   * @param searchSubDirs
   * @param callback
   * @return a list of file paths (! full path from root like
   *         <code>dirA\dirB\file.json</code> !)
   */
  void fileList(String path, boolean searchSubDirs, Callback1<Array<String>> callback);

  /**
   * 
   * @param path
   * @param callback
   */
  <T> void readFile(String path, Callback1<VfsEntityDescriptor<T>> callback);

  /**
   * 
   * @param path
   * @param callback
   */
  default <T> void readFiles(Callback1<Array<VfsEntityDescriptor<T>>> callback) {

    Array<VfsEntityDescriptor<T>> files = ContainerUtil.createArray();
    Array<Callback1<Callback0>> fileLoaders = ContainerUtil.createArray();
    
    Callback1<String> pushFileLoader = (file) -> {
      fileLoaders.push((next) -> {
        readFile(file, (fileDesc) -> {
          files.push((VfsEntityDescriptor<T>) fileDesc);
          next.$invoke();
        });
      });
    };

    fileList("", true, (fileList) -> {
      for (int i = 0; i < fileList.$length(); i++) {
        pushFileLoader.$invoke(fileList.$get(i));
      }

      BrowserUtil.executeSeries(fileLoaders, () -> {
        callback.$invoke(files);
      });
    });
  }

  /**
   * 
   * @param fileCb
   * @param cb
   */
  default <T> void forEachFile(Callback2<VfsEntityDescriptor<T>, Callback0> fileCb, Callback0 cb) {
    readFiles((fileDescs) -> {

      Array<Callback1<Callback0>> iterations = ContainerUtil.createArray();
      Callback1<VfsEntityDescriptor<T>> pushFile = (file) -> {
        iterations.push((next) -> {
          fileCb.$invoke(file, next);
        });
      };

      for (int i = 0; i < fileDescs.$length(); i++) {
        pushFile.$invoke((VfsEntityDescriptor<T>) fileDescs.$get(i));
      }

      BrowserUtil.executeSeries(iterations, cb);
    });
  }

  /**
   * Writes a file to the file system.
   * 
   * @param path
   * @param value
   * @param callback
   */
  <T> void writeFile(String path, T value, Callback2<Object, Object> callback);

  /**
   * 
   * @param callback
   *          will be called with true as parameter when the file system is
   *          empty, else false will be used
   */
  default void isEmpty(Callback1<Boolean> callback) {
    fileList("", true, list -> callback.$invoke(list.$length() == 0));
  }
}
