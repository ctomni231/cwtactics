package org.wolftec.cwt.audio;

import org.stjs.javascript.functions.Callback0;
import org.wolftec.cwt.audio.AudioManager.AudioBuffer;
import org.wolftec.cwt.core.BrowserUtil;
import org.wolftec.cwt.core.FileDescriptor;
import org.wolftec.cwt.core.Grabber;
import org.wolftec.cwt.core.ioc.Injectable;
import org.wolftec.cwt.persistence.PersistenceManager;

public class SfxLoader implements Injectable, Grabber {

  private AudioManager audio;

  @Override
  public String forPath() {
    return "audio\\sfx\\";
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
    pm.get(file.path, (err, data) -> {
      audio.registerAudioBuffer(file.fileName, (AudioBuffer) data);
    });
  }
}
