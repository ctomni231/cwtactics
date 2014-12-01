package net.wolfTec.widgets;

import net.wolfTec.Constants;
import net.wolfTec.bridges.CanvasRenderingContext2D;
import net.wolfTec.input.InputData;
import net.wolfTec.input.InputType;
import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;

public class UiButtonGroup {

    private Array<UiElement> elements;
    private int selectedElement;

    public UiButtonGroup(){
        this.elements = JSCollections.$array();
        selectedElement = Constants.INACTIVE_ID;
    }

    public void addElement (UiElement el) {
        this.elements.push(el);
        if (this.selectedElement == Constants.INACTIVE_ID && el.action) {
           // this.elements.$get(this.elements.$length() - 1).inFocus = true;
            this.selectedElement = this.elements.$length() - 1;
        }
    }

    public UiElement activeButton () {
        return this.elements.$get(selectedElement);
    }

    public UiElement getButtonByKey (String key) {
        for (int i = 0, e = this.elements.$length(); i < e; i++) {
            if (this.elements.$get(i).key() == key) {
                return this.elements.$get(i);
            }
        }
        return null;
    }


    //
    //
    // @param {RegExp} reg
    //
    public UiElement getButtonsByReg (reg) {
        Array<UiElement> arr = JSCollections.$array();

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
    public boolean updateIndex (int x, int y) {
        for (int i = 0, e = this.elements.$length(); i < e; i++) {

            // inactive element
            if (!this.elements[i].action || this.elements[i].inactive) {
                continue;
            }

            if (this.elements[i].positionInButton(x, y)) {
                if (i == this.selected) {
                    return false;
                }

                this.elements[this.selected].inFocus = false;
                this.selected = i;
                this.elements[this.selected].inFocus = true;

                return true;
            }
        }
        return false;
    },

    public void setIndex (int index) {
        if (index < 0 && index >= this.elements.length) {
            throw Error("illegal index");
        }

        this.elements[this.selected].inFocus = false;
        this.selectedElement = index;
        this.elements[this.selected].inFocus = true;
    },

    @Override
    public boolean isInactive() {
        return false;
    }

    //
    //
    // @param input
    // @return {boolean} true, if the index was updated, else false
    //
    public boolean handleInput (InputData inputData) {
        boolean res = true;
        this.elements.$get(selectedElement).inFocus = false;

        switch (inputData.key) {
            case InputType.UP:
            case InputType.LEFT:
                do {
                    this.selectedElement--;
                    if (this.selectedElement < 0) {
                        this.selectedElement = this.elements.$length() - 1;
                    }
                } while (!this.elements.$get(selectedElement).action || this.elements.$get(selectedElement).isInactive());
                break;

            case InputType.RIGHT:
            case InputType.DOWN:
                do {
                    this.selectedElement++;
                    if (this.selectedElement >= this.elements.$length()) {
                        this.selectedElement = 0;
                    }
                } while (!this.elements.$get(selectedElement).action || this.elements.$get(selectedElement).isInactive());
                break;

            default:
                res = false;
        }

        this.elements.$get(selectedElement).inFocus = true;

        return res;
    }

    @Override
    public void draw(CanvasRenderingContext2D ctx) {
        for (int i = 0, e = this.elements.$length(); i < e; i++) {
            UiElement el = this.elements.$get(i);

            if (!el.isInactive()) {
                el.draw(ctx);
            }
        }
    }
}
