package org.wolftec.cwt.system;

import org.stjs.javascript.functions.Callback0;
import org.stjs.javascript.functions.Callback1;

public class Nullable {
  public native static <T> boolean ifPresent(T value, Callback1<T> cb); // TODO

  public native static <T> boolean ifPresentOrElse(T value, Callback1<T> thenCb, Callback0 elseCb); // TODO

  public native static <T> boolean isPresent(T value); // TODO

  public native static <T> T getOrElse(T value, T whenNull); // TODO

  public native static <T> T getOrThrow(T value, String error); // TODO
}
