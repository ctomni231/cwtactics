package org.wolftec.core;

public interface ManagedContructionFactory {

  <T> Object create(T component, Class<T> clazz, String property, ManagerOptions options);
}
