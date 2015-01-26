package net.wolfTec.wtEngine.renderer;

import net.wolfTec.cwt.util.AssertUtil;

import org.stjs.javascript.JSCollections;
import org.stjs.javascript.Map;

public class SpriteManagerBean {

  /** */
  private Map<String, Sprite> sprites;

  /** */
  private Map<String, String> overlayTiles;

  /** */
  private Map<String, String> longAnimatedTiles;

  /** */
  private Map<String, Integer> minimapIndex;

  public SpriteManagerBean() {
    sprites = JSCollections.$map();
    overlayTiles = JSCollections.$map();
    longAnimatedTiles = JSCollections.$map();
    minimapIndex = JSCollections.$map();
  }

  private void registerSprite(String spriteKey, Sprite sprite) {
    AssertUtil.hasNoProperty(sprites, spriteKey);
    sprites.$put(spriteKey, sprite);
  }

  private Sprite getSprite(String spriteKey) {
    AssertUtil.hasProperty(sprites, spriteKey);
    return sprites.$get(spriteKey);
  }
}
