package org.wolftec.cwtactics.game.system.old;

import org.wolftec.cwtactics.engine.converter.ImageConverter;
import org.wolftec.cwtactics.engine.converter.TypedObjectConverter;
import org.wolftec.cwtactics.engine.playground.CanvasQuery.Atlas;
import org.wolftec.cwtactics.engine.playground.Playground;
import org.wolftec.cwtactics.engine.playground.Playground.AssetEntry;
import org.wolftec.cwtactics.game.components.old.UnitType;
import org.wolftec.cwtactics.game.core.ConstructedClass;

public class AssetLoader implements ConstructedClass {

  public static final String FOLDER_IMAGES = "image/cwt_tileset/units";
  public static final String FOLDER_SHEETS = "modifications/cwt/units";

  private ImageConverter imgGrabber;
  private TypedObjectConverter<UnitType> sheetGrabber;

  @Override
  public void onConstruction() {
    imgGrabber = new ImageConverter();
    sheetGrabber = new TypedObjectConverter<UnitType>();
  }

  private void loadEntry(Playground app, AssetEntry entry, Atlas frameData) {
    sheetGrabber.grabData(entry, (sheet) -> {

      /* register data sheet */
      app.data.$put(entry.key, sheet);

      AssetEntry spriteEntry = app.getAssetEntry("CWT_" + entry.key, FOLDER_IMAGES, "png");
      imgGrabber.grabData(spriteEntry, (sheetSprite) -> {

        Atlas sprite = new Atlas();
        sprite.image = sheetSprite;
        sprite.frames = frameData.frames;

        /* register sprite */
        app.atlases.$put(entry.key, sprite);
      });
    });
  }

  public <T> void loadFolder(Playground app, Class<T> dataClass) {

  }

  // @Override
  // public void cacheRemoteContent(Playground app, AssetEntry asset,
  // Callback1<String> cacheContentCb) {
  // // crop images
  // // rearrange
  // // colorize for every army
  // // create atlas ?
  //
  // Atlas unitSprite = new Atlas();
  //
  // }
  //
  // @Override
  // public void loadContent(Playground app, AssetEntry asset, String
  // cachedContent, Callback1<Canvas> callback) {
  // imgLoader.loadContent(app, asset, cachedContent);
  //
  // Atlas unitSprite = new Atlas();
  // }

}
