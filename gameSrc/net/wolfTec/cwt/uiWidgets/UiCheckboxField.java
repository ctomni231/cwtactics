package net.wolfTec.cwt.uiWidgets;

import org.stjs.javascript.dom.canvas.CanvasRenderingContext2D;
import org.stjs.javascript.functions.Callback0;

public class UiCheckboxField extends UiField {

    private boolean checked;

    public UiCheckboxField(int x, int y, int w, int h, String text, int fsize, int style) {
        super(x, y, w, h, text, fsize, style, null);

        this.action = new Callback0() {
            @Override public void $invoke() {
                checked = !checked;
            }
        };

        this.text = "";
        this.checked = false;
    }

    @Override
    public void draw(CanvasRenderingContext2D ctx) {
        super.draw(ctx);

        ctx.fillStyle = "black";
        ctx.fillRect(this.x + 4, this.y + 4, this.width - 8, this.height - 8);

        ctx.fillStyle = (this.checked) ? "rgb(60,60,60)" : "white";
        ctx.fillRect(this.x + 5, this.y + 5, this.width - 10, this.height - 10);
    }
}
