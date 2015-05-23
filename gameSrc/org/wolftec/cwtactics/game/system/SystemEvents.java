package org.wolftec.cwtactics.game.system;

import org.stjs.javascript.Array;
import org.wolftec.cwtactics.engine.components.ConstructedClass;
import org.wolftec.cwtactics.engine.event.Observerable1;
import org.wolftec.cwtactics.engine.event.Observerable2;
import org.wolftec.cwtactics.engine.event.Observerable3;
import org.wolftec.cwtactics.engine.event.Observerable4;

public class SystemEvents implements ConstructedClass {

  public Observerable1<String> ERROR_RAISED;

  public Observerable1<Integer> FRAME_TICK;

  /**
   * (player, turnNumber)
   */
  public Observerable2<Integer, Integer> TURN_STARTS;

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
    ERROR_RAISED = new Observerable1<String>();
    FRAME_TICK = new Observerable1<Integer>();
    UNIT_HEALED = new Observerable2<String, Integer>();
    UNIT_DAMAGED = new Observerable2<String, Integer>();
    INFLICTS_DAMAGE = new Observerable3<String, String, Integer>();
    UNIT_CREATED = new Observerable1<String>();
    UNIT_DESTROYED = new Observerable1<String>();
    UNIT_MOVED = new Observerable4<String, Integer, Integer, Array<Integer>>();
    PLAYER_GOLD_CHANGES = new Observerable2<String, Integer>();
    UNIT_PRODUCED = new Observerable4<String, String, Integer, Integer>();

    WEATHER_CHANGED = new Observerable1<String>();
    WEATHER_CHANGES = new Observerable2<String, Integer>();
  }
}
