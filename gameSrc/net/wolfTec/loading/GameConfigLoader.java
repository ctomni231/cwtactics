package net.wolfTec.loading;

import org.stjs.javascript.functions.Callback1;

import net.wolfTec.system.StorageBean;
import net.wolfTec.system.StorageBean.StorageEntry;
import net.wolfTec.wtEngine.model.GameConfigBean;
import net.wolfTec.wtEngine.utility.BrowserHelperBean;

public class GameConfigLoader implements LoaderStep {

  public static final String PARAM_FORCE_TOUCH = "forceTouch";
  public static final String PARAM_WIPE_OUT = "resetData";

  private BrowserHelperBean params;
  private GameConfigBean config;

  @Override public void grabAssetsFromRemove(StorageBean storage) {

  }

  @Override public void loadAssets(StorageBean storage) {

    boolean wantsWipe = params.getUrlParameter(PARAM_WIPE_OUT) == "1";

    config.getConfig(PARAM_ANIMATED_TILES).setValue(0);
    config.getConfig(PARAM_FORCE_TOUCH).setValue(0);

    boolean wantsForceTouch = params.getUrlParameter(PARAM_FORCE_TOUCH) == "1";
    StorageBean.get(PARAM_ANIMATED_TILES, new Callback1<StorageBean.StorageEntry>() {
      @Override public void $invoke(StorageEntry entry) {
        if (entry != null) {
          config.getConfig(PARAM_ANIMATED_TILES).setValue(entry.value == "1" ? 1 : 0);
        }

        // forceTouch can be overruled by a URL parameter
        if (wantsForceTouch) {
          config.getConfig(PARAM_FORCE_TOUCH).setValue(1);
          callback.$invoke();

        } else {
          // load value from storage
          StorageBean.get(PARAM_FORCE_TOUCH, new Callback1<StorageBean.StorageEntry>() {
            @Override public void $invoke(StorageEntry entry) {
              if (entry != null && (Boolean) entry.value == true) {
                config.getConfig(PARAM_FORCE_TOUCH).setValue(1);
              }

              if (callback != null) {
                callback.$invoke();
              }
            }
          });
        }
      }
    });
  }

}
