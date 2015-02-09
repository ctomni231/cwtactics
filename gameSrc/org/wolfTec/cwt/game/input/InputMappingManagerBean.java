package org.wolfTec.cwt.game.input;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.JSObjectAdapter;
import org.stjs.javascript.Map;
import org.stjs.javascript.functions.Callback0;
import org.wolfTec.cwt.game.Constants;
import org.wolfTec.cwt.game.Game;
import org.wolfTec.cwt.game.log.Logger;
import org.wolfTec.cwt.game.persistence.StorageBean;
import org.wolfTec.cwt.game.utility.BrowserHelperBean;
import org.wolfTec.cwt.utility.beans.Bean;
import org.wolfTec.cwt.utility.beans.BeanFactory;
import org.wolfTec.cwt.utility.beans.Injected;
import org.wolfTec.cwt.utility.beans.InjectedByFactory;
import org.wolfTec.cwt.utility.beans.PostInitialization;

@Bean public class InputMappingManagerBean {

  @InjectedByFactory private Logger log;
  @Injected private StorageBean storage;
  @Injected private BrowserHelperBean browser;
  @Injected private Array<InputMappable> mappables;
  
  @PostInitialization public void init(BeanFactory engine) {
    mappables = Game.engine.getBeansOfInterface(InputMappable.class);
  }
  
  /**
   * Saves the input mappings from the input backends into the storage.
   * 
   * @param callback
   */
  public void saveConfig (Callback0 callback) {
    Map<String, Map<String, Integer>> mappings = JSCollections.$map();
    
    for (int i = 0; i < mappables.$length(); i++) {
      mappings.$put(mappables.$get(i).getInputMappingName(), mappables.$get(i).getInputMapping());
    }
    
    storage.set(Constants.STORAGE_PARAMETER_INPUT_MAPPING, mappings, (data, error) -> {
      if (error != null) {
        log.error("SavingInputMappingError");
        
      } else {
        log.info("Successfully saved user input mappings");
        callback.$invoke();
      }
    });
  }
  
  /**
   * Loads the input mapping configuration from storage and injects it into the possible 
   * input backends.
   *  
   * @param callback
   */
  public void loadConfig (Callback0 callback) {
    storage.get(Constants.STORAGE_PARAMETER_INPUT_MAPPING, (entry) -> {
      
      if (entry.value != null) {
        Map<String, Map<String, Integer>> mappings = JSObjectAdapter.$js("entry.value");
        Array<String> mappingKeys = browser.objectKeys(mappings);
        
        for (int i = 0; i < mappingKeys.$length(); i++) {
          String curKey = mappingKeys.$get(i);
          
          for (int j = 0; j < mappables.$length(); j++) {
            if (mappables.$get(j).getInputMappingName() == curKey) {
              mappables.$get(j).setInputMapping(mappings.$get(curKey));
              break;
            }
          }
        }
      }

      log.info("Successfully load user input mappings");
      callback.$invoke();
    });
  }
}
