package org.wolftec.cwtactics.game.persistence;

public interface SaveGameHandler<T> {

  T onSaveGame();

  void onLoadGame(T gameData);
}
