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

  @Override
  public int priority() {
    return 5;
  }

  private void downloadFolderFile(DataLoader loader, String path, String file, Callback0 next) {
    FileDescriptor entryDesc = new FileDescriptor();
    entryDesc.fileName = file;
    entryDesc.path = path + "/" + file;

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
    ListUtil.forEachArrayValueAsync(loaders, this::downloadFolderData, doneCb);
  }

  @Override
  public void onLoad(Callback0 done) {
    storage.get(DATA_FILE, (err, data) -> {
      Nullable.ifPresentOrElse(data, (saveData) -> {
        log.info("going to use game data from game storage");
        done.$invoke();

      }, () -> {
        log.info("going to grab game data from remote");
        downloadData(done);
      });
    });
  }
}
