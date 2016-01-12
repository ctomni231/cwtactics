package org.wolftec.cwt.test;

import org.wolftec.cwt.action.actions.UnloadUnit;
import org.wolftec.cwt.logic.TransportLogic;
import org.wolftec.cwt.test.base.AbstractCwtTest;

public class UnloadUnitActionTest extends AbstractCwtTest
{

  private UnloadUnit     action;
  private TransportLogic transport;

  @Override
  protected void prepareModel()
  {
    test.expectThat.unitType("unitA").maxloads = 1;
    test.expectThat.moveCosts("moveB", "tileA", 1);
    test.expectThat.moveCosts("moveB", "tileB", -1);
    test.expectThat.unitExistsAt(1, 1, "unitA", 0);
    test.expectThat.loadedUnitExistsIn(1, 1, "unitB");
    test.expectThat.everythingVisible();
  }

  public void test_usableOnlyWhenTransporterHasLoads()
  {
    test.expectThat.unitExistsAt(3, 3, "unitA", 0);

    // has loads
    test.expectThat.everythingCanAct();
    test.expectThat.sourceSelectionAt(1, 1);
    test.assertThat.usableAction(action);

    // hasn't loads
    test.expectThat.everythingCanAct();
    test.expectThat.sourceSelectionAt(3, 3);
    test.assertThat.unusableAction(action);
  }

  public void test_unloadTargetsOnlyContainsEmptyTilesWhichAreMovableByTheLoad()
  {
    test.expectThat.tileTypeAt(1, 0, "tileA");
    test.expectThat.tileTypeAt(0, 1, "tileA");
    test.expectThat.tileTypeAt(2, 1, "tileA");
    test.expectThat.tileTypeAt(1, 2, "tileB");
    test.expectThat.unitExistsAt(0, 1, "unitC", 0);
    test.expectThat.unitExistsAt(2, 1, "unitC", 1);
    test.expectThat.everythingCanAct();
    test.expectThat.sourceSelectionAt(1, 1);
    test.expectThat.actionSubMenuOpened(action);
    test.expectThat.menuEntrySelected(0);
    test.expectThat.actionTargetMapOpened(action);

    test.assertThat.inTargetMap(1, 0);
    test.assertThat.notInTargetMap(1, 2);
    test.assertThat.notInTargetMap(2, 1);
    test.assertThat.notInTargetMap(0, 1);
  }

  public void test_removesLoadFromTransporter()
  {
    test.expectThat.everythingCanAct();
    test.expectThat.sourceSelectionAt(1, 1);
    test.expectThat.actionSubMenuOpened(action);
    test.expectThat.menuEntrySelected(0);
    test.expectThat.actionSelectionAt(0, 1);
    test.expectThat.actionTriggered(action);

    test.assertThat.value(transport.hasLoads(test.expectThat.unitAt(1, 1))).isFalse();
  }

  public void test_movesLoadToActionTargetTile()
  {
    test.expectThat.everythingCanAct();
    test.expectThat.sourceSelectionAt(1, 1);
    test.expectThat.actionSubMenuOpened(action);
    test.expectThat.menuEntrySelected(0);
    test.expectThat.actionSelectionAt(0, 1);
    test.expectThat.actionTriggered(action);

    test.assertThat.unitAt(0, 1).exists();
  }

}
