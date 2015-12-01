package org.wolftec.cwt.model.sheets.loaders;

import org.stjs.javascript.Global;
import org.stjs.javascript.functions.Callback0;
import org.stjs.javascript.functions.Callback1;
import org.wolftec.cwt.core.FileUtil;
import org.wolftec.cwt.core.annotations.AsyncCallback;
import org.wolftec.cwt.core.annotations.AsyncOperation;
import org.wolftec.cwt.core.javascript.ReflectionUtil;
import org.wolftec.cwt.core.persistence.FolderStorage;
import org.wolftec.cwt.core.persistence.RemoteFolderReader;
import org.wolftec.cwt.model.GenericDataObject;
import org.wolftec.cwt.model.gameround.objecttypes.SheetType;
import org.wolftec.cwt.model.sheets.SheetSet;

public abstract class AbstractSheetLoader<T extends SheetType> {

  protected SheetSet<T> sheets;
  private RemoteFolderReader remoteReader;
  private FolderStorage storageReader;

  public AbstractSheetLoader(SheetSet<T> db) {
    this.sheets = db;
    this.storageReader = new FolderStorage(forPath());
  }

  @AsyncOperation
  private void grabRemoteData(@AsyncCallback Callback0 onFinish, @AsyncCallback Callback1<String> onFail) {
    remoteReader.readAllFiles((filePath, data, next) -> {
      storageReader.writeFile(filePath, data, next, onFail);
    } , onFinish);
  }

  @AsyncOperation
  private void grabCacheData(@AsyncCallback Callback0 onFinish, @AsyncCallback Callback1<String> onFail) {
    storageReader.readFiles((filePath, data, next) -> {
      GenericDataObject genData = new GenericDataObject(Global.JSON.parse((String) data));
      T sheet = ReflectionUtil.createInstance(getSheetClass());

      /*
       * we inject the ID by the file name to prevent to set the id name twice
       */
      sheet.ID = FileUtil.extractFilename(filePath);

      /*
       * hydrates the data object into the created sheet instead of
       * automatically copy the properties -> decouples the sheet file format
       * from the data class structure.
       */
      hydrate(genData, sheet);

      sheets.register(sheet);
      next.$invoke();
    } , onFinish, onFail);
  }

  @AsyncOperation
  public void grabData(@AsyncCallback Callback0 onFinish, @AsyncCallback Callback1<String> onFail) {
    storageReader.hasFile("__cached__", (cached) -> {
      if (cached) {
        grabCacheData(onFinish, onFail);
      } else {
        grabRemoteData(() -> grabCacheData(onFinish, onFail), onFail);
      }
    });
  }

  abstract String forPath();

  abstract Class<T> getSheetClass();

  /**
   * Copies needed data from the data map into the sheet object.
   * 
   * @param dataMap
   * @param sheet
   */
  abstract void hydrate(GenericDataObject data, T sheet);
}
