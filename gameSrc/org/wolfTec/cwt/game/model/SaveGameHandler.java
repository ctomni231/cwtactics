package org.wolfTec.cwt.game.model;

public interface SaveGameHandler<T> {

  T onSaveGame();

  void onLoadGame(T gameData);
}
