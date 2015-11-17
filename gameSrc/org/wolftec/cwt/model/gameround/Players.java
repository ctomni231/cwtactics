package org.wolftec.cwt.model.gameround;

import org.stjs.javascript.Array;
import org.stjs.javascript.functions.Callback2;
import org.wolftec.cwt.Constants;
import org.wolftec.cwt.core.AssertUtil;
import org.wolftec.cwt.core.collection.ListUtil;

public class Players {

  private final Units units;
  private final Properties properties;
  private final GameroundEnder gameroundEnd;

  /**
   * All player objects of a game round. This buffer holds the maximum amount of
   * possible player objects. Inactive ones are marked by the inactive marker as
   * team value.
   */
  private Array<Player> players;

  public Players(Units units, Properties properties, GameroundEnder gameroundEnd) {
    this.units = units;
    this.properties = properties;
    this.gameroundEnd = gameroundEnd;

    this.players = ListUtil.instanceList(Player.class, Constants.MAX_PLAYER);
    ListUtil.forEachArrayValue(players, (i, player) -> player.id = i);
  }

  public Player getPlayer(int id) {
    AssertUtil.assertThatNot(id < 0 || id > players.$length());
    return players.$get(id);
  }

  public boolean isValidPlayerId(int id) {
    return (id >= 0 && id < players.$length());
  }

  public void forEachPlayer(Callback2<Integer, Player> cb) {
    for (int i = 0; i < players.$length(); i++) {
      cb.$invoke(i, players.$get(i));
    }
  }

  /**
   * 
   * @return true when at least two opposite teams are left, else false
   */
  public boolean areEnemyPlayersLeft() {
    Player player;
    int foundTeam = Constants.INACTIVE;
    for (int i = 0, e = players.$length(); i < e; i++) {
      player = players.$get(i);

      if (player.team != -1) {

        // found alive player
        if (foundTeam == -1) {
          foundTeam = player.team;
        } else if (foundTeam != player.team) {
          foundTeam = -1;
          break;
        }
      }
    }

    return (foundTeam == -1);
  }

  /**
   * A player has loosed the game round due a specific reason. This function
   * removes all of his units and properties. Furthermore the left teams will be
   * checked. If only one team is left then the end game event will be invoked.
   * 
   * @param player
   */
  public void deactivatePlayer(Player player) {
    units.dropUnitsOfPlayer(player);
    properties.dropPropertiesOfPlayer(player);
    player.deactivate();

    AssertUtil.assertThat(!gameroundEnd.isGameroundEnded());
    if (!areEnemyPlayersLeft()) {
      gameroundEnd.endGameround();
    }
  }
}
