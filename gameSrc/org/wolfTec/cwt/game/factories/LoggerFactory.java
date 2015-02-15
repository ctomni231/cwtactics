package org.wolfTec.cwt.game.factories;

import org.wolfTec.cwt.game.EngineGlobals;
import org.wolfTec.wolfTecEngine.beans.Bean;
import org.wolfTec.wolfTecEngine.beans.FactoryBean;
import org.wolfTec.wolfTecEngine.log.Logger;
import org.wolfTec.wolfTecEngine.util.JsUtil;

@Bean
public class LoggerFactory implements FactoryBean<Logger> {

  @Override
  public Logger create(String propertyName, String beanName, Object bean, Class<?> beanClass) {
    boolean isDebug = EngineGlobals.DEBUG;
    return JsUtil.evalJs("LogJS.get({name: beanName, enabled: isDebug})");
  }
}
