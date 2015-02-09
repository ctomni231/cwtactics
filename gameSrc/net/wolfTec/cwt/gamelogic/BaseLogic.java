package net.wolfTec.cwt.gamelogic;

import net.wolfTec.cwt.model.GameConfigBean;
import net.wolfTec.cwt.model.GameRoundBean;
import net.wolfTec.cwt.model.ObjectTypesBean;

public interface BaseLogic {
  public GameRoundBean getGameRound();
  public GameConfigBean getGameConfig();
  public ObjectTypesBean getObjectTypes();
}
