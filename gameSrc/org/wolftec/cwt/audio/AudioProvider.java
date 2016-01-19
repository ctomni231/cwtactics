package org.wolftec.cwt.audio;

import org.wolftec.cwt.managed.ManagedClass;

public class AudioProvider implements ManagedClass // TODO TEMP
{
  // --------------- REMOVE LATER ---------------------

  private AudioService webAudio;

  @Override
  public void onConstruction()
  {
    static_webAudio = webAudio;
  }

  // --------------- REMOVE LATER ---------------------

  private static Audio static_webAudio;

  public static Audio getAudio()
  {
    return static_webAudio;
  }
}
