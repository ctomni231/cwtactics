package org.wolftec.cwt.view.input;

class InputActivator {

  private KeyboardBackend keyboard;
  private GamepadBackend gamepad;
  private MouseBackend mouse;
  private TouchBackend touch;

  public InputActivator(KeyboardBackend keyboard, GamepadBackend gamepad, MouseBackend mouse, TouchBackend touch) {
    super();
    this.keyboard = keyboard;
    this.gamepad = gamepad;
    this.mouse = mouse;
    this.touch = touch;
  }

  public void activate() {
    keyboard.enable();
    gamepad.enable();
    mouse.enable();
    touch.enable();
  }

}
