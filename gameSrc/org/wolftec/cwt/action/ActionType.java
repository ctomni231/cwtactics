package org.wolftec.cwt.action;

public enum ActionType {

  /**
   * Map actions are called in the idle state on the map.
   */
  MAP_ACTION,

  /**
   * Unit actions are called on units.
   */
  UNIT_ACTION,

  /**
   * Property actions are called on properties.
   */
  PROPERTY_ACTION,

  /**
   * Engine actions are callable by the engine itself.
   */
  ENGINE_ACTION,

  /**
   * Client actions are callable only by the game session hoster.
   */
  CLIENT_ACTION;
}
