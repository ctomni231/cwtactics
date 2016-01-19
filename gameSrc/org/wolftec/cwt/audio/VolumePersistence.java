package org.wolftec.cwt.audio;

import org.stjs.javascript.annotation.STJSBridge;
import org.wolftec.cwt.audio.VolumePersistence.VolumeData;
import org.wolftec.cwt.serialization.SaveAppdataHandler;
import org.wolftec.cwt.util.NullUtil;

class VolumePersistence implements SaveAppdataHandler<VolumeData>
{

  @STJSBridge
  static class VolumeData
  {
    float sfx;
    float music;
  }

  private Audio audio;

  @Override
  public void onAppLoad(VolumeData data)
  {
    audio.setSfxVolume(NullUtil.getOrElse(data.sfx, 1.0f));
    audio.setMusicVolume(NullUtil.getOrElse(data.music, 1.0f));
  }

  @Override
  public void onAppSave(VolumeData data)
  {
    data.sfx = audio.getSfxVolume();
    data.music = audio.getMusicVolume();
  }

}
