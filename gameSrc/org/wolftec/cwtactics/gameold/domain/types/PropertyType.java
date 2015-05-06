package org.wolftec.cwtactics.gameold.domain.types;

import org.stjs.javascript.Array;
import org.stjs.javascript.Map;
import org.wolftec.cwtactics.gameold.EngineGlobals;
import org.wolftec.wCore.validation.DataObject;
import org.wolftec.wCore.validation.validators.IntValue;
import org.wolftec.wCore.validation.validators.StringKey;
import org.wolftec.wCore.validation.validators.StringValue;

@DataObject
public class PropertyType extends ObjectType {

  @IntValue(min = 0, max = 6)
  public int defense = 0;

  @IntValue(min = 0, max = EngineGlobals.MAX_SELECTION_RANGE)
  public int vision = 0;

  @IntValue(min = 0, max = 20)
  public int capturePoints = 20; // TODO static ?

  public boolean visionBlocker;
  public RocketSiloType rocketsilo;

  @StringValue(minLength = 4, maxLength = 4)
  public Array<String> builds;

  public LaserType laser;

  @StringValue(minLength = 1)
  public String changesTo;

  @StringKey(minLength = 4, maxLength = 4)
  @IntValue(min = 1, max = 10)
  public Map<String, Integer> repairs;

  @IntValue(min = 0, max = 99999)
  public int funds = 0;

  public boolean looseAfterCaptured = false;
  public boolean blocker = false;
  public boolean notTransferable = false;
}