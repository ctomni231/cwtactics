package net.temp.cwt.game.persistence.model;

public interface SaveGameHandler<T> {

  T onSaveGame();

  void onLoadGame(T gameData);
}
