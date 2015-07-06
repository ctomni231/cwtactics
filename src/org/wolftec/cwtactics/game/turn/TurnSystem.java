package org.wolftec.cwtactics.game.turn;

import org.wolftec.cwtactics.Entities;
import org.wolftec.cwtactics.game.core.syscomponent.Components;
import org.wolftec.cwtactics.game.core.systems.System;
import org.wolftec.cwtactics.game.event.ClientEndsTurn;
import org.wolftec.cwtactics.game.event.DayStart;
import org.wolftec.cwtactics.game.event.IllegalGameData;
import org.wolftec.cwtactics.game.event.TurnEnd;
import org.wolftec.cwtactics.game.event.TurnStart;
import org.wolftec.cwtactics.game.player.Player;

public class TurnSystem implements System, ClientEndsTurn {

  private DayStart           dayStartEvent;
  private TurnEnd            endTurnEvent;
  private TurnStart          startTurnEvent;
  private IllegalGameData    illegalGameDataExc;

  private Components<Turn>   turns;
  private Components<Player> players;

  @Override
  public void onClientEndsTurn() {
    Turn data = turns.get(Entities.GAME_ROUND);

    String prevTurnOwner = data.owner;
    endTurnEvent.onTurnEnd(prevTurnOwner);

    // search new owner
    do {
      data.owner = Entities.getNextPlayerId(data.owner);

      // when the first player will be checked then we completed an iteration
      // through the player list
      // -> this means all players ends their turn on the active day and we
      // start a new day with a turn for every player
      if (Entities.isFirstPlayer(data.owner)) {
        data.day++;
        dayStartEvent.onDayStart(data.day);
      }

      if (players.get(data.owner).alive) {
        startTurnEvent.onTurnStart(data.owner, data.day);
        return;
      }
    } while (data.owner != prevTurnOwner);

    illegalGameDataExc.onIllegalGameData("could not select a new turn owner");
  }
}
