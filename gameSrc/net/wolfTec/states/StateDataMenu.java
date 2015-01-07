package net.wolfTec.states;

import net.wolfTec.CustomWarsTactics;
import net.wolfTec.action.Action;
import net.wolfTec.logic.Relationship;
import net.wolfTec.logic.$RelationshipCheck;
import net.wolfTec.model.Position;
import net.wolfTec.model.Property;
import net.wolfTec.model.Unit;
import net.wolfTec.utility.CircularBuffer;
import net.wolfTec.utility.Debug;

import org.stjs.javascript.Array;
import org.stjs.javascript.annotation.Template;

public class StateDataMenu {

    private StateData parent;
    private int selectedIndex;
    private int size;

    private Array<MenuEntry> entries;

    public StateDataMenu(StateData parent) {
        this.parent = parent;
        this.selectedIndex = 0;
        for (int i = 0; i < 50; i++) entries.push(new MenuEntry());
    }

    public int getSelectedIndex() {
        return this.selectedIndex;
    }

    public String getSelectedContent() {
        return this.entries.$get(this.selectedIndex).content;
    }

    public String getContentAt(int index) {
        return this.entries.$get(index).content;
    }

    @Template("toProperty")
    public int getSize() {
        return size;
    }

    public boolean isSelectedEntryEnabled() {
        return this.entries.$get(this.selectedIndex).enabled;
    }

    public void clean() {
        // release string references
        for (int i = 0, e = this.entries.$length(); i < e; i++) {
            this.entries.$get(i).content = null;
        }

        this.selectedIndex = 0;
        this.size = 0;
    }

    public void addEntry(String content, boolean enabled) {
        if (this.entries.$length() == this.size) {
            Debug.logCritical(parent.LOG_HEADER, "IndexOutOfBounds");
        }

        MenuEntry entry = this.entries.$get(this.size);
        entry.content = content;
        entry.enabled = enabled;
        this.size++;
    }

    public boolean checkRelation(Action.SourceToTarget checkMode, Array<Relationship> relationList, Relationship sMode, Relationship stMode) {
        Relationship currentRelationship;
        switch (checkMode) {
            case SOURCE_AND_TARGET:
                currentRelationship = sMode;
                break;

            case SOURCE_AND_SUBTARGET:
                currentRelationship = stMode;
                break;

            default:
                currentRelationship = null;
        }

        for (int i = 2, e = relationList.$length(); i < e; i++) {
            if (relationList.$get(i) == currentRelationship) {
                return true;
            }
        }

        return false;
    }

    /**
     * Generates the action menu based on the given position data.
     */
    public void generate() {
        Relationship st_mode = null;
        Relationship sst_mode = null;
        Relationship pr_st_mode = null;
        Relationship pr_sst_mode = null;
        Position sPos = parent.source;
        Position tPos = parent.target;
        Position tsPos = parent.targetSelection;
        $RelationshipCheck.RelationshipCheckMode ChkU = $RelationshipCheck.RelationshipCheckMode.CHECK_NORMAL;
        $RelationshipCheck.RelationshipCheckMode ChkP = $RelationshipCheck.RelationshipCheckMode.CHECK_PROPERTY;
        Property sProp = sPos.property;
        Unit sUnit = sPos.unit;
        boolean unitActable = (!(sUnit == null || sUnit.getOwner() != net.wolfTec.gameround.turnOwner || !sUnit.isCanAct()));
        boolean propertyActable = (!(sUnit != null || sProp == null || sProp.owner != net.wolfTec.gameround.turnOwner || sProp.type.blocker));
        boolean mapActable = (!unitActable && !propertyActable);

        // check_ all game action objects and fill menu
        Array<Action> actions = CustomWarsTactics.actionInvoker.getActions();
        for (int i = 0, e = actions.$length(); i < e; i++) {
            Action action = actions.$get(i);

            switch (action.type) {

                case CLIENT_ACTION:
                    // TODO: ai check
                    if (!mapActable || net.wolfTec.gameround.lastClientPlayer != net.wolfTec.gameround.turnOwner) {
                        continue;
                    }
                    break;

                case PROPERTY_ACTION:
                    if (!propertyActable) {
                        continue;
                    }
                    break;

                case MAP_ACTION:
                    if (!mapActable) {
                        continue;
                    }
                    break;

                case UNIT_ACTION:
                    if (!unitActable) {
                        continue;
                    }

                    // extract relationships
                    if (st_mode == null) {
                        st_mode = $RelationshipCheck.getRelationShipTo(sPos, tPos, ChkU, ChkU);
                        sst_mode = $RelationshipCheck.getRelationShipTo(sPos, tsPos, ChkU, ChkU);
                        pr_st_mode = $RelationshipCheck.getRelationShipTo(sPos, tPos, ChkU, ChkP);
                        pr_sst_mode = $RelationshipCheck.getRelationShipTo(sPos, tsPos, ChkU, ChkP);
                    }

                    // relation to unit
                    if (action.relationToUnit != null) {
                        if (!checkRelation(action.mappingForUnit, action.relationToUnit, st_mode, sst_mode)) {
                            continue;
                        }
                    }

                    // relation to property
                    if (action.relationToProperty != null) {
                        if (!checkRelation(action.mappingForProperty, action.relationToProperty, pr_st_mode, pr_sst_mode)) {
                            continue;
                        }
                    }
                    break;

                case ENGINE_ACTION:
                    continue;
            }

            // if condition matches then add the entry to the menu list
            if (action.condition.$invoke(parent)) {
                addEntry(action.key, true);
            }
        }
    }

    public void generateSubMenu() {
        parent.selectedAction.prepareMenu.$invoke(parent);
    }
}
