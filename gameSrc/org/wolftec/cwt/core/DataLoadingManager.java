package org.wolftec.cwt.core;

import org.stjs.javascript.Array;
import org.stjs.javascript.functions.Callback0;
import org.wolftec.cwt.Constants;
import org.wolftec.cwt.persistence.PersistenceManager;
import org.wolftec.cwt.system.Log;
import org.wolftec.cwt.system.Nullable;

public class DataLoadingManager implements GameLoader {

  private static final String   DATA_FILE = "system/grabbedData";

  private Log                   log;
  private PersistenceManager    storage;

  private Array<DataLoader>     loaders;
  private Array<LoadingWatcher> watchers;

  private void downloadFolderFile(DataLoader loader, String path, String file, Callback0 next) {
    FileDescriptor entryDesc = new FileDescriptor(path + "/" + file);

    log.info("downloading " + entryDesc.fileName);

    BrowserUtil.requestJsonFile(entryDesc.path, (data, err) -> {
      loader.downloadRemoteFolder(entryDesc, (content) -> {
        /* TODO */
        if (content.isPresent()) {
          storage.set(entryDesc.path, content.get(), (ferr, fdata) -> {
            log.info("completed");
            next.$invoke();
          });

        } else {
          log.error("missing file " + entryDesc.path);
        }
      });
    });
  }

  private void downloadFolderData(int index, DataLoader loader, Callback0 next) {
    String path = Constants.SERVER_PATH + Constants.DEF_MOD_PATH + "/" + loader.forPath();

    log.info("iterating folder " + loader.forPath());
    BrowserUtil.requestJsonFile(path + "/__filelist__.json", (data, err) -> {
      if (Nullable.isPresent(data)) {
        ListUtil.forEachArrayValueAsync((Array<String>) data, (findex, file, fnext) -> {
          downloadFolderFile(loader, path, file, fnext);
        }, next);

      } else {
        /* TODO remove this by error handling */
        next.$invoke();
      }
    });
  }

  private void downloadData(Callback0 doneCb) {
    log.info("downloading game data from location " + Constants.SERVER_PATH + Constants.DEF_MOD_PATH);
    ListUtil.forEachArrayValueAsync(loaders, this::downloadFolderData, () -> {
      storage.set(DATA_FILE, true, (err, data) -> {
        doneCb.$invoke();
      });
    });
  }

  private void handleFolderFile(DataLoader loader, String file, Callback0 next) {
    FileDescriptor entryDesc = new FileDescriptor(file);

    log.info("handle " + entryDesc.fileName);
    storage.get(entryDesc.path, (err, value) -> {
      loader.handleFolderEntry(entryDesc, value, next);
    });
  }

  private void handleFolderData(int index, DataLoader loader, Callback0 next) {
    String path = Constants.SERVER_PATH + Constants.DEF_MOD_PATH + "/" + loader.forPath();

    log.info("iterating folder data " + loader.forPath());
    storage.keys((err, keys) -> {
      ListUtil.forEachArrayValueAsync(keys, (findex, file, fnext) -> {
        if (file.startsWith(path)) {
          handleFolderFile(loader, file, fnext);
        } else {
          fnext.$invoke();
        }
      }, next);
    });
  }

  private void handleData(Callback0 doneCb) {
    log.info("handle game data from game storage");
    ListUtil.forEachArrayValueAsync(loaders, this::handleFolderData, doneCb);
  }

  @Override
  public void onLoad(Callback0 done) {
    storage.get(DATA_FILE, (err, data) -> {
      Nullable.ifPresentOrElse(data, (saveData) -> handleData(done), () -> downloadData(() -> handleData(done)));
    });
  }
}
