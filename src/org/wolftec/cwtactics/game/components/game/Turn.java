package org.wolftec.cwtactics.game.components.game;

import org.wolftec.cwtactics.Constants;
import org.wolftec.cwtactics.game.core.Handled;
import org.wolftec.cwtactics.game.core.Component;

@Handled("component")
public class Turn implements Component {

  @Handled("validated:[entity, startsWith, PL]")
  public String lastClientOwner;

  @Handled("validated:[entity, startsWith, PL]")
  public String owner;

  @Handled("validated:[intBetween, 0, " + Constants.MAX_PLAYERS + "]")
  public int day;
}
