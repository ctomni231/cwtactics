package org.wolftec.cwtactics.system.savegame;

public interface SaveGameHandler {

  Object onSaveGame();

  void onLoadGame(Object gameData);
}
