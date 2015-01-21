package net.wolfTec.wtEngine.base;

import net.wolfTec.wtEngine.action.ActionData;
import net.wolfTec.wtEngine.assets.AssetCategory;

import org.stjs.javascript.Array;
import org.stjs.javascript.annotation.Namespace;
import org.stjs.javascript.functions.Callback0;
import org.stjs.javascript.functions.Callback3;
import org.stjs.javascript.functions.Function1;
import org.stjs.javascript.functions.Function2;

// TODO: SyntheticType
@Namespace("wtEngine") public class EngineOptions {

  public String namespace;
  public String gameDivId;
  public Callback0 callback; 
  public int actionBufferSize;
  public int inputBufferSize;
  public int networkBufferSize;
  public boolean disableImageSmooth;
  public boolean debugMode;
  public Array<String> stateMachines;
  public int screenWidth;
  public int screenHeight;
  public Function1<String, ActionData> onIncomingNetworkMessage;
  public Callback3<Object, Integer, AssetCategory> onItemLoaded;
  public Function2<Object, AssetCategory, Boolean> onTryToCacheItem;
  
  public EngineOptions () {
    namespace = null;
    gameDivId = null; 
    callback = null; 
    actionBufferSize = 32;
    inputBufferSize = 10;
    networkBufferSize = 16;
    disableImageSmooth = false;
    debugMode = false;
    screenWidth = 32;
    screenHeight = 24;
    
    stateMachines = null;
    onIncomingNetworkMessage = null;
    onItemLoaded = null;
    onTryToCacheItem = null;
  }
}
