package org.wolftec.cwt.input;

import org.stjs.javascript.functions.Callback0;
import org.wolftec.cwt.core.Loader;
import org.wolftec.cwt.input.backends.KeyboardInput;
import org.wolftec.cwt.input.backends.MouseInput;
import org.wolftec.cwt.input.backends.TouchInput;
import org.wolftec.cwt.input.backends.gamepad.GamepadInput;
import org.wolftec.cwt.system.Features;
import org.wolftec.cwt.system.Log;

public class InputLoader implements Loader {

  private Log           log;
  private Features      features;

  private KeyboardInput keyboard;
  private GamepadInput  gamepad;
  private MouseInput    mouse;
  private TouchInput    touch;

  @Override
  public void onLoad(Callback0 done) {
    log.info("activating input backends");

    if (features.keyboard) keyboard.enable();
    if (features.gamePad) gamepad.enable();
    if (features.mouse) mouse.enable();
    if (features.touch) touch.enable();

    done.$invoke();
  }

}
