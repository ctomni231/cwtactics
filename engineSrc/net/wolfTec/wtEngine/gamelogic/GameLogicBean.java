package net.wolfTec.wtEngine.gamelogic;

import org.wolfTec.utility.Bean;

import net.wolfTec.wtEngine.model.GameConfigBean;
import net.wolfTec.wtEngine.model.GameRoundBean;
import net.wolfTec.wtEngine.model.ObjectTypesBean;

/**
 * This bean holds the complete game logic of CustomWars Tactics.
 */
@Bean public class GameLogicBean implements BaseLogic, CaptureLogic, TransportLogic, JoinLogic,
    SupplyLogic, SpecialWeaponsLogic, RepairLogic, RelationshipCheckLogic, LifecycleLogic,
    FactoryLogic, CommanderLogic, BattleLogic, WeatherLogic {

  private GameRoundBean gameround;
  private GameConfigBean gameconfig;
  private ObjectTypesBean objectTypes;

  @Override public GameRoundBean getGameRound() {
    return gameround;
  }

  @Override public GameConfigBean getGameConfig() {
    return gameconfig;
  }

  @Override public ObjectTypesBean getObjectTypes() {
    return objectTypes;
  }

}
