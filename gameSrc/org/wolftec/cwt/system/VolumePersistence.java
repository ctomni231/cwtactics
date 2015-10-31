package org.wolftec.cwt.system;

import org.stjs.javascript.annotation.STJSBridge;
import org.wolftec.cwt.system.VolumePersistence.VolumeData;
import org.wolftec.cwt.util.NullUtil;

public class VolumePersistence implements SavegameHandler<VolumeData> {

  @STJSBridge
  static class VolumeData {
    float sfx;
    float music;
  }

  private Audio audio;

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
