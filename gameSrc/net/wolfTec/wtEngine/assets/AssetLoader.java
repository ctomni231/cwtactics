package net.wolfTec.wtEngine.assets;

import net.wolfTec.wtEngine.persistence.StorageBean;

import org.stjs.javascript.functions.Callback0;

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
