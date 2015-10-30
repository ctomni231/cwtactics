package org.wolftec.cwt.model.persistence;

import org.stjs.javascript.Map;
import org.wolftec.cwt.model.gameround.ModelManager;
import org.wolftec.cwt.wotec.log.Log;
import org.wolftec.cwt.wotec.persistence.SavegameHandler;

public class ModelSaver implements SavegameHandler<Map<String, String>> {

  private ModelManager model;

  private Log log;

  @Override
  public void onGameLoad(Map<String, String> data) {
    log.info("loading game model");
  }

  @Override
  public void onGameSave(Map<String, String> data) {
    log.info("saving game model");
  }

}
