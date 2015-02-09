package net.wolfTec.wtEngine.assets;

import net.wolfTec.wtEngine.Constants;
import net.wolfTec.wtEngine.log.Logger;
import net.wolfTec.wtEngine.persistence.StorageBean;
import net.wolfTec.wtEngine.utility.BrowserHelperBean;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.functions.Callback;
import org.stjs.javascript.functions.Callback0;
import org.stjs.javascript.functions.Callback1;
import org.wolfTec.utility.Bean;
import org.wolfTec.utility.Injected;
import org.wolfTec.utility.InjectedByFactory;
import org.wolfTec.utility.InjectedByInterface;
import org.wolfTec.utility.PostInitialization;

@Bean public class AssetLoadingManagerBean {

  @InjectedByFactory private Logger log;

  @InjectedByInterface private Array<AssetLoader> loaderListeners;

  @Injected private BrowserHelperBean browser;

  @Injected private StorageBean storage;

  private boolean completed;

  private Callback1<Callback> loadModification;

  @PostInitialization public void init() {
    loadModification = (cb) -> {

    };
  }

  /**
   * Starts the loading process. Loads all game data and assets into the browser
   * storage. The game data will be cached after the first start of the game.
   * This method only invokes the broadcast process of the game data from the
   * modification file. Beans have to implement the {@link AssetLoader}
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

    storage.get(Constants.STORAGE_PARAMETER_CACHED_CONTENT, entry -> {
      if (entry.value != null) {
        grabAndCacheContent(() -> {
          loadContent(callback);
        });
      } else {
        loadContent(callback);
      }
    });
  }

  private void grabAndCacheContent(Callback0 callback) {

  }

  @SuppressWarnings("unchecked") private void loadContent(Callback0 callback) {
    Array<Callback1<Callback0>> fns = JSCollections.$array();

    fns.push((next) -> publishLoadEvent(new AssetItem(Constants.DEFAULT_MOD_PATH, null, AssetType.MODIFICATION), next));
  }

  private void publishGrabAndCacheEvent(AssetItem item, Callback0 callback) {

  }

  private void publishLoadEvent(AssetItem item, Callback0 callback) {

  }

  private void publishEventTo(Array<Callback1<Callback0>> queue, AssetLoader loader, AssetItem item, Callback0 callback) {

  }

  public boolean isComplete() {
    return completed;
  }
}
