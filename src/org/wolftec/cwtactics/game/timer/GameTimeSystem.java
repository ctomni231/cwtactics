package org.wolftec.cwtactics.game.timer;

import org.wolftec.cwtactics.Entities;
import org.wolftec.cwtactics.game.EntityManager;
import org.wolftec.cwtactics.game.EventEmitter;
import org.wolftec.cwtactics.game.core.Log;
import org.wolftec.cwtactics.game.core.System;
import org.wolftec.cwtactics.game.event.ClientEndsTurn;
import org.wolftec.cwtactics.game.event.FrameTick;
import org.wolftec.cwtactics.game.event.GameroundEnd;
import org.wolftec.cwtactics.game.event.GameroundStart;
import org.wolftec.cwtactics.game.event.TurnStart;

/**
 * The {@link GameTimeSystem} adds time limits for the turn and game mechanic.
 * When a turn limit is reached then the turn will be ended by this system. If
 * the game time limit is reached then the game round will be ended by this
 * system.
 */
public class GameTimeSystem implements System, FrameTick, GameroundStart, TurnStart {

  Log            log;
  EntityManager  em;
  EventEmitter   ev;

  ClientEndsTurn endTurnEvent;
  GameroundEnd   gameroundEndEvent;

  @Override
  public void onNextTick(int delta) {
    TimerData data = em.getComponent(Entities.GAME_ROUND, TimerData.class);

    data.gameTime += delta;
    data.turnTime += delta;

    if (data.turnTime >= data.turnTimeLimit) {
      log.info("ending current turn because turn time limit is reached");
      endTurnEvent.onClientEndsTurn();

    } else if (data.gameTime >= data.gameTimeLimit) {
      log.info("ending game because game time limit is reached");
      gameroundEndEvent.onGameroundEnd();
    }
  }

  @Override
  public void gameroundStart() {
    TimerData data = em.getComponent(Entities.GAME_ROUND, TimerData.class);
    data.gameTime = 0;
    data.turnTime = 0;
  }

  @Override
  public void onTurnStart(String player, int turn) {
    TimerData data = em.getComponent(Entities.GAME_ROUND, TimerData.class);
    data.turnTime = 0;
  }
}
