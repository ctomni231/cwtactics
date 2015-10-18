package org.wolftec.cwt.core.audio;

import org.stjs.javascript.annotation.STJSBridge;
import org.wolftec.cwt.core.audio.VolumeSaver.VolumeData;
import org.wolftec.cwt.core.persistence.SavegameHandler;
import org.wolftec.cwt.core.util.NullUtil;

public class VolumeSaver implements SavegameHandler<VolumeData> {

  @STJSBridge
  static class VolumeData {
    float sfx;
    float music;
  }

  private AudioManager audio;

  @Override
  public void onGameLoad(VolumeData data) {
    audio.setSfxVolume(NullUtil.getOrElse(data.sfx, 1.0f));
    audio.setMusicVolume(NullUtil.getOrElse(data.music, 1.0f));
  }

  @Override
  public void onGameSave(VolumeData data) {
    data.sfx = audio.getSfxVolume();
    data.music = audio.getMusicVolume();
  }

}
