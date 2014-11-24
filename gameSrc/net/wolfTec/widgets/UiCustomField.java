package net.wolfTec.widgets;

import org.stjs.javascript.dom.canvas.CanvasRenderingContext2D;
import org.stjs.javascript.functions.Callback0;

public class UiCustomField extends UiField {

    private final Callback0 drawFn;

    public UiCustomField(int x, int y, int w, int h, String key, Callback0 drawFn) {
        super(x, y, w, h, key, 0, UiField.STYLE_NORMAL);
        this.text = "";
        this.drawFn = drawFn;
    }

    @Override
    public void draw(CanvasRenderingContext2D ctx) {
        drawFn.$invoke();
    }
}
