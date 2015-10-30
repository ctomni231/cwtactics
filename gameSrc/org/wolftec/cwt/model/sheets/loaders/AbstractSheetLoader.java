package org.wolftec.cwt.model.sheets.loaders;

import org.stjs.javascript.Map;
import org.stjs.javascript.functions.Callback0;
import org.stjs.javascript.functions.Callback1;
import org.wolftec.cwt.core.loading.DataLoader;
import org.wolftec.cwt.core.persistence.FileDescriptor;
import org.wolftec.cwt.core.util.ClassUtil;
import org.wolftec.cwt.core.util.JsUtil;
import org.wolftec.cwt.core.util.NullUtil;
import org.wolftec.cwt.core.util.RequestUtil;
import org.wolftec.cwt.model.sheets.SheetDatabase;
import org.wolftec.cwt.model.sheets.SheetManager;
import org.wolftec.cwt.model.sheets.types.SheetType;

public abstract class AbstractSheetLoader<T extends SheetType> implements DataLoader {

  protected SheetManager db;

  protected <M> M read(Map<String, Object> data, String property) {
    M value = (M) data.$get(property);
    return NullUtil.getOrThrow(value);
  }

  protected <M> M readNullable(Map<String, Object> data, String property, M defaultValue) {
    return NullUtil.getOrElse((M) data.$get(property), defaultValue);
  }

  @Override
  public abstract String forPath();

  @Override
  public void downloadRemoteFolder(FileDescriptor entryDesc, Callback1<Object> doneCb) {
    RequestUtil.getJSON(entryDesc.path, response -> doneCb.$invoke(response.data));
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
      getDatabase().register(data);
      doneCb.$invoke();

    } catch (Exception e) {
      JsUtil.throwError("could not hydrate data for " + entryDesc.fileNameWithoutExtension + " because of " + e);
    }
  }

  abstract SheetDatabase<T> getDatabase();

  abstract Class<T> getSheetClass();

  /**
   * Copies needed data from the data map into the sheet object.
   * 
   * @param dataMap
   * @param sheet
   */
  abstract void hydrate(Map<String, Object> dataMap, T sheet);
}
