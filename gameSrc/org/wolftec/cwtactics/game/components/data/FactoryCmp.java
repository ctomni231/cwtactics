package org.wolftec.cwtactics.game.components.data;

import org.stjs.javascript.Array;
import org.wolftec.cwtactics.game.components.IEntityComponent;
import org.wolftec.cwtactics.game.components.IFlyweightComponent;

public class FactoryCmp implements IEntityComponent, IFlyweightComponent {
  public Array<String> builds;
}
