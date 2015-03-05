package org.wolfTec.wolfTecEngine;

import org.stjs.javascript.Map;
import org.stjs.javascript.annotation.SyntheticType;
import org.wolfTec.wolfTecEngine.validation.BooleanValue;
import org.wolfTec.wolfTecEngine.validation.DataObject;
import org.wolfTec.wolfTecEngine.validation.FloatValue;
import org.wolfTec.wolfTecEngine.validation.IntValue;
import org.wolfTec.wolfTecEngine.validation.StringKey;
import org.wolfTec.wolfTecEngine.validation.StringValue;

/**
 * The engine options controls the behavior of the wolfTec engine. It's possible
 * to extend this object to add additional configuration parameters.
 */
@SyntheticType
@DataObject
public class EngineOptions {

  @BooleanValue(defaultValue = false)
  public boolean debug;

  @StringValue
  public String namespace;

  @StringValue
  public String wolfTecNamespace = "wolfTec";

  @StringValue
  public String remoteDataLocation;

  @IntValue(min = 16, defaultValue = 32)
  public int animationTickTime;

  @IntValue(min = 8, defaultValue = 16)
  public int tileSize;

  @FloatValue(min = 0, max = 1, defaultValue = 1)
  public float defaultSfxVolume;

  @FloatValue(min = 0, max = 1, defaultValue = 0.5f)
  public float defaultMusicVolume;

  @StringKey
  @StringValue
  public Map<String, String> componentQualifiers;
}
