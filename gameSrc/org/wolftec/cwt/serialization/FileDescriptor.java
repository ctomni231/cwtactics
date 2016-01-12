package org.wolftec.cwt.serialization;

public class FileDescriptor
{

  /**
   * e.g. myFile.txt
   */
  public final String fileName;

  /**
   * e.g. myFile
   */
  public final String fileNameWithoutExtension;

  /**
   * e.g. txt
   */
  public final String extension;

  /**
   * e.g. path/to/myFile.txt
   */
  public final String path;

  public FileDescriptor(String pPath)
  {
    int index;

    path = pPath;

    index = pPath.lastIndexOf("/");
    fileName = index != -1 ? pPath.substring(index + 1) : pPath;

    index = fileName.lastIndexOf(".");
    fileNameWithoutExtension = fileName.substring(0, index);
    extension = fileName.substring(index + 1);
  }

  @Override
  public FileDescriptor clone()
  {
    return new FileDescriptor(path);
  }
}
