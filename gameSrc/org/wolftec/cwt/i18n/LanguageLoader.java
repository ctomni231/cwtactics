package org.wolftec.cwt.i18n;

import org.stjs.javascript.Map;
import org.wolftec.cwt.loading.DataGrabber;
import org.wolftec.cwt.loading.ResourceGrabbingType;
import org.wolftec.cwt.serialization.FileDescriptor;

public class LanguageLoader implements DataGrabber
{

  @Override
  public String getTargetFolder()
  {
    return "lang";
  }

  @Override
  public ResourceGrabbingType getFileType(FileDescriptor file)
  {
    return ResourceGrabbingType.JSON_DATA;
  }

  @Override
  public void putDataIntoGame(FileDescriptor file, Object data)
  {
    I18Service i18n = LocalizationProvider.getLocalization();
    i18n.registerLanguage(file.fileNameWithoutExtension, (Map<String, String>) data);
  }

}
