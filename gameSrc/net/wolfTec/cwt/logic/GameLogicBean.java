package net.wolfTec.cwt.logic;

import net.wolfTec.cwt.model.GameRoundBean;

/**
 * This bean holds the complete game logic of CustomWars Tactics.
 */
public class GameLogicBean implements BaseLogic, CaptureLogic, TransportLogic, JoinLogic, SupplyLogic,
    SpecialWeaponsLogic, RepairLogic, RelationshipCheckLogic, LifecycleLogic, FactoryLogic, CommanderLogic,
    BattleLogic, WeatherLogic {

  private GameRoundBean  gameround;
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
