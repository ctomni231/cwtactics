package org.wolftec.cwtactics.game.service;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.wolftec.cwtactics.engine.components.ConstructedClass;
import org.wolftec.cwtactics.engine.playground.CanvasQuery.Atlas;
import org.wolftec.cwtactics.engine.playground.CanvasQuery.AtlasFrame;

public class UnitAssetLoader implements ConstructedClass {

  private Atlas defaultFrameData;
  private Array<String> knownTypeIds;

  @Override
  public void onConstruction() {
    // defaultFrameData = createDefaultFrame();
    knownTypeIds = JSCollections.$array();
  }

  public void loadData() {
    // ImageConverter imgGrabber = new ImageConverter();
    // AssetEntry spriteEntry = app.getAssetEntry("CWT_" + entry.key,
    // FOLDER_IMAGES, "png");
    // imgGrabber.grabData(spriteEntry, (sheetSprite) -> {
    //
    // Atlas sprite = new Atlas();
    // sprite.image = sheetSprite;
    // sprite.frames = frameData.frames;
    //
    // /* register sprite */
    // app.atlases.$put(entry.key, sprite);
    // });

  }

  private Atlas createDefaultFrame() {
    Atlas frame = new Atlas();
    Array<AtlasFrame> frames = JSCollections.$array();
    frame.frames = frames;

    for (int j = 0; j < 9; j++) {
      AtlasFrame subFrame = new AtlasFrame();

      subFrame.height = 32;
      subFrame.width = 32;
      subFrame.region = JSCollections.$array(0, 0, 32, 32);
      subFrame.offset = JSCollections.$array(0, 0);

      frames.push(subFrame);
    }

    return frame;
  }
}
