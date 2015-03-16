package net.temp.wolfTecEngine.renderer;

import org.stjs.javascript.Map;
import org.wolftec.container.ContainerUtil;

/**
 * 
 */
public class SpriteSizeMetrics {
  
  public SpriteSizeMetrics () {
    this.tileIndex = ContainerUtil.createMap();
  }
  
  /**
   * The width of one tile of the sprite
   */
  public int tileWidth;

  /**
   * The width of one tile of the sprite
   */
  public int tileHeight;
  
  /**
   * Contains the different indexes
   */
  public Map<String, Integer> tileIndex;
  
}
