package org.wolftec.core;

public interface ManagedContructionFactory<T> {

  Class<T> factoryForClass();

  Object create(T component, Class<T> clazz, String property, ManagerOptions options);
}
