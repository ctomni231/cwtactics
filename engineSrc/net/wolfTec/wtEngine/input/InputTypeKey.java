package net.wolfTec.wtEngine.input;

import org.stjs.javascript.annotation.Namespace;

@Namespace("wtEngine") public enum InputTypeKey {
  UP, DOWN, LEFT, RIGHT, A, B,

  /**
   * The call hovers over a given position x,y
   */
  HOVER,

  SET_INPUT
}
