package org.wolftec.cwtactics.game.components;

import org.stjs.javascript.Array;
import org.wolftec.cwtactics.game.IEntityComponent;

public class Transporter implements IEntityComponent {
  public int slots;
  public Array<String> loads;
}
