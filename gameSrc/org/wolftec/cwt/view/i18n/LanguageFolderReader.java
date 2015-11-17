package org.wolftec.cwt.view.i18n;

import org.stjs.javascript.JSCollections;
import org.stjs.javascript.Map;
import org.stjs.javascript.functions.Callback0;
import org.stjs.javascript.functions.Callback1;
import org.wolftec.cwt.core.ObjectUtil;
import org.wolftec.cwt.core.Properties;
import org.wolftec.cwt.core.annotations.AsyncCallback;
import org.wolftec.cwt.core.annotations.AsyncOperation;
import org.wolftec.cwt.core.collection.ListUtil;
import org.wolftec.cwt.core.javascript.JsUtil;
import org.wolftec.cwt.core.persistence.FileDescriptor;
import org.wolftec.cwt.core.persistence.FolderStorage;
import org.wolftec.cwt.core.persistence.RemoteFolderReader;

public class LanguageFolderReader {

  private FolderStorage storage;
  private RemoteFolderReader remote;

  public LanguageFolderReader() {
    storage = new FolderStorage("lang/");
    remote = new RemoteFolderReader("localhost:80/mod/cwt/lang");
  }

  @AsyncOperation
  public void downloadLanguageFiles(@AsyncCallback Callback0 onFinish) {
    Callback1<String> throwErrorCallback = JsUtil.throwErrorCallback();
    remote.fileList((files) -> {
      ListUtil.forEachArrayValueAsync(files, (index, filePath, next) -> {
        remote.readFile(filePath, (file, fileContent) -> {
          storage.writeFile(filePath, fileContent, next, throwErrorCallback);
        });
      } , onFinish);
    });
  }

  @AsyncOperation
  public void readLanguageFiles(@AsyncCallback Callback1<Map<String, Properties>> onFinish) {
    Map<String, Properties> languages = JSCollections.$map();
    storage.fileList((files) -> {
      ListUtil.forEachArrayValueAsync(files, (index, file, next) -> {
        FileDescriptor fileMeta = new FileDescriptor(file);
        readLanguageFile(fileMeta, (properties) -> {
          languages.$put(fileMeta.fileNameWithoutExtension, properties);
          next.$invoke();
        });
      } , () -> {
        onFinish.$invoke(languages);
      });
    } , JsUtil.throwErrorCallback());
  }

  @AsyncOperation
  private void readLanguageFile(FileDescriptor fileMeta, @AsyncCallback Callback1<Properties> onFinish) {
    storage.readFile(fileMeta.path, (Map<String, String> value) -> {
      Properties langProp = new Properties();
      ObjectUtil.forEachMapValue(value, (okey, ovalue) -> langProp.put(okey, ovalue));
      onFinish.$invoke(langProp);

    } , JsUtil.throwErrorCallback());
  }

}
