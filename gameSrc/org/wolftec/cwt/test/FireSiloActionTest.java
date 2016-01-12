package org.wolftec.cwt.test;

import org.wolftec.cwt.action.actions.FireSilo;
import org.wolftec.cwt.model.gameround.Unit;
import org.wolftec.cwt.test.base.AbstractCwtTest;

public class FireSiloActionTest extends AbstractCwtTest
{

  private FireSilo action;

  @Override
  protected void prepareModel()
  {
    test.expectThat.propertyType("propA").rocketsilo.damage = 5;
    test.expectThat.propertyType("propA").rocketsilo.range = 1;
    test.expectThat.propertyType("propA").rocketsilo.fireable.push("unitA");
    test.expectThat.propertyType("propA").rocketsilo.changeTo = "propB";
    test.expectThat.everythingVisible();
  }

  public void test_usableOnlyOnSiloProperties()
  {
    test.expectThat.unitExistsAt(0, 0, "unitA", 0);
    test.expectThat.propertyAt(1, 0, "propA", 0);
    test.expectThat.propertyAt(2, 0, "propA", 1);
    test.expectThat.propertyAt(3, 0, "propB", 0);

    test.expectThat.everythingCanAct();
    test.expectThat.sourceSelectionAt(0, 0);
    test.expectThat.targetSelectionAt(1, 0);
    test.assertThat.usableAction(action);

    test.expectThat.everythingCanAct();
    test.expectThat.sourceSelectionAt(0, 0);
    test.expectThat.targetSelectionAt(2, 0);
    test.assertThat.usableAction(action);

    test.expectThat.everythingCanAct();
    test.expectThat.sourceSelectionAt(0, 0);
    test.expectThat.targetSelectionAt(3, 0);
    test.assertThat.unusableAction(action);
  }

  public void test_targetIsFreelySelectableOnMap()
  {
    test.expectThat.inTeam(0, 0);
    test.expectThat.inTeam(1, 0);
    test.expectThat.inTeam(2, 1);
    test.expectThat.unitExistsAt(0, 0, "unitA", 0);
    test.expectThat.unitExistsAt(4, 4, "unitA", 0);
    test.expectThat.unitExistsAt(5, 4, "unitA", 1);
    test.expectThat.unitExistsAt(6, 4, "unitA", 2);
    test.expectThat.unitExistsAt(7, 4, "unitA", 2);
    test.expectThat.propertyAt(1, 0, "propA", 0);
    test.expectThat.propertyAt(2, 0, "propA", 1);
    test.expectThat.propertyAt(3, 0, "propB", 0);

    for (int i = 0; i < 10; i++)
    {
      for (int j = 0; j < 10; j++)
      {
        test.expectThat.actionSelectionAt(i, j);
        test.assertThat.validFreeSelectionTarget(action).isTrue();
      }
    }
  }

  public void test_inflictsDamageToEveryUnitInRange()
  {
    test.expectThat.inTeam(0, 0);
    test.expectThat.inTeam(1, 0);
    test.expectThat.inTeam(2, 1);
    test.expectThat.unitExistsAt(0, 0, "unitA", 0);
    test.expectThat.unitExistsAt(4, 4, "unitA", 0, o -> o.hp = Unit.pointsToHealth(10) - 1);
    test.expectThat.unitExistsAt(5, 4, "unitA", 1, o -> o.hp = Unit.pointsToHealth(10) - 1);
    test.expectThat.unitExistsAt(6, 4, "unitA", 2, o -> o.hp = Unit.pointsToHealth(10) - 1);
    test.expectThat.unitExistsAt(7, 4, "unitA", 2, o -> o.hp = Unit.pointsToHealth(10) - 1);
    test.expectThat.propertyAt(1, 0, "propA", 0);

    test.expectThat.everythingCanAct();
    test.expectThat.sourceSelectionAt(0, 0);
    test.expectThat.targetSelectionAt(1, 0);
    test.expectThat.actionSelectionAt(5, 4);
    test.expectThat.actionTriggered(action);

    test.assertThat.unitAt(4, 4).propertyByFn(o -> Unit.healthToPoints(o.hp)).is(5);
    test.assertThat.unitAt(5, 4).propertyByFn(o -> Unit.healthToPoints(o.hp)).is(5);
    test.assertThat.unitAt(6, 4).propertyByFn(o -> Unit.healthToPoints(o.hp)).is(5);

    // out of range
    test.assertThat.unitAt(7, 4).propertyByFn(o -> Unit.healthToPoints(o.hp)).is(10);

  }

  public void test_doesNotKillUnitsInRange()
  {
    test.expectThat.unitExistsAt(0, 0, "unitA", 0);
    test.expectThat.unitExistsAt(4, 4, "unitA", 0, o -> o.hp = Unit.pointsToHealth(2) - 1);
    test.expectThat.propertyAt(1, 0, "propA", 0);

    test.expectThat.everythingCanAct();
    test.expectThat.sourceSelectionAt(0, 0);
    test.expectThat.targetSelectionAt(1, 0);
    test.expectThat.actionSelectionAt(4, 4);
    test.expectThat.actionTriggered(action);

    test.assertThat.unitAt(4, 4).propertyByFn(o -> Unit.healthToPoints(o.hp)).is(1);
  }

}
