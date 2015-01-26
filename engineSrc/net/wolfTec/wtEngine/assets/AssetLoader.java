package net.wolfTec.wtEngine.assets;

import org.stjs.javascript.functions.Callback0;
import org.stjs.javascript.functions.Callback1;

public interface AssetLoader {


  void cacheAsset (AssetItem item, Object data, Callback0 callback);
  
  void loadAsset (AssetItem item, Object data, Callback0 callback);
  
  void grabAsset (AssetItem item, Callback1<Object> callback);
}
