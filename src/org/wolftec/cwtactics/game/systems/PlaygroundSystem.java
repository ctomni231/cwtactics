package org.wolftec.cwtactics.game.systems;

import org.stjs.javascript.Global;
import org.stjs.javascript.JSObjectAdapter;
import org.wolftec.cwtactics.engine.playground.Playground;
import org.wolftec.cwtactics.engine.playground.PlaygroundGlobal;
import org.wolftec.cwtactics.engine.util.ClassUtil;
import org.wolftec.cwtactics.engine.util.PlaygroundUtil;
import org.wolftec.cwtactics.game.core.Log;
import org.wolftec.cwtactics.game.core.systems.System;
import org.wolftec.cwtactics.game.events.system.RawInput;
import org.wolftec.cwtactics.game.events.system.SystemInitializedEvent;
import org.wolftec.cwtactics.game.events.system.SystemStartEvent;

public class PlaygroundSystem extends Playground implements System, SystemInitializedEvent {

  private Log              log;

  private SystemStartEvent systemStartEvent;
  private RawInput         inputEvent;

  @Override
  public void onConstruction() {

    log.info("initializing cwt core");

    // width = Constants.SCREEN_WIDTH_PX;
    // height = Constants.SCREEN_HEIGHT_PX;
    // smoothing = false;
    PlaygroundUtil.setBasePath(this, "../");
    container = Global.window.document.getElementById("game");
  }

  @Override
  public void onSystemInitialized() {
    log.info("initialize playground engine");
    JSObjectAdapter.$put(Global.window, "cwtPly", PlaygroundGlobal.playground(this));
  }

  @Override
  public void preload() {
    loader.on("error", (error) -> log.error("Failed to load asset => " + error));
    systemStartEvent.onSystemStartup(this);
  }

  @Override
  public void ready() {
  }

  @Override
  public void step(int delta) {
  }

  @Override
  public void render() {
  }

  @Override
  public void enterstate(ChangeStateEvent event) {
    log.info("enter state " + ClassUtil.getClassName(event.state));
  }

  @Override
  public void keydown(KeyboardEvent ev) {
    inputEvent.onRawInput("KEYBOARD", ev.key, 0, 0);
  }

  @Override
  public void mousedown(MouseEvent ev) {
    inputEvent.onRawInput("MOUSE", ev.original.which, 0, 0);
  }

  @Override
  public void leavestate(ChangeStateEvent event) {
    log.info("leaving state " + ClassUtil.getClassName(event.state));
  }
}
