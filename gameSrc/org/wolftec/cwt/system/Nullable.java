package org.wolftec.cwt.system;

public class Nullable {
  public native static <T> boolean isPresent(T value); // TODO

  public native static <T> T getOrElse(T value, T whenNull); // TODO

  public native static <T> T getOrThrow(T value, String error); // TODO
}
