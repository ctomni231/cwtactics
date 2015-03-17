package org.wolftec.layca;

import org.stjs.javascript.functions.Callback1;
import org.wolftec.persistence.Serializer;

/**
 * 
 */
public class SpriteConverter implements Serializer<Sprite> {
  
  @Override
  public void deserialize(String data, Callback1<Sprite> cb) {
    // TODO Auto-generated method stub
    // Array<String> spriteDataArray =
    // JSObjectAdapter.$js("JSON.parse(spriteData)");
    //
    // Sprite sprite = new Sprite(data.length());
    // for (int i = 0, e = data.length(); i < e; i++) {
    // sprite.setImage(i, (Canvas) );
    // }
    // BrowserUtil.convertBase64ToImage(data).... TODO
  }

  @Override
  public void serialize(Sprite data, Callback1<String> cb) {
    // TODO Auto-generated method stub

    // Array<String> data = JSCollections.$array();
    // for (int i = 0, e = sprite.getNumberOfImages(); i < e; i++) {
    // data.$set(i, BrowserUtil.convertCanvasToBase64(sprite.getImage(i)));
    // }
    // TODO
    // return JSObjectAdapter.$js("JSON.stringify(data)");
  }
}