package org.wolftec.cwt.core;

public class FileDescriptor {

  public final String fileName;
  public final String fileNameWithoutExtension;
  public final String extension;
  public final String path;

  public FileDescriptor(String pPath) {
    int index;

    path = pPath;

    index = pPath.lastIndexOf("/");
    fileName = pPath.substring(index + 1);

    index = fileName.lastIndexOf(".");
    fileNameWithoutExtension = fileName.substring(0, index);
    extension = fileName.substring(index + 1);
  }

  @Override
  public FileDescriptor clone() {
    return new FileDescriptor(path);
  }
}
