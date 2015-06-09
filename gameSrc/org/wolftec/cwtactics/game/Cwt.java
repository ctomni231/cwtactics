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
import org.wolftec.cwtactics.game.core.Log;
import org.wolftec.cwtactics.game.event.ClickEvent;

public class Cwt extends Playground implements ConstructedClass {

  private Log log;
  private EntityManager em;
  private EventEmitter ev;

  @Override
  public void onConstruction() {

    // width = Constants.SCREEN_WIDTH_PX;
    // height = Constants.SCREEN_HEIGHT_PX;
    // smoothing = false;

    PlaygroundUtil.setBasePath(this, "../");

    container = Global.window.document.getElementById("game");

    log.info("initialize playground engine");

    JSObjectAdapter.$put(Global.window, "cwtPly", PlaygroundGlobal.playground(this));
  }

  @Override
  public void preload() {
    loader.on("error", (error) -> log.error("Failed to load asset => " + error));

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
    log.info("enter state " + ClassUtil.getClassName(event.state));
  }

  @Override
  public void keydown(KeyboardEvent ev) {
    ((ClickEvent) this.ev.getEventEmitter()).onClick(ev.key + "", 0, 0);
  }

  @Override
  public void mousedown(MouseEvent ev) {
    ((ClickEvent) this.ev.getEventEmitter()).onClick(ev.original.which + "", 0, 0);
  }

  @Override
  public void leavestate(ChangeStateEvent event) {
    log.info("leaving state " + ClassUtil.getClassName(event.state));
  }
}
