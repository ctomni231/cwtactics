package org.wolftec.cwtactics.engine.converter;

import org.stjs.javascript.dom.Canvas;
import org.stjs.javascript.dom.Image;
import org.stjs.javascript.dom.canvas.CanvasRenderingContext2D;
import org.stjs.javascript.functions.Callback1;
import org.wolftec.cwtactics.engine.playground.Playground.AssetEntry;
import org.wolftec.cwtactics.engine.util.BrowserUtil;
import org.wolftec.cwtactics.engine.util.ImageUtil;

public class ImageConverter implements DataConverter<Canvas> {

  @Override
  public void grabData(AssetEntry asset, Callback1<Canvas> callback) {
    Image img = new Image();

    img.onload = (image) -> {
      Canvas canvas = BrowserUtil.createDomElement("canvas");
      CanvasRenderingContext2D ctx = canvas.getContext("2d");
      canvas.width = img.width;
      canvas.height = img.height;

      ctx.drawImage(img, 0, 0);

      callback.$invoke(canvas);
    };

    img.src = asset.path;
  }

  @Override
  public void cacheData(Canvas data, Callback1<String> callback) {
    ImageUtil.convertImageToString(data, callback);
  }

  @Override
  public void loadData(String data, Callback1<Canvas> callback) {
    ImageUtil.convertStringToImage(data, callback);
  }

}
