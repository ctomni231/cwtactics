package org.wolftec.cwtactics.game;

import org.stjs.javascript.Global;
import org.stjs.javascript.JSObjectAdapter;
import org.wolftec.cwtactics.engine.playground.Playground;
import org.wolftec.cwtactics.engine.playground.PlaygroundGlobal;
import org.wolftec.cwtactics.engine.playground.PlaygroundState;
import org.wolftec.cwtactics.engine.util.ClassUtil;
import org.wolftec.cwtactics.engine.util.PlaygroundUtil;
import org.wolftec.cwtactics.game.core.ConstructedClass;
import org.wolftec.cwtactics.game.core.ConstructedFactory;
import org.wolftec.cwtactics.game.core.Inject;

public class Cwt extends Playground implements ConstructedClass {

  @Inject
  private EntityManager em;

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

    PlaygroundUtil.setBasePath(this, "../");

    container = Global.window.document.getElementById("game");

    info("initialize playground engine");

    JSObjectAdapter.$put(Global.window, "cwtPly", PlaygroundGlobal.playground(this));
  }

  @Override
  public void preload() {
    loader.on("error", (error) -> error("Failed to load asset => " + error));

    // ConstructedFactory.getObject(SystemEvents.class).ERROR_RAISED.subscribe((error)
    // -> {
    // error(error);
    // setStateByClass(ErrorScreen.class);
    // });

    // OfflineCacheDataLoader offlineDataLoader =
    // ConstructedFactory.getObject(OfflineCacheDataLoader.class);

    // offlineDataLoader.loadData(this, "modifications/cwt/armies",
    // ArmyType.class);
    // offlineDataLoader.loadData(this, "modifications/cwt/cos", CoType.class);
    // offlineDataLoader.loadData(this, "modifications/cwt/tiles",
    // TileType.class);
    // offlineDataLoader.loadData(this, "modifications/cwt/props",
    // PropertyType.class);
    // offlineDataLoader.loadData(this, "modifications/cwt/movetypes",
    // MoveType.class);
    // offlineDataLoader.loadData(this, "modifications/cwt/units",
    // UnitType.class);
    // offlineDataLoader.loadData(this, "modifications/cwt/weathers",
    // WeatherType.class);
    //
    // offlineDataLoader.loadAssets(this, "image/cwt_tileset/units",
    // ConstructedFactory.getObject(AssetLoader.class));
  }

  @Override
  public void ready() {
    // boolean hasErrors =
    // ConstructedFactory.getObject(ErrorScreen.class).errorMsg != null;
    // setStateByClass(hasErrors ? ErrorScreen.class : StartScreen.class);

  }

  @Override
  public void mousedown(MouseEvent ev) {
  }

  @Override
  public void error(String msg) {
    warn("Got an error: " + msg);
  }

  @Override
  public void step(int delta) {
  }

  @Override
  public void render() {
    // layer.clear("yellow");
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
  public void keydown(KeyboardEvent ev) {
    em.createEntityDataDump((data) -> info(data));
  }

  @Override
  public void leavestate(ChangeStateEvent event) {
    info("leaving state " + ClassUtil.getClassName(event.state));
  }
}
