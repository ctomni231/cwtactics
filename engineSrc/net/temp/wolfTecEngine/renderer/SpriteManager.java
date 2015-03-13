package net.temp.wolfTecEngine.renderer;

import net.temp.wolfTecEngine.logging.LogManager;
import net.temp.wolfTecEngine.logging.Logger;
import net.temp.wolfTecEngine.vfs.DecoratedVfs;

import org.stjs.javascript.Map;
import org.wolftec.core.ComponentManager;
import org.wolftec.core.JsUtil;
import org.wolftec.core.ManagedComponent;
import org.wolftec.core.ManagedComponentInitialization;
import org.wolftec.persistence.VirtualFilesystemManager;

@ManagedComponent
public class SpriteManager implements ManagedComponentInitialization {

  private Logger p_log;
  private Map<String, Sprite> p_sprites;

  @Override
  public void onComponentConstruction(ComponentManager manager) {
    p_log = manager.getComponentByClass(LogManager.class).createByClass(getClass());

    VirtualFilesystemManager vfs;
    vfs = manager.getComponentByClass(VirtualFilesystemManager.class);
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
