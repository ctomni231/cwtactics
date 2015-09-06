package org.wolftec.cwt.core;

public interface InformationList {

  public void addInfo(String key, boolean flag);

  public void cleanInfos();

  public int getNumberOfInfos();
}
