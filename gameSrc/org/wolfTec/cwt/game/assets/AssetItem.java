package org.wolfTec.cwt.game.assets;

public class AssetItem {

  public AssetItem(String path, String name, AssetType type) {
    this.path = path;
    this.name = name;
    this.type = type;
  }

  public String path;
  public String name;
  public AssetType type;
}
