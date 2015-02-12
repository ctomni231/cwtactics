package org.wolfTec.cwt.game.factories;

import org.wolfTec.cwt.utility.beans.Bean;
import org.wolfTec.cwt.utility.beans.FactoryBean;
import org.wolfTec.cwt.utility.container.CircularBuffer;

@Bean
public class BufferFactory implements FactoryBean<CircularBuffer<?>> {

  @Override
  public CircularBuffer<?> create(String beanName, Object bean, Class<?> beanClass) {
    return null; // TODO
  }
}
