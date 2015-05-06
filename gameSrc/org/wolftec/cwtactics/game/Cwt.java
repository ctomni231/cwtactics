package org.wolftec.cwtactics.game;

import org.stjs.javascript.Global;
import org.wolftec.cwtactics.engine.components.ConstructedClass;
import org.wolftec.cwtactics.engine.components.ConstructedFactory;
import org.wolftec.cwtactics.engine.components.ConstructedLogger;
import org.wolftec.cwtactics.engine.playground.Playground;
import org.wolftec.cwtactics.engine.playground.PlaygroundJsGlb;
import org.wolftec.cwtactics.engine.playground.PlaygroundState;

public class Cwt extends Playground implements ConstructedClass, ConstructedLogger {

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
    info("Enter state " + event.state);
  }

  @Override
  public void leavestate(ChangeStateEvent event) {
    info("Leaving state " + event.state);
  }
}
