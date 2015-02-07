package net.wolfTec.wtEngine.gamelogic;

import net.wolfTec.wtEngine.model.GameConfigBean;
import net.wolfTec.wtEngine.model.GameRoundBean;
import net.wolfTec.wtEngine.model.ObjectTypesBean;

public interface BaseLogic {
	public GameRoundBean getGameRound();
  public GameConfigBean getGameConfig();
  public ObjectTypesBean getObjectTypes();
}
