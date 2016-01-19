package org.wolftec.cwt.loading;

import org.wolftec.cwt.serialization.FileDescriptor;

public interface DataGrabber
{

  String getTargetFolder();

  ResourceGrabbingType getFileType(FileDescriptor file);

  void putDataIntoGame(FileDescriptor file, Object data);

}
