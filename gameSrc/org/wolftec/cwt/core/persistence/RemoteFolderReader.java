package org.wolftec.cwt.core.persistence;

import org.stjs.javascript.Array;
import org.stjs.javascript.functions.Callback0;
import org.stjs.javascript.functions.Callback1;
import org.stjs.javascript.functions.Callback2;
import org.stjs.javascript.functions.Callback3;
import org.wolftec.cwt.core.annotations.AsyncCallback;
import org.wolftec.cwt.core.annotations.AsyncOperation;
import org.wolftec.cwt.core.collection.ListUtil;
import org.wolftec.cwt.core.javascript.JsUtil;
import org.wolftec.cwt.core.javascript.RequestUtil;

public class RemoteFolderReader {

  private String path;

  public RemoteFolderReader(String path) {
    this.path = path;
  }

  @AsyncOperation
  public void fileList(@AsyncCallback Callback1<Array<String>> onFinish) {
    RequestUtil.getJSON(path + "/__filelist__.json", (Array<String> response) -> {
      onFinish.$invoke(response);
    } , JsUtil.throwErrorCallback());
  }

  @AsyncOperation
  public <T> void readFile(String path, @AsyncCallback Callback2<String, T> onFinsh) {
    String filePath = path + "/" + path;
    RequestUtil.getJSON(filePath, (T response) -> onFinsh.$invoke(filePath, response), JsUtil.throwErrorCallback());
  }

  @AsyncOperation
  public <T> void readAllFiles(@AsyncCallback Callback3<String, T, Callback0> onFinishedFile, Callback0 onFinishedAll) {
    fileList((files) -> {
      ListUtil.forEachArrayValueAsync(files, (i, file, next) -> {
        readFile(file, (String filePath, T fileContent) -> onFinishedFile.$invoke(filePath, fileContent, next));
      } , onFinishedAll);
    });
  }
}
