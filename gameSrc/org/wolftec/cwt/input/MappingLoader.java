package org.wolftec.cwt.input;

import org.stjs.javascript.Map;
import org.wolftec.cwt.serialization.SaveAppdataHandler;
import org.wolftec.cwt.util.ObjectUtil;

/**
 * This module saves and loads the input mapping of the game.
 */
class MappingLoader implements SaveAppdataHandler<Map<String, String>>
{

  private InputService input;

  @Override
  public void onAppLoad(Map<String, String> data)
  {
    ObjectUtil.forEachMapValue(data, (button, action) -> input.setButtonMapping(button, action));
  }

  @Override
  public void onAppSave(Map<String, String> data)
  {
    input.forEachButtonMapping((button, action) -> data.$put(button, action));
  }

}
