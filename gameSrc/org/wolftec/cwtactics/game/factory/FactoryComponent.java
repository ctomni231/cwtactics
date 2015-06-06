package org.wolftec.cwtactics.game.factory;

import org.stjs.javascript.Array;
import org.wolftec.cwtactics.game.IEntityComponent;
import org.wolftec.cwtactics.game.IFlyweightComponent;

public class FactoryComponent implements IEntityComponent, IFlyweightComponent {
  public Array<String> builds;
}
