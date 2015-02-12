package org.wolfTec.cwt.game.gamelogic;

import org.wolfTec.cwt.game.model.GameConfigBean;
import org.wolfTec.cwt.game.model.GameRoundBean;
import org.wolfTec.cwt.game.model.ObjectTypesBean;
import org.wolfTec.cwt.game.utility.AssertUtilyBean;
import org.wolfTec.cwt.utility.beans.Bean;
import org.wolfTec.cwt.utility.beans.Injected;

/**
 * This bean holds the complete game logic of CustomWars Tactics.
 */
@Bean
public class GameLogicBean implements BaseLogic, CaptureLogic, TransportLogic, JoinLogic,
    SupplyLogic, SpecialWeaponsLogic, RepairLogic, RelationshipCheckLogic, LifecycleLogic,
    FactoryLogic, CommanderLogic, BattleLogic, WeatherLogic, TransferLogic, FogLogic {

  @Injected
  private GameRoundBean gameround;
  @Injected
  private GameConfigBean gameconfig;
  @Injected
  private ObjectTypesBean objectTypes;
  @Injected
  private AssertUtilyBean assertUtil;

  @Override
  public GameRoundBean getGameRound() {
    return gameround;
  }

  @Override
  public GameConfigBean getGameConfig() {
    return gameconfig;
  }

  @Override
  public ObjectTypesBean getObjectTypes() {
    return objectTypes;
  }

}
