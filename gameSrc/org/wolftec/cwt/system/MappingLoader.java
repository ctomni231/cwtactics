package org.wolftec.cwt.system;

import org.stjs.javascript.Map;
import org.wolftec.cwt.util.ObjectUtil;

/**
 * This module saves and loads the input mapping of the game.
 */
public class MappingLoader implements SaveAppdataHandler<Map<String, String>> {

  private InputManager input;

  @Override
  public void onAppLoad(Map<String, String> data) {
    ObjectUtil.forEachMapValue(data, (button, action) -> input.setButtonMapping(button, action));
  }

  @Override
  public void onAppSave(Map<String, String> data) {
    input.forEachButtonMapping((button, action) -> data.$put(button, action));
  }

}
