package org.wolftec.cwt.sheets.loaders;

import org.stjs.javascript.functions.Callback0;
import org.stjs.javascript.functions.Callback1;
import org.wolftec.cwt.core.DataLoader;
import org.wolftec.cwt.core.FileDescriptor;
import org.wolftec.cwt.sheets.SheetDatabase;
import org.wolftec.cwt.sheets.SheetType;
import org.wolftec.cwt.system.Maybe;
import org.wolftec.cwt.system.RequestUtil;

public abstract class SheetLoader<T extends SheetType> implements DataLoader {
  abstract SheetDatabase<T> getDatabase();

  @Override
  public void downloadRemoteFolder(FileDescriptor entryDesc, Callback1<Maybe<Object>> doneCb) {
    RequestUtil.getJSON(entryDesc.path, (response) -> doneCb.$invoke(response.data));
  }

  @Override
  public void handleFolderEntry(FileDescriptor entryDesc, Object entry, Callback0 doneCb) {
    /* TODO validate data */
    getDatabase().registerSheet((T) entry);
    doneCb.$invoke();
  }
}
