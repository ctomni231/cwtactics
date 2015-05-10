package org.wolftec.cwtactics.game;

import org.stjs.javascript.Global;
import org.wolftec.cwtactics.Constants;
import org.wolftec.cwtactics.engine.components.ConstructedClass;
import org.wolftec.cwtactics.engine.components.ConstructedFactory;
import org.wolftec.cwtactics.engine.loader.OfflineCacheDataLoader;
import org.wolftec.cwtactics.engine.playground.Playground;
import org.wolftec.cwtactics.engine.playground.PlaygroundGlobal;
import org.wolftec.cwtactics.engine.playground.PlaygroundState;
import org.wolftec.cwtactics.engine.util.ClassUtil;
import org.wolftec.cwtactics.engine.util.PlaygroundUtil;
import org.wolftec.cwtactics.game.service.GameDataService;
import org.wolftec.cwtactics.game.states.GameInit;

public class Cwt extends Playground implements ConstructedClass {

  @Override
  public String getLoggerName() {
    // all functions of this class will be called in an object of a different
    // type after being converted to a playground object
    // ==> to avoid a "undefined" logger name we going to set a fixed one
    return ClassUtil.getClassName(Cwt.class);
  }

  @Override
  public void onConstruction() {
    width = Constants.SCREEN_WIDTH_PX;
    height = Constants.SCREEN_HEIGHT_PX;
    smoothing = false;

    PlaygroundUtil.setBasePath(this, "../modifications/cwt/");

    container = Global.window.document.getElementById("game");

    info("initialize playground engine");
    PlaygroundGlobal.playground(this);

  }

  @Override
  public void create() {
    OfflineCacheDataLoader offlineDataLoader = ConstructedFactory.getObject(OfflineCacheDataLoader.class);
    GameDataService dataService = ConstructedFactory.getObject(GameDataService.class);
    offlineDataLoader.loadData(this, dataService);
  }

  @Override
  public void ready() {
    setStateByClass(GameInit.class);
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
    info("enter state " + ClassUtil.getClassName(event.state));
  }

  @Override
  public void leavestate(ChangeStateEvent event) {
    info("leaving state " + ClassUtil.getClassName(event.state));
  }
}
