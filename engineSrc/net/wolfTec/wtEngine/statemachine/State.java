package net.wolfTec.wtEngine.statemachine;

import net.wolfTec.wtEngine.input.InputBackendType;

import org.stjs.javascript.annotation.Namespace;

@Namespace("wtEngine") public abstract class State {

  public void genericInput(InputBackendType backendType, Integer code) {
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
