package net.wolfTec.actions.factory;

import net.wolfTec.CustomWarsTactics;
import net.wolfTec.actions.Action;
import net.wolfTec.actions.ActionData;
import net.wolfTec.actions.ActionInvoker;
import net.wolfTec.enums.Relationship;
import net.wolfTec.model.PositionData;
import net.wolfTec.utility.Debug;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.functions.Callback1;
import org.stjs.javascript.functions.Function1;

public abstract class TeamActionFactory {

    public static void registerActions(ActionInvoker invoker) {
    }

    private static Action createShareMoneyAction() {

        exports.actionMoney = {
                condition: function (player, x, y) {
            return team.canTransferMoney(player, x, y);
        },

        hasSubMenu: true,
                prepareMenu: function (player, menu) {
            team.getTransferMoneyTargets(player, menu);
        },

        invoke: function (sourcePlayerId, targetPlayerId, money) {
            team.transferMoney(model.getPlayer(sourcePlayerId), model.getPlayer(targetPlayerId), money);
        }
        };

        Action action = new Action("transferMoney");
        action.type = Action.ActionType.UNIT_ACTION;
        action.mappingForUnit = Action.SourceToTarget.SOURCE_AND_TARGET;
        action.relationToUnit = JSCollections.$array(Relationship.RELATION_NONE, Relationship.RELATION_SAME_THING);

        action.condition = new Function1<PositionData, Boolean>() {
            @Override public Boolean $invoke(PositionData positionData) {
                return team.canTransferMoney(player, x, y);
            }
        };

        action.invoke = new Callback1<ActionData>() {
            @Override public void $invoke(ActionData actionData) {
                Debug.logInfo(null, "Send unit " + actionData.p1 + " into wait status");
                CustomWarsTactics.gameround.units.$get(actionData.p1).setActable(false);
                renderer.renderUnitsOnScreen();
            }
        };

        return action;
    }
}
