package net.wolfTec.states;

import net.wolfTec.utility.CircularBuffer;
import net.wolfTec.utility.Debug;
import org.stjs.javascript.Array;
import org.stjs.javascript.annotation.Template;

public class StateDataMenu {

    public static class MenuEntry {
        private String content;
        private boolean enabled;
    }

    private StateData parent;
    private int selectedIndex;
    private int size;

    private Array<MenuEntry> entries;

    public StateDataMenu(StateData parent) {
        this.parent = parent;
        this.selectedIndex = 0;
        for (int i = 0; i < 50; i++) entries.push(new MenuEntry());
    }

    public int getSelectedIndex () {
        return this.selectedIndex;
    }

    public String getSelectedContent () {
        return this.entries.$get(this.selectedIndex).content;
    }

    public String getContentAt (int index) {
        return this.entries.$get(index).content;
    }

    @Template("toProperty")
    public int getSize () {
        return size;
    }

    public boolean isSelectedEntryEnabled () {
        return this.entries.$get(this.selectedIndex).enabled;
    }

    public void clean () {
        // release string references
        for (int i=0, e=this.entries.$length(); i<e; i++) {
            this.entries.$get(i).content = null;
        }

        this.selectedIndex = 0;
        this.size = 0;
    }

    public void addEntry (String content, boolean enabled) {
        if (this.entries.$length() == this.size) {
            Debug.logCritical(parent.LOG_HEADER, "IndexOutOfBounds");
        }

        MenuEntry entry = this.entries.$get(this.size);
        entry.content = content;
        entry.enabled = enabled;
        this.size++;
    }

    /**
     * Generates the action menu based on the given position data.
     */
    public void generate () {
        var st_mode;
        var sst_mode;
        var pr_st_mode;
        var pr_sst_mode;
        var sPos = exports.source;
        var tPos = exports.target;
        var tsPos = exports.targetselection;
        var ChkU = relationship.CHECK_UNIT;
        var ChkP = relationship.CHECK_PROPERTY;
        var sProp = sPos.property;
        var sUnit = sPos.unit;
        var unitActable = (!(!sUnit || sUnit.owner !== model.turnOwner || !sUnit.canAct));
        var propertyActable = (!(sUnit || !sProp || sProp.owner !== model.turnOwner || sProp.type.blocker));
        var mapActable = (!unitActable && !propertyActable);


        // check_ all game action objects and fill menu
        var actions = actionsLib.getActions();
        for (var i = 0, e = actions.length; i < e; i++) {
            var action = actions[i];

            switch (action.type) {

                case actionsLib.CLIENT_ACTION:
                    // TODO: ai check
                    if (!mapActable || model.Player.activeClientPlayer !== model.turnOwner) {
                        continue;
                    }
                    break;

                case actionsLib.PROPERTY_ACTION:
                    if (!propertyActable) {
                        continue;
                    }
                    break;

                case actionsLib.MAP_ACTION:
                    if (!mapActable) {
                        continue;
                    }
                    break;

                case actionsLib.UNIT_ACTION:
                    if (!unitActable) {
                        continue;
                    }

                    // extract relationships
                    if (!st_mode) {
                        st_mode = relationship.getRelationShipTo(sPos, tPos, ChkU, ChkU);
                        sst_mode = relationship.getRelationShipTo(sPos, tsPos, ChkU, ChkU);
                        pr_st_mode = relationship.getRelationShipTo(sPos, tPos, ChkU, ChkP);
                        pr_sst_mode = relationship.getRelationShipTo(sPos, tsPos, ChkU, ChkP);
                    }

                    // relation to unit
                    if (action.relation) {
                        if (!checkRelation(action, action.relation, st_mode, sst_mode)) {
                            continue;
                        }
                    }

                    // relation to property
                    if (action.relationToProp) {
                        if (!checkRelation(action, action.relationToProp, pr_st_mode, pr_sst_mode)) {
                            continue;
                        }
                    }
                    break;

                case actionsLib.ENGINE_ACTION:
                    continue;
            }

            // if condition matches then add the entry to the menu list
            if (checkConditionByData(action)) {
                exports.menu.addEntry(action.key, true)
            }
        }
    }

    public void generateSubMenu () {
        prepareMenuByData(parent.selectedAction);
    }
}
