package org.wolftec.cwt.core.util;

import org.stjs.javascript.JSObjectAdapter;
import org.stjs.javascript.dom.Element;

public abstract class DomUtil {

  /**
   * Creates a DOM element.
   * 
   * @param tag
   *          name of the tag
   * @return a DOM element with the given tag
   */
  public static <T extends Element> T createDomElement(String tag) {
    return JSObjectAdapter.$js("document.createElement(tag)");
  }

}
