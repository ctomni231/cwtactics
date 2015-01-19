package net.wolfTec.wtEngine.assets;

import org.stjs.javascript.annotation.Namespace;
import org.stjs.javascript.functions.Callback0;

@Namespace("wtEngine") public class AssetLoadingBean {
  
  private boolean completed;
  
  public void load(Callback0 callback) {
    
    completed = true;
    callback.$invoke();
  }
  
  public boolean isComplete () {
    return completed;
  }
}
