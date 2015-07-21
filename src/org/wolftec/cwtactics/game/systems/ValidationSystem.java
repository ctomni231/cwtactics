package org.wolftec.cwtactics.game.systems;

import org.wolftec.cwtactics.game.core.Log;
import org.wolftec.cwtactics.game.core.sysevent.ValidatesModel;
import org.wolftec.cwtactics.game.core.systems.System;

public class ValidationSystem implements System, ValidatesModel {

  private Log log;

  @Override
  public void onValidateGameModel() {
    log.info("validating game model");
  }
}
