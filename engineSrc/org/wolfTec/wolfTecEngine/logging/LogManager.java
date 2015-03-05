package org.wolfTec.wolfTecEngine.logging;

public interface LogManager {

  /**
   * Creates a logger by a class. The name will be choosen in relation to the
   * given class.
   * 
   * @param clazz
   * @return
   */
  Logger createByClass(Class<?> clazz);

  /**
   * Creates a logger with a given name.
   * 
   * @param name
   * @return
   */
  Logger createByName(String name);
}
