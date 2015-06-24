package org.wolftec.cwtactics.game.components.ui;

import org.wolftec.cwtactics.game.IEntityComponent;
import org.wolftec.cwtactics.game.core.CircularBuffer;

public class Menu implements IEntityComponent {

  public CircularBuffer<String> menu;
}
