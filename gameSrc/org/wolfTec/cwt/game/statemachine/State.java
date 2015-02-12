package org.wolfTec.cwt.game.statemachine;

import org.wolfTec.cwt.game.input.InputBackendType;
import org.wolfTec.cwt.game.input.InputData;

public abstract class State {

  public abstract String getId();

  public boolean isAnimationState() {
    return false;
  }

  public void genericInput(InputBackendType backendType, Integer code) {
  }

  public void exit() {
  }

  public void enter() {
  }

  public void update(int delta, InputData input) {
    if (input != null) {
      switch (input.key) {

        case LEFT:
          keyLeft();
          break;

        case RIGHT:
          keyRight();
          break;

        case UP:
          keyUp();
          break;

        case DOWN:
          keyDown();
          break;

        case A:
          keyAction();
          break;

        case B:
          keyCancel();
          break;

        default:
          break;
      }
    }
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
