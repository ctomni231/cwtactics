package org.wolfTec.cwt.game.assets;

import org.stjs.javascript.functions.Callback0;
import org.wolfTec.cwt.game.persistence.StorageBean;

public interface AssetLoader {

  /**
   * 
   * @param storage
   * @param item
   * @param callback
   */
  void loadAsset (StorageBean storage, AssetItem item, Callback0 callback);
  
  /**
   * Called when an asset must be grabbed from remote location and cached internally.
   * 
   * @param storage
   * @param item
   * @param callback
   */
  void grabAsset (StorageBean storage, AssetItem item, Callback0 callback);
}
