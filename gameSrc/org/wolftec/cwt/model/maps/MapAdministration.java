package org.wolftec.cwt.model.maps;

public class MapAdministration {

  // TODO view only for step map selection -> may ctr/view but not really
  // necessary here
  public final MapList mapNames;

  public final MapStorage mapStorage;

  public MapAdministration() {
    mapStorage = new MapStorage();
    mapNames = new MapList();
  }

  /**
   * Grabs the list of maps from the storage and puts their names into the map
   * list.
   */
  public void updateMapList() {
    mapStorage.fetchStoredMapNames((names) -> mapNames.initByList(names));
  }
}
