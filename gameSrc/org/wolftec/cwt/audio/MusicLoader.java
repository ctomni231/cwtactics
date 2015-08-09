package org.wolftec.cwt.audio;

import org.stjs.javascript.functions.Callback0;
import org.wolftec.cwt.core.BrowserUtil;
import org.wolftec.cwt.core.FileDescriptor;
import org.wolftec.cwt.core.Grabber;
import org.wolftec.cwt.core.ioc.Injectable;
import org.wolftec.cwt.persistence.PersistenceManager;

public class MusicLoader implements Injectable, Grabber {

  @Override
  public String forPath() {
    return "audio\\music\\";
  }

  @Override
  public void grabData(PersistenceManager pm, FileDescriptor file, Callback0 completeCb) {
    /* TODO check features before */
    BrowserUtil.doXmlHttpRequest(file.path, "arraybuffer", (data, err) -> {
      pm.set(file.path, data, (saveErr, saveData) -> {
        completeCb.$invoke();
      });
    });
  }

  @Override
  public void loadData(PersistenceManager pm, FileDescriptor file, Callback0 completeCb) {
    /* we load music files when we need them to save RAM :) */
  }
}
