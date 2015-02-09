package net.wolfTec.wtEngine.statemachine;

import net.wolfTec.wtEngine.input.InputBackendType;
import net.wolfTec.wtEngine.input.InputData;

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
