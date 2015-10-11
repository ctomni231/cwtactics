package org.wolftec.cwt.core.input;

import org.stjs.javascript.Map;
import org.wolftec.cwt.core.persistence.SaveAppdataHandler;
import org.wolftec.cwt.core.util.JsUtil;

/**
 * This module saves and loads the input mapping of the game.
 */
public class MappingLoader implements SaveAppdataHandler<Map<String, String>> {

  private InputManager input;

  @Override
  public void onAppLoad(Map<String, String> data) {
    JsUtil.forEachMapValue(data, (button, action) -> input.setButtonMapping(button, action));
  }

  @Override
  public void onAppSave(Map<String, String> data) {
    input.forEachButtonMapping((button, action) -> data.$put(button, action));
  }

}
