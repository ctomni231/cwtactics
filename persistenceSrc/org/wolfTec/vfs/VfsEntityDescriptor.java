package org.wolfTec.vfs;

import org.stjs.javascript.annotation.SyntheticType;

@SyntheticType
public class VfsEntityDescriptor<T> {
  
  /**
   * Path of the entity.
   */
  public String key;
  
  /**
   * Content of the entity.
   */
  public T value;
}
