package org.wolftec.cwtactics.game.domain.config;

import org.stjs.javascript.Map;
import org.wolftec.wCore.validation.DataObject;
import org.wolftec.wCore.validation.validators.IntValue;
import org.wolftec.wCore.validation.validators.StringKey;

@DataObject
public class GameConfigData {

  @StringKey
  @IntValue
  public Map<String, Integer> data;
}
