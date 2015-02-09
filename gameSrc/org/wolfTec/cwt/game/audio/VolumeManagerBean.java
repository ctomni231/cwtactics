package org.wolfTec.cwt.game.audio;

import org.stjs.javascript.JSCollections;
import org.stjs.javascript.JSObjectAdapter;
import org.stjs.javascript.Map;
import org.stjs.javascript.functions.Callback0;
import org.wolfTec.cwt.game.Constants;
import org.wolfTec.cwt.game.GameInitializationListener;
import org.wolfTec.cwt.game.log.Logger;
import org.wolfTec.cwt.game.persistence.StorageBean;
import org.wolfTec.utility.Bean;
import org.wolfTec.utility.Injected;
import org.wolfTec.utility.InjectedByFactory;

@Bean public class VolumeManagerBean implements GameInitializationListener {
  
  @InjectedByFactory private Logger log;
  @Injected private StorageBean storage;
  @Injected private AudioBean audio;

  public void saveConfig(Callback0 callback){
    Map<String, Integer> data = JSCollections.$map();
    data.$put("bg", audio.getVolume(AudioChannel.CHANNEL_BG));
    data.$put("sfx", audio.getVolume(AudioChannel.CHANNEL_SFX));
    
    storage.set(Constants.STORAGE_PARAMETER_AUDIO_VOLUME, data, (savedData, err) -> {
      if (err != null) {
        log.error("SavingVolumeConfigException");
        
      } else callback.$invoke();
    });
  }
  
  public void loadConfig(Callback0 callback){
    storage.get(Constants.STORAGE_PARAMETER_AUDIO_VOLUME, (entry) -> {
      if(entry.value != null) {
        // TODO type safe
        audio.setVolume(AudioChannel.CHANNEL_BG, JSObjectAdapter.$js("entry.value.bg"));
        audio.setVolume(AudioChannel.CHANNEL_SFX, JSObjectAdapter.$js("entry.value.sfx"));
      }
      
      callback.$invoke();
    });
  }
  
  @Override public void onGameLoaded(Callback0 callback) {
    loadConfig(callback);
  }
}
