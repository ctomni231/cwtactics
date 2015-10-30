package org.wolftec.wTec.input;

import org.stjs.javascript.functions.Callback0;
import org.wolftec.wTec.env.Features;
import org.wolftec.wTec.input.backends.GamepadInput;
import org.wolftec.wTec.input.backends.KeyboardInput;
import org.wolftec.wTec.input.backends.MouseInput;
import org.wolftec.wTec.input.backends.TouchInput;
import org.wolftec.wTec.loading.GameLoader;
import org.wolftec.wTec.log.Log;

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
