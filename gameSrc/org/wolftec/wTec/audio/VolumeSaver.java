package org.wolftec.wTec.audio;

import org.stjs.javascript.annotation.STJSBridge;
import org.wolftec.cwt.util.NullUtil;
import org.wolftec.wTec.audio.VolumeSaver.VolumeData;
import org.wolftec.wTec.persistence.SavegameHandler;

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
