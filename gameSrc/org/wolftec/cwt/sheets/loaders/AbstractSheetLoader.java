package org.wolftec.cwt.sheets.loaders;

import org.stjs.javascript.Map;
import org.stjs.javascript.functions.Callback0;
import org.stjs.javascript.functions.Callback1;
import org.wolftec.cwt.ErrorManager;
import org.wolftec.cwt.core.FileDescriptor;
import org.wolftec.cwt.core.loading.DataLoader;
import org.wolftec.cwt.core.util.ClassUtil;
import org.wolftec.cwt.core.util.RequestUtil;
import org.wolftec.cwt.sheets.SheetDatabase;
import org.wolftec.cwt.sheets.SheetManager;
import org.wolftec.cwt.sheets.SheetType;
import org.wolftec.cwt.system.Option;

public abstract class AbstractSheetLoader<T extends SheetType> implements DataLoader {

  protected SheetManager db;
  private ErrorManager   errors;

  <M> M read(Map<String, Object> data, String property) {
    return Option.ofNullable((M) data.$get(property)).orElseThrow(property + " is missing in data map");
  }

  <M> M readNullable(Map<String, Object> data, String property, M defaultValue) {
    return Option.ofNullable((M) data.$get(property)).orElse(defaultValue);
  }

  @Override
  public abstract String forPath();

  abstract SheetDatabase<T> getDatabase();

  abstract Class<T> getSheetClass();

  abstract void hydrate(Map<String, Object> entry, T data);

  @Override
  public void downloadRemoteFolder(FileDescriptor entryDesc, Callback1<Option<Object>> doneCb) {
    RequestUtil.getJSON(entryDesc.path, (response) -> doneCb.$invoke(Option.of(response.data.orElse(null))));
  }

  @Override
  public void handleFolderEntry(FileDescriptor entryDesc, Object entry, Callback0 doneCb) {
    T data = ClassUtil.newInstance(getSheetClass());

    /* we inject the ID by the file name to prevent to set the id name twice */
    data.ID = entryDesc.fileNameWithoutExtension;

    try {

      /*
       * hydrates the data object into the created sheet instead of
       * automatically copy the properties ==> decouples the sheet file format
       * from the data class structure.
       */
      hydrate((Map<String, Object>) entry, data);
      getDatabase().registerSheet(data);
      doneCb.$invoke();

    } catch (Exception e) {
      errors.raiseError("could not hydrate data for " + entryDesc.fileNameWithoutExtension + " because of " + e, "sheet loading");
    }
  }
}
