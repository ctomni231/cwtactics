package org.wolftec.cwt.test;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.functions.Function1;
import org.wolftec.cwt.logic.Action;
import org.wolftec.cwt.model.gameround.ModelManager;
import org.wolftec.cwt.model.gameround.Player;
import org.wolftec.cwt.model.gameround.Property;
import org.wolftec.cwt.model.gameround.Tile;
import org.wolftec.cwt.model.gameround.Unit;

public class TestAssertion {

  private CwtTestManager parent;

  public TestAssertion(CwtTestManager parent) {
    this.parent = parent;
  }

  public Assert<Tile> tileAt(int x, int y) {
    return new Assert(parent.model.getTile(x, y));
  }

  public Assert<Unit> unitAt(int x, int y) {
    return new Assert(parent.model.getTile(x, y).unit);
  }

  public Assert<Property> propertyAt(int x, int y) {
    return new Assert(parent.model.getTile(x, y).property);
  }

  public Assert<Player> player(int index) {
    return new Assert(parent.model.getPlayer(index));
  }

  public Assert<Player> turnOwner() {
    return new Assert(parent.model.turnOwner);
  }

  public <X> Assert<X> gameroundProperty(Function1<ModelManager, X> filter) {
    return new Assert(filter.$invoke(parent.model));
  }

  public Assert usableAction(Action action) {
    parent.modify.checkAction(action);
    return menu().contains(action.key());
  }

  public Assert unusableAction(Action action) {
    parent.modify.checkAction(action);
    return menu().notContains(action.key());
  }

  public Assert validFreeSelectionTarget(Action action) {
    return value(action.isTargetValid(parent.uiData));
  }

  public Assert<Integer> targetMapValue(int x, int y) {
    return value(parent.uiData.targets.getValue(x, y));
  }

  public void inTargetMap(int x, int y) {
    targetMapValue(x, y).greaterThen(0);
  }

  public void notInTargetMap(int x, int y) {
    targetMapValue(x, y).lowerEquals(0);
  }

  public Assert<Array<String>> menu() {
    Array<String> menu = JSCollections.$array();
    for (int i = 0; i < parent.uiData.getNumberOfInfos(); i++) {
      menu.push(parent.uiData.getInfoAtIndex(i));
    }
    return new Assert(menu);
  }

  public <X> Assert<X> value(X value) {
    return new Assert(value);
  }
}
