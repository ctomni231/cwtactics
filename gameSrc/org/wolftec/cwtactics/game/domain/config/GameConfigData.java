package org.wolftec.cwtactics.game.domain.config;

import org.stjs.javascript.Map;
import org.wolftec.validation.DataObject;
import org.wolftec.validation.validators.IntValue;
import org.wolftec.validation.validators.StringKey;

@DataObject
public class GameConfigData {

  @StringKey
  @IntValue
  public Map<String, Integer> data;
}
