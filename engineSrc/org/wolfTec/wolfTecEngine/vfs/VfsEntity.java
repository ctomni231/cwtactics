package org.wolfTec.wolfTecEngine.vfs;

import org.stjs.javascript.annotation.SyntheticType;

@SyntheticType
public class VfsEntity<T> {
  
  /**
   * Path of the entity.
   */
  public String key;
  
  /**
   * Content of the entity.
   */
  public T value;
}
