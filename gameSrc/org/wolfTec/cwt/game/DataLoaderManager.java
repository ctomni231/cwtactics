package org.wolfTec.cwt.game;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.Map;
import org.stjs.javascript.functions.Callback0;
import org.stjs.javascript.functions.Callback1;
import org.wolfTec.vfs.ReadOnlyHtmlVfs;
import org.wolfTec.vfs.Vfs;
import org.wolfTec.vfs.VfsEntityDescriptor;
import org.wolfTec.wolfTecEngine.logging.Logger;
import org.wolfTec.wolfTecEngine.util.BrowserUtil;
import org.wolftec.core.Injected;
import org.wolftec.core.ManagedComponent;
import org.wolftec.core.ManagerOptions;

@ManagedComponent
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
  private VirtualFilesystemManager localFs;

  @Injected
  private ManagerOptions options;
  
  @Injected("key=$beanName")
  private Map<String, DataConverter<?>> converters;

  private boolean completed;

  private void addRemoteToLocalCopyHandler(VirtualFilesystemManager remoteFs,
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
    ManagerOptions options = this.options;

    // remote files will be loaded with the HTML file system
    ReadOnlyHtmlVfs remoteFs = new ReadOnlyHtmlVfs() {
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
