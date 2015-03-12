package org.wolfTec.wolfTecEngine.audio;

import org.stjs.javascript.functions.Callback1;
import org.wolfTec.wolfTecEngine.components.ComponentManager;
import org.wolfTec.wolfTecEngine.components.Injected;
import org.wolfTec.wolfTecEngine.components.JsExec;
import org.wolfTec.wolfTecEngine.components.ManagedComponent;
import org.wolfTec.wolfTecEngine.components.ManagedComponentInitialization;
import org.wolfTec.wolfTecEngine.components.ManagedConstruction;
import org.wolfTec.wolfTecEngine.logging.Logger;
import org.wolfTec.wolfTecEngine.util.BrowserUtil;
import org.wolfTec.wolfTecEngine.vfs.Serializer;

/**
 * Simple serialize utility to stringify audio files to base64. This introduces
 * a lot of overhead in terms of file. Be careful with a large amount of music
 * files in your project.
 */
@ManagedComponent
public class AudioFileSerializer implements Serializer<Object>, ManagedComponentInitialization {
  
  @ManagedConstruction
  private Logger p_log;
  
  @Injected
  private WebAudioManager p_audio;
  
  private Callback1<Object> p_errorCb;
  
  @Override
  public void onComponentConstruction(ComponentManager manager) {
    p_errorCb = (err) -> {
      p_log.error(err);
    };
  }

  @Override
  public void deserialize(String data, Callback1<Object> cb) {
    Object bufData = BrowserUtil.convertBase64ToArrayBuffer(data);
    JsExec.injectJS("this.p_audioCtx.decodeAudioData(bufData, cb, this.p_errorCb)");
  }

  @Override
  public void serialize(Object data, Callback1<String> cb) {
    cb.$invoke(BrowserUtil.convertArrayBufferToBase64(data));
  }
}
