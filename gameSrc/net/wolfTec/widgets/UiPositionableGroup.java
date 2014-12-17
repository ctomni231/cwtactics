package net.wolfTec.widgets;

public class UiPositionableGroup extends UiButtonGroup {

    private int x;
    private int y;

    public  UiPositionableGroup(){
        super();
        this.x = 0;
        this.y = 0;
    }

    public void setMenuPosition (int x, int y) {
        int diffX = x - this.x;
        int diffY = y - this.y;

        for (int i = 0, e = this.elements.$length(); i < e; i++) {
            UiField element = this.elements.$get(i);

            element.x += diffX;
            element.y += diffY;
        }

        this.x = x;
        this.y = y;
    }
}
