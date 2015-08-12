package org.wolftec.cwt.core;

import org.stjs.javascript.Array;
import org.stjs.javascript.functions.Callback0;
import org.wolftec.cwt.persistence.PersistenceManager;

public class GrabberManager implements Loader {

  private PersistenceManager storage;

  private Array<Grabber>     grabbers;

  @Override
  public int priority() {
    return 5;
  }

  @Override
  public void onLoad(Callback0 done) {
    done.$invoke();
  }
}
