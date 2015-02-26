package org.wolfTec.cwt.game.loading.beans;

import org.stjs.javascript.functions.Callback0;
import org.wolfTec.wolfTecEngine.EngineOptions;
import org.wolfTec.wolfTecEngine.beans.annotations.Bean;
import org.wolfTec.wolfTecEngine.beans.annotations.Injected;
import org.wolfTec.wolfTecEngine.localization.model.Localization;
import org.wolfTec.wolfTecEngine.logging.model.Logger;
import org.wolfTec.wolfTecEngine.persistence.HtmlFilesystem;
import org.wolfTec.wolfTecEngine.persistence.model.VirtualFilesystem;

/**
 * This manager is used to load the game data. We use a pretty dumb but simple
 * algorithm to grab the game data. The game files are stored in a remote file
 * system. If the game starts with an empty local file system, then we're going
 * to copy the files from the remote file system first. This results in a long
 * first start, but makes it easy, understand able and pretty stable.
 * 
 * TODO nodeWebKit => remote can be local too...
 */
@Bean
public class GameLoadingManager {

  @Injected
  private Logger log;

  @Injected
  private EngineOptions options;

  @Injected
  private VirtualFilesystem localFs;

  @Injected
  private Localization i18n;

  public void start(Callback0 cb) {
    log.info("Start loading game data");
    localFs.isEmpty(isEmpty -> {

      // first start ?
      // we need to copy the files into the local file system
        if (isEmpty) {
          copyFs(() -> {
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
  private void copyFs(Callback0 cb) {
    log.info("Copying data from remote vfs into local vsf");

    HtmlFilesystem remoteFs = new HtmlFilesystem() {
      @Override
      public String getRemotePath() {
        return options.remoteDataLocation;
      }
    };

    remoteFs.forEachFile((fileDesc, next) -> {
      localFs.writeFile(fileDesc.key, fileDesc.value, (data, err) -> {
        if (err != null) {
          log.error("Could not copy file " + fileDesc.key + " into local filesystem");
        }
        next.$invoke();
      });
      
    }, () -> {
      log.info("Successfully copied data from remote vfs into local vsf");
      cb.$invoke();
    });
  }

  private void loadData(Callback0 cb) {
    log.info("Loading necessary data from vfs into the memory");

    i18n.autoSelectLanguage(() -> {
      log.info("Wooohooo :D");
    });
  }
}
