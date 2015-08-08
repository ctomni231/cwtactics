package org.wolftec.cwt.sheets;

import org.stjs.javascript.functions.Callback0;
import org.wolftec.cwt.core.FileDescriptor;
import org.wolftec.cwt.core.Grabber;
import org.wolftec.cwt.persistence.PersistenceManager;

public class SheetDataLoader implements Grabber {

  @Override
  public String forPath() {
    return "data\\";
  }

  // TODO type checks

  @Override
  public void grabData(PersistenceManager pm, FileDescriptor file, Callback0 completeCb) {
    // TODO Auto-generated method stub

  }

  @Override
  public void loadData(PersistenceManager pm, FileDescriptor file, Callback0 completeCb) {
    // TODO Auto-generated method stub

  }
}
