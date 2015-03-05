package org.wolfTec.vfs;

import org.stjs.javascript.Array;
import org.stjs.javascript.functions.Callback0;
import org.stjs.javascript.functions.Callback1;
import org.stjs.javascript.functions.Callback2;
import org.wolfTec.wolfTecEngine.container.ContainerUtil;

public class DecoratedVfs implements Vfs {

  private Vfs p_vfs;
  private Serializer p_serializer; // TODO
  private String p_folder;

  public DecoratedVfs(Vfs vfs, String folder, Serializer serializer) {
    p_vfs = vfs;
    p_folder = folder;
    p_serializer = serializer;
  }

  @Override
  public void deleteDirectory(String path, Callback0 callback) {
    p_vfs.deleteDirectory(p_folder + path, callback);
  }

  @Override
  public void deleteEverything(Callback0 callback) {
    p_vfs.deleteEverything(callback);
  }

  @Override
  public void deleteFile(String path, Callback0 callback) {
    p_vfs.deleteFile(p_folder + path, callback);
  }

  @Override
  public void fileList(String path, boolean searchSubDirs, Callback1<Array<String>> callback) {
    p_vfs.fileList(p_folder + path, searchSubDirs, (fileList) -> {

      Array<String> maskFiles = ContainerUtil.createArray();
      for (int i = 0; i < maskFiles.$length(); i++) {
        String fileNameToTest = maskFiles.$get(i);
        if (fileNameToTest.startsWith(p_folder)) {
          fileNameToTest = fileNameToTest.substring(p_folder.length());
          maskFiles.push(fileNameToTest);
        }
      }
      
      callback.$invoke(maskFiles);
    });
  }

  @Override
  public <T> void readFile(String path, Callback1<VfsEntityDescriptor<T>> callback) {
    p_vfs.readFile(p_folder + path, (vfsEntry) -> {

      if (p_serializer != null) {
        p_serializer.deserialize(vfsEntry.value.toString(), deSerializedVfsEntry -> {
          vfsEntry.value = deSerializedVfsEntry;
          callback.$invoke((VfsEntityDescriptor<T>) vfsEntry);
        });
      } else {
        callback.$invoke((VfsEntityDescriptor<T>) vfsEntry);
      }
    });
  }

  @Override
  public <T> void readFiles(Callback1<Array<VfsEntityDescriptor<T>>> callback) {
    p_vfs.readFiles((fileDescs) -> {

      Array<VfsEntityDescriptor<T>> maskFileDescs = ContainerUtil.createArray();
      for (int i = 0; i < fileDescs.$length(); i++) {
        VfsEntityDescriptor<T> fileToTest = (VfsEntityDescriptor<T>) fileDescs.$get(i);
        if (fileToTest.key.startsWith(p_folder)) {
          fileToTest.key = fileToTest.key.substring(p_folder.length());
          maskFileDescs.push(fileToTest);
        }
      }

      callback.$invoke(maskFileDescs);
    });
  }

  @Override
  public <T> void forEachFile(Callback2<VfsEntityDescriptor<T>, Callback0> fileCallback,
      Callback0 callback) {
    
  }

  @Override
  public <T> void writeFile(String path, T value, Callback2<Object, Object> callback) {
    p_vfs.writeFile(p_folder + path, value, callback);
  }

}
