package org.wolftec.cwtactics.game.domain.model;

import org.wolftec.cwtactics.EngineGlobals;
import org.wolftec.cwtactics.game.domain.types.ArmyType;
import org.wolftec.cwtactics.game.domain.types.CoType;
import org.wolftec.validation.DataObject;
import org.wolftec.validation.validators.BooleanValue;
import org.wolftec.validation.validators.IntValue;
import org.wolftec.validation.validators.StringValue;

@DataObject
public class Player {

  public int id = -1;
  public int team = EngineGlobals.INACTIVE_ID;

  @StringValue(minLength = 4, maxLength = 20)
  public String name;

  @IntValue(min = 0, defaultValue = 0)
  public int power = 0;

  @IntValue(min = 0, defaultValue = 0)
  public int powerUsed = 0;

  @IntValue(min = 0, defaultValue = 0)
  public int gold = 0;

  @IntValue(min = 0, defaultValue = 999999999)
  public int manpower = 999999999;

  @IntValue(min = 0, defaultValue = 0)
  public int numberOfUnits = 0;

  @IntValue(min = 0, defaultValue = 0)
  public int numberOfProperties = 0;

  public CoType mainCo = null;
  public CoType sideCo = null;
  public CoPowerLevel activePower = CoPowerLevel.OFF;
  public ArmyType army;

  @BooleanValue(defaultValue = false)
  public boolean turnOwnerVisible = false;

  @BooleanValue(defaultValue = false)
  public boolean clientVisible = false;

  @BooleanValue(defaultValue = false)
  public boolean clientControlled = false;

}
