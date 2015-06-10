package org.wolftec.cwtactics.game.system.old;

public class AssetLoader {

  // public static final String FOLDER_IMAGES = "image/cwt_tileset/units";
  // public static final String FOLDER_SHEETS = "modifications/cwt/units";
  //
  // private ImageConverter imgGrabber;
  // private TypedObjectConverter<UnitType> sheetGrabber;
  //
  // @Override
  // public void onConstruction() {
  // imgGrabber = new ImageConverter();
  // sheetGrabber = new TypedObjectConverter<UnitType>();
  // }
  //
  // private void loadEntry(Playground app, AssetEntry entry, Atlas frameData) {
  // sheetGrabber.grabData(entry, (sheet) -> {
  //
  // /* register data sheet */
  // app.data.$put(entry.key, sheet);
  //
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
  // });
  // }
  //
  // public <T> void loadFolder(Playground app, Class<T> dataClass) {
  //
  // }

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
