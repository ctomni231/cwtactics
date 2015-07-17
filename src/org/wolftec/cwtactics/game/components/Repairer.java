package org.wolftec.cwtactics.game.components;

import org.stjs.javascript.Array;
import org.wolftec.cwtactics.game.core.syscomponent.Component;

public class Repairer implements Component {
  public int           amount;
  public Array<String> targets;
}
