package net.wolfTec.states.widgets;

import net.wolfTec.Constants;
import net.wolfTec.input.InputData;
import net.wolfTec.utility.Debug;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.RegExp;
import org.stjs.javascript.dom.canvas.CanvasRenderingContext2D;

public class UiButtonGroup {

    protected Array<UiField> elements;
    protected int selectedElement;

    public UiButtonGroup() {
        this.elements = JSCollections.$array();
        selectedElement = Constants.INACTIVE_ID;
    }

    public void addElement(UiField el) {
        this.elements.push(el);
        if (this.selectedElement == Constants.INACTIVE_ID && el.action != null) {
            this.elements.$get(this.elements.$length() - 1).inFocus = true;
            this.selectedElement = this.elements.$length() - 1;
        }
    }

    public UiField activeButton() {
        return this.elements.$get(selectedElement);
    }

    public UiField getButtonByKey(String key) {
        for (int i = 0, e = this.elements.$length(); i < e; i++) {
            if (this.elements.$get(i).key == key) {
                return this.elements.$get(i);
            }
        }
        return null;
    }


    //
    //
    // @param {RegExp} reg
    //
    public Array<UiField> getButtonsByReg(RegExp reg) {
        Array<UiField> arr = JSCollections.$array();

        for (int i = 0, e = this.elements.$length(); i < e; i++) {
            if (reg.test(this.elements.$get(i).key)) {
                arr.push(this.elements.$get(i));
            }
        }

        return arr;
    }

    //
    // Updates the index of the selected button in interconnection to a given position.
    //
    // @param {Number} x
    // @param {Number} y
    // @return {boolean} true, if the index was updated, else false
    //
    public boolean updateIndex(int x, int y) {
        for (int i = 0, e = this.elements.$length(); i < e; i++) {

            // inactive element
            if (this.elements.$get(i).action == null || this.elements.$get(i).inactive) {
                continue;
            }

            if (this.elements.$get(i).isPositionInElement(x, y)) {
                if (i == this.selectedElement) {
                    return false;
                }

                this.elements.$get(this.selectedElement).inFocus = false;
                this.selectedElement = i;
                this.elements.$get(this.selectedElement).inFocus = true;

                return true;
            }
        }
        return false;
    }

    public void setIndex(int index) {
        if (index < 0 && index >= this.elements.$length()) {
            Debug.logCritical(UiField.LOG_HEADER, "IllegalIndexArgument");
        }

        this.elements.$get(this.selectedElement).inFocus = false;
        this.selectedElement = index;
        this.elements.$get(this.selectedElement).inFocus = true;
    }

    public boolean isInactive() {
        return false;
    }

    //
    //
    // @param input
    // @return {boolean} true, if the index was updated, else false
    //
    public boolean handleInput(InputData inputData) {
        boolean res = true;
        this.elements.$get(selectedElement).inFocus = false;

        switch (inputData.key) {
            case UP:
            case LEFT:
                do {
                    this.selectedElement--;
                    if (this.selectedElement < 0) {
                        this.selectedElement = this.elements.$length() - 1;
                    }
                } while (this.elements.$get(selectedElement).action == null ||
                        this.elements.$get(selectedElement).isInactive());
                break;

            case RIGHT:
            case DOWN:
                do {
                    this.selectedElement++;
                    if (this.selectedElement >= this.elements.$length()) {
                        this.selectedElement = 0;
                    }
                } while (this.elements.$get(selectedElement).action == null ||
                        this.elements.$get(selectedElement).isInactive());
                break;

            default:
                res = false;
        }

        this.elements.$get(selectedElement).inFocus = true;

        return res;
    }

    public void draw(CanvasRenderingContext2D ctx) {
        for (int i = 0, e = this.elements.$length(); i < e; i++) {
            UiField el = this.elements.$get(i);

            if (!el.isInactive()) {
                el.draw(ctx);
            }
        }
    }
}
