/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.engine;

import java.io.File;
import org.mozilla.javascript.ScriptableObject;

/**
 *
 * @author tapsi
 */
public class EngineApi {
  
  private static final JsContext jsBridge;
  
  private static EngineObject viewObject;
  private static EngineObject utilObject;
  private static EngineObject modelObject;
  private static EngineObject controllerObject;
  private static EngineObject windowObject;
  
  public static final String WORK_DIR = System.getProperty("user.dir");
  
  public static final String SOURCE_PATH = "jsBin/nightly/normal/";
  public static final String MAPS_PATH = "maps/";
  
  public static final String[] FILES = new String[]{"engineDeps", "engine", "mod"};
  public static final String[] MAPS = new String[]{"testMap","testMap_2_6","testMap_2_7"};

  static {
    jsBridge = new JsContext(true);
  }
  
  
  /**
   * @return the viewObject
   */
  public static EngineObject getViewObject() {
    return viewObject;
  }

  /**
   * @return the utilObject
   */
  public static EngineObject getUtilObject() {
    return utilObject;
  }

  /**
   * @return the modelObject
   */
  public static EngineObject getModelObject() {
    return modelObject;
  }

  /**
   * @return the controllerObject
   */
  public static EngineObject getControllerObject() {
    return controllerObject;
  }

  /**
   * @return the windowObject
   */
  public static EngineObject getWindowObject() {
    return windowObject;
  }

  private static File getFile(String sPath, String fPath) {
    return new File(
            (new StringBuilder())
            .append(WORK_DIR).append("/")
            .append(sPath)
            .append(fPath)
            .append(".js")
            .toString());
  }

  /**
   *
   * @param actionKey
   * @param shared
   * @param args
   */
  public static void pushAction(String actionKey, boolean shared, Object... args) {
    Object[] arguments = new Object[args.length + 1];

    arguments[ args.length ] = actionKey;
    System.arraycopy(args, 0, arguments, 0, args.length);

    getControllerObject().callFunction(
            (shared) ? "pushShardedAction" : "pushAction",
            arguments);
  }

  /**
   * Loads the engine into the javascript context of rhino.
   */
  public static void loadEngine() {
    JsContext.logger.fine("start loading engine");

    JsContext.logger.fine("load files");
    for (int i = 0, e = FILES.length; i < e; i++) {
      jsBridge.evaluateFile(getFile(SOURCE_PATH, FILES[i]));
    }

    for (int i = 0, e = MAPS.length; i < e; i++) {
      jsBridge.evaluateFile(getFile(MAPS_PATH, MAPS[i]));
    }
    
    JsContext.logger.fine("extracting modules");
    viewObject = new EngineObject((ScriptableObject) jsBridge.evalExpression("view"));
    utilObject = new EngineObject((ScriptableObject) jsBridge.evalExpression("util"));
    modelObject = new EngineObject((ScriptableObject) jsBridge.evalExpression("model"));
    controllerObject = new EngineObject((ScriptableObject) jsBridge.evalExpression("controller"));
    windowObject = new EngineObject((ScriptableObject) jsBridge.evalExpression("window"));

    JsContext.logger.fine("finished loading engine");
  }
  
  /**
   * 
   */
  public static void loadDevStuff() {
    
    pushAction("LDMD", false);
    pushAction("LDGM", false, getWindowObject().getProperty("testMapNew"));
  }

  public static boolean hasNextAction(){
    return !getControllerObject().callFunctionAsBoolean("noNextActions");
  }
  
  public static Object flushNextAction(){
    return getControllerObject().callFunction("doNextAction");
  }
}
