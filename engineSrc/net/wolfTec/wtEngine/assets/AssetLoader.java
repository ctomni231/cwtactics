package net.wolfTec.wtEngine.assets;

import org.stjs.javascript.functions.Callback0;
import org.stjs.javascript.functions.Callback1;

public interface AssetLoader {

  /**
   * 
   * @param item
   * @param data
   * @param callback
   */
  void cacheAsset (AssetItem item, Object data, Callback0 callback);
  
  /**
   * 
   * @param item
   * @param data
   * @param callback
   */
  void loadAsset (AssetItem item, Object data, Callback0 callback);
  
  /**
   * 
   * @param item
   * @param callback
   */
  void grabAsset (AssetItem item, Callback1<Object> callback);
}
