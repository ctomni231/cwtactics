package org.wolftec.cwtactics.game.event;

public interface ActionFlags {

  public static final int FLAG_SOURCE_PROP_EXISTS = 0;
  public static final int FLAG_SOURCE_PROP_TO = 1;
  public static final int FLAG_SOURCE_PROP_TO_ALLIED = 2;
  public static final int FLAG_SOURCE_PROP_TO_ENEMY = 3;
  public static final int FLAG_SOURCE_PROP_NONE = 4;

  public static final int FLAG_SOURCE_UNIT_EXISTS = 5;
  public static final int FLAG_SOURCE_UNIT_TO = 6;
  public static final int FLAG_SOURCE_UNIT_TO_ALLIED = 7;
  public static final int FLAG_SOURCE_UNIT_TO_ENEMY = 8;

  public static final int FLAG_UNIT_GAP_START = 5;
}
