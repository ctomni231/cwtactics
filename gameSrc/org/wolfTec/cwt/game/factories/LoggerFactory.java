package org.wolfTec.cwt.game.factories;

import org.stjs.javascript.JSObjectAdapter;
import org.wolfTec.cwt.utility.Logger;
import org.wolfTec.cwt.utility.beans.Bean;
import org.wolfTec.cwt.utility.beans.FactoryBean;

@Bean
public class LoggerFactory implements FactoryBean<Logger> {

  @Override
  public Logger create(String propertyName, String beanName, Object bean, Class<?> beanClass) {
    return JSObjectAdapter.$js("LogJS.get({name: beanName, enabled: Constants.DEBUG})");
  }
}
