package org.wolfTec.cwt.game;

import org.wolfTec.wolfTecEngine.beans.FactoryBean;
import org.wolfTec.wolfTecEngine.container.CircularBuffer;

public class ObjectFactory implements FactoryBean {

  @Override
  public <T> T create(String propertyName, Class<T> propertyClass) {
    if (propertyClass == CircularBuffer.class) {
      int size = JsUtil.getPropertyValue(EngineGlobals.class, beanName.toUpperCase() + "_" + propertyName.toUpperCase() + "_size");
      return (T) new CircularBuffer<Object>(size);
    }
    return null;
  }

}
