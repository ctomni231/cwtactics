package org.wolftec.cwt.system;

import org.stjs.javascript.functions.Callback0;
import org.wolftec.cwt.input.GamepadInput;
import org.wolftec.cwt.input.KeyboardInput;
import org.wolftec.cwt.input.MouseInput;
import org.wolftec.cwt.input.TouchInput;

public class InputActivator implements GameLoadingHandler {

  private Features features;
  private KeyboardInput keyboard;
  private GamepadInput gamepad;
  private MouseInput mouse;
  private TouchInput touch;

  @Override
  public void onLoad(Callback0 done) {
    if (features.keyboard) keyboard.enable();
    if (features.gamePad) gamepad.enable();
    if (features.mouse) mouse.enable();
    if (features.touch) touch.enable();

    done.$invoke();
  }

}
