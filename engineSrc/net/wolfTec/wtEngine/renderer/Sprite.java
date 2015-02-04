package net.wolfTec.wtEngine.renderer;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.JSObjectAdapter;
import org.stjs.javascript.annotation.Namespace;
import org.stjs.javascript.dom.Canvas;
import org.stjs.javascript.dom.Element;

@Namespace("wtEngine") public class Sprite {

  private Array<Canvas>  images;
  public Canvas graphic;
  public int spriteHeight;
  public int spriteWidth;
  public int offsetX;
  public int offsetY;
  public int height;
  public int width;

  public boolean isOverlaySprite() {
    return false;
  }

  public Sprite(int entries) {
    Canvas nullObj = null;
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
  public void setImage(int index, Canvas image) {
    if (index < 0 && index >= this.images.$length()) {
      throw new Error("IllegalIndex");
    }
    this.images.$set(index, image);
  }

  /**
   * @param index
   * @returns {behaviorTree.Sprite}
   */
  public Canvas getImage(int index) {
    return this.images.$get(index);
  }
}
