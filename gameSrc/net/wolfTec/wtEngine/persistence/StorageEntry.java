package net.wolfTec.wtEngine.persistence;

import org.stjs.javascript.annotation.SyntheticType;

@SyntheticType  public class StorageEntry<T> {
  public String key;
  public T value;
}
