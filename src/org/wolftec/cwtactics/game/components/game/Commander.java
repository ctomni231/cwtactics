package org.wolftec.cwtactics.game.components.game;

import org.wolftec.cwtactics.game.core.Handled;
import org.wolftec.cwtactics.game.core.Component;

@Handled("component")
public class Commander implements Component {

  @Handled("validated:[entity]")
  public String army;

  @Handled("validated:[intBetween, 0, 9]")
  public int powerStars;

  @Handled("validated:[intBetween, powerStars, 10]")
  public int superPowerStars;
}
