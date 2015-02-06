package net.wolfTec.wtEngine.renderer;

import net.wolfTec.wtEngine.utility.AssertUtilyBean;
import net.wolfTec.wtEngine.utility.BrowserHelperBean;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.JSObjectAdapter;
import org.stjs.javascript.Map;
import org.stjs.javascript.dom.Canvas;

public class SpriteManagerBean {

  private BrowserHelperBean browserUtil;

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

  public void registerSprite(String spriteKey, Sprite sprite) {
    AssertUtilyBean.hasNoProperty(sprites, spriteKey);
    sprites.$put(spriteKey, sprite);
  }

  public Sprite getSprite(String spriteKey) {
    AssertUtilyBean.hasProperty(sprites, spriteKey);
    return sprites.$get(spriteKey);
  }
  
  public boolean isLongAnimatedSprite(String spriteKey) {
    return JSObjectAdapter.hasOwnProperty(longAnimatedTiles, spriteKey);
  }

  /**
   * @param {behaviorTree.Sprite} sprite
   * @returns {string}
   */
  public String toJSON(Sprite sprite) {
    Array<String> data = JSCollections.$array();
    for (int i = 0, e = sprite.getNumberOfImages(); i < e; i++) {
      data.$set(i, browserUtil.convertCanvasToBase64(sprite.getImage(i)));
    }

    return JSObjectAdapter.$js("JSON.stringify(data)");
  }

  /**
   * Loads a sprite from the cache.
   *
   * @param {string} spriteData
   * @returns {behaviorTree.Sprite}
   */
  public Sprite fromJSON(String spriteData) {
    Array<String> spriteDataArray = JSObjectAdapter.$js("JSON.parse(spriteData)");

    Sprite sprite = new Sprite(spriteData.length());
    for (int i = 0, e = spriteData.length(); i < e; i++) {
      sprite.setImage(i, (Canvas) browserUtil.convertBase64ToImage(spriteDataArray.$get(i)));
    }

    return sprite;
  }
}
