package org.wolftec.cwtactics.system.layergfx;

import org.stjs.javascript.Map;
import org.stjs.javascript.functions.Callback0;
import org.wolftec.core.Injected;
import org.wolftec.core.JsUtil;
import org.wolftec.core.ManagedComponent;
import org.wolftec.core.ManagedConstruction;
import org.wolftec.log.Logger;
import org.wolftec.persistence.VirtualFilesystemManager;

@ManagedComponent
public class SpriteManager {

  @ManagedConstruction
  private Logger p_log;

  private Map<String, Sprite> p_sprites;

  @Injected
  private VirtualFilesystemManager vfs;

  public void load(Callback0 callback) {

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
