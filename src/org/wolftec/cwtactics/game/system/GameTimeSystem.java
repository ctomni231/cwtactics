package org.wolftec.cwtactics.game.system;

import org.wolftec.cwtactics.game.EntityId;
import org.wolftec.cwtactics.game.EntityManager;
import org.wolftec.cwtactics.game.EventEmitter;
import org.wolftec.cwtactics.game.components.game.TimerData;
import org.wolftec.cwtactics.game.core.Log;
import org.wolftec.cwtactics.game.core.System;
import org.wolftec.cwtactics.game.event.GameroundEvents;
import org.wolftec.cwtactics.game.event.NextFrameEvent;
import org.wolftec.cwtactics.game.event.game.turn.ClientEndsTurn;
import org.wolftec.cwtactics.game.event.game.turn.TurnStart;

/**
 * The {@link GameTimeSystem} adds time limits for the turn and game mechanic.
 * When a turn limit is reached then the turn will be ended by this system. If
 * the game time limit is reached then the game round will be ended by this
 * system.
 */
public class GameTimeSystem implements System, NextFrameEvent, GameroundEvents, TurnStart {

  private Log log;
  private EntityManager em;
  private EventEmitter ev;

  private ClientEndsTurn endTurnEvent;

  @Override
  public void onNextFrame(int delta) {
    TimerData data = em.getComponent(EntityId.GAME_ROUND, TimerData.class);

    data.gameTime += delta;
    data.turnTime += delta;

    if (data.turnTime >= data.turnTimeLimit) {
      log.info("ending current turn because turn time limit is reached");
      endTurnEvent.onClientEndsTurn();

    } else if (data.gameTime >= data.gameTimeLimit) {
      log.info("ending game because game time limit is reached");
      ev.publish(GameroundEvents.class).onGameroundEnds();
    }
  }

  @Override
  public void gameroundStartEvent() {
    TimerData data = em.getComponent(EntityId.GAME_ROUND, TimerData.class);
    data.gameTime = 0;
    data.turnTime = 0;
  }

  @Override
  public void onTurnStart(String player, int turn) {
    TimerData data = em.getComponent(EntityId.GAME_ROUND, TimerData.class);
    data.turnTime = 0;
  }
}
