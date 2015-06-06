package org.wolftec.cwtactics.game.system;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSObjectAdapter;
import org.wolftec.cwtactics.engine.components.ConstructedClass;
import org.wolftec.cwtactics.engine.event.Observerable;
import org.wolftec.cwtactics.engine.event.Observerable0;
import org.wolftec.cwtactics.engine.event.Observerable1;
import org.wolftec.cwtactics.engine.event.Observerable2;
import org.wolftec.cwtactics.engine.event.Observerable3;
import org.wolftec.cwtactics.engine.event.Observerable4;
import org.wolftec.cwtactics.engine.playground.Playground;
import org.wolftec.cwtactics.engine.util.JsUtil;

public class SystemEvents implements ConstructedClass {

  public Observerable1<Playground> INIT_ENGINE;
  public Observerable0 FLUSHED_ACTION;
  public Observerable1<Playground> INPUT_ACTION;
  public Observerable1<Playground> INPUT_CANCEL;

  /**
   * (TileEntity, TilePropertyEntity, TileUnitEntity)
   */
  public Observerable3<String, String, String> CLICK_ON_TILE;

  public Observerable4<String, String, String, String> INVOKE_ACTION;

  public Observerable1<String> OBJECT_WAITS;

  public Observerable1<String> ERROR_RAISED;

  public Observerable1<Integer> FRAME_TICK;

  public Observerable3<Integer, Integer, String> MOUSE_CLICK;

  public Observerable2<Integer, Integer> SET_CURSOR;

  public Observerable0 CURSOR_ACTION;

  /**
   * (player, turnNumber)
   */
  public Observerable2<Integer, Integer> TURN_STARTS;

  public Observerable0 TURN_ENDS;

  public Observerable0 GAME_STARTS;

  public Observerable0 GAME_ENDS;

  public Observerable2<String, Integer> WEATHER_CHANGES;

  public Observerable1<String> WEATHER_CHANGED;

  public Observerable2<String, Integer> UNIT_HEALED;

  public Observerable2<String, Integer> UNIT_DAMAGED;

  public Observerable3<String, String, Integer> INFLICTS_DAMAGE;

  public Observerable1<String> UNIT_CREATED;

  public Observerable1<String> UNIT_DESTROYED;

  public Observerable4<String, Integer, Integer, Array<Integer>> UNIT_MOVED;

  public Observerable2<String, Integer> PLAYER_GOLD_CHANGES;

  /**
   * (Id, Type, X, Y)
   */
  public Observerable4<String, String, Integer, Integer> UNIT_PRODUCED;

  @Override
  public void onConstruction() {
    constructEvents();
  }

  private void constructEvents() {
    Array<String> eventNames = JsUtil.objectKeys(JSObjectAdapter.$properties(this));
    for (int i = 0; i < eventNames.$length(); i++) {
      String eventName = eventNames.$get(i);

      if (eventName == "onConstruction") {
        continue;
      }

      // we use the generic Observerable class here because this one supports
      // zero to n arguments
      JSObjectAdapter.$put(this, eventName, new Observerable());
    }
  }
}
