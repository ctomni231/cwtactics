package org.wolftec.cwt.i18n;

import org.stjs.javascript.functions.Callback1;
import org.wolftec.cwt.PersistenceManager;
import org.wolftec.cwt.dataGrabber.Grabber;

public class LanguageDataLoader implements Grabber {

  @Override
  public void fromRemote(String dataKey, Callback1<Object> dataCb) {
    // TODO Auto-generated method stub

  }

  @Override
  public void fromCache(PersistenceManager pm, String dataKey, Callback1<Object> dataCb) {
    // TODO Auto-generated method stub

  }

}
