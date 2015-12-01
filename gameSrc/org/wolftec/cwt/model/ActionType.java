package org.wolftec.cwt.model;

public enum ActionType {

  /**
   * Map actions are called in the idle state on the map.
   */
  MAP_ACTION,

  /**
   * Engine actions are callable by the engine itself.
   */
  ENGINE_MAP_ACTION,

  /**
   * Unit actions are called on units.
   */
  UNIT_ACTION,

  /**
   * Unit actions are called on units.
   */
  ENGINE_UNIT_ACTION,

  /**
   * Property actions are called on properties.
   */
  PROPERTY_ACTION,

  /**
   * Property actions are called on properties.
   */
  ENGINE_PROPERTY_ACTION,

  /**
   * Client actions are callable only by the game session hoster.
   */
  CLIENT_ACTION;
}
