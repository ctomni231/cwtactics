package net.wolfTec.wtEngine.base;

import org.stjs.javascript.annotation.Namespace;
import org.stjs.javascript.functions.Callback0;

@Namespace("wtEngine") public class EngineOptions {

  public String namespace;
  public String gameDivId;
  public Callback0 callback; 
  public int actionBufferSize;
  public int inputBufferSize;
  public int networkBufferSize;
  public boolean disableImageSmooth;
  // stateMachines: array<string> 
  // screenSize: [width: int, height: int]
  // onIncomingNetworkMessage: function<messgage: string>: ActionData
  // onItemLoaded: function<item, leftItems: int, category: AssetCategory>
  // onTryToCacheItem: function<item, category: AssetCategory>: boolean
  
  public EngineOptions () {
    namespace = null;
    gameDivId = null; 
    callback = null; 
    actionBufferSize = 32;
    inputBufferSize = 10;
    networkBufferSize = 16;
    disableImageSmooth = false;
  }
}
