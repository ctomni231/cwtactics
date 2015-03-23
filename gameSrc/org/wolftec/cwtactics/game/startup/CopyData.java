package org.wolftec.cwtactics.game.startup;

import org.stjs.javascript.functions.Callback0;
import org.stjs.javascript.functions.Callback1;
import org.wolftec.container.ContainerUtil;
import org.wolftec.core.Injected;
import org.wolftec.core.ManagedComponent;
import org.wolftec.core.ManagedConstruction;
import org.wolftec.core.ManagerOptions;
import org.wolftec.cwtactics.system.loading.GameLoadingHandler;
import org.wolftec.log.Logger;
import org.wolftec.persistence.ReadOnlyHtmlVfs;
import org.wolftec.persistence.VirtualFilesystemManager;

/**
 * The {@link CopyData} will be registered as the most important
 * {@link GameLoadingHandler}. This must be done to make sure that we can copy
 * the remote file system as first game loading action if the local file system
 * is empty.
 */
@ManagedComponent
public class CopyData implements GameLoadingHandler {

  @ManagedConstruction
  private Logger log;

  @Injected
  private ManagerOptions options;

  @Injected
  private VirtualFilesystemManager localFs;

  @Override
  public void loadStuff(Callback1<String> triggerElementLoading, Callback0 triggerDone) {

    // first start ? -> we need to copy the files into the local file system
    localFs.isEmpty(isEmpty -> {

      if (isEmpty) {
        log.info("Copying data from remote fs into local fs");

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
              triggerElementLoading.$invoke(data.key);

              localFs.writeKey(data.key, null, data.value, (errL) -> {
                if (errL != null) {
                  log.error("Could not copy file " + data.key + " into local filesystem");
                }
                next.$invoke();
              });
            });

          }, () -> {
            log.info("Successfully copied data from remote vfs into local vsf");
            triggerDone.$invoke();
          });
        });

      } else {
        log.info("Found data in the local fs... skip copy fs");
        triggerDone.$invoke();
      }
    });
  }

  @Override
  public int getLoadPriority() {
    // make sure that the copy job will be called as first handler
    return 99;
  }

}
