package org.wolfTec.cwt.game.renderer;

import org.wolfTec.cwt.utility.beans.Bean;

@Bean
public class SpriteIndexBean {

  public final int TYPE_UNIT = 0;
  public final int TYPE_PROPERTY = 1;
  public final int TYPE_TILE = 2;
  public final int TYPE_ANIMATED_TILE = 3;
  public final int TYPE_ANIMATED_TILE_WITH_VARIANTS = 4;
  public final int TYPE_MISC = 10;
  public final int TYPE_IMAGE = 99;

  public final int UNIT_INDEX_RED = 0;
  public final int UNIT_INDEX_BLUE = 3;
  public final int UNIT_INDEX_GREEN = 4;
  public final int UNIT_INDEX_YELLOW = 5;
  public final int UNIT_INDEX_COLORS = 6;

  public final int PROPERTY_INDEX_RED = 0;
  public final int PROPERTY_INDEX_GRAY = 1;
  public final int PROPERTY_INDEX_BLUE = 3;
  public final int PROPERTY_INDEX_GREEN = 4;
  public final int PROPERTY_INDEX_YELLOW = 5;
  public final int PROPERTY_INDEX_COLORS = 4;

  public final int MINIMAP_2x2 = 0;
  public final int MINIMAP_4x4 = 1;

  public final int UNIT_STATES = 30;
  public final int UNIT_RED = 0;
  public final int UNIT_BLUE = 6;
  public final int UNIT_GREEN = 12;
  public final int UNIT_YELLOW = 18;
  public final int UNIT_SHADOW_MASK = 24;
  public final int UNIT_STATE_IDLE = 0;
  public final int UNIT_STATE_IDLE_INVERTED = 1;
  public final int UNIT_STATE_LEFT = 2;
  public final int UNIT_STATE_RIGHT = 3;
  public final int UNIT_STATE_UP = 4;
  public final int UNIT_STATE_DOWN = 5;

  public final int TILE_STATES = 2;
  public final int TILE_SHADOW = 1;

  public final int PROPERTY_STATES = 6;
  public final int PROPERTY_RED = 0;
  public final int PROPERTY_BLUE = 1;
  public final int PROPERTY_GREEN = 2;
  public final int PROPERTY_YELLOW = 3;
  public final int PROPERTY_NEUTRAL = 4;
  public final int PROPERTY_SHADOW_MASK = 5;

  public final int SYMBOL_HP = 0;
  public final int SYMBOL_AMMO = 1;
  public final int SYMBOL_FUEL = 2;
  public final int SYMBOL_LOAD = 3;
  public final int SYMBOL_CAPTURE = 4;
  public final int SYMBOL_ATT = 5;
  public final int SYMBOL_VISION = 6;
  public final int SYMBOL_MOVE = 7;
  public final int SYMBOL_UNKNOWN = 8;
  public final int SYMBOL_HIDDEN = 9;
  public final int SYMBOL_DEFENSE = 10;
  public final int SYMBOL_RANK_1 = 11;
  public final int SYMBOL_RANK_2 = 12;
  public final int SYMBOL_RANK_3 = 13;

  public final int DIRECTION_N = 0;
  public final int DIRECTION_S = 1;
  public final int DIRECTION_W = 2;
  public final int DIRECTION_E = 3;
  public final int DIRECTION_SW = 4;
  public final int DIRECTION_SE = 5;
  public final int DIRECTION_NW = 6;
  public final int DIRECTION_NE = 7;
  public final int DIRECTION_NS = 8;
  public final int DIRECTION_WE = 9;
  public final int DIRECTION_ALL = 8;
  public final int DIRECTION_UP = 0;
  public final int DIRECTION_DOWN = 1;
  public final int DIRECTION_LEFT = 2;
  public final int DIRECTION_RIGHT = 3;

  public final int FOCUS_MOVE = 0;
  public final int FOCUS_ATTACK = 1;

  public final int COLOR_MAP_PROPERTY = 0;
  public final int COLOR_MAP_UNIT = 1;

  public final int EXPLOSION_GROUND = 0;
  public final int EXPLOSION_AIR = 1;
  public final int EXPLOSION_DUST = 2;
  public final int EXPLOSION_SEA = 3;

}
