package org.wolftec.cwt.system;

import org.stjs.javascript.Map;
import org.stjs.javascript.functions.Callback0;
import org.stjs.javascript.functions.Callback1;
import org.wolftec.cwt.util.RequestUtil;

public class LanguageLoader implements ResourceLoader {

  private LanguageManager lang;

  @Override
  public String forPath() {
    return "lang";
  }

  @Override
  public void downloadRemoteFolder(FileDescriptor entryDesc, Callback1<Object> doneCb) {
    RequestUtil.getJSON(entryDesc.path, response -> doneCb.$invoke(response.data));
  }

  @Override
  public void handleFolderEntry(FileDescriptor entryDesc, Object entry, Callback0 doneCb) {
    lang.registerLanguage(entryDesc.fileNameWithoutExtension, (Map<String, String>) entry);
    doneCb.$invoke();
  }

}
