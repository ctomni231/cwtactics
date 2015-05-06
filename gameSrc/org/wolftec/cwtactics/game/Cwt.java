package org.wolftec.cwtactics.game;

import org.stjs.javascript.Global;
import org.stjs.javascript.JSObjectAdapter;
import org.wolftec.cwtactics.engine.components.ConstructedClass;
import org.wolftec.cwtactics.engine.components.ConstructedFactory;
import org.wolftec.cwtactics.engine.components.ConstructedLogger;
import org.wolftec.cwtactics.engine.playground.Playground;
import org.wolftec.cwtactics.engine.playground.PlaygroundJsGlb;
import org.wolftec.cwtactics.engine.playground.PlaygroundState;

public class Cwt extends Playground implements ConstructedClass, ConstructedLogger {

  @Override
  public String getLoggerName() {
    // all functions of this class will be called in an object of a different
    // type after being converted to a playground object
    // ==> to avoid a "undefined" logger name we going to set a fixed one
    return (String) JSObjectAdapter.$get(Cwt.class, "__className");
  }

  @Override
  public void onConstruction() {
    width = Constants.SCREEN_WIDTH_PX;
    height = Constants.SCREEN_HEIGHT_PX;
    smoothing = false;

    container = Global.window.document.getElementById("game");

    info("Initialize playground engine");
    PlaygroundJsGlb.playground(this);

  }

  @Override
  public void render() {
    layer.clear("yellow");
  }

  /**
   * Sets a state by it's class. The class needs to be a {@link Constructed}
   * class.
   * 
   * @param stateClass
   */
  public void setStateByClass(Class<? extends PlaygroundState> stateClass) {
    setState(ConstructedFactory.getObject(stateClass));
  }

  @Override
  public void enterstate(ChangeStateEvent event) {
    info("Enter state " + ((String) JSObjectAdapter.$get(event.state, "__className")));
  }

  @Override
  public void leavestate(ChangeStateEvent event) {
    info("Leaving state " + ((String) JSObjectAdapter.$get(event.state, "__className")));
  }
}
