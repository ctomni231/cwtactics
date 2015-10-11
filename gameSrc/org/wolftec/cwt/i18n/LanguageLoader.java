package org.wolftec.cwt.i18n;

import org.stjs.javascript.Map;
import org.stjs.javascript.functions.Callback0;
import org.stjs.javascript.functions.Callback1;
import org.wolftec.cwt.core.DataLoader;
import org.wolftec.cwt.core.FileDescriptor;
import org.wolftec.cwt.core.util.RequestUtil;
import org.wolftec.cwt.system.Option;

public class LanguageLoader implements DataLoader {

  private LanguageManager lang;

  @Override
  public String forPath() {
    return "lang";
  }

  @Override
  public void downloadRemoteFolder(FileDescriptor entryDesc, Callback1<Option<Object>> doneCb) {
    RequestUtil.getJSON(entryDesc.path, (response) -> doneCb.$invoke(Option.ofNullable(response.data.orElse(null))));
  }

  @Override
  public void handleFolderEntry(FileDescriptor entryDesc, Object entry, Callback0 doneCb) {
    lang.registerLanguage(entryDesc.fileNameWithoutExtension, (Map<String, String>) entry);
    doneCb.$invoke();
  }

}
