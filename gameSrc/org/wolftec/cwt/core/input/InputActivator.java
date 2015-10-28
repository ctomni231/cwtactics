package org.wolftec.cwt.core.input;

import org.stjs.javascript.functions.Callback0;
import org.wolftec.cwt.core.env.Features;
import org.wolftec.cwt.core.input.backends.GamepadInput;
import org.wolftec.cwt.core.input.backends.KeyboardInput;
import org.wolftec.cwt.core.input.backends.MouseInput;
import org.wolftec.cwt.core.input.backends.TouchInput;
import org.wolftec.cwt.core.loading.GameLoader;
import org.wolftec.cwt.core.log.Log;

public class InputActivator implements GameLoader {

  private Log      $log;
  private Features features;

  private KeyboardInput keyboard;
  private GamepadInput  gamepad;
  private MouseInput    mouse;
  private TouchInput    touch;

  @Override
  public void onLoad(Callback0 done) {
    $log.info("activating input backends");

    if (features.keyboard) keyboard.enable();
    if (features.gamePad) gamepad.enable();
    if (features.mouse) mouse.enable();
    if (features.touch) touch.enable();
    done.$invoke();
  }

}
