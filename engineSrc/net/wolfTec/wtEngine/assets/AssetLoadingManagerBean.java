package net.wolfTec.wtEngine.assets;

import org.stjs.javascript.functions.Callback0;

public class AssetLoadingManagerBean {
  
  private boolean completed;
  
  public void load(Callback0 callback) {
    
    completed = true;
    callback.$invoke();
  }
  
  public boolean isComplete () {
    return completed;
  }
}
