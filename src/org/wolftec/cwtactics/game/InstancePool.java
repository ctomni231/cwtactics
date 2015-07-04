package org.wolftec.cwtactics.game;

public interface InstancePool<T> {

  /**
   * Acquires an object for an key.
   * 
   * @param entity
   * @return
   */
  public abstract T acquire(String entity);

  /**
   * Releases an object T of an key.
   * 
   * @param entity
   * @return
   */
  public abstract boolean release(String entity);

}