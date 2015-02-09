package net.wolfTec.cwt.audio;

import net.wolfTec.cwt.Constants;
import net.wolfTec.cwt.GameInitializationListener;
import net.wolfTec.cwt.log.Logger;
import net.wolfTec.cwt.persistence.StorageBean;

import org.stjs.javascript.JSCollections;
import org.stjs.javascript.JSObjectAdapter;
import org.stjs.javascript.Map;
import org.stjs.javascript.functions.Callback0;
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
