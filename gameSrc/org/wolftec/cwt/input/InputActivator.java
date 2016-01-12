package org.wolftec.cwt.input;

import org.stjs.javascript.functions.Callback0;
import org.wolftec.cwt.loading.GameLoadingHandler;
import org.wolftec.cwt.system.Features;

class InputActivator implements GameLoadingHandler
{

  private Features             features;
  private InputKeyboardBackend keyboard;
  private InputGamepadBackend  gamepad;
  private MouseBackend         mouse;
  private TouchBackend         touch;

  @Override
  public void onLoad(Callback0 done)
  {
    if (features.keyboard)
      keyboard.enable();
    if (features.gamePad)
      gamepad.enable();
    if (features.mouse)
      mouse.enable();
    if (features.touch)
      touch.enable();

    done.$invoke();
  }

}
