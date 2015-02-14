package org.wolfTec.cwt.game.factories;

import org.wolfTec.cwt.game.EngineGlobals;
import org.wolfTec.cwt.utility.JsUtil;
import org.wolfTec.cwt.utility.beans.Bean;
import org.wolfTec.cwt.utility.beans.FactoryBean;
import org.wolfTec.cwt.utility.container.CircularBuffer;

@Bean
public class BufferFactory implements FactoryBean<CircularBuffer<?>> {

  @Override
  public CircularBuffer<?> create(String propertyName, String beanName, Object bean,
      Class<?> beanClass) {
    int size = JsUtil.getPropertyValue(EngineGlobals.class, beanName.toUpperCase() + "_"
        + propertyName.toUpperCase() + "_size");
    return new CircularBuffer<Object>(size);
  }
}
