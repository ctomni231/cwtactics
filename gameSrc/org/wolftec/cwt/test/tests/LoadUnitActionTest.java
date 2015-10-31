package org.wolftec.cwt.test.tests;

import org.wolftec.cwt.logic.actions.LoadUnit;
import org.wolftec.cwt.logic.features.TransportLogic;
import org.wolftec.cwt.model.gameround.Unit;
import org.wolftec.cwt.test.AbstractCwtTest;

public class LoadUnitActionTest extends AbstractCwtTest {

  private LoadUnit action;
  private TransportLogic transport;

  @Override
  protected void prepareModel() {
    test.expectThat.unitType("unitB").canload.push("unitA");
    test.expectThat.unitType("unitB").maxloads = 1;
    test.expectThat.everythingVisible();
  }

  public void test_usableOnlyWhenTargetUnitIsATransporterAndCanLoadSourceUnit() {
    test.expectThat.unitExistsAt(0, 0, "unitA", 0);
    test.expectThat.unitExistsAt(0, 1, "unitC", 0);
    test.expectThat.unitExistsAt(2, 2, "unitB", 0);
    test.expectThat.everythingCanAct();

    test.expectThat.sourceSelectionAt(0, 0);
    test.expectThat.targetSelectionAt(2, 2);
    test.modify.checkAction(action);
    test.assertThat.menu().notEmpty();

    test.expectThat.sourceSelectionAt(0, 1);
    test.expectThat.targetSelectionAt(2, 2);
    test.modify.checkAction(action);
    test.assertThat.menu().empty();
  }

  public void test_usableOnlyWhenTargetTransporterIsNotFull() {
    test.expectThat.unitExistsAt(0, 0, "unitA", 0);
    test.expectThat.unitExistsAt(0, 1, "unitA", 0);
    test.expectThat.unitExistsAt(2, 2, "unitB", 0);
    test.expectThat.everythingCanAct();

    // not full -> should be available
    test.expectThat.sourceSelectionAt(0, 0);
    test.expectThat.targetSelectionAt(2, 2);
    test.modify.checkAction(action);
    test.assertThat.menu().notEmpty();
    test.modify.invokeAction(action);

    // full -> should be not available
    test.expectThat.sourceSelectionAt(0, 1);
    test.expectThat.targetSelectionAt(2, 2);
    test.modify.checkAction(action);
    test.assertThat.menu().empty();
  }

  public void test_addsUnitInTransporter() {
    test.expectThat.unitExistsAt(0, 0, "unitA", 0);
    test.expectThat.unitExistsAt(2, 2, "unitB", 0);
    Unit load = test.expectThat.unitAt(0, 0);
    Unit transporter = test.expectThat.unitAt(2, 2);
    test.expectThat.everythingCanAct();

    test.expectThat.sourceSelectionAt(0, 0);
    test.expectThat.targetSelectionAt(2, 2);
    test.modify.checkAction(action);
    test.assertThat.menu().notEmpty();
    test.modify.invokeAction(action);
    test.assertThat.value(transport.isLoadedIn(load, transporter)).is(true);
  }

}
