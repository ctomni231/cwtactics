package org.wolftec.cwt.model;

import org.wolftec.cwt.model.gameround.Battlefield;
import org.wolftec.cwt.model.maps.MapAdministration;
import org.wolftec.cwt.model.savegame.GameSaver;
import org.wolftec.cwt.model.sheets.SheetDatabase;
import org.wolftec.cwt.model.tags.Tags;

public class Model {

  public final Battlefield game;
  public final GameSaver gameSaver;
  public final SheetDatabase objectTypes;
  public final MapAdministration maps;
  public final Actions actions;
  public final Tags cfg;

  public Model() {
    cfg = new Tags();
    objectTypes = new SheetDatabase();
    gameSaver = new GameSaver(objectTypes, cfg);
    game = new Battlefield();
    maps = new MapAdministration();
    actions = new Actions(cfg);
  }
}
