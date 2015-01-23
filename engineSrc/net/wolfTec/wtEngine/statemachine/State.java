package net.wolfTec.wtEngine.statemachine;

import net.wolfTec.wtEngine.input.InputBackendType;

import org.stjs.javascript.annotation.Namespace;

@Namespace("wtEngine") public abstract class State {

  public void genericInput (InputBackendType backendType, Integer code) {}
  
}
