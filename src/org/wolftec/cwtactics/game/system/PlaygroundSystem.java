package org.wolftec.cwtactics.game.system;

import org.stjs.javascript.Global;
import org.stjs.javascript.JSObjectAdapter;
import org.wolftec.cwtactics.engine.playground.Playground;
import org.wolftec.cwtactics.engine.playground.PlaygroundGlobal;
import org.wolftec.cwtactics.engine.playground.PlaygroundState;
import org.wolftec.cwtactics.engine.util.ClassUtil;
import org.wolftec.cwtactics.engine.util.PlaygroundUtil;
import org.wolftec.cwtactics.game.EntityManager;
import org.wolftec.cwtactics.game.EventEmitter;
import org.wolftec.cwtactics.game.core.CESManager;
import org.wolftec.cwtactics.game.core.Log;
import org.wolftec.cwtactics.game.core.System;
import org.wolftec.cwtactics.game.event.SystemStartEvent;
import org.wolftec.cwtactics.game.event.system.RawInput;

public class PlaygroundSystem extends Playground implements System, SystemStartEvent {

  private Log log;
  private EntityManager em;
  private EventEmitter evem;

  private RawInput inputEvent;

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
    evem.publish(SystemStartEvent.class).onSystemStartup(this);
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

  /**
   * Sets a state by it's class. The class needs to be a {@link Constructed}
   * class.
   *
   * @param stateClass
   */
  public void setStateByClass(Class<? extends PlaygroundState> stateClass) {
    setState(CESManager.getObject(stateClass));
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
