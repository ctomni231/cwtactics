package org.wolftec.wPlay.audio;

import org.stjs.javascript.functions.Callback1;
import org.wolftec.wCore.core.BrowserUtil;
import org.wolftec.wCore.core.ComponentManager;
import org.wolftec.wCore.core.Injected;
import org.wolftec.wCore.core.JsExec;
import org.wolftec.wCore.core.ManagedComponent;
import org.wolftec.wCore.core.ManagedComponentInitialization;
import org.wolftec.wCore.core.ManagedConstruction;
import org.wolftec.wCore.log.Logger;
import org.wolftec.wCore.persistence.Serializer;

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
