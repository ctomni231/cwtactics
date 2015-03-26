package org.wolftec.wPlay.savegame;

public interface SaveGameHandler {

  Object onSaveGame();

  void onLoadGame(Object gameData);
}
