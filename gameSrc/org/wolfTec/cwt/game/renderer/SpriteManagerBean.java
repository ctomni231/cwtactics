package org.wolfTec.cwt.game.renderer;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.JSObjectAdapter;
import org.stjs.javascript.Map;
import org.stjs.javascript.dom.Canvas;
import org.stjs.javascript.functions.Callback0;
import org.wolfTec.cwt.game.assets.AssetItem;
import org.wolfTec.cwt.game.assets.AssetLoader;
import org.wolfTec.cwt.game.assets.AssetType;
import org.wolfTec.cwt.game.persistence.StorageBean;
import org.wolfTec.cwt.game.utility.AssertUtilyBean;
import org.wolfTec.cwt.game.utility.BrowserHelperBean;
import org.wolfTec.cwt.utility.Bean;
import org.wolfTec.cwt.utility.Injected;
import org.wolfTec.cwt.utility.PostInitialization;

@Bean public class SpriteManagerBean implements AssetLoader {

  @Injected private BrowserHelperBean browserUtil;
  @Injected private AssertUtilyBean assertUtil;

  /** */
  private Map<String, Sprite> sprites;

  /** */
  private Map<String, String> overlayTiles;

  /** */
  private Map<String, String> longAnimatedTiles;

  /** */
  private Map<String, Integer> minimapIndex;

  @PostInitialization public void init() {
    sprites = JSCollections.$map();
    overlayTiles = JSCollections.$map();
    longAnimatedTiles = JSCollections.$map();
    minimapIndex = JSCollections.$map();
  }

  @Override public void loadAsset(StorageBean storage, AssetItem item, Callback0 callback) {
    if (item.type == AssetType.IMAGES) {

    }
  }

  @Override public void grabAsset(StorageBean storage, AssetItem item, Callback0 callback) {
    if (item.type == AssetType.IMAGES) {

    }
  }

  // TODO remove it
  // public void registerSprite(String spriteKey, Sprite sprite) {
  // assertUtil.hasNoProperty(sprites, spriteKey);
  // sprites.$put(spriteKey, sprite);
  // }

  /**
   * 
   * @param spriteKey
   *          key of the sprite
   * @return Sprite for the given key
   */
  public Sprite getSprite(String spriteKey) {
    assertUtil.hasProperty(sprites, spriteKey);
    return sprites.$get(spriteKey);
  }

  /**
   * 
   * @param spriteKey
   *          key of the sprite
   * @return true when the sprite overlaps one tile, else false
   */
  public boolean isLongAnimatedSprite(String spriteKey) {
    return JSObjectAdapter.hasOwnProperty(longAnimatedTiles, spriteKey);
  }

  /**
   * @param {behaviorTree.Sprite} sprite
   * @returns {string}
   */
  private String toJSON(Sprite sprite) {
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
  private Sprite fromJSON(String spriteData) {
    Array<String> spriteDataArray = JSObjectAdapter.$js("JSON.parse(spriteData)");

    Sprite sprite = new Sprite(spriteData.length());
    for (int i = 0, e = spriteData.length(); i < e; i++) {
      sprite.setImage(i, (Canvas) browserUtil.convertBase64ToImage(spriteDataArray.$get(i)));
    }

    return sprite;
  }
}
