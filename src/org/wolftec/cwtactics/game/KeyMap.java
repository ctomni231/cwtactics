package org.wolftec.cwtactics.game;

import org.stjs.javascript.functions.Callback2;
import org.stjs.javascript.functions.Function2;

public interface KeyMap<T> {

  /**
   * 
   * @param key
   * @return the component of the key.
   */
  public abstract T get(String key);

  /**
   * 
   * @param key
   * @return true when the key has a component of this holder else false
   */
  public abstract boolean has(String key);

  /**
   * Searches the first matching key.
   * 
   * @param filter
   * @return the key that matches with the filter
   */
  public abstract String find(Function2<String, T, Boolean> filter);

  /**
   * Iterates through every key with a connected component of this holder.
   * 
   * @param callback
   */
  public abstract void each(Callback2<String, T> callback);

}