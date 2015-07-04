package org.wolftec.cwtactics.game.system.game;

import org.wolftec.cwtactics.game.EntityId;
import org.wolftec.cwtactics.game.components.game.Player;
import org.wolftec.cwtactics.game.components.game.Turn;
import org.wolftec.cwtactics.game.core.Components;
import org.wolftec.cwtactics.game.core.System;
import org.wolftec.cwtactics.game.event.ErrorEvent;
import org.wolftec.cwtactics.game.event.game.turn.ClientEndsTurn;
import org.wolftec.cwtactics.game.event.game.turn.DayStart;
import org.wolftec.cwtactics.game.event.game.turn.TurnEnd;
import org.wolftec.cwtactics.game.event.game.turn.TurnStart;

public class TurnSystem implements System, ClientEndsTurn {

  private DayStart dayStartEvent;
  private TurnEnd endTurnEvent;
  private TurnStart startTurnEvent;
  private ErrorEvent errors;

  private Components<Turn> turns;
  private Components<Player> players;

  @Override
  public void onClientEndsTurn() {
    Turn data = turns.get(EntityId.GAME_ROUND);

    String prevTurnOwner = data.owner;
    endTurnEvent.onTurnEnd(prevTurnOwner);

    // search new owner
    do {
      data.owner = EntityId.getNextPlayerId(data.owner);

      // when the first player will be checked then we completed an iteration
      // through the player list
      // -> this means all players ends their turn on the active day and we
      // start a new day with a turn for every player
      if (EntityId.isFirstPlayer(data.owner)) {
        data.day++;
        dayStartEvent.onDayStart(data.day);
      }

      if (players.get(data.owner).alive) {
        startTurnEvent.onTurnStart(data.owner, data.day);
        return;
      }
    } while (data.owner != prevTurnOwner);

    errors.onIllegalGameData("could not select a new turn owner");
  }
}