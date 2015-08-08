package org.wolftec.cwt.core;

import org.stjs.javascript.Array;
import org.stjs.javascript.functions.Callback0;
import org.wolftec.cwt.PersistenceManager;

public class GrabberManager implements Injectable {

  private PersistenceManager storage;

  private Array<Grabber>     grabbers;

  public void grabData(Callback0 doneCb) {
    storage.keys((err, keys) -> {
      if (keys.$length() > 0) {
        // grab remote
      }
      // grab local
    });
  }
}
