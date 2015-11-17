package org.wolftec.cwt.model;

import org.wolftec.cwt.model.gameround.Battlefield;
import org.wolftec.cwt.model.maps.MapAdministration;
import org.wolftec.cwt.model.savegame.GameSaver;
import org.wolftec.cwt.model.sheets.SheetDatabase;

public class Model {

  public final Battlefield game;
  public final GameSaver gameSaver;
  public final SheetDatabase objectTypes;
  public final MapAdministration maps;

  public Model() {
    objectTypes = new SheetDatabase();
    gameSaver = new GameSaver();
    game = new Battlefield(objectTypes);
    maps = new MapAdministration();
  }
}
