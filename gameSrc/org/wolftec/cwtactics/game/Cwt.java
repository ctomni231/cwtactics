package org.wolftec.cwtactics.game;

import org.stjs.javascript.Global;
import org.stjs.javascript.JSObjectAdapter;
import org.wolftec.cwtactics.engine.components.ConstructedClass;
import org.wolftec.cwtactics.engine.components.ConstructedFactory;
import org.wolftec.cwtactics.engine.loader.OfflineCacheDataLoader;
import org.wolftec.cwtactics.engine.playground.Playground;
import org.wolftec.cwtactics.engine.playground.PlaygroundGlobal;
import org.wolftec.cwtactics.engine.playground.PlaygroundState;
import org.wolftec.cwtactics.engine.util.ClassUtil;
import org.wolftec.cwtactics.engine.util.PlaygroundUtil;
import org.wolftec.cwtactics.game.data.ArmyType;
import org.wolftec.cwtactics.game.data.CoType;
import org.wolftec.cwtactics.game.data.MoveType;
import org.wolftec.cwtactics.game.data.PropertyType;
import org.wolftec.cwtactics.game.data.TileType;
import org.wolftec.cwtactics.game.data.UnitType;
import org.wolftec.cwtactics.game.data.WeatherType;
import org.wolftec.cwtactics.game.states.ErrorScreen;
import org.wolftec.cwtactics.game.states.StartScreen;

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

    // width = Constants.SCREEN_WIDTH_PX;
    // height = Constants.SCREEN_HEIGHT_PX;
    // smoothing = false;

    PlaygroundUtil.setBasePath(this, "../modifications/cwt/");

    container = Global.window.document.getElementById("game");

    info("initialize playground engine");

    JSObjectAdapter.$put(Global.window, "cwtPly", PlaygroundGlobal.playground(this));
  }

  @Override
  public void preload() {
    loader.on("error", (error) -> error("Failed to load asset => " + error));

    OfflineCacheDataLoader offlineDataLoader = ConstructedFactory.getObject(OfflineCacheDataLoader.class);

    offlineDataLoader.loadFolderData(this, "armies", ArmyType.class);
    offlineDataLoader.loadFolderData(this, "cos", CoType.class);
    offlineDataLoader.loadFolderData(this, "tiles", TileType.class);
    offlineDataLoader.loadFolderData(this, "props", PropertyType.class);
    offlineDataLoader.loadFolderData(this, "movetypes", MoveType.class);
    offlineDataLoader.loadFolderData(this, "units", UnitType.class);
    offlineDataLoader.loadFolderData(this, "weathers", WeatherType.class);
  }

  @Override
  public void ready() {
    setStateByClass(StartScreen.class);
  }

  @Override
  public void error(String msg) {
    warn("Got an error: " + msg);
    if (ClassUtil.getClass(state) != ErrorScreen.class) {
      ConstructedFactory.getObject(ErrorScreen.class).errorMsg = msg;
      setStateByClass(ErrorScreen.class);
    }
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
