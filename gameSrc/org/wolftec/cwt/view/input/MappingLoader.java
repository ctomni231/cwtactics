package org.wolftec.cwt.view.input;

import org.stjs.javascript.Map;
import org.wolftec.cwt.core.ObjectUtil;

public class MappingLoader {

  public void loadMapping(InputService input, Map<String, String> data) {
    ObjectUtil.forEachMapValue(data, (button, action) -> input.setButtonMapping(button, action));
  }

  public void saveMapping(InputService input, Map<String, String> data) {
    input.forEachButtonMapping((button, action) -> data.$put(button, action));
  }

}
