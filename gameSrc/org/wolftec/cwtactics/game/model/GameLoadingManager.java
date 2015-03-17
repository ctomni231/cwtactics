package org.wolftec.cwtactics.game.model;

import org.stjs.javascript.functions.Callback0;
import org.stjs.javascript.functions.Callback1;
import org.wolftec.container.ContainerUtil;
import org.wolftec.core.Injected;
import org.wolftec.core.ManagedComponent;
import org.wolftec.core.ManagedConstruction;
import org.wolftec.core.ManagerOptions;
import org.wolftec.i18n.LocalizationManager;
import org.wolftec.log.Logger;
import org.wolftec.persistence.ReadOnlyHtmlVfs;
import org.wolftec.persistence.VirtualFilesystemManager;

/**
 * This manager is used to load the game data. We use a pretty dumb but simple
 * algorithm to grab the game data. The game files are stored in a remote file
 * system. If the game starts with an empty local file system, then we're going
 * to copy the files from the remote file system first. This results in a long
 * first start, but makes it easy, understand able and pretty stable.
 * 
 * TODO nodeWebKit => remote can be local too...
 */
@ManagedComponent
public class GameLoadingManager {

  @ManagedConstruction
  private Logger log;

  @Injected
  private ManagerOptions options;

  @Injected
  private VirtualFilesystemManager localFs;

  @Injected
  private LocalizationManager i18n;

  public void start(Callback1<String> fileCopyListener, Callback0 cb) {
    log.info("Start loading game data");
    localFs.isEmpty(isEmpty -> {

      // first start ? -> we need to copy the files into the local file system
        if (isEmpty) {
          copyFs(fileCopyListener, () -> {
            loadData(cb);
          });
        } else {
          loadData(cb);
        }
      });
  }

  /**
   * Copies the files from the remote file system to the local file system.
   * 
   * @param cb
   *          called when the job is done
   */
  private void copyFs(Callback1<String> fileCopyListener, Callback0 cb) {
    log.info("Copying data from remote vfs into local vsf");

    ReadOnlyHtmlVfs remoteFs = new ReadOnlyHtmlVfs() {
      @Override
      public String getRemotePath() {
        return options.remoteDataLocation;
      }
    };

    remoteFs.keyList(null, (entryList) -> {
      ContainerUtil.forEachElementInListAsync(entryList, (entry, next) -> {
        remoteFs.readKey(entry, (errR, data) -> {
          log.info("Copy file " + data.key);
          fileCopyListener.$invoke(data.key);
          localFs.writeKey(data.key, null, data.value, (errL) -> {
            if (errL != null) {
              log.error("Could not copy file " + data.key + " into local filesystem");
            }
            next.$invoke();
          });
        });

      }, () -> {
        log.info("Successfully copied data from remote vfs into local vsf");
        cb.$invoke();
      });
    });
  }

  private void loadData(Callback0 cb) {
    log.info("Loading necessary data from vfs into the memory");

    i18n.autoSelectLanguage(() -> {
      log.info("Wooohooo :D");
    });
  }
}
