package org.wolftec.cwt.log;

public class LogProvider
{

  public static Log createLogger(Object object)
  {
    return new Log(object);
  }
}
