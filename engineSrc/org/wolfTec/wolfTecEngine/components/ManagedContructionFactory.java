package org.wolfTec.wolfTecEngine.components;

public interface ManagedContructionFactory {

  <T> Object create(T component, Class<T> clazz, String property, ManagerOptions options);
}
