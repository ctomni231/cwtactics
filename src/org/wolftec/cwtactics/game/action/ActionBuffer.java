package org.wolftec.cwtactics.game.action;

import org.wolftec.cwtactics.game.core.CircularBuffer;
import org.wolftec.cwtactics.game.core.syscomponent.Component;

public class ActionBuffer implements Component {

  public CircularBuffer<String> buffer;
}
