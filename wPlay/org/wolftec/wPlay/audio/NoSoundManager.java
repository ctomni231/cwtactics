package org.wolftec.wPlay.audio;

import org.wolftec.wCore.core.ComponentManager;
import org.wolftec.wCore.core.ComponentScore;
import org.wolftec.wCore.core.ManagedComponent;
import org.wolftec.wCore.core.ManagedComponentInitialization;
import org.wolftec.wCore.core.ManagedConstruction;
import org.wolftec.wCore.log.Logger;

/**
 * Fallback manager to prevent breaking components that using the audio
 * interface while having no usable audio backend available.
 */
@ManagedComponent
@ComponentScore(1)
public class NoSoundManager implements AudioManager, ManagedComponentInitialization {

  @ManagedConstruction
  private Logger log;
  
  @Override
  public void onComponentConstruction(ComponentManager manager) {
    log.info("Initializing No-Sound-Manager");
  }
  
  @Override
  public boolean isEnabled() {
    return true;
  }

  @Override
  public void playNullSound() {
  }

  @Override
  public void playSFX(String key) {
  }

  @Override
  public boolean playBG(String key) {
    return true;
  }

  @Override
  public boolean stopBG() {
    return true;
  }

  @Override
  public boolean isBuffered(String id) {
    return true;
  }

  @Override
  public void setVolume(AudioChannel channel, int volume) {
  }

  @Override
  public int getVolume(AudioChannel channel) {
    return 0;
  }

  @Override
  public boolean isMusicSupported() {
    return true;
  }

  @Override
  public boolean isSfxSupported() {
    return true;
  }

}
