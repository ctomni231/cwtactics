package org.wolftec.cwt.core;

public class FileUtil {

  public static String extractFilename(String path) {
    path = path.substring(path.lastIndexOf("/") + 1);
    path.substring(0, path.lastIndexOf("."));
    return path;
  }
}
