package net.wolfTec.wtEngine.gamelogic;

import org.wolfTec.utility.Bean;
import org.wolfTec.utility.Injected;

import net.wolfTec.wtEngine.model.GameConfigBean;
import net.wolfTec.wtEngine.model.GameRoundBean;
import net.wolfTec.wtEngine.model.ObjectTypesBean;
import net.wolfTec.wtEngine.utility.AssertUtilyBean;

/**
 * This bean holds the complete game logic of CustomWars Tactics.
 */
@Bean public class GameLogicBean implements BaseLogic, CaptureLogic, TransportLogic, JoinLogic,
    SupplyLogic, SpecialWeaponsLogic, RepairLogic, RelationshipCheckLogic, LifecycleLogic,
    FactoryLogic, CommanderLogic, BattleLogic, WeatherLogic, TransferLogic, FogLogic {

  @Injected private GameRoundBean gameround;
  @Injected private GameConfigBean gameconfig;
  @Injected private ObjectTypesBean objectTypes;
  @Injected private AssertUtilyBean assertUtil;

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
