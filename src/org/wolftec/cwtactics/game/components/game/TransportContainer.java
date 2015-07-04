package org.wolftec.cwtactics.game.components.game;

import org.wolftec.cwtactics.Constants;
import org.wolftec.cwtactics.game.core.CircularBuffer;
import org.wolftec.cwtactics.game.core.IEntityComponent;

public class TransportContainer implements IEntityComponent {
  public CircularBuffer<String> loaded;

  public TransportContainer() {
    loaded = new CircularBuffer<String>(Constants.MAX_TRANSPORTER_LOADS);
  }
}
