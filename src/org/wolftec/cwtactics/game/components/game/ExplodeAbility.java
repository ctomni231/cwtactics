package org.wolftec.cwtactics.game.components.game;

import org.stjs.javascript.Array;
import org.wolftec.cwtactics.Constants;
import org.wolftec.cwtactics.game.core.Handled;
import org.wolftec.cwtactics.game.core.IEntityComponent;

@Handled("component")
public class ExplodeAbility implements IEntityComponent {

  @Handled("validated:int,ge-1,le-10")
  public int damage;

  @Handled("validated:int,ge-1,le-" + Constants.MAX_SELECTION_RANGE)
  public int range;

  @Handled("validated:array of string,entityOf-Living")
  public Array<String> noDamage;
}
