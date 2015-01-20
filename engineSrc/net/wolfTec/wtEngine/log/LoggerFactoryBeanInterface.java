package net.wolfTec.wtEngine.log;

import org.stjs.javascript.annotation.Namespace;

@Namespace("wtEngine") public interface LoggerFactoryBeanInterface {
  public Logger getLogger(String name, boolean isDebugEnabled);
}
