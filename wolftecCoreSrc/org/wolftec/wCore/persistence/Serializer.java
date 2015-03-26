package org.wolftec.wCore.persistence;

import org.stjs.javascript.functions.Callback1;

/**
 * A {@link Serializer} is an object which converts objects to a string and
 * strings to objects. It's commonly used in virtual file system objects which
 * converts automatically file contents to objects.
 */
public interface Serializer<T> {

  /**
   * Converts a string to a data object.
   * 
   * @param data
   * @param cb 
   *          called with the result data object as first parameter
   */
  void deserialize(String data, Callback1<T> cb);

  /**
   * Converts a data object to a string.
   * 
   * @param data
   * @param cb
   *          called with the result string as first parameter
   */
  void serialize(T data, Callback1<String> cb);
}
