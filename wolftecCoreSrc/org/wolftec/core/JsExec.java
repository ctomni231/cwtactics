package org.wolftec.core;

import org.stjs.javascript.annotation.STJSBridge;
import org.stjs.javascript.annotation.Template;

@STJSBridge
public abstract class JsExec {

  /**
   * Injects the code from the parameter code as direct JavaScript statement.
   * 
   * @param code js code
   * @return return value of the js code
   */
  @Template("js")
  public static native <T> T injectJS(String code);
}
