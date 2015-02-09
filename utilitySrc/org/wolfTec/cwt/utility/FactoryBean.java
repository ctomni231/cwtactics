package org.wolfTec.cwt.utility;

public interface FactoryBean<T> {
  public T create(String beanName, Object bean, Class<?> beanClass);
}
