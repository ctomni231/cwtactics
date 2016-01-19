package org.wolftec.cwt.loading;

import org.stjs.javascript.Array;
import org.stjs.javascript.functions.Callback0;
import org.stjs.javascript.functions.Callback1;
import org.wolftec.cwt.Constants;
import org.wolftec.cwt.collection.ListUtil;
import org.wolftec.cwt.log.Log;
import org.wolftec.cwt.serialization.FileDescriptor;
import org.wolftec.cwt.serialization.Storage;
import org.wolftec.cwt.serialization.StorageProvider;
import org.wolftec.cwt.util.JsUtil;
import org.wolftec.cwt.util.Plugins;
import org.wolftec.cwt.util.RequestUtilNew;

public class DataGrabbers
{
  private static final String FILELIST_JSON_NAME = "__filelist__.json";

  public static final String DATA_FILE = "system/grabbedData";

  private Storage storage;
  private Plugins<DataGrabber> grabbers;
  private Plugins<ResourceRequestWatcher> watchers;

  public DataGrabbers()
  {
    storage = StorageProvider.getStorage();
    grabbers = new Plugins<>(DataGrabber.class);
    watchers = new Plugins<>(ResourceRequestWatcher.class);
  }

  public void downloadGameData(Callback0 whenDone)
  {
    loadDataFromServer(whenDone);
    // storage.loadEntry(DATA_FILE, (ingoredData) ->
    // loadDataFromStorage(whenDone),
    // (ignoredError) -> loadDataFromServer(whenDone));
  }

  private void loadDataFromServer(Callback0 whenDone)
  {
    String serverPath = Constants.SERVER_PATH + Constants.DEF_MOD_PATH;
    grabbers.asyncForEach((grabber, invokeNextGrabber) ->
    {

      Callback1<String> whenGrabberFail = (error) ->
      {
        (new Log(this)).error(error);
        invokeNextGrabber.$invoke();
      };

      String folder = grabber.getTargetFolder();
      RequestUtilNew.getJSON(serverPath + "/" + folder + "/" + FILELIST_JSON_NAME, (rawData) ->
      {
        storage.saveEntry(serverPath + "/" + folder + "/" + FILELIST_JSON_NAME, rawData, () ->
        {
          Array<String> fileList = (Array<String>) rawData;
          ListUtil.forEachArrayValueAsync(fileList, (index, file, next) ->
          {

            FileDescriptor entryDesc = new FileDescriptor(serverPath + "/" + folder + "/" + file);

            watchers.forEach((watcher) -> watcher.onStartLoading(entryDesc.fileName));
            switch (grabber.getFileType(entryDesc))
            {
              case JSON_DATA:
                RequestUtilNew.getJSON(entryDesc.path, (rawFileData) ->
                {

                  storage.saveEntry(entryDesc.path, rawFileData, () ->
                  {
                    grabber.putDataIntoGame(entryDesc, rawFileData);
                    watchers.forEach((watcher) -> watcher.onFinishedLoading(entryDesc.fileName));
                    next.$invoke();

                  } , (error) -> whenGrabberFail.$invoke("could not save " + entryDesc.fileName));
                } , (error) -> whenGrabberFail.$invoke("could not download " + entryDesc.fileName));
                break;

              default:
                next.$invoke();
                break;
            }
          } , invokeNextGrabber);
        } , (error) -> whenGrabberFail.$invoke("could not save " + folder + " file list"));
      } , (error) -> whenGrabberFail.$invoke("could not download " + folder + " file list"));
    } , whenDone);
  }

  private void loadDataFromStorage(Callback0 whenDone)
  {
    String serverPath = Constants.SERVER_PATH + Constants.DEF_MOD_PATH;
    grabbers.forEach((grabber) ->
    {
      String folder = grabber.getTargetFolder();
      storage.loadEntry(serverPath + "/" + folder + "/" + FILELIST_JSON_NAME, (rawData) ->
      {
        Array<String> fileList = (Array<String>) rawData;
        ListUtil.forEachArrayValueAsync(fileList, (index, file, next) ->
        {
          FileDescriptor entryDesc = new FileDescriptor(serverPath + "/" + folder + "/" + file);

          watchers.forEach((watcher) -> watcher.onStartLoading(entryDesc.fileName));
          storage.loadEntry(entryDesc.path, (rawFileData) ->
          {
            grabber.putDataIntoGame(entryDesc, rawFileData);
            watchers.forEach((watcher) -> watcher.onFinishedLoading(entryDesc.fileName));
            next.$invoke();

          } , (error) -> JsUtil.throwError("could not download " + folder + " folder file " + entryDesc.fileName));
        } , whenDone);
      } , (error) -> JsUtil.throwError("could not load " + folder + " folder file list"));
    });
  }
}
