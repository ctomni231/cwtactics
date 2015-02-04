package net.wolfTec.wtEngine.uiWidgets;

import org.stjs.javascript.dom.canvas.CanvasRenderingContext2D;
import org.stjs.javascript.functions.Callback1;

public class UiCustomField extends UiField {

    private final Callback1<CanvasRenderingContext2D> drawFn;

    public UiCustomField(int x, int y, int w, int h, String key, Callback1<CanvasRenderingContext2D> drawFn) {
        super(x, y, w, h, key, 0, UiField.STYLE_NORMAL, null);
        this.text = "";
        this.drawFn = drawFn;
    }

    @Override
    public void draw(CanvasRenderingContext2D ctx) {
        drawFn.$invoke(ctx);
    }
}
