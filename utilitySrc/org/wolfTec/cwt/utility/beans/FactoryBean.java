package org.wolfTec.cwt.utility.beans;

public interface FactoryBean<T> {
  public T create(String beanName, Object bean, Class<?> beanClass);
}
