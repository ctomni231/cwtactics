package net.wolfTec.wtEngine.renderer;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.JSObjectAdapter;
import org.stjs.javascript.annotation.Namespace;
import org.stjs.javascript.dom.Canvas;
import org.stjs.javascript.dom.Element;

@Namespace("wtEngine") public class Sprite {

  private Array<Element>  images;
  public Canvas graphic;
  public int spriteHeight;
  public int spriteWidth;
  public int offsetX;
  public int offsetY;
  public int height;
  public int width;

  public int getNumberFrames() {
    return 0;
  }
  
  public boolean isOverlaySprite() {
    return false;
  }

  public Sprite(int entries) {
    Element nullObj = null;
    while (entries > 0) {
      this.images.push(nullObj);
      entries--;
    }
  }

  /**
   * @returns {Number}
   */
  public int getNumberOfImages() {
    return this.images.$length();
  }

  /**
   * @param index
   * @param image
   */
  public void setImage(int index, Element image) {
    if (index < 0 && index >= this.images.$length()) {
      throw new Error("IllegalIndex");
    }
    this.images.$set(index, image);
  }

  /**
   * @param index
   * @returns {behaviorTree.Sprite}
   */
  public Element getImage(int index) {
    return this.images.$get(index);
  }

  /**
   * @param {behaviorTree.Sprite} sprite
   * @returns {string}
   */
  public static String toJSON(Sprite sprite) {
    Array<String> data = JSCollections.$array();
    for (int i = 0, e = sprite.images.$length(); i < e; i++) {
      data.$set(i, Globals.Base64Helper.(sprite.images.$get(i)));
    }

    return JSObjectAdapter.$js("JSON.stringify(data)");
  }

  /**
   * Loads a sprite from the cache.
   *
   * @param {string} spriteData
   * @returns {behaviorTree.Sprite}
   */
  public static Sprite fromJSON(String spriteData) {
    Array<String> spriteDataArray = JSObjectAdapter.$js("JSON.parse(spriteData)");

    Sprite sprite = new Sprite(spriteData.length());
    Array<Element> data = sprite.images;
    for (int i = 0, e = spriteData.length(); i < e; i++) {
      data.$set(i, Globals.Base64Helper.base64ToImage(spriteDataArray.$get(i)));
    }

    return sprite;
  }
}
