package org.wolfTec.cwt.game.gamelogic;

public enum BattleType {

  /**
   * Direct fire type that can fire from range 1 to 1.
   */
  DIRECT,

  /**
   * Indirect fire type that can fire from range 2 to x.
   */
  INDIRECT,

  /**
   * Ballistic fire type that can fire from range 1 to x.
   */
  BALLISTIC,

  /**
   * Signal for units that cannot attack.
   */
  NONE
}