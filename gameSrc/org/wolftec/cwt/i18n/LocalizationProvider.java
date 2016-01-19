package org.wolftec.cwt.i18n;

import org.wolftec.cwt.managed.ManagedClass;

public class LocalizationProvider implements ManagedClass
{

  private I18Service i18n;
  private static I18Service static_i18n;

  @Override
  public void onConstruction()
  {
    static_i18n = i18n;
  }

  public static I18Service getLocalization()
  {
    return static_i18n;
  }
}
