package org.wolftec.cwt.view.audio;

import org.stjs.javascript.functions.Callback0;
import org.wolftec.cwt.core.NullUtil;
import org.wolftec.cwt.core.annotations.AsyncCallback;
import org.wolftec.cwt.core.annotations.AsyncOperation;
import org.wolftec.cwt.core.javascript.JsUtil;
import org.wolftec.cwt.core.persistence.FolderStorage;

public class VolumePersistence {

  private FolderStorage cfgDir;

  public VolumePersistence() {
    cfgDir = new FolderStorage("cfg/");
  }

  @AsyncOperation
  public void load(Audio audio, @AsyncCallback Callback0 onFinish) {
    cfgDir.readFile("audio", (VolumeData data) -> {
      audio.setSfxVolume(NullUtil.getOrElse(data.sfx, 1.0f));
      audio.setMusicVolume(NullUtil.getOrElse(data.music, 1.0f));
    } , JsUtil.throwErrorCallback());
  }

  @AsyncOperation
  public void save(Audio audio, @AsyncCallback Callback0 onFinish) {
    VolumeData data = new VolumeData();
    data.sfx = audio.getSfxVolume();
    data.music = audio.getMusicVolume();
    cfgDir.writeFile("audio", data, onFinish, JsUtil.throwErrorCallback());
  }

}
