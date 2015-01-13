package net.wolfTec.logic;

import net.wolfTec.model.GameRoundBean;

/**
 * This bean holds the complete game logic of CustomWars Tactics.
 */
public class GameLogicBean implements BaseLogic, CaptureLogic, TransportLogic, JoinLogic, SupplyLogic,
    SpecialWeaponsLogic, RepairLogic, RelationshipCheckLogic, LifecycleLogic, FactoryLogic, CommanderLogic, BattleLogic {

  private GameRoundBean  gameround;
  private GameConfigBean gameconfig;

  @Override public GameRoundBean getGameRound() {
    return gameround;
  }

  @Override public GameConfigBean getGameConfig() {
    return gameconfig;
  }

}
