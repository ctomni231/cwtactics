package org.wolftec.cwt.core;

public interface InformationList {

  void addInfo(String key, boolean flag);

  void cleanInfos();

  void increaseIndex();

  void decreaseIndex();

  String getInfo();

  String getInfoAtIndex(int index);

  int getNumberOfInfos();
}
