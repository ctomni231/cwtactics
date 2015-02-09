package net.wolfTec.cwt.statemachine;

import net.wolfTec.cwt.input.InputBackendType;
import net.wolfTec.cwt.input.InputData;

public abstract class State {

  public abstract String getId();
  
  public boolean isAnimationState () {
    return false;
  }
  
  public void genericInput(InputBackendType backendType, Integer code) {
  }

  public void exit() {
  }

  public void enter() {
  }
  
  public void update(int delta, InputData input) {
  }

  public void render(int delta) {
  }
  
  public void keyUp() {
  }

  public void keyDown() {
  }

  public void keyLeft() {
  }

  public void keyRight() {
  }

  public void keyAction() {
  }

  public void keyCancel() {
  }
}
