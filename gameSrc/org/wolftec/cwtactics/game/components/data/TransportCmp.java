package org.wolftec.cwtactics.game.components.data;

import org.stjs.javascript.Array;
import org.wolftec.cwtactics.game.IEntityComponent;

public class TransportCmp implements IEntityComponent {
  public int maxloads;
  public Array<String> canload; // TODO
}
