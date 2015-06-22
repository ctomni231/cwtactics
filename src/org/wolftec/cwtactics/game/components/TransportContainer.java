package org.wolftec.cwtactics.game.components;

import org.wolftec.cwtactics.Constants;
import org.wolftec.cwtactics.game.IEntityComponent;
import org.wolftec.cwtactics.game.core.CircularBuffer;

public class TransportContainer implements IEntityComponent {
  public CircularBuffer<String> loaded;

  public TransportContainer() {
    loaded = new CircularBuffer<String>(Constants.MAX_TRANSPORTER_LOADS);
  }
}
