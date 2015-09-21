package org.wolftec.cwt.test.tools;

import org.wolftec.cwt.core.test.Assert;
import org.wolftec.cwt.model.ModelManager;

public class AssertionStub {

  private ModelManager gameModel;

  public AssertionStub(ModelManager lGameModel) {
    gameModel = lGameModel;
  }

  public Assert tileAt(int x, int y) {
    return new Assert(gameModel.getTile(x, y));
  }

  public Assert unitAt(int x, int y) {
    return new Assert(gameModel.getTile(x, y).unit);
  }

  public Assert propertyAt(int x, int y) {
    return new Assert(gameModel.getTile(x, y).property);
  }

  public Assert player(int index) {
    return new Assert(gameModel.getPlayer(index));
  }

  public Assert menu() {
    // TODO
    return null;
  }
}
