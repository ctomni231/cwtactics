package org.wolftec.wCore.persistence;

import org.stjs.javascript.Array;
import org.stjs.javascript.functions.Callback1;
import org.stjs.javascript.functions.Callback2;
import org.wolftec.wCore.container.ContainerUtil;
import org.wolftec.wCore.core.BrowserUtil;
import org.wolftec.wCore.core.JsUtil;

/**
 * The html file system will be used to grab the game data from a remote source.
 * In the normal case your game files will be stored somewhere in the web on a
 * web server. With the general settings wolfTec will grab these files with xml
 * http requests and stores them into a local file system.
 */
public abstract class ReadOnlyHtmlVfs implements VfsBackend {

  public abstract String getRemotePath();

  private String getTypeForFile(String path) {
    String end = JsUtil.splitString(path, ".").pop();
    ;
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
  public void keyList(String pathRegEx, Callback1<Array<String>> callback) {
    if (pathRegEx != null && pathRegEx.length() > 0) {
      JsUtil.raiseError("UnsupportedOperationException");
      callback.$invoke(null);
    }

    String file = getRemotePath() + "__fs_content__.txt";
    BrowserUtil.doXmlHttpRequest(file, null, (data, err) -> {
      callback.$invoke(JsUtil.splitString(((String) data), "\n"));
    });
  }

  @Override
  public void readKey(String path, Callback2<String, VfsEntity<String>> cb) {
    String type = getTypeForFile(path);
    BrowserUtil.doXmlHttpRequest(path, type, (data, err) -> {
      VfsEntity<String> entry = new VfsEntity<String>();

      entry.key = path;
      if (err == null) {
        if (type == "arraybuffer") {
          data = BrowserUtil.convertArrayBufferToBase64(data);
        }
        entry.value = (String) data;

      }

      cb.$invoke(err, entry);
    });
  }

  @Override
  public void readKeys(String pathRegEx, Callback2<String, Array<VfsEntity<String>>> cb) {
    keyList(null, fileList -> {
      Array<String> maskedFileList = ContainerUtil.createArray();
      Array<VfsEntity<String>> entities = ContainerUtil.createArray();
      for (int i = 0; i < fileList.$length(); i++) {
        String file = fileList.$get(i);

        if (file.matches(pathRegEx)) {
          maskedFileList.push(file);
        }

        ContainerUtil.forEachElementInListAsync(maskedFileList, (el, next) -> {
          readKey(el, (err, entity) -> {
            entities.push(entity);
            next.$invoke();
          });
        }, () -> cb.$invoke(null, entities));
      }
    });
  }

  @Override
  public void hasKeys(String pathRegEx, Callback2<String, Boolean> cb) {
    keyList(null, fileList -> {
      cb.$invoke(null, fileList != null && fileList.$length() > 0);
    });
  }

  @Override
  public void writeKey(String path, String value, Callback1<String> cb) {
    JsUtil.raiseError("NotSupportedOperationException");
  }

  @Override
  public void purgeKey(String path, Callback1<String> cb) {
    JsUtil.raiseError("NotSupportedOperationException");
  }

  @Override
  public void purgeKeys(String pathRegEx, Callback1<String> cb) {
    JsUtil.raiseError("NotSupportedOperationException");
  }
}
