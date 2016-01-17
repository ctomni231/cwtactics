package org.wolftec.cwt.model.sheets.types;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;

public class SiloType
{
  public Array<String> fireable;
  public String changeTo;
  public int damage;
  public int range;

  public SiloType()
  {
    fireable = JSCollections.$array();
  }
}
