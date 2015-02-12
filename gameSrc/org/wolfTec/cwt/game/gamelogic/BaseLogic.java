package org.wolfTec.cwt.game.gamelogic;

import org.wolfTec.cwt.game.model.GameConfigBean;
import org.wolfTec.cwt.game.model.GameRoundBean;
import org.wolfTec.cwt.game.model.types.ObjectTypesBean;

public interface BaseLogic {
  public GameRoundBean getGameRound();

  public GameConfigBean getGameConfig();

  public ObjectTypesBean getObjectTypes();
}
