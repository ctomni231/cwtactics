package org.wolfTec.wolfTecEngine.vfs;

import org.stjs.javascript.Array;
import org.stjs.javascript.functions.Callback0;
import org.stjs.javascript.functions.Callback1;
import org.stjs.javascript.functions.Callback2;
import org.wolfTec.wolfTecEngine.components.JsUtil;
import org.wolfTec.wolfTecEngine.util.BrowserUtil;

/**
 * The html file system will be used to grab the game data from a remote source.
 * In the normal case your game files will be stored somewhere in the web on a
 * web server. With the general settings wolfTec will grab these files with xml
 * http requests and stores them into a local file system.
 */
public abstract class ReadOnlyHtmlVfs implements Vfs {

  private JsonFileSerializer p_jsonSerializer;

  public ReadOnlyHtmlVfs() {
    p_jsonSerializer = new JsonFileSerializer();
  }

  @Override
  public void deleteDirectory(String path, Callback0 callback) {
    JsUtil.raiseError("UnsupportedOperationException");
  }

  @Override
  public void deleteEverything(Callback0 callback) {
    JsUtil.raiseError("UnsupportedOperationException");
  }

  @Override
  public void deleteFile(String path, Callback0 callback) {
    JsUtil.raiseError("UnsupportedOperationException");
  }

  public abstract String getRemotePath();

  /**
   * 
   * @param path
   * @return
   */
  private String getTypeForFile(String path) {
    String end = JsUtil.splitString(path, ".").pop();;
    switch (end) {

      case "ogg":
      case "mp4":
      case "mp3":
      case "wav":
        return "arraybuffer";

      default:
        return null;
    }
  }

  @Override
  public void fileList(String path, boolean withSubDirs, Callback1<Array<String>> callback) {
    String file = getRemotePath() + "__fs_" + (withSubDirs ? "subs_" : "") + "content__.json";
    BrowserUtil.doXmlHttpRequest(file, null, (data, err) -> {
      p_jsonSerializer.serialize(data, (fileList) -> {
        // TODO check
          callback.$invoke((Array<String>) callback);
        });
    });
  }

  @Override
  public <T> void readFile(String path, Callback1<VfsEntityDescriptor<T>> callback) {
    BrowserUtil.doXmlHttpRequest(path, getTypeForFile(path), (data, err) -> {

      VfsEntityDescriptor<T> entry = (VfsEntityDescriptor<T>) new VfsEntityDescriptor<Object>();
      entry.key = path;
      entry.value = (T) data;

      callback.$invoke(entry);
    });
  }

  @Override
  public <T> void writeFile(String path, T value, Callback2<Object, Object> callback) {
    JsUtil.raiseError("NotSupportedOperationException");
  }

}
