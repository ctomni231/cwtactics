package org.wolftec.cwt.util;

import org.stjs.javascript.JSObjectAdapter;
import org.stjs.javascript.dom.Element;

/**
 * Utility class to handle with the browser document object model.
 */
public abstract class DomUtil
{

  /**
   * Creates a DOM element.
   * 
   * @param tag
   *          name of the tag
   * @return a DOM element with the given tag
   */
  public static <T extends Element> T createDomElement(String tag)
  {
    return JSObjectAdapter.$js("document.createElement(tag)");
  }

}
