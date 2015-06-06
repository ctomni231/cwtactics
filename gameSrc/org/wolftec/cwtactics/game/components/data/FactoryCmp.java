package org.wolftec.cwtactics.game.components.data;

import org.stjs.javascript.Array;
import org.wolftec.cwtactics.game.IEntityComponent;
import org.wolftec.cwtactics.game.IFlyweightComponent;

public class FactoryCmp implements IEntityComponent, IFlyweightComponent {
  public Array<String> builds;
}
