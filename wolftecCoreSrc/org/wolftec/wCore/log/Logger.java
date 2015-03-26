package org.wolftec.wCore.log;

/**
 * Logger interface to log messages somewhere.
 */
public interface Logger {
  
  /**
   * Logs an info message.
   *  
   * @param msg
   */
  void info(Object msg);

  /**
   * Logs a waning message.
   * 
   * @param msg
   */
  void warn(Object msg);

  /**
   * Logs an error message.
   * 
   * @param msg
   */
  void error(Object msg);
}
