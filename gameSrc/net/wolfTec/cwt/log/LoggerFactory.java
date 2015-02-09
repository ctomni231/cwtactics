package net.wolfTec.cwt.log;

import org.stjs.javascript.JSObjectAdapter;
import org.wolfTec.utility.Bean;
import org.wolfTec.utility.FactoryBean;

@Bean public class LoggerFactory implements FactoryBean<Logger> {

  @Override public Logger create(String beanName, Object bean, Class<?> beanClass) {
    return JSObjectAdapter.$js("LogJS.get({name: beanName, enabled: Constants.DEBUG})");
  }
}
