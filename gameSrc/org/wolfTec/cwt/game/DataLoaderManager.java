package org.wolfTec.cwt.game;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.Map;
import org.stjs.javascript.functions.Callback0;
import org.stjs.javascript.functions.Callback1;
import org.wolfTec.wolfTecEngine.EngineOptions;
import org.wolfTec.wolfTecEngine.beans.annotations.Bean;
import org.wolfTec.wolfTecEngine.beans.annotations.Injected;
import org.wolfTec.wolfTecEngine.logging.model.Logger;
import org.wolfTec.wolfTecEngine.persistence.HtmlFilesystem;
import org.wolfTec.wolfTecEngine.persistence.model.FileDescriptor;
import org.wolfTec.wolfTecEngine.persistence.model.VirtualFilesystem;
import org.wolfTec.wolfTecEngine.persistence.model.VirtualFilesystemFolder;
import org.wolfTec.wolfTecEngine.util.BrowserUtil;

@Bean
public class DataLoaderManager {

  @Injected
  private Logger log;

  private Array<VirtualFilesystemFolder> folders;
  
  /**
   * Adds a virtual folder to the loading queue. Every content from the remote file system
   * will be copied into.... TODO
   * 
   * @param vfs
   */
  public void addAutoloadVFS (VirtualFilesystemFolder vfs) {
    if (this.folders == null) {
      this.folders = JSCollections.$array();
    }
    this.folders.push(vfs);
  }

  @Injected
  private VirtualFilesystem localFs;

  @Injected
  private EngineOptions options;
  
  @Injected("key=$beanName")
  private Map<String, DataConverter<?>> converters;

  private boolean completed;

  private void addRemoteToLocalCopyHandler(VirtualFilesystem remoteFs,
      Array<Callback1<Callback0>> loaders, String filePath) {

    loaders.push((cb) -> {
      remoteFs.readFile(filePath, (fileDesc) -> {
        localFs.writeFile(filePath, fileDesc.value, (data, err) -> {
          cb.$invoke();
        });
      });
    });
  }

  private void copyContentFromRemoteToLocalFs(Callback0 callback) {
    Array<Callback1<Callback0>> loaders = JSCollections.$array();

    // remoteFs cannot access instance variables here (because of ST-JS)
    EngineOptions options = this.options;

    // remote files will be loaded with the HTML file system
    HtmlFilesystem remoteFs = new HtmlFilesystem() {
      @Override
      public String getRemotePath() {
        return options.remoteDataLocation;
      }
    };

    remoteFs.readFileList(fileList -> {
      for (int i = 0; i < fileList.$length(); i++) {
        addRemoteToLocalCopyHandler(remoteFs, loaders, fileList.$get(i));
      }

      BrowserUtil.executeSeries(loaders, callback);
    });
  }

  /**
   * 
   * @return true when all content is copied, else false
   */
  public boolean isComplete() {
    return completed;
  }

  /**
   * Starts the loading process. Loads all game data and assets into the browser
   * storage. The game data will be cached after the first start of the game.
   * This method only invokes the broadcast process of the game data from the
   * modification file. Beans have to implement the {@link GameDataGrabber}
   * interface to load and cache data from the game data definition.
   * 
   * @param completeCb
   *          called after the loading process is completed
   */
  public void load(Callback0 completeCb) {
    log.info("Start loading game content");

    Callback0 callback = () -> {
      log.info("Completed loading game content");
      completeCb.$invoke();
    };

    localFs.isEmpty(isEmpty -> {
      if (isEmpty) {
        log.info("No cached content found, "
            + "loading them from remote first and then sharing them among the data grabbers");
        copyContentFromRemoteToLocalFs(() -> {
          loadContentFromLocalFsToRAM(callback);
        });
      } else {
        log.info("Found cached content, sharing them among the data grabbers");
        loadContentFromLocalFsToRAM(callback);
      }
    });
  }

  private void loadContentFromLocalFsToRAM(Callback0 callback) {

  }
}
