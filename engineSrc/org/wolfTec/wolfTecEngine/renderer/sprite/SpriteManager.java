package org.wolfTec.wolfTecEngine.renderer.sprite;

import org.stjs.javascript.Map;
import org.wolfTec.vfs.DecoratedVfs;
import org.wolfTec.vfs.Vfs;
import org.wolfTec.wolfTecEngine.components.ComponentManager;
import org.wolfTec.wolfTecEngine.components.JsUtil;
import org.wolfTec.wolfTecEngine.components.ManagedComponent;
import org.wolfTec.wolfTecEngine.components.ManagedComponentInitialization;
import org.wolfTec.wolfTecEngine.logging.LogManager;
import org.wolfTec.wolfTecEngine.logging.Logger;

@ManagedComponent
public class SpriteManager implements ManagedComponentInitialization {

  private Logger p_log;
  private Map<String, Sprite> p_sprites;

  @Override
  public void onComponentConstruction(ComponentManager manager) {
    p_log = manager.getComponentByClass(LogManager.class).createByClass(getClass());

    Vfs vfs;
    vfs = manager.getComponentByClass(Vfs.class);
    vfs = new DecoratedVfs(vfs, "/sprites", new SpriteConverter());
    
    // TODO load
  }

  /**
   * 
   * @param spriteKey
   *          key of the sprite
   * @return Sprite for the given key
   */
  public Sprite getSprite(String spriteKey) {
    if (!JsUtil.hasProperty(p_sprites, spriteKey)) {
      JsUtil.raiseError("Unknown sprite key " + spriteKey);
    }
    return p_sprites.$get(spriteKey);
  }

  public boolean isOverlaySprite(String spritePath) {
    return false; // TODO
  }

  /**
   * 
   * @param spriteKey
   *          key of the sprite
   * @return true when the sprite overlaps one tile, else false
   */
  public boolean isLongAnimatedSprite(String spriteKey) {
    // TODO
    return false;
    // return JSObjectAdapter.hasOwnProperty(longAnimatedTiles, spriteKey);
  }
}
