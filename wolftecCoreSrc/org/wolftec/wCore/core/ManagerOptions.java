package org.wolftec.wCore.core;

import org.stjs.javascript.Array;
import org.stjs.javascript.Map;
import org.stjs.javascript.annotation.SyntheticType;
import org.wolftec.wCore.validation.DataObject;
import org.wolftec.wCore.validation.validators.BooleanValue;
import org.wolftec.wCore.validation.validators.FloatValue;
import org.wolftec.wCore.validation.validators.IntValue;
import org.wolftec.wCore.validation.validators.StringKey;
import org.wolftec.wCore.validation.validators.StringValue;

/**
 * The engine options controls the behavior of the wolfTec engine. It's possible
 * to extend this object to add additional configuration parameters.
 */
@SyntheticType
@DataObject
public class ManagerOptions {

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
  @Deprecated
  public Map<String, String> componentQualifiers;
  
  public Array<Class<?>> noComponentCandidates;
}
