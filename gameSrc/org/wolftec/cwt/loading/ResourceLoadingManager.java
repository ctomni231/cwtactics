package org.wolftec.cwt.loading;

import org.stjs.javascript.Array;
import org.stjs.javascript.functions.Callback0;
import org.wolftec.cwt.Constants;
import org.wolftec.cwt.collection.ListUtil;
import org.wolftec.cwt.log.Log;
import org.wolftec.cwt.serialization.FileDescriptor;
import org.wolftec.cwt.serialization.PersistenceManager;
import org.wolftec.cwt.util.JsUtil;
import org.wolftec.cwt.util.NullUtil;
import org.wolftec.cwt.util.RequestUtil;
import org.wolftec.cwt.util.RequestUtil.ResponseData;

/**
 * This class manages the game resource persistence.
 */
public class ResourceLoadingManager implements GameLoadingHandler
{

  public static final String DATA_FILE = "system/grabbedData";

  private Log log;
  private PersistenceManager storage;
  private Array<ResourceLoader> loaders;
  private Array<ResourceRequestWatcher> watchers;

  private void downloadFolderFile(ResourceLoader loader, String path, String file, Callback0 next)
  {
    FileDescriptor entryDesc = new FileDescriptor(path + "/" + file);

    log.info("downloading " + entryDesc.fileName);
    ListUtil.forEachArrayValue(watchers, (i, w) -> w.onStartLoading(entryDesc.fileName));

    RequestUtil.getJSON(entryDesc.path, (ResponseData<Array<String>> response) ->
    {
      loader.downloadRemoteFolder(entryDesc, (content) ->
      {
        if (NullUtil.isPresent(content))
        {
          storage.set(entryDesc.path, content, (ferr, fdata) ->
          {

            log.info("completed downloading " + entryDesc.fileName);
            ListUtil.forEachArrayValue(watchers, (i, w) -> w.onFinishedLoading(entryDesc.fileName));

            next.$invoke();
          });

        }
        else
        {
          log.error("missing file " + entryDesc.path);
        }
      });
    });
  }

  private void downloadFolderData(int index, ResourceLoader loader, Callback0 next)
  {
    String path = Constants.SERVER_PATH + Constants.DEF_MOD_PATH + "/" + loader.forPath();

    log.info("iterating folder " + loader.forPath());
    RequestUtil.getJSON(path + "/__filelist__.json", (ResponseData<Array<String>> response) ->
    {
      if (NullUtil.isPresent(response.data))
      {
        ListUtil.forEachArrayValueAsync(response.data, (findex, file, fnext) ->
        {
          downloadFolderFile(loader, path, file, fnext);
        } , next);

      }
      else
      {
        JsUtil.throwError("could not download filelist for folder " + loader.forPath());
      }
    });
  }

  private void downloadData(Callback0 doneCb)
  {
    log.info("downloading game data from location " + Constants.SERVER_PATH + Constants.DEF_MOD_PATH);
    ListUtil.forEachArrayValueAsync(loaders, this::downloadFolderData, () ->
    {
      storage.set(DATA_FILE, true, (err, data) ->
      {
        doneCb.$invoke();
      });
    });
  }

  private void handleFolderFile(ResourceLoader loader, String file, Callback0 next)
  {
    FileDescriptor entryDesc = new FileDescriptor(file);

    log.info("handle " + entryDesc.fileName);
    storage.get(entryDesc.path, (err, value) ->
    {
      loader.handleFolderEntry(entryDesc, value, next);
    });
  }

  private void handleFolderData(int index, ResourceLoader loader, Callback0 next)
  {
    String path = Constants.SERVER_PATH + Constants.DEF_MOD_PATH + "/" + loader.forPath();

    log.info("iterating folder data " + loader.forPath());
    storage.keys((err, keys) ->
    {
      ListUtil.forEachArrayValueAsync(keys, (findex, file, fnext) ->
      {
        if (file.startsWith(path))
        {
          handleFolderFile(loader, file, fnext);
        }
        else
        {
          fnext.$invoke();
        }
      } , next);
    });
  }

  private void handleData(Callback0 doneCb)
  {
    log.info("handle game data from game storage");
    ListUtil.forEachArrayValueAsync(loaders, this::handleFolderData, doneCb);
  }

  @Override
  public void onLoad(Callback0 done)
  {
    storage.get(DATA_FILE, (err, data) ->
    {
      if (NullUtil.isPresent(data))
      {
        handleData(done);
      }
      else
      {
        downloadData(() -> handleData(done));
      }
    });
  }
}
