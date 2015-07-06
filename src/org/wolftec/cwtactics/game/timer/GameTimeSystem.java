package org.wolftec.cwtactics.game.timer;

import org.wolftec.cwtactics.Entities;
import org.wolftec.cwtactics.game.core.syscomponent.Components;
import org.wolftec.cwtactics.game.core.sysobject.Log;
import org.wolftec.cwtactics.game.core.systems.System;
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

  private Log                   log;

  private ClientEndsTurn        endTurnEvent;
  private GameroundEnd          gameroundEndEvent;

  private Components<TimerData> timers;

  @Override
  public void onNextTick(int delta) {
    TimerData data = getGameroundTimer();

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
    TimerData data = getGameroundTimer();
    data.gameTime = 0;
    data.turnTime = 0;
  }

  @Override
  public void onTurnStart(String player, int turn) {
    TimerData data = getGameroundTimer();
    data.turnTime = 0;
  }

  private TimerData getGameroundTimer() {
    TimerData data = timers.get(Entities.GAME_ROUND);
    return data;
  }
}
