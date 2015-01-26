package net.wolfTec.cwt.logic;

import net.wolfTec.cwt.model.GameRoundBean;

public interface BaseLogic {
	public GameRoundBean getGameRound();
  public GameConfigBean getGameConfig();
  public ObjectTypesBean getObjectTypes();
}
