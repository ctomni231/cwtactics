package net.wolfTec.renderer;

import net.wolfTec.Constants;
import org.stjs.javascript.Array;
import org.stjs.javascript.Global;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.dom.Canvas;
import org.stjs.javascript.dom.canvas.CanvasRenderingContext2D;

public class LayeredCanvas {

    private Canvas cv;
    private CanvasRenderingContext2D ctx;
    public int w;
    public int h;
    private Array<CanvasRenderingContext2D> contexts;
    private Array<Canvas> layers;

    public LayeredCanvas (String canvasId, int frames, int w, int h) {

        // root canvas
        this.cv = (Canvas) Global.window.document.getElementById(canvasId);
        this.cv.width = w;
        this.cv.height = h;
        this.ctx = this.cv.getContext("2d");
        this.w = w;
        this.h = h;

        // cached layers
        if (frames > 0) {
            this.contexts = JSCollections.$array();
            this.layers = JSCollections.$array();

            int n = 0;
            while (n < frames) {
                Canvas cv = (Canvas) Global.window.document.createElement("canvas");

                cv.width = w;
                cv.height = h;

                this.contexts.$set(n, cv.getContext("2d"));
                this.layers.$set(n, cv);

                n++;
            }
        }
    }

    /**
     *
     * @param index
     */
    public void renderLayer (int index) {
        CanvasRenderingContext2D ctx = this.getContext(Constants.INACTIVE_ID);
        ctx.clearRect(0, 0, this.w, this.h);
        ctx.drawImage(getLayer(index), 0, 0, this.w, this.h);
    }

    /**
     *
     * @param {number?} index
     * @returns {HTMLCanvasElement}
     */
    public Canvas getLayer (int index) {
        if (index == Constants.INACTIVE_ID) {
            return this.cv;
        }

        return this.layers.$get(index);
    }

    /**
     *
     * @param index
     */
    public void clear (int index) {
        this.getContext(index).clearRect(0, 0, this.w, this.h);
    }

    /**
     *
     */
    public void clearAll () {
        int n = this.layers.$length() - 1;
        while (n >= 0) {
            this.clear(n);
            n--;
        }
        this.clear(Constants.INACTIVE_ID);
    }

    /**
     *
     * @param {number?} index
     * @returns {CanvasRenderingContext2D}
     */
    public CanvasRenderingContext2D getContext (int index) {
        if (index == Constants.INACTIVE_ID) {
            return this.ctx;
        }

        return this.contexts.$get(index);
    }
}
