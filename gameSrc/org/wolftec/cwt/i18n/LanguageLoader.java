package org.wolftec.cwt.i18n;

import org.stjs.javascript.Global;
import org.stjs.javascript.Map;
import org.stjs.javascript.functions.Callback0;
import org.stjs.javascript.functions.Callback1;
import org.wolftec.cwt.core.DataLoader;
import org.wolftec.cwt.core.FileDescriptor;
import org.wolftec.cwt.core.ioc.Injectable;
import org.wolftec.cwt.system.Maybe;
import org.wolftec.cwt.system.RequestUtil;

public class LanguageLoader implements Injectable, DataLoader {

  private LanguageManager lang;

  @Override
  public String forPath() {
    return "lang";
  }

  @Override
  public void downloadRemoteFolder(FileDescriptor entryDesc, Callback1<Maybe<Object>> doneCb) {
    RequestUtil.getJSON(entryDesc.path, (response) -> doneCb.$invoke(response.data));
  }

  @Override
  public void handlerFolderEntry(FileDescriptor entryDesc, Object entry, Callback0 doneCb) {
    lang.registerLanguage(entryDesc.fileName, (Map<String, String>) Global.JSON.parse(entry.toString()));
    doneCb.$invoke();
  }

}
