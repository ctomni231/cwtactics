package org.wolfTec.cwt.utility.container;

import org.stjs.javascript.annotation.STJSBridge;
import org.stjs.javascript.annotation.Template;

@STJSBridge public abstract class ImmutableArray<T> {
  
  @Template("get")
  public native T $get(int index);

  @Template("toProperty")
  public native int $length();
  
  public native int indexOf(T element);
}
